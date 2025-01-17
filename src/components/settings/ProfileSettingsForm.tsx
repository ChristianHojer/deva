import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  username: z.string().min(2).max(30),
  language_preference: z.string(),
  theme: z.string(),
  notification_preferences: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettingsForm() {
  const { profile, isLoading, updateProfile } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || "",
      language_preference: profile?.language_preference || "en",
      theme: profile?.theme || "light",
      notification_preferences: {
        email: profile?.notification_preferences?.email ?? true,
        push: profile?.notification_preferences?.push ?? true,
      },
    },
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfile.mutate({
      ...data,
      notification_preferences: {
        email: data.notification_preferences.email,
        push: data.notification_preferences.push,
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Your preferred language for the application.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Choose between light and dark theme.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notification_preferences.email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Receive email notifications about your projects.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notification_preferences.push"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Push Notifications</FormLabel>
                  <FormDescription>
                    Receive push notifications about your projects.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
          {updateProfile.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update profile
        </Button>
      </form>
    </Form>
  );
}