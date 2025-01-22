import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Settings } from "@/pages/Settings";
import { Analytics } from "@/pages/Analytics";
import { Superadmin } from "@/pages/Superadmin";
import Index from "@/pages/Index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="superadmin" element={<Superadmin />} />
          <Route path="project/:projectId/*" element={<Index />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;