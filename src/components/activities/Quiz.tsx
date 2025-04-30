
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { generateQuizQuestions } from "@/lib/gemini";

interface QuizProps {
  storyContent: string;
  apiKey?: string;
}

const Quiz = ({ storyContent, apiKey }: QuizProps) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Function to load quiz questions
  const loadQuiz = async () => {
    setIsLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    
    try {
      const quizQuestions = await generateQuizQuestions(storyContent, apiKey);
      setQuestions(quizQuestions);
    } catch (error) {
      console.error("Failed to load quiz:", error);
      toast({
        title: "خطأ في تحميل الاختبار",
        description: "لم نتمكن من إنشاء أسئلة الاختبار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load questions when component mounts
  useEffect(() => {
    if (storyContent) {
      loadQuiz();
    }
  }, [storyContent]);

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (submitted) return;
    
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  // Handle quiz submission
  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setSubmitted(true);
    
    toast({
      title: `نتيجة الاختبار: ${correctCount}/${questions.length}`,
      description: correctCount === questions.length 
        ? "رائع! لقد أجبت على جميع الأسئلة بشكل صحيح!" 
        : "استمر في القراءة وحاول مرة أخرى!",
      variant: correctCount === questions.length ? "default" : "destructive",
    });
  };

  // Determine if all questions have been answered
  const allQuestionsAnswered = questions.length > 0 && 
    Object.keys(selectedAnswers).length === questions.length;

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg">جاري إنشاء أسئلة الاختبار...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg mb-4">لا توجد أسئلة متاحة حالياً</p>
            <Button onClick={loadQuiz}>
              إنشاء أسئلة اختبار
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">اختبر فهمك للقصة</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-8">
            <div className="flex items-start mb-3">
              <span className="font-bold text-lg ml-2">{questionIndex + 1}.</span>
              <h3 className="text-lg">{question.question}</h3>
            </div>
            
            <RadioGroup
              value={selectedAnswers[questionIndex]}
              onValueChange={(value) => handleAnswerSelect(questionIndex, value)}
              className="space-y-2"
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem
                    value={option}
                    id={`question-${questionIndex}-option-${optionIndex}`}
                    disabled={submitted}
                    className="mt-1"
                  />
                  <div className="flex-grow">
                    <Label htmlFor={`question-${questionIndex}-option-${optionIndex}`} className="text-base">
                      {option}
                    </Label>
                  </div>
                  {submitted && (
                    <div className="ml-2 rtl:mr-2 rtl:ml-0">
                      {option === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : selectedAnswers[questionIndex] === option ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={loadQuiz} disabled={isLoading}>
          اختبار جديد
        </Button>
        
        {submitted ? (
          <div className="text-lg font-medium">
            النتيجة: {score}/{questions.length}
          </div>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!allQuestionsAnswered || isLoading}
          >
            إرسال الإجابات
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Quiz;
