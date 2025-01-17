import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

export const ProfileSection = () => {
  const handleUpdateProfile = async () => {
    // TODO: Implement profile update logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and how others see you on the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <Camera className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" />
          </div>
          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}