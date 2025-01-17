import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { ProjectDashboard } from './components/sections/ProjectDashboard';
import { ChatSection } from './components/sections/ChatSection';
import { VisualizationSection } from './components/sections/VisualizationSection';
import { BugsList } from './components/sections/BugsList';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="project/:projectId">
            <Route path="discover" element={<ChatSection />} />
            <Route path="dashboard" element={<ProjectDashboard />} />
            <Route path="visualize" element={<VisualizationSection />} />
            <Route path="bugs" element={<BugsList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;