import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const SecuritySection = () => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      // Clear the form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error updating password",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input 
            id="current-password" 
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input 
            id="new-password" 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input 
            id="confirm-password" 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
};