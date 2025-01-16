import { cn } from "@/lib/utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MessageList } from "../chat/MessageList";
import { MessageInput } from "../chat/MessageInput";
import { useMessages } from "@/hooks/useMessages";
import { useFileHandler } from "../chat/FileHandler";

interface ChatSectionProps {
  variant?: "primary" | "code";
  className?: string;
  activeTab: string;
}

export const ChatSection = ({ variant = "primary", className, activeTab }: ChatSectionProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const { projectId } = useParams();
  const { messages, sendMessage } = useMessages(projectId, activeTab);
  const { handleFileUpload } = useFileHandler({
    projectId: projectId || '',
    activeTab,
    onFileUploaded: (fileData) => {
      sendMessage(inputMessage, fileData);
      setInputMessage('');
    }
  });

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white",
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