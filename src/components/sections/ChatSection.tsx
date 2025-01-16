import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MessageList } from "../chat/MessageList";
import { MessageInput } from "../chat/MessageInput";
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  file_name?: string;
  file_url?: string;
  file_type?: string;
}

interface ChatSectionProps {
  variant?: "primary" | "code";
  className?: string;
  activeTab: string;
}

export const ChatSection = ({ variant = "primary", className, activeTab }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();
  const { projectId } = useParams();

  useEffect(() => {
    if (!projectId) return;
    
    fetchMessages();

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId} AND tab_id=eq.${activeTab}`,
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            timestamp: new Date(payload.new.timestamp),
          } as Message;
          setMessages((currentMessages) => [...currentMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, projectId]);

  const fetchMessages = async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .eq('tab_id', activeTab)
      .order('timestamp', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Convert timestamp strings to Date objects
    const messagesWithDates = data?.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp as string)
    })) || [];

    setMessages(messagesWithDates);
  };

  const handleSendMessage = async (fileData?: { name: string; url: string; type: string }) => {
    if (!inputMessage.trim() && !fileData) return;
    if (!projectId) return;

    const timestamp = new Date();
    const newMessage = {
      content: inputMessage,
      sender: 'user' as const,
      tab_id: activeTab,
      project_id: projectId,
      timestamp: timestamp.toISOString(),
      ...(fileData && {
        file_name: fileData.name,
        file_url: fileData.url,
        file_type: fileData.type,
      }),
    };

    const optimisticMessage: Message = {
      ...newMessage,
      id: crypto.randomUUID(),
      timestamp: timestamp,
      sender: 'user',
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    setInputMessage('');

    const { error } = await supabase
      .from('messages')
      .insert(newMessage);

    if (error) {
      setMessages((prev) => prev.filter(msg => msg.id !== optimisticMessage.id));
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!projectId) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(`${projectId}/${activeTab}/${Date.now()}-${file.name}`, file);

    if (error) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(data.path);
    
    handleSendMessage({
      name: file.name,
      url: publicUrl,
      type: file.type,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full rounded-lg overflow-hidden",
      variant === "primary" ? "bg-[#F1F1F1]" : "bg-[#F6F6F7]",
      className
    )}>
      <MessageList messages={messages} />
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleFileUpload={handleFileUpload}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};
