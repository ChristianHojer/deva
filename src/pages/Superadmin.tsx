import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Database } from "lucide-react";
import { UserManagementSection } from "@/components/settings/UserManagementSection";
import { Navigate } from "react-router-dom";

interface RoleStats {
  role: string;
  count: number;
}

export const Superadmin = () => {
  const { profile, isLoading, error } = useProfile();
  
  console.log('Superadmin page - Profile:', profile);
  console.log('Superadmin page - Loading:', isLoading);
  console.log('Superadmin page - Error:', error);

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Redirect non-superadmin users
  if (!profile || profile.role !== 'superadmin') {
    console.log('Access denied - Current role:', profile?.role);
    return <Navigate to="/dashboard" replace />;
  }

  const { data: stats } = useQuery({
    queryKey: ['superadmin-stats'],
    queryFn: async () => {
      const [roleStats, projectStats, tokenStats] = await Promise.all([
        // Get user count by role
        supabase
          .from('profiles')
          .select('role, count')
          .select('role')
          .then(({ data, error }) => {
            if (error) {
              console.error('Role stats error:', error);
              return [];
            }
            if (!data) return [];
            const stats: Record<string, number> = {};
            data.forEach(user => {
              stats[user.role] = (stats[user.role] || 0) + 1;
            });
            return Object.entries(stats).map(([role, count]) => ({ role, count }));
          }),
        // Get total active projects
        supabase
          .from('projects')
          .select('count')
          .eq('status', 'In Progress')
          .single()
          .then(({ count, error }) => {
            if (error) {
              console.error('Project stats error:', error);
              return 0;
            }
            return count || 0;
          }),
        // Get total token usage
        supabase
          .from('token_usage')
          .select('tokens_used')
          .then(({ data, error }) => {
            if (error) {
              console.error('Token usage error:', error);
              return 0;
            }
            return data?.reduce((sum, record) => sum + record.tokens_used, 0) || 0;
          })
      ]);

      return {
        roleStats,
        projectStats,
        tokenStats
      };
    }
  });

  return (
    <div className="container max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Superadmin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage users and monitor platform statistics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.roleStats.map((stat) => (
                <div key={stat.role} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{stat.role}</span>
                  <span className="text-2xl font-bold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.projectStats || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Token Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tokenStats || 0}</div>
          </CardContent>
        </Card>
      </div>

      <UserManagementSection />
    </div>
  );
};

export default Superadmin;