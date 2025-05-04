import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Gamepad, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateEducationalGame } from "@/lib/gemini";

interface EducationalGameProps {
  storyContent: string;
  apiKey: string;
}

interface GameQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  imagePrompt?: string;
}

interface GameData {
  type: string;
  questions: GameQuestion[];
  instructions: string;
  title: string;
}

const EducationalGame: React.FC<EducationalGameProps> = ({ storyContent, apiKey }) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateGame();
  }, [storyContent, apiKey]);

  const generateGame = async () => {
    try {
      setIsLoading(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setGameCompleted(false);
      
      const gameData = await generateEducationalGame(storyContent, apiKey);
      setGameData(gameData);
    } catch (error) {
      console.error("Error generating educational game:", error);
      toast({
        title: "خطأ في إنشاء اللعبة",
        description: "لم نتمكن من إنشاء اللعبة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !gameData) return;
    
    const currentQuestion = gameData.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      toast({
        title: "إجابة صحيحة! 🎉",
        description: "أحسنت! تم إضافة نقطة إلى رصيدك.",
      });
    } else {
      toast({
        title: "إجابة خاطئة",
        description: `الإجابة الصحيحة هي: ${currentQuestion.correctAnswer}`,
      });
    }
    
    setIsAnswerSubmitted(true);
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < gameData.questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
      } else {
        setGameCompleted(true);
      }
    }, 1500);
  };

  const handleRestartGame = () => {
    generateGame();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">جاري إنشاء اللعبة التعليمية...</p>
        </CardContent>
      </Card>
    );
  }

  if (!gameData) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-xl text-destructive">حدث خطأ في إنشاء اللعبة</p>
          <Button onClick={generateGame} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Gamepad className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
            {gameData.title}
          </CardTitle>
          {!gameCompleted && (
            <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              السؤال {currentQuestionIndex + 1} من {gameData.questions.length}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {gameCompleted ? (
          <div className="text-center py-8">
            <div className="mx-auto bg-primary/10 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">أحسنت! 🎉</h3>
            <p className="text-lg mb-6">
              لقد حصلت على {score} من أصل {gameData.questions.length} نقاط
            </p>
            <Button onClick={handleRestartGame}>
              <RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              إعادة اللعبة
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">{gameData.instructions}</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">{gameData.questions[currentQuestionIndex].question}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gameData.questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option 
                      ? isAnswerSubmitted 
                        ? option === gameData.questions[currentQuestionIndex].correctAnswer 
                          ? "default" 
                          : "destructive" 
                        : "default" 
                      : "outline"}
                    className={`h-auto py-3 px-4 justify-start text-base ${
                      isAnswerSubmitted && option === gameData.questions[currentQuestionIndex].correctAnswer
                        ? "bg-green-500/10 text-green-500 border-green-500/50"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswerSubmitted}
                  >
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm mr-3 rtl:ml-3 rtl:mr-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={!selectedAnswer || isAnswerSubmitted}
                className="min-w-[150px]"
              >
                {isAnswerSubmitted ? "السؤال التالي..." : "تأكيد الإجابة"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationalGame;