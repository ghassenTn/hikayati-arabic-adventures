
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import Index from "./pages/Index";
import StoryList from "./pages/StoryList";
import CreateStory from "./pages/CreateStory";
import StoryDetail from "./pages/StoryDetail";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create a context for managing the Gemini API key
export const GeminiContext = createContext<{
  apiKey: string;
  setApiKey: (key: string) => void;
}>({
  apiKey: "AIzaSyAY7GX2ACK7O4TsITnICn21bYgywQL5LyE", // Initialize with the provided API key
  setApiKey: () => {},
});

const App = () => {
  const [apiKey, setApiKey] = useState<string>("AIzaSyAY7GX2ACK7O4TsITnICn21bYgywQL5LyE"); // Initialize with the provided API key
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GeminiContext.Provider value={{ apiKey, setApiKey }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/stories" element={<StoryList />} />
              <Route path="/create" element={<CreateStory />} />
              <Route path="/story/:id" element={<StoryDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GeminiContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
