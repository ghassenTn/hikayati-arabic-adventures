
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, BookPlus, Loader2, Search, Trash2 } from "lucide-react";
import { getAllStories, deleteStory, Story } from "@/lib/db";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const StoryList = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadStories = async () => {
      try {
        const allStories = await getAllStories();
        setStories(allStories);
        setFilteredStories(allStories);
      } catch (error) {
        console.error("Error loading stories:", error);
        toast({
          title: "خطأ في تحميل القصص",
          description: "لم نتمكن من تحميل قائمة القصص. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(
        story =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.hero.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStories(filtered);
    }
  }, [searchTerm, stories]);

  const handleDeleteStory = async (id: number) => {
    try {
      await deleteStory(id);
      setStories(prevStories => prevStories.filter(story => story.id !== id));
      
      toast({
        title: "تم حذف القصة بنجاح",
        description: "تم حذف القصة من المكتبة",
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "خطأ في حذف القصة",
        description: "لم نتمكن من حذف القصة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">مكتبة القصص</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن قصة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-9 w-full"
                />
              </div>
              
              <Link to="/create">
                <Button>
                  <BookPlus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  قصة جديدة
                </Button>
              </Link>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-12 bg-secondary/20 rounded-lg">
              <h2 className="text-xl font-medium mb-2">لا توجد قصص</h2>
              {stories.length === 0 ? (
                <p className="text-muted-foreground mb-6">لم تقم بإنشاء أي قصص حتى الآن.</p>
              ) : (
                <p className="text-muted-foreground mb-6">لا توجد نتائج مطابقة لبحثك.</p>
              )}
              {stories.length === 0 && (
                <Link to="/create">
                  <Button>
                    <BookPlus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                    أنشئ قصتك الأولى
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold line-clamp-1" title={story.title}>
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground">البطل: </span>
                      <span className="font-medium">{story.hero}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground">الموضوع: </span>
                      <span className="font-medium">{story.subject}</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm text-muted-foreground">تاريخ الإنشاء: </span>
                      <span className="font-medium">{formatDate(story.createdAt)}</span>
                    </div>
                    <p className="line-clamp-3 text-sm story-container h-16">
                      {story.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Link to={`/story/${story.id}`}>
                      <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        فتح القصة
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد من حذف هذه القصة؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف القصة نهائيًا ولا يمكن استعادتها.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-row-reverse sm:justify-end">
                          <AlertDialogAction
                            onClick={() => story.id && handleDeleteStory(story.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoryList;
