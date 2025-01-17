import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { SessionsSection } from "@/components/settings/SessionsSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";

export function Settings() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-6">
              <ProfileSettingsForm />
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            <PreferencesSection />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySection />
          </TabsContent>
          <TabsContent value="sessions">
            <SessionsSection />
          </TabsContent>
          <TabsContent value="subscription">
            <SubscriptionSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}