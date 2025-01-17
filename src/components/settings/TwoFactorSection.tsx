import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Smartphone } from "lucide-react"

export const TwoFactorSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by enabling 2FA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Enable 2FA</h4>
            <p className="text-sm text-muted-foreground">
              Secure your account with an authentication app
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-start space-x-4">
            <QrCode className="h-8 w-8 mt-1" />
            <div className="space-y-2 flex-1">
              <h4 className="text-sm font-medium">Setup Instructions</h4>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>1. Download an authenticator app like Google Authenticator</li>
                <li>2. Scan the QR code or enter the setup key manually</li>
                <li>3. Enter the 6-digit code to verify setup</li>
              </ol>
              <div className="pt-4">
                <Button variant="outline" disabled>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Setup 2FA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}