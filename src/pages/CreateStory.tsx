import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast, useToast } from "@/components/ui/use-toast";
import { Loader2, Save, BookText, Wand2, Sparkles } from "lucide-react";
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
  
  // Enhanced story generation parameters
  const [genre, setGenre] = useState("fantasy");
  const [tone, setTone] = useState("adventurous");
  const [length, setLength] = useState(3); // 1-5 scale
  const [includeMoral, setIncludeMoral] = useState(true);
  const [culturalSetting, setCulturalSetting] = useState("universal");
  const [ageGroup, setAgeGroup] = useState("children");
  
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
      // Create a detailed prompt for the AI
      const prompt = `
قم بإنشاء قصة مميزة بعنوان "${title || `مغامرة ${hero} في عالم ${subject}`}" تدور أحداثها في عالم ${subject}.
البطل الرئيسي هو ${hero}، وهو شخصية ${ageGroup === "children" ? "مناسبة للأطفال" : "عامة"}.
النوع الأدبي: ${genre === "fantasy" ? "خيال" : genre === "sci-fi" ? "خيال علمي" : genre === "realistic" ? "واقعية" : "مغامرات"}.
النبرة: ${tone === "adventurous" ? "مغامرة" : tone === "educational" ? "تعليمية" : tone === "humorous" ? "كوميدية" : "مثيرة"}.
الطول: ${length * 20}% من متوسط طول القصص (${length}/5).
الإعداد الثقافي: ${culturalSetting === "universal" ? "عالمي" : culturalSetting === "middle-eastern" ? "شرقي" : "عربي"}.
${includeMoral ? "تتضمن قصة درساً أخلاقياً مهماً." : ""}
القصة يجب أن تكون مبتكرة وممتعة، مع شخصيات متطورة وصراعات شيقة وحل منطقي للصراع.
ابدأ مباشرة بالقصة دون أي مقدمة أو تفسيرات إضافية.
`;

      const generatedStory = await generateStoryWithGemini(subject, apiKey,prompt);
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
        // genre,
        tone,
        length,
        includeMoral,
        culturalSetting,
        ageGroup
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
                <CardTitle className="text-xl flex items-center">
                  <Wand2 className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  قم بتحديد تفاصيل القصة للحصول على أفضل نتيجة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateStory} className="space-y-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>النوع الأدبي</Label>
                      <Select onValueChange={setGenre} defaultValue={genre}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fantasy">خيال</SelectItem>
                          <SelectItem value="sci-fi">خيال علمي</SelectItem>
                          <SelectItem value="realistic">قصة واقعية</SelectItem>
                          <SelectItem value="adventure">مغامرات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>الفئة العمرية</Label>
                      <Select onValueChange={setAgeGroup} defaultValue={ageGroup}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="children">أطفال</SelectItem>
                          <SelectItem value="teens">مراهقون</SelectItem>
                          <SelectItem value="general">عامة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>النبرة</Label>
                      <Select onValueChange={setTone} defaultValue={tone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adventurous">مغامرة</SelectItem>
                          <SelectItem value="educational">تعليمية</SelectItem>
                          <SelectItem value="humorous">كوميدية</SelectItem>
                          <SelectItem value="mysterious">مثيرة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>الإعداد الثقافي</Label>
                      <Select onValueChange={setCulturalSetting} defaultValue={culturalSetting}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="universal">عالمي</SelectItem>
                          <SelectItem value="middle-eastern">شرقي</SelectItem>
                          <SelectItem value="arabic">عربي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>طول القصة: {length * 20}%</Label>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[length]}
                      onValueChange={(value) => setLength(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>قصيرة</span>
                      <span>متوسطة</span>
                      <span>طويلة</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Switch id="moral" checked={includeMoral} onCheckedChange={setIncludeMoral} />
                    <Label htmlFor="moral">تضمين درس أخلاقي</Label>
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
                        <Sparkles className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                        إنشاء القصة الذكية
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