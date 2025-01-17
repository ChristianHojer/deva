import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Smartphone, LogOut } from "lucide-react"

export const SessionsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Chrome - Windows</p>
                <p className="text-sm text-muted-foreground">Current session</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" disabled>
              Current
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Safari - iPhone</p>
                <p className="text-sm text-muted-foreground">Last active: 2 hours ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Sign out
            </Button>
          </div>
        </div>

        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out of all devices
        </Button>
      </CardContent>
    </Card>
  )
}