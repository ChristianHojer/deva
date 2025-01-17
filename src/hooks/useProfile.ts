import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string | null;
  profile_picture_url: string | null;
  language_preference: string;
  theme: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  role: 'free' | 'pro' | 'team' | 'enterprise' | 'superadmin';
  is_active: boolean;
}

interface UpdateProfileData {
  username?: string;
  profile_picture_url?: string;
  language_preference?: string;
  theme?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
  };
}

export function useProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) return null;

        console.log("Session found:", session.user.id); // Debug log

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, profile_picture_url, language_preference, theme, notification_preferences, role, is_active')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError); // Debug log
          throw profileError;
        }

        console.log("Profile data:", data); // Debug log
        return data as Profile | null;
      } catch (error) {
        console.error("Profile query error:", error); // Debug log
        throw error;
      }
    },
    retry: 1,
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: UpdateProfileData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}