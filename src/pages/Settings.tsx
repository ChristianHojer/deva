import { Separator } from "@/components/ui/separator";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { TwoFactorSection } from "@/components/settings/TwoFactorSection";
import { SessionsSection } from "@/components/settings/SessionsSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";

const Settings = () => {
  return (
    <div className="container max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="grid gap-6">
        <ProfileSection />
        <SecuritySection />
        <TwoFactorSection />
        <SessionsSection />
        <SubscriptionSection />
      </div>
    </div>
  );
};

export default Settings;