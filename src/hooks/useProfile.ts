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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return null;

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, profile_picture_url, language_preference, theme, notification_preferences, role, is_active')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      return data as Profile | null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: UpdateProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
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