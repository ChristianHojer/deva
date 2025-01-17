import { Separator } from "@/components/ui/separator";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";

const Settings = () => {
  return (
    <div className="container max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Profile Settings</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="p-4 bg-card rounded-lg border">
        <ProfileSettingsForm />
      </div>
    </div>
  );
};

export default Settings;