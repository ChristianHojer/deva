import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types/messages";
import { messagesService } from "@/services/messagesService";

export const useMessages = (projectId: string | undefined, activeTab: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId || projectId === ':projectId') return;
    
    fetchMessages();
    setupRealtimeSubscription();

    return () => {
      cleanupRealtimeSubscription();
    };
  }, [activeTab, projectId]);

  const setupRealtimeSubscription = () => {
    return supabase
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
  };

  const cleanupRealtimeSubscription = () => {
    supabase.removeChannel(supabase.channel('messages-channel'));
  };

  const fetchMessages = async () => {
    if (!projectId || projectId === ':projectId') return;

    try {
      const messages = await messagesService.fetchMessages(projectId, activeTab);
      setMessages(messages);
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
    const messageInput = {
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
      ...messageInput,
      id: crypto.randomUUID(),
      timestamp,
      sender: 'user',
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await messagesService.createMessage(messageInput);
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