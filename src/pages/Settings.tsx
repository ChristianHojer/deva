import { Separator } from "@/components/ui/separator";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <ProfileSettingsForm />
    </div>
  );
}