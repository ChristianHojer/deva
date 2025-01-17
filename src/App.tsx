import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { Dashboard } from "./pages/Dashboard";
import Index from "./pages/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="project/:projectId" element={<MainLayout />}>
              <Route path="discover" element={<Index />} />
              <Route path="iterate" element={<Index />} />
              <Route path="visualization" element={<Index />} />
              <Route path="code" element={<Index />} />
              <Route path="bugs" element={<Index />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;