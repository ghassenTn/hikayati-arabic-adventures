
import React, { useState, useEffect, useContext, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Book, Infinity, School, BookOpen, HelpCircle, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { GeminiContext } from "@/App";
import { generateQuizQuestions } from "@/lib/gemini";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

// Question type definition
type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

const domains = [
  {
    id: "language",
    name: "اللغة",
    icon: <Book className="h-6 w-6 text-primary" />,
    description: "أنشطة لتعلم اللغة العربية والتعبير"
  },
  {
    id: "science",
    name: "العلوم",
    icon: <Brain className="h-6 w-6 text-primary" />,
    description: "اكتشف عالم العلوم والظواهر الطبيعية"
  },
  {
    id: "math",
    name: "الرياضيات",
    icon: <Infinity className="h-6 w-6 text-primary" />,
    description: "تمارين وألعاب لتعلم الرياضيات"
  },
  {
    id: "social",
    name: "الاجتماعيات",
    icon: <School className="h-6 w-6 text-primary" />,
    description: "اكتشف التاريخ والجغرافيا والثقافات"
  }
];

// Function to generate a new question based on the domain using AI
const generateAIQuestion = async (
  domainId: string,
  apiKey: string,
  previousQuestions: string[]
): Promise<Question> => {
  try {
    // Prepare content based on domain
    const domainContent = {
      language: "اللغة العربية وقواعدها والنحو والصرف والبلاغة",
      science: "العلوم والفيزياء والكيمياء والأحياء والفلك",
      math: "الرياضيات والحساب والجبر والهندسة",
      social: "الاجتماعيات والتاريخ والجغرافيا"
    };
    
    // Generate question using Gemini API
    const prompt = `قم بإنشاء سؤال اختيار من متعدد تعليمي للأطفال عن ${domainContent[domainId as keyof typeof domainContent]}. 
    السؤال يجب أن يكون باللغة العربية مع 4 خيارات.
    تأكد أن السؤال فريد وليس مكررًا من الأسئلة السابقة: ${previousQuestions.join(' | ')}
    قم بتنسيق الإجابة بشكل JSON فقط بالشكل التالي:
    {
      "question": "نص السؤال؟",
      "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
      "correctAnswer": "الإجابة الصحيحة (يجب أن تكون واحدة من الخيارات)"
    }`;

    const response = await generateQuizQuestions(prompt, apiKey);
    
    // Take the first question from the response
    const aiQuestion = response && response.length > 0 ? response[0] : null;
    
    if (!aiQuestion) {
      throw new Error("Failed to generate question");
    }

    return {
      id: Date.now(),
      question: aiQuestion.question,
      options: aiQuestion.options,
      correctAnswer: aiQuestion.correctAnswer
    };
  } catch (error) {
    console.error("Error generating AI question:", error);
    // Fallback to a simple question if AI fails
    return {
      id: Date.now(),
      question: `سؤال تلقائي حول ${domainId}؟`,
      options: ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
      correctAnswer: "الخيار الأول"
    };
  }
};

const FreeActivities = () => {
  const { apiKey } = useContext(GeminiContext);
  const [activeTab, setActiveTab] = useState("language");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [showCustomQuestion, setShowCustomQuestion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Store previous questions to avoid repetition
  const previousQuestions = useRef<{[key: string]: string[]}>({
    language: [],
    science: [],
    math: [],
    social: []
  });

  // Generate a question when the tab changes or component first loads
  useEffect(() => {
    generateNewQuestion();
  }, [activeTab, apiKey]);

  const generateNewQuestion = async () => {
    setLoading(true);
    try {
      // Pass the previous questions for this domain to avoid repetition
      const newQuestion = await generateAIQuestion(
        activeTab, 
        apiKey,
        previousQuestions.current[activeTab] || []
      );
      
      // Store this question to avoid repeating it
      if (newQuestion.question !== `سؤال تلقائي حول ${activeTab}؟`) {
        previousQuestions.current = {
          ...previousQuestions.current,
          [activeTab]: [
            ...(previousQuestions.current[activeTab] || []).slice(-5),
            newQuestion.question
          ]
        };
      }
      
      setCurrentQuestion(newQuestion);
      setSelectedAnswer("");
      setShowResult(false);
    } catch (error) {
      console.error("Failed to generate question:", error);
      toast({
        title: "خطأ في إنشاء السؤال",
        description: "لم نتمكن من إنشاء سؤال جديد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    
    setQuestionsAnswered(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    generateNewQuestion();
  };

  const handleCustomQuestionSubmit = () => {
    if (customQuestion.trim()) {
      toast({
        title: "تم استلام سؤالك",
        description: "شكرًا لمساهمتك! سيتم مراجعة سؤالك وإضافته قريبًا.",
      });
      setCustomQuestion("");
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">أنشطة تعليمية مجانية</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          اكتشف مجموعة متنوعة من الأنشطة التعليمية المجانية في مختلف المجالات لتعزيز مهارات الأطفال بطريقة ممتعة
        </p>
        
        <Tabs 
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {domains.map((domain) => (
              <TabsTrigger 
                key={domain.id} 
                value={domain.id}
                className="flex flex-col gap-2 py-4"
              >
                <span className="flex justify-center">{domain.icon}</span>
                <span>{domain.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {domains.map((domain) => (
            <TabsContent key={domain.id} value={domain.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{domain.icon}</span>
                    <span>{domain.name}</span>
                  </CardTitle>
                  <CardDescription>{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Question Card */}
                    {loading ? (
                      <Card className="p-6 border-primary/20 bg-primary/5">
                        <div className="flex justify-between items-start mb-4">
                          <Skeleton className="h-6 w-3/4" />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled
                          >
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          </Button>
                        </div>
                        <div className="space-y-3 my-4">
                          {[1, 2, 3, 4].map((item) => (
                            <Skeleton key={item} className="h-12 w-full" />
                          ))}
                        </div>
                        <Skeleton className="h-10 w-full mt-4" />
                      </Card>
                    ) : currentQuestion ? (
                      <Card className="p-6 border-primary/20 bg-primary/5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-lg font-medium">{currentQuestion.question}</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleNextQuestion}
                            title="سؤال جديد"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>

                        <RadioGroup 
                          value={selectedAnswer} 
                          onValueChange={setSelectedAnswer}
                          className="space-y-3 my-4"
                          disabled={showResult}
                        >
                          {currentQuestion.options.map((option) => (
                            <div key={option} className={`
                              flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-md border
                              ${showResult && option === currentQuestion.correctAnswer ? 'bg-green-100 border-green-300' : ''}
                              ${showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer ? 'bg-red-100 border-red-300' : ''}
                              ${!showResult ? 'hover:bg-accent cursor-pointer' : ''}
                            `}>
                              <RadioGroupItem value={option} />
                              <label
                                htmlFor={option}
                                className="flex-1 text-base cursor-pointer"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>

                        {!showResult ? (
                          <Button 
                            onClick={handleAnswerSubmit}
                            className="w-full mt-4"
                            disabled={!selectedAnswer}
                          >
                            تحقق من الإجابة
                          </Button>
                        ) : (
                          <div className="mt-4 space-y-4">
                            <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {isCorrect ? (
                                <p className="font-medium">أحسنت! إجابة صحيحة.</p>
                              ) : (
                                <div>
                                  <p className="font-medium">للأسف، الإجابة غير صحيحة.</p>
                                  <p className="mt-1">الإجابة الصحيحة هي: {currentQuestion.correctAnswer}</p>
                                </div>
                              )}
                            </div>
                            <Button onClick={handleNextQuestion} className="w-full">
                              السؤال التالي
                            </Button>
                          </div>
                        )}
                      </Card>
                    ) : null}
                    
                    {/* Score Card */}
                    <Card className="p-4 bg-background">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">النتيجة الحالية</p>
                          <p className="text-xl font-bold">{score} / {questionsAnswered}</p>
                        </div>
                        <Button onClick={() => {
                          setScore(0);
                          setQuestionsAnswered(0);
                          generateNewQuestion();
                        }} variant="outline">إعادة المحاولة</Button>
                      </div>
                    </Card>
                    
                    {/* Custom Questions Toggle */}
                    <div className="flex items-center space-x-2 pt-4 rtl:space-x-reverse">
                      <Checkbox 
                        id="customQuestions" 
                        checked={showCustomQuestion}
                        onCheckedChange={(checked) => setShowCustomQuestion(!!checked)}
                      />
                      <label
                        htmlFor="customQuestions"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        أريد إضافة أسئلتي الخاصة
                      </label>
                    </div>
                    
                    {/* Custom Question Input */}
                    {showCustomQuestion && (
                      <div className="space-y-4 pt-2">
                        <Input
                          placeholder="أدخل سؤالاً هنا..."
                          value={customQuestion}
                          onChange={(e) => setCustomQuestion(e.target.value)}
                        />
                        <Button 
                          onClick={handleCustomQuestionSubmit} 
                          disabled={!customQuestion.trim()}
                        >
                          إرسال السؤال
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FreeActivities;
