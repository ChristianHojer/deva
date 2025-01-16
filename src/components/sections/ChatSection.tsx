import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSectionProps {
  variant?: "primary" | "code";
  className?: string;
  activeTab: string;
}

export const ChatSection = ({ variant = "primary", className, activeTab }: ChatSectionProps) => {
  // Use a map to store messages for each tab
  const [messagesByTab, setMessagesByTab] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState('');

  // Get messages for current tab
  const currentMessages = messagesByTab[activeTab] || [];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessagesByTab(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMessage]
    }));
    setInputMessage('');
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
            {message.content}
          </div>
        ))}
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};