import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

interface ChatSectionProps {
  variant?: "primary" | "code";
  className?: string;
  activeTab: string;
}

export const ChatSection = ({ variant = "primary", className, activeTab }: ChatSectionProps) => {
  const [messagesByTab, setMessagesByTab] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentMessages = messagesByTab[activeTab] || [];

  const handleSendMessage = (fileData?: { name: string; url: string; type: string }) => {
    if (!inputMessage.trim() && !fileData) return;

    const newMessage: Message = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      ...(fileData && { file: fileData }),
    };

    setMessagesByTab(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMessage]
    }));
    setInputMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Create a URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);
    
    handleSendMessage({
      name: file.name,
      url: fileUrl,
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
        {currentMessages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg max-w-[80%]",
              message.sender === 'user' 
                ? "bg-primary text-primary-foreground ml-auto" 
                : "bg-muted"
            )}
          >
            {message.file ? (
              <div className="space-y-2">
                <div className="text-sm font-medium">Uploaded: {message.file.name}</div>
                {message.file.type.startsWith('image/') ? (
                  <img 
                    src={message.file.url} 
                    alt={message.file.name}
                    className="max-w-full rounded-md"
                  />
                ) : (
                  <a 
                    href={message.file.url} 
                    download={message.file.name}
                    className="text-blue-500 hover:underline"
                  >
                    Download {message.file.name}
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