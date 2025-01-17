import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Settings } from "@/pages/Settings";
import { Analytics } from "@/pages/Analytics";
import { Superadmin } from "@/pages/Superadmin";
import Index from "@/pages/Index";
import { useProfile } from "@/hooks/useProfile";

// Protected route component
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
        <Route path="/" element={<MainLayout />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;