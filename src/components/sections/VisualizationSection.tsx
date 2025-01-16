import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const VisualizationSection = () => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just show a toast that the file was selected
      toast({
        title: "File selected",
        description: `Selected file: ${file.name}`,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 p-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Upload visualization</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your files here or click to browse
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = function(e) {
                  if (e && e.target instanceof HTMLInputElement) {
                    handleFileUpload({
                      target: e.target,
                      currentTarget: e.target,
                      preventDefault: () => {},
                      stopPropagation: () => {},
                      isPropagationStopped: () => false,
                      isDefaultPrevented: () => false,
                      persist: () => {},
                      nativeEvent: e as unknown as Event,
                      bubbles: e.bubbles,
                      cancelable: e.cancelable,
                      defaultPrevented: e.defaultPrevented,
                      eventPhase: e.eventPhase,
                      isTrusted: e.isTrusted,
                      timeStamp: e.timeStamp,
                      type: e.type
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                };
                input.click();
              }}
            >
              Browse Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};