import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatInterface from "@/components/chat/ChatInterface";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-3xl">المساعد الذكي</CardTitle>
              <CardDescription>
                تحدث مع المساعد الذكي حول القصص والأنشطة التعليمية. يمكنه مساعدتك في فهم القصص وتقديم توصيات مخصصة.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <ChatInterface />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
