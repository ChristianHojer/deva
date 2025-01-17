import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export function Auth() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Get the user's profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error checking profile:', profileError);
            setError('Error checking profile status. Please try again.');
            return;
          }

          if (!profile) {
            console.error('Profile not found after signup');
            setError('Error creating profile. Please contact support.');
            return;
          }

          // If everything is successful, navigate to dashboard
          navigate('/dashboard');
        } catch (err) {
          console.error('Auth error:', err);
          if (err instanceof AuthApiError) {
            switch (err.status) {
              case 400:
                if (err.message.includes('Invalid login credentials')) {
                  setError('Account not found. Please sign up first or check your credentials.');
                } else {
                  setError('Invalid email or password. Please check your credentials and try again.');
                }
                break;
              case 422:
                setError('Invalid email format. Please enter a valid email address.');
                break;
              default:
                setError(err.message);
            }
          } else {
            setError(err instanceof AuthError ? err.message : 'An unexpected error occurred');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                },
                input: {
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}