
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  QueryClient,
  QueryClientProvider 
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useState } from "react";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import StoryList from "./pages/StoryList";
import CreateStory from "./pages/CreateStory";
import StoryDetail from "./pages/StoryDetail";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Coloring from "./pages/Coloring";
import Activities from "./pages/Activities"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Create new QueryClient instance
const queryClient = new QueryClient();

// Create a context for managing the Gemini API key
export const GeminiContext = createContext<{
  apiKey: string;
  setApiKey: (key: string) => void;
}>({
  apiKey: "AIzaSyAY7GX2ACK7O4TsITnICn21bYgywQL5LyE", // Initialize with the provided API key
  setApiKey: () => {},
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [apiKey, setApiKey] = useState<string>("AIzaSyAY7GX2ACK7O4TsITnICn21bYgywQL5LyE"); // Initialize with the provided API key
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="hikayati-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <GeminiContext.Provider value={{ apiKey, setApiKey }}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/stories" element={<StoryList />} />
                  <Route path="/coloring" element={<Coloring />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/create" 
                    element={
                      <ProtectedRoute>
                        <CreateStory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/story/:id" 
                    element={<StoryDetail />} 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </GeminiContext.Provider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
