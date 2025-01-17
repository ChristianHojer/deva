import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { Dashboard } from "./pages/Dashboard";
import { Index } from "./pages/Index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="project/:projectId/*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;