import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
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

interface ChatSectionProps {
  variant?: "primary" | "code";
  className?: string;
  activeTab: string;
}

export const ChatSection = ({ variant = "primary", className, activeTab }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();

    // Set up real-time listener for new messages
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

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Upload file to Supabase Storage
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

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(data.path);
    
    handleSendMessage({
      name: file.name,
      url: publicUrl,
      type: file.type,
    });

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      variant === "primary" ? "bg-[#F1F1F1]" : "bg-[#F6F6F7]",
      className
    )}>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "p-4 rounded-lg max-w-[80%]",
              message.sender === 'user' 
                ? "bg-primary text-primary-foreground ml-auto" 
                : "bg-muted"
            )}
          >
            {message.file_url ? (
              <div className="space-y-2">
                <div className="text-sm font-medium">Uploaded: {message.file_name}</div>
                {message.file_type?.startsWith('image/') ? (
                  <img 
                    src={message.file_url} 
                    alt={message.file_name}
                    className="max-w-full rounded-md"
                  />
                ) : (
                  <a 
                    href={message.file_url} 
                    download={message.file_name}
                    className="text-blue-500 hover:underline"
                  >
                    Download {message.file_name}
                  </a>
                )}
              </div>
            ) : (
              message.content
            )}
          </div>
        ))}
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button variant="outline" size="icon" onClick={triggerFileUpload}>
            <Upload className="h-4 w-4" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={() => handleSendMessage()}>Send</Button>
        </div>
      </div>
    </div>
  );
};
