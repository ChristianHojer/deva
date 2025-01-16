import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import Index from "./pages/Index";
import { Settings } from "./pages/Settings";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/discover" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/iterate" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/visualization" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/code" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/bugs" element={<MainLayout><Index /></MainLayout>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;