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
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' 
                ? "justify-end" 
                : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[80%] break-words",
              message.sender === 'user' 
                ? "flex flex-col items-end" 
                : "flex flex-col items-start"
            )}>
              {message.file_url ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">
                    Uploaded: {message.file_name}
                  </div>
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
                <div className={cn(
                  "inline-block",
                  message.sender === 'user' 
                    ? "bg-secondary rounded-lg px-4 py-2" 
                    : ""
                )}>
                  {message.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};