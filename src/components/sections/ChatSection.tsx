import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MessageList } from "../chat/MessageList";
import { MessageInput } from "../chat/MessageInput";

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

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `tab_id=eq.${activeTab}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((currentMessages) => [...currentMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
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

    setMessages(data || []);
  };

  const handleSendMessage = async (fileData?: { name: string; url: string; type: string }) => {
    if (!inputMessage.trim() && !fileData) return;

    const newMessage = {
      content: inputMessage,
      sender: 'user' as const,
      tab_id: activeTab,
      ...(fileData && {
        file_name: fileData.name,
        file_url: fileData.url,
        file_type: fileData.type,
      }),
    };

    const { error } = await supabase
      .from('messages')
      .insert(newMessage);

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setInputMessage('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      .upload(`${activeTab}/${Date.now()}-${file.name}`, file);

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
      "flex flex-col h-full",
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