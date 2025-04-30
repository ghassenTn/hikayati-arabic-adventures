import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Edit, Palette, Gamepad, Save, ArrowLeft, Puzzle, HelpCircle } from "lucide-react";
import { Image as LucideImage } from "lucide-react"; // Rename the lucide Image to avoid conflict
import { getStoryById, updateStory } from "@/lib/db";
import { 
  generateImagePrompt, 
  generateImage, 
  generateGameContent, 
  generateColoringImage,
  generateWordSearchPuzzle
} from "@/lib/gemini";
import { GeminiContext } from "@/App";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WordSearchPuzzle from "@/components/activities/WordSearchPuzzle";
import Quiz from "@/components/activities/Quiz";

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { apiKey } = useContext(GeminiContext);
  
  const [story, setStory] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingColoringPage, setIsGeneratingColoringPage] = useState(false);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [coloringImage, setColoringImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("story");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [matchingCards, setMatchingCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  
  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000"
  ];

  // Load the story data
  useEffect(() => {
    const loadStory = async () => {
      if (!id) return;
      
      try {
        const storyData = await getStoryById(Number(id));
        setStory(storyData);
        setEditedContent(storyData.content);
        setStoryImage(storyData.image || null);
      } catch (error) {
        console.error("Error loading story:", error);
        toast({
          title: "خطأ في تحميل القصة",
          description: "لم نتمكن من تحميل القصة. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
        navigate("/stories");
      }
    };
    
    loadStory();
  }, [id, navigate, toast]);
  
  // Set up canvas for coloring activity
  useEffect(() => {
    if (activeTab === "coloring" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        if (coloringImage) {
          // Draw the generated coloring image if available
          const img = new window.Image(); // Use window.Image instead of Image
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = coloringImage;
        } else {
          // Draw a simple outline for coloring (alternatively, could use image from story)
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          // Draw a simple house outline
          // House base
          ctx.moveTo(100, 300);
          ctx.lineTo(300, 300);
          ctx.lineTo(300, 200);
          ctx.lineTo(200, 100);
          ctx.lineTo(100, 200);
          ctx.lineTo(100, 300);
          
          // Door
          ctx.moveTo(175, 300);
          ctx.lineTo(175, 225);
          ctx.lineTo(225, 225);
          ctx.lineTo(225, 300);
          
          // Window
          ctx.moveTo(125, 225);
          ctx.lineTo(125, 250);
          ctx.lineTo(150, 250);
          ctx.lineTo(150, 225);
          ctx.lineTo(125, 225);
          
          // Another window
          ctx.moveTo(250, 225);
          ctx.lineTo(250, 250);
          ctx.lineTo(275, 250);
          ctx.lineTo(275, 225);
          ctx.lineTo(250, 225);
          
          // Sun
          ctx.moveTo(350, 50);
          ctx.arc(350, 50, 30, 0, Math.PI * 2);
          
          // Tree
          ctx.moveTo(50, 300);
          ctx.lineTo(50, 200);
          ctx.moveTo(25, 200);
          ctx.lineTo(75, 200);
          ctx.moveTo(20, 170);
          ctx.lineTo(80, 170);
          ctx.moveTo(30, 140);
          ctx.lineTo(70, 140);
          
          ctx.stroke();
        }
      }
    }
  }, [activeTab, coloringImage]);
  
  // Generate matching game when the tab is selected
  useEffect(() => {
    if (activeTab === "games" && story && matchingCards.length === 0) {
      const generateGame = async () => {
        try {
          const wordPairs = await generateGameContent(story.content);
          
          // Create card pairs for the matching game
          const cards = wordPairs.flatMap((pair, index) => [
            { id: index * 2, value: pair[0], matched: false },
            { id: index * 2 + 1, value: pair[1], matched: false }
          ]);
          
          // Shuffle the cards
          const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
          setMatchingCards(shuffledCards);
        } catch (error) {
          console.error("Error generating game:", error);
        }
      };
      
      generateGame();
    }
  }, [activeTab, story]);
  
  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      isDrawing.current = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  
  const endDrawing = () => {
    isDrawing.current = false;
  };
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw the outline or coloring image
      if (coloringImage) {
        const img = new window.Image(); // Use window.Image instead of Image
        img.onload = () => {
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        };
        img.src = coloringImage;
      } else {
        // Reset the tab to refresh the canvas with the default drawing
        const currentTab = activeTab;
        setActiveTab("story");
        setTimeout(() => setActiveTab(currentTab), 10);
      }
    }
  };
  
  // Card game functions
  const handleCardClick = (id: number) => {
    // Prevent clicking if two cards are already flipped or the card is already matched
    if (flippedCards.length === 2 || matchedPairs.includes(id)) return;
    
    // Prevent clicking on the same card twice
    if (flippedCards.length === 1 && flippedCards[0] === id) return;
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    // Check for a match if two cards are flipped
    if (newFlipped.length === 2) {
      const card1 = matchingCards.find(card => card.id === newFlipped[0]);
      const card2 = matchingCards.find(card => card.id === newFlipped[1]);
      
      // Using setTimeout to allow the card to flip before resolving the match
      setTimeout(() => {
        if (card1 && card2 && Math.floor(card1.id / 2) === Math.floor(card2.id / 2)) {
          // Match found
          setMatchedPairs([...matchedPairs, card1.id, card2.id]);
          toast({
            title: "تطابق رائع!",
            description: "لقد وجدت تطابقًا",
          });
        }
        setFlippedCards([]);
      }, 1000);
    }
  };
  
  // Save edited story
  const handleSaveEdit = async () => {
    if (!story) return;
    
    try {
      await updateStory({
        ...story,
        content: editedContent
      });
      
      setStory({
        ...story,
        content: editedContent
      });
      
      setIsEditing(false);
      
      toast({
        title: "تم حفظ التغييرات بنجاح",
        description: "تم تحديث محتوى القصة",
      });
    } catch (error) {
      console.error("Error saving edits:", error);
      toast({
        title: "خطأ في حفظ التغييرات",
        description: "لم نتمكن من حفظ التغييرات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };
  
  // Generate an image for the story
  const handleGenerateImage = async () => {
    if (!story) return;
    
    setIsGeneratingImage(true);
    
    try {
      const imagePrompt = await generateImagePrompt(story.content);
      const imageUrl = await generateImage(imagePrompt, apiKey);
      
      setStoryImage(imageUrl);
      
      // Update the story with the image URL
      await updateStory({
        ...story,
        image: imageUrl
      });
      
      setStory({
        ...story,
        image: imageUrl
      });
      
      toast({
        title: "تم إنشاء الصورة بنجاح",
        description: "تم إضافة صورة جديدة للقصة",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "خطأ في إنشاء الصورة",
        description: "لم نتمكن من إنشاء صورة للقصة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  // Generate a coloring page from the story content
  const handleGenerateColoringPage = async () => {
    if (!story) return;
    
    setIsGeneratingColoringPage(true);
    
    try {
      const coloringImageUrl = await generateColoringImage(story.content, apiKey);
      setColoringImage(coloringImageUrl);
      
      toast({
        title: "تم إنشاء صفحة التلوين بنجاح",
        description: "تم إنشاء صفحة جديدة للتلوين",
      });
      
      // Reset the canvas to show the new coloring image
      if (activeTab === "coloring") {
        setActiveTab("story");
        setTimeout(() => setActiveTab("coloring"), 10);
      }
    } catch (error) {
      console.error("Error generating coloring page:", error);
      toast({
        title: "خطأ في إنشاء صفحة التلوين",
        description: "لم نتمكن من إنشاء صفحة للتلوين. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingColoringPage(false);
    }
  };
  
  // Generate a word search puzzle based on story content
  const handleGenerateWordSearchPuzzle = async () => {
    if (!story) return;
    return generateWordSearchPuzzle(story.content);
  };
  
  // Check if all pairs have been matched
  const isGameComplete = matchingCards.length > 0 && matchedPairs.length === matchingCards.length;
  
  if (!story) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl">جاري تحميل القصة...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link to="/stories" className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-5 w-5 ml-2 rtl:rotate-180" />
              <span>العودة إلى المكتبة</span>
            </Link>
            <h1 className="text-3xl font-bold">{story.title}</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="story" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                القصة
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center">
                <LucideImage className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                الصور
              </TabsTrigger>
              <TabsTrigger value="coloring" className="flex items-center">
                <Palette className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                التلوين
              </TabsTrigger>
              <TabsTrigger value="wordsearch" className="flex items-center">
                <Puzzle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                البحث عن الكلمات
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                الأسئلة
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center">
                <Gamepad className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                الألعاب
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="story" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">الموضوع: <span className="font-medium text-foreground">{story.subject}</span></p>
                      <p className="text-sm text-muted-foreground">البطل: <span className="font-medium text-foreground">{story.hero}</span></p>
                    </div>
                    
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center">
                        <Edit className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        تحرير القصة
                      </Button>
                    ) : (
                      <Button onClick={handleSaveEdit} variant="default" className="flex items-center">
                        <Save className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        حفظ التغييرات
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[400px] story-container"
                    />
                  ) : (
                    <div className="bg-secondary/20 p-6 rounded-md story-container whitespace-pre-line">
                      {story.content}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="image" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-end">
                    <Button 
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="flex items-center"
                    >
                      {isGeneratingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 rtl:ml-2 rtl:mr-0"></div>
                          جاري إنشاء الصورة...
                        </>
                      ) : (
                        <>
                          <LucideImage className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                          إنشاء صورة جديدة
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {storyImage ? (
                    <div className="flex justify-center">
                      <img 
                        src={storyImage} 
                        alt={story.title} 
                        className="max-w-full rounded-lg shadow-lg max-h-[600px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-lg">
                      <h3 className="text-xl font-medium mb-2">لا توجد صورة للقصة</h3>
                      <p className="text-muted-foreground mb-4">قم بإنشاء صورة جديدة لقصتك</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="coloring" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleGenerateColoringPage}
                        disabled={isGeneratingColoringPage}
                        className="flex items-center"
                      >
                        {isGeneratingColoringPage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2 rtl:ml-2 rtl:mr-0"></div>
                            جاري إنشاء صفحة تلوين...
                          </>
                        ) : (
                          <>
                            <Palette className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                            إنشاء صفحة تلوين جديدة
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" onClick={clearCanvas}>
                        مسح الرسم
                      </Button>
                    </div>
                    
                    <div className="color-palette flex gap-2">
                      {colors.map((color) => (
                        <div
                          key={color}
                          className={`color-option w-6 h-6 rounded-full cursor-pointer ${
                            selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="colored-canvas w-full h-[500px]"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                    ></canvas>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wordsearch" className="mt-0">
              {story && (
                <WordSearchPuzzle 
                  storyContent={story.content}
                  onGeneratePuzzle={handleGenerateWordSearchPuzzle}
                />
              )}
            </TabsContent>
            
            <TabsContent value="quiz" className="mt-0">
              {story && (
                <Quiz 
                  storyContent={story.content}
                  apiKey={apiKey}
                />
              )}
            </TabsContent>
            
            <TabsContent value="games" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-center">لعبة الذاكرة: اربط الكلمات</h3>
                  
                  {isGameComplete && (
                    <div className="bg-primary/20 text-primary rounded-lg p-4 mb-6 text-center">
                      <h4 className="text-lg font-bold mb-2">مبروك! 🎉</h4>
                      <p>لقد أكملت اللعبة بنجاح!</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {matchingCards.map((card) => (
                      <div
                        key={card.id}
                        className={`game-card ${flippedCards.includes(card.id) || matchedPairs.includes(card.id) ? 'flipped' : ''}`}
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className="card-inner">
                          <div className="card-front flex items-center justify-center text-white text-lg font-bold">
                            ?
                          </div>
                          <div className="card-back">
                            <span className="text-xl font-bold">{card.value}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoryDetail;
