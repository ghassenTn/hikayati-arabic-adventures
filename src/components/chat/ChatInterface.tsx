import React, { useState, useRef, useEffect, useContext } from "react";
import { Send, Mic, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { GeminiContext } from "@/App";
import { discussWithGemini } from "@/lib/gemini";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useContext(GeminiContext);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        content: "مرحبا! أنا مساعدك الذكي للتعلم. كيف يمكنني مساعدتك اليوم؟",
        role: "assistant",
        timestamp: new Date(),
      }]);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await discussWithGemini(
        inputMessage,
        "",
        "",
        apiKey
      );

      const assistantMessage: Message = {
        id: Date.now().toString() + "-response",
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "خطأ في المحادثة",
        description: "حدث خطأ أثناء محاولة الحصول على رد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-error",
        content: "عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        role: "assistant",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full">
        {/* Chat messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[90%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className={message.role === "user" ? "bg-primary" : "bg-secondary"}>
                    <AvatarFallback>
                      {message.role === "user" ? "أنت" : "AI"}
                    </AvatarFallback>
                    {message.role === "assistant" && (
                      <AvatarImage src="/robot-avatar.png" alt="AI Assistant" />
                    )}
                  </Avatar>
                  
                  <div
                    className={`rounded-lg py-2 px-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar className="bg-secondary">
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="/robot-avatar.png" alt="AI Assistant" />
                  </Avatar>
                  <div className="rounded-lg py-2 px-3 bg-muted">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <div className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-secondary rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>التحدث بالرسالة</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>إرفاق ملف</TooltipContent>
            </Tooltip>
            
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك هنا..."
              className="min-h-[60px] flex-1"
              disabled={isLoading}
            />
            
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;