
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Book, Infinity, School, BookOpen, HelpCircle, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

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

// Sample questions database by domain
const questionsDatabase: Record<string, Question[]> = {
  language: [
    {
      id: 1,
      question: "ما هو جمع كلمة 'كتاب'؟",
      options: ["كتب", "كتابات", "كتبان", "كاتبون"],
      correctAnswer: "كتب"
    },
    {
      id: 2,
      question: "أي من الكلمات التالية تحتوي على همزة قطع؟",
      options: ["استماع", "أحمد", "انطلاق", "استغفار"],
      correctAnswer: "أحمد"
    },
    {
      id: 3,
      question: "ما هو ضد كلمة 'سعادة'؟",
      options: ["حزن", "فرح", "سرور", "بهجة"],
      correctAnswer: "حزن"
    },
    {
      id: 4,
      question: "ما هو المثنى من كلمة 'معلم'؟",
      options: ["معلمان", "معلمين", "معلمون", "معالم"],
      correctAnswer: "معلمان"
    }
  ],
  science: [
    {
      id: 1,
      question: "ما هو أكبر كوكب في المجموعة الشمسية؟",
      options: ["المريخ", "المشتري", "زحل", "الأرض"],
      correctAnswer: "المشتري"
    },
    {
      id: 2,
      question: "مم تتكون المادة؟",
      options: ["ذرات", "خلايا", "جزيئات فقط", "بروتينات"],
      correctAnswer: "ذرات"
    },
    {
      id: 3,
      question: "أي من الحيوانات التالية من الثدييات؟",
      options: ["السلحفاة", "التمساح", "الدولفين", "السمكة"],
      correctAnswer: "الدولفين"
    },
    {
      id: 4,
      question: "ما هي وظيفة القلب في جسم الإنسان؟",
      options: ["ضخ الدم", "هضم الطعام", "تنقية الهواء", "إنتاج الأنزيمات"],
      correctAnswer: "ضخ الدم"
    }
  ],
  math: [
    {
      id: 1,
      question: "ما هو ناتج 7 × 8 ؟",
      options: ["54", "56", "49", "64"],
      correctAnswer: "56"
    },
    {
      id: 2,
      question: "كم يساوي محيط المربع الذي طول ضلعه 5 سم؟",
      options: ["10 سم", "15 سم", "20 سم", "25 سم"],
      correctAnswer: "20 سم"
    },
    {
      id: 3,
      question: "ما هو العدد الذي إذا أضفنا إليه 15 يصبح 42؟",
      options: ["27", "25", "28", "30"],
      correctAnswer: "27"
    },
    {
      id: 4,
      question: "ما هو الكسر المكافئ للكسر 2/4 ؟",
      options: ["1/2", "2/6", "3/6", "4/8"],
      correctAnswer: "1/2"
    }
  ],
  social: [
    {
      id: 1,
      question: "ما هي عاصمة المملكة العربية السعودية؟",
      options: ["جدة", "الرياض", "مكة", "المدينة"],
      correctAnswer: "الرياض"
    },
    {
      id: 2,
      question: "من هو الخليفة الراشدي الأول في الإسلام؟",
      options: ["عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب", "أبو بكر الصديق"],
      correctAnswer: "أبو بكر الصديق"
    },
    {
      id: 3,
      question: "أي من هذه الدول ليست من دول مجلس التعاون الخليجي؟",
      options: ["الكويت", "البحرين", "الأردن", "عمان"],
      correctAnswer: "الأردن"
    },
    {
      id: 4,
      question: "ما هو النهر الذي يمر عبر مصر؟",
      options: ["دجلة", "النيل", "الفرات", "الأمازون"],
      correctAnswer: "النيل"
    }
  ]
};

