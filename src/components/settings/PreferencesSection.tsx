import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export const PreferencesSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Manage your app preferences and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable dark mode for a better viewing experience at night
            </p>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications about important updates
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
      </CardContent>
    </Card>
  )
}