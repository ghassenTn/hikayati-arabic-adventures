
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, BookText } from "lucide-react";
import { generateStoryWithGemini } from "@/lib/gemini";
import { addStory } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GeminiContext } from "@/App";

const CreateStory = () => {
  const [subject, setSubject] = useState("");
  const [hero, setHero] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { apiKey } = useContext(GeminiContext);

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !hero) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى إدخال الموضوع واسم البطل",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const generatedStory = await generateStoryWithGemini(subject, hero, apiKey);
      setContent(generatedStory);
      
      // Auto-generate a title if not provided
      if (!title) {
        setTitle(`مغامرة ${hero} في عالم ${subject}`);
      }
      
      setIsEditing(true);
      
      toast({
        title: "تم إنشاء القصة بنجاح",
        description: "يمكنك الآن تحرير القصة قبل حفظها",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "خطأ في إنشاء القصة",
        description: "حدث خطأ أثناء إنشاء القصة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStory = async () => {
    if (!title || !content) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى التأكد من وجود عنوان ومحتوى للقصة",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newStory = await addStory({
        title,
        subject,
        hero,
        content,
      });
      
      toast({
        title: "تم حفظ القصة بنجاح",
        description: "يمكنك الآن إضافة صور وأنشطة للقصة",
      });
      
      // Navigate to the story page
      navigate(`/story/${newStory.id}`);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "خطأ في حفظ القصة",
        description: "حدث خطأ أثناء حفظ القصة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">إنشاء قصة جديدة</h1>
          
          {!isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">قم بتحديد موضوع القصة واسم البطل</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateStory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان القصة (اختياري)</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="أدخل عنواناً للقصة أو سيتم إنشاء عنوان تلقائياً"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">موضوع القصة</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="مثل: الفضاء، الحيوانات، البحار، الصداقة..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hero">اسم بطل القصة</Label>
                    <Input
                      id="hero"
                      value={hero}
                      onChange={(e) => setHero(e.target.value)}
                      placeholder="أدخل اسم بطل القصة"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                        جاري إنشاء القصة...
                      </>
                    ) : (
                      <>
                        <BookText className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                        إنشاء القصة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">تحرير القصة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">عنوان القصة</Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان القصة"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-content">محتوى القصة</Label>
                  <Textarea
                    id="edit-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="محتوى القصة"
                    className="min-h-[300px] resize-none story-container"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  رجوع
                </Button>
                <Button
                  onClick={handleSaveStory}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                      حفظ القصة
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateStory;
