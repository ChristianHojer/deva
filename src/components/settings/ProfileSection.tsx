import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const ProfileSection = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{
    username: string | null;
    email: string | null;
    profile_picture_url: string | null;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, profile_picture_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        username: data?.username,
        email: user.email,
        profile_picture_url: data?.profile_picture_url
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile?.username,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and how others see you on the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.profile_picture_url || "/placeholder.svg"} />
            <AvatarFallback>
              {profile?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <Camera className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name" 
              value={profile?.username || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev!, username: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={profile?.email || ''} 
              disabled 
              className="bg-muted"
            />
          </div>
          <Button 
            onClick={handleUpdateProfile} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};