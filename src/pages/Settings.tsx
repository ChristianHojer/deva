import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Upload, X } from "lucide-react";
import { useState } from "react";

interface Website {
  id: string;
  url: string;
}

export const Settings = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [newWebsite, setNewWebsite] = useState(false);

  const addWebsite = (url: string) => {
    if (url) {
      setWebsites([...websites, { id: crypto.randomUUID(), url }]);
      setNewWebsite(false);
    }
  };

  const removeWebsite = (id: string) => {
    setWebsites(websites.filter(website => website.id !== id));
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-8">User Settings</h1>
      
      <div className="space-y-8">
        {/* Profile Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <div className="flex items-start gap-6">
            <div>
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-2">
                Change Photo
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your company" />
              </div>
            </div>
          </div>
        </section>

        {/* File Upload Sections */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Files & Documents</h2>
          
          {/* Coding Files */}
          <div className="space-y-2">
            <Label>Coding Files</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">Upload Coding Files</Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <Label>Preferences</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">Upload Preferences</Button>
              </div>
            </div>
          </div>

          {/* Previous Projects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Previous Projects</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setNewWebsite(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Website
              </Button>
            </div>
            
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {websites.map((website) => (
                  <div 
                    key={website.id}
                    className="flex items-center justify-between p-2 rounded-lg border bg-gray-50"
                  >
                    <span className="text-sm">{website.url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWebsite(website.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {newWebsite && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter website URL"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addWebsite((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setNewWebsite(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;