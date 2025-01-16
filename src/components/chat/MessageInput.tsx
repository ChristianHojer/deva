import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Upload } from "lucide-react";
import { useRef, useEffect } from "react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (fileData?: { name: string; url: string; type: string }) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleFileUpload,
  handleKeyPress
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Max height of 200px
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  return (
    <div className="border-t bg-[#F1F1F1] p-4 rounded-b-lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 items-start">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={triggerFileUpload}
            className="shrink-0 mt-1"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Textarea 
            ref={textareaRef}
            placeholder="Type your message..." 
            className="flex-1 bg-white min-h-[40px] max-h-[200px] resize-none py-2 px-3 custom-scrollbar"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
          />
          <Button 
            onClick={() => handleSendMessage()}
            className="shrink-0 bg-black hover:bg-black/90 text-white p-2 mt-1"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};