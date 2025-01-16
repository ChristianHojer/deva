import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FileHandlerProps {
  projectId: string;
  activeTab: string;
  onFileUploaded: (fileData: { name: string; url: string; type: string }) => void;
}

export const useFileHandler = ({ projectId, activeTab, onFileUploaded }: FileHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!projectId) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(`${projectId}/${activeTab}/${Date.now()}-${file.name}`, file);

    if (error) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(data.path);
    
    onFileUploaded({
      name: file.name,
      url: publicUrl,
      type: file.type,
    });
  };

  return {
    handleFileUpload
  };
};