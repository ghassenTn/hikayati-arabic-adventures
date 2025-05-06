import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Book, Infinity, School, BookOpen, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const domains = [
  {
    id: "language",
    name: "اللغة",
    icon: <Book className="h-6 w-6 text-primary" />,
    description: "أنشطة لتعلم اللغة العربية والتعبير",
    activities: [
      "قصص تفاعلية مع أسئلة",
      "تمارين في القواعد النحوية",
      "ألعاب الكلمات والأضداد"
    ]
  },
  {
    id: "science",
    name: "العلوم",
    icon: <Brain className="h-6 w-6 text-primary" />,
    description: "اكتشف عالم العلوم والظواهر الطبيعية",
    activities: [
      "تجارب علمية بسيطة",
      "عجائب الكون والفضاء",
      "عالم الحيوانات والنباتات"
    ]
  },
  {
    id: "math",
    name: "الرياضيات",
    icon: <Infinity className="h-6 w-6 text-primary" />,
    description: "تمارين وألعاب لتعلم الرياضيات",
    activities: [
      "ألغاز حسابية ممتعة",
      "تحديات الأرقام",
      "تطبيقات الرياضيات في الحياة"
    ]
  },
  {
    id: "social",
    name: "الاجتماعيات",
    icon: <School className="h-6 w-6 text-primary" />,
    description: "اكتشف التاريخ والجغرافيا والثقافات",
    activities: [
      "رحلات افتراضية حول العالم",
      "قصص من التراث والتاريخ",
      "ثقافات الشعوب المختلفة"
    ]
  }
];

const FreeActivities = () => {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "هذا سؤال رائع! يمكنك معرفة المزيد عن هذا الموضوع في قسم القصص التعليمية.",
        "أحسنت! هذا موضوع مهم للتعلم. جرب استكشاف الأنشطة المتعلقة بالعلوم لمعرفة المزيد.",
        "سؤال ممتاز! يمكنك العثور على معلومات أكثر في ألعابنا التعليمية المخصصة.",
        "إجابة هذا السؤال موجودة في قصصنا عن الفضاء والكواكب. جرب قراءة إحدى قصصنا!",
        "فكرة جيدة للتعلم! جرب استخدام المساعد الذكي في صفحة الدردشة للمزيد من المعلومات المفصلة."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAnswer(randomResponse);
      setIsAsking(false);
    }, 1500);
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">أنشطة تعليمية مجانية</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          اكتشف مجموعة متنوعة من الأنشطة التعليمية المجانية في مختلف الم��الات لتعزيز مهارات الأطفال بطريقة ممتعة
        </p>
        
        <Tabs defaultValue="language" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {domains.map((domain) => (
              <TabsTrigger 
                key={domain.id} 
                value={domain.id}
                className="flex flex-col gap-2 py-4"
              >
                {domain.icon}
                <span>{domain.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {domains.map((domain) => (
            <TabsContent key={domain.id} value={domain.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {domain.icon}
                    <span>{domain.name}</span>
                  </CardTitle>
                  <CardDescription>{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {domain.activities.map((activity, index) => (
                      <Card key={index} className="hover-scale">
                        <CardContent className="pt-6 text-center">
                          <h3 className="font-medium mb-2">{activity}</h3>
                          <Link to="/chat">
                            <Button variant="outline" size="sm" className="mt-2">
                              استكشف النشاط
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span>أسئلة لا نهائية مع المساعد الذكي</span>
              </CardTitle>
              <CardDescription>
                اسأل أي سؤال تعليمي وسيساعدك المساعد الذكي في الإجابة عليه
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="اكتب سؤالك هنا..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAskQuestion} 
                    disabled={!question.trim() || isAsking}
                  >
                    {isAsking ? "جاري البحث..." : "اسأل"}
                  </Button>
                </div>
                
                {answer && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <p>{answer}</p>
                    </CardContent>
                  </Card>
                )}
                
                <div className="text-center mt-2">
                  <Link to="/chat">
                    <Button variant="link">
                      للمزيد من الأسئلة، جرب الدردشة مع المساعد الذكي
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FreeActivities;
