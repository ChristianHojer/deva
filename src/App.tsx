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
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="project/:projectId/*" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;