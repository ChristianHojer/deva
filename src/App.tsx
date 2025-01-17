import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Settings } from "@/pages/Settings";
import { Analytics } from "@/pages/Analytics";
import { Superadmin } from "@/pages/Superadmin";
import { Auth } from "@/pages/Auth";
import Index from "@/pages/Index";
import { useProfile } from "@/hooks/useProfile";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useProfile();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const SuperadminRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  
  if (profile?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route 
            path="superadmin" 
            element={
              <SuperadminRoute>
                <Superadmin />
              </SuperadminRoute>
            } 
          />
          <Route path="project/:projectId/*" element={<Index />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;