// Function to generate a new question based on the domain
const generateQuestion = (domainId: string): Question => {
  const domainQuestions = questionsDatabase[domainId];
  
  // Base template questions if we run out of pre-defined questions
  const baseTemplates: Record<string, Question[]> = {
    language: [
      {
        id: 100,
        question: "أي من الكلمات التالية تحتوي على حرف الضاد؟",
        options: ["ضوء", "سماء", "قلب", "بحر"],
        correctAnswer: "ضوء"
      },
      {
        id: 101,
        question: "ما هو الفعل المضارع من 'كتب'؟",
        options: ["يكتب", "كاتب", "مكتوب", "كتابة"],
        correctAnswer: "يكتب"
      }
    ],
    science: [
      {
        id: 100,
        question: "ما هي الغازات الأساسية في الهواء؟",
        options: ["أكسجين ونيتروجين", "هيدروجين وهيليوم", "نيتروجين وهيليوم", "أكسجين وكربون"],
        correctAnswer: "أكسجين ونيتروجين"
      },
      {
        id: 101,
        question: "ما هي حالات المادة الثلاث الأساسية؟",
        options: ["صلبة وسائلة وغازية", "صلبة وناعمة ولينة", "سائلة وغازية وبلازما", "ناعمة وسائلة وغازية"],
        correctAnswer: "صلبة وسائلة وغازية"
      }
    ],
    math: [
      {
        id: 100,
        question: "كم يساوي ناتج 144 ÷ 12؟",
        options: ["12", "14", "10", "16"],
        correctAnswer: "12"
      },
      {
        id: 101,
        question: "ما هو الشكل الذي له أربعة أضلاع متساوية وأربع زوايا قائمة؟",
        options: ["المستطيل", "المربع", "المثلث", "الدائرة"],
        correctAnswer: "المربع"
      }
    ],
    social: [
      {
        id: 100,
        question: "ما هي أطول سلسلة جبال في العالم؟",
        options: ["جبال الهيمالايا", "جبال الأنديز", "جبال الألب", "جبال روكي"],
        correctAnswer: "جبال الأنديز"
      },
      {
        id: 101,
        question: "في أي قارة تقع مصر؟",
        options: ["آسيا", "أفريقيا", "أوروبا", "أمريكا الشمالية"],
        correctAnswer: "أفريقيا"
      }
    ]
  };
  
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * (domainQuestions.length + baseTemplates[domainId].length));
  
  // Use a base template if we exceed our main question bank
  if (randomIndex >= domainQuestions.length) {
    const templateIndex = randomIndex - domainQuestions.length;
    const templateQuestion = {...baseTemplates[domainId][templateIndex % baseTemplates[domainId].length]};
    
    // Modify the template slightly to create variety
    const suffixes = [" في رأيك؟", " بشكل صحيح؟", " حسب ما تعلمت؟", "؟"];
    templateQuestion.id = Date.now(); // ensure unique ID
    templateQuestion.question = templateQuestion.question.replace("؟", suffixes[Math.floor(Math.random() * suffixes.length)]);
    
    // Shuffle options
    templateQuestion.options.sort(() => Math.random() - 0.5);
    
    return templateQuestion;
  }
  
  // Return a copy of the question to avoid modifying the original
  const selectedQuestion = {...domainQuestions[randomIndex]};
  
  // Shuffle options order for variety
  selectedQuestion.options.sort(() => Math.random() - 0.5);
  
  return selectedQuestion;
};

const FreeActivities = () => {
  const [activeTab, setActiveTab] = useState("language");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [showCustomQuestion, setShowCustomQuestion] = useState<boolean>(false);

  // Generate a question when the tab changes or component first loads
  useEffect(() => {
    generateNewQuestion();
  }, [activeTab]);

  const generateNewQuestion = () => {
    const newQuestion = generateQuestion(activeTab);
    setCurrentQuestion(newQuestion);
    setSelectedAnswer("");
    setShowResult(false);
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

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">أنشطة تعليمية مجانية</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          اكتشف مجموعة متنوعة من الأنشطة التعليمية المجانية في مختلف المجالات لتعزيز مهارات الأطفال بطريقة ممتعة
        </p>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value)}
          className="w-full max-w-4xl mx-auto"
        >
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
                  <div className="space-y-6">
                    {/* Question Card */}
                    {currentQuestion && (
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
                              <RadioGroupItem value={option} id={option} />
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
                    )}
                    
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
                        <Button onClick={() => {
                          if (customQuestion.trim()) {
                            // Handle custom question - in production, this would send to backend
                            alert("تم إرسال سؤالك، سيتم إضافته قريباً");
                            setCustomQuestion("");
                          }
                        }} disabled={!customQuestion.trim()}>
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
