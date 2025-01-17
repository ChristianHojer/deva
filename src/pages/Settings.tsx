import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { TwoFactorSection } from "@/components/settings/TwoFactorSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { SessionsSection } from "@/components/settings/SessionsSection";

export const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate("/");
  };

  return (
    <div className="container max-w-4xl py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">User Settings</h1>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="2fa">2FA</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySection />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesSection />
        </TabsContent>

        <TabsContent value="2fa">
          <TwoFactorSection />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSection />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;