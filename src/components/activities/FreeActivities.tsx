
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Brain, 
  Book, 
  Infinity, 
  School, 
  BookOpen, 
  HelpCircle,
  Globe,
  History,
  Calculator,
  AtomIcon,
  ScrollText,
  Heart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    id: "geography",
    name: "الجغرافيا",
    icon: <Globe className="h-6 w-6 text-primary" />,
    description: "استكشف العالم والطبيعة من حولك",
    activities: [
      "استكشاف الدول والقارات",
      "الظواهر الطبيعية والمناخ",
      "البيئة والمحافظة عليها"
    ]
  },
  {
    id: "history",
    name: "التاريخ",
    icon: <History className="h-6 w-6 text-primary" />,
    description: "رحلة عبر الزمن لاكتشاف الماضي",
    activities: [
      "قصص من التاريخ العربي",
      "الحضارات القديمة وإنجازاتها",
      "شخصيات تاريخية مهمة"
    ]
  },
  {
    id: "math",
    name: "الرياضيات",
    icon: <Calculator className="h-6 w-6 text-primary" />,
    description: "تمارين وألعاب لتعلم الرياضيات",
    activities: [
      "ألغاز حسابية ممتعة",
      "تحديات الأرقام",
      "تطبيقات الرياضيات في الحياة"
    ]
  },
  {
    id: "physics",
    name: "الفيزياء",
    icon: <AtomIcon className="h-6 w-6 text-primary" />,
    description: "اكتشف قوانين الطبيعة والعلوم",
    activities: [
      "تجارب علمية بسيطة",
      "قوانين الحركة والطاقة",
      "الضوء والصوت والمغناطيسية"
    ]
  },
  {
    id: "culture",
    name: "الثقافة",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    description: "استكشف التراث والفنون والآداب",
    activities: [
      "حكايات من التراث العربي",
      "الفنون والموسيقى العربية",
      "العادات والتقاليد المختلفة"
    ]
  },
  {
    id: "sports",
    name: "الرياضة",
    icon: <Heart className="h-6 w-6 text-primary" />,
    description: "أنشطة حركية ورياضية للأطفال",
    activities: [
      "ألعاب حركية داخل المنزل",
      "رياضات شعبية حول العالم",
      "فوائد الرياضة للصحة"
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

// Age ranges for activities
const ageRanges = [
  { id: "3-5", label: "3-5 سنوات", color: "bg-green-100 text-green-800" },
  { id: "6-8", label: "6-8 سنوات", color: "bg-blue-100 text-blue-800" },
  { id: "9-12", label: "9-12 سنة", color: "bg-purple-100 text-purple-800" },
  { id: "13-15", label: "13-15 سنة", color: "bg-orange-100 text-orange-800" },
  { id: "all", label: "جميع الأعمار", color: "bg-gray-100 text-gray-800" }
];

const FreeActivities = () => {
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState("");
  const [selectedAge, setSelectedAge] = useState(searchParams.get("age") || "all");
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "language");
  
  useEffect(() => {
    // Update selections based on URL params when they change
    const age = searchParams.get("age");
    const domain = searchParams.get("domain");
    
    if (age) setSelectedAge(age);
    if (domain) setSelectedDomain(domain);
  }, [searchParams]);

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

  // Filter domains or activities based on the selected age range
  const getFilteredDomains = () => {
    if (selectedAge === "all") return domains;
    
    // In a real app, you would filter domains or activities based on age appropriateness
    return domains;
  };

  // Get the currently selected domain object
  const getCurrentDomain = () => {
    return domains.find(domain => domain.id === selectedDomain) || domains[0];
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">أنشطة تعليمية مجانية</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          اكتشف مجموعة متنوعة من الأنشطة التعليمية المجانية في مختلف المجالات لتعزيز مهارات الأطفال بطريقة ممتعة
        </p>
        
        {/* Age Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-background rounded-lg shadow-sm border p-4 max-w-md w-full">
            <h3 className="text-sm font-medium mb-3">اختر الفئة العمرية:</h3>
            <div className="flex flex-wrap gap-2">
              {ageRanges.map((range) => (
                <Button
                  key={range.id}
                  variant={selectedAge === range.id ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${selectedAge === range.id ? "" : ""}`}
                  onClick={() => setSelectedAge(range.id)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Tabs value={selectedDomain} onValueChange={setSelectedDomain} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {getFilteredDomains().map((domain) => (
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
          
          {getFilteredDomains().map((domain) => (
            <TabsContent key={domain.id} value={domain.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {domain.icon}
                      <CardTitle>{domain.name}</CardTitle>
                    </div>
                    {selectedAge !== "all" && (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ageRanges.find(range => range.id === selectedAge)?.color || "bg-gray-100"
                      }`}>
                        {ageRanges.find(range => range.id === selectedAge)?.label || "جميع الأعمار"}
                      </div>
                    )}
                  </div>
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
