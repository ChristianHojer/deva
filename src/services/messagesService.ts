import { supabase } from "@/lib/supabase";
import { Message, MessageInput } from "@/types/messages";

export const messagesService = {
  async fetchMessages(projectId: string, activeTab: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .eq('tab_id', activeTab)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data?.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp as string)
    })) as Message[];
  },

  async createMessage(message: MessageInput): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert(message);

    if (error) throw error;
  }
};