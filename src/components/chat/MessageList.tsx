import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  file_name?: string;
  file_url?: string;
  file_type?: string;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
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
  );
};