import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  file_name?: string;
  file_url?: string;
  file_type?: string;
}

export const useMessages = (projectId: string | undefined, activeTab: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch messages if we have a valid projectId
    if (!projectId || projectId === ':projectId') return;
    
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
    // Guard against invalid projectId
    if (!projectId || projectId === ':projectId') return;

    try {
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

      const messagesWithDates = data?.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp as string)
      })) || [];

      setMessages(messagesWithDates);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error fetching messages",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (inputMessage: string, fileData?: { name: string; url: string; type: string }) => {
    if ((!inputMessage.trim() && !fileData) || !projectId || projectId === ':projectId') return;

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

    try {
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
      }
    } catch (error) {
      setMessages((prev) => prev.filter(msg => msg.id !== optimisticMessage.id));
      toast({
        title: "Error sending message",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    sendMessage
  };
};