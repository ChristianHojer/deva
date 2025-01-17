export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  file_name?: string;
  file_url?: string;
  file_type?: string;
}

export interface MessageInput {
  content: string;
  tab_id: string;
  project_id: string;
  timestamp: string;
  sender: 'user' | 'assistant';
  file_name?: string;
  file_url?: string;
  file_type?: string;
}