import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (fileData?: { name: string; url: string; type: string }) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleFileUpload,
  handleKeyPress
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
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
  );
};