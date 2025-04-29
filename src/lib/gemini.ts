
import { toast } from "@/components/ui/use-toast";

const API_KEY = "YOUR_GEMINI_API_KEY"; // This should be user-provided in a real application

export const generateStoryWithGemini = async (subject: string, hero: string): Promise<string> => {
  try {
    // For demonstration, we'll simulate the API call
    // In a real app, you would make an actual API call to Google's Gemini API
    console.log(`Generating story about ${subject} with hero ${hero}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock story
    const storyStart = [
      `كان يا ما كان، في قديم الزمان، عاش ${hero} في مدينة صغيرة محاطة بالجبال العالية.`,
      `في يوم من الأيام، استيقظ ${hero} على صوت غريب قادم من خارج نافذته.`,
      `لم يكن ${hero} يعلم أنه سيبدأ مغامرة مثيرة في عالم ${subject}.`
    ].join(" ");
    
    const storyMiddle = [
      `قرر ${hero} أن يستكشف سر الصوت الغريب. عندما خرج من المنزل، وجد ${subject === "الفضاء" ? "مركبة فضائية غريبة" : subject === "البحار" ? "قارباً غريباً" : "رسالة غامضة"}.`,
      `كان ${hero} متحمساً جداً لاكتشاف المزيد عن ${subject}.`,
      `في طريقه، قابل ${hero} العديد من الأصدقاء الذين ساعدوه في مغامرته.`
    ].join(" ");
    
    const storyEnd = [
      `بعد رحلة طويلة ومليئة بالتحديات، اكتشف ${hero} أن ${subject} كان مليئاً بالأسرار والدروس القيمة.`,
      `تعلم ${hero} أن الشجاعة والصداقة هي أهم ما يمكن أن يمتلكه المرء.`,
      `وعاد ${hero} إلى منزله سعيداً بما تعلمه، ومستعداً لمشاركة قصته مع الجميع.`
    ].join(" ");
    
    return `${storyStart}\n\n${storyMiddle}\n\n${storyEnd}`;
    
  } catch (error) {
    console.error("Error generating story:", error);
    toast({
      title: "خطأ في إنشاء القصة",
      description: "حدث خطأ أثناء محاولة إنشاء القصة. يرجى المحاولة مرة أخرى.",
      variant: "destructive",
    });
    throw error;
  }
};

export const generateImagePrompt = async (storyContent: string): Promise<string> => {
  try {
    // For demonstration, we'll create a simple image prompt based on the story
    // In a real app, you would use Gemini API to generate a better prompt
    console.log("Generating image prompt from story");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract first few words for a simple prompt
    const words = storyContent.split(' ').slice(0, 15).join(' ');
    return `${words} (Arabic children's story illustration, colorful, friendly)`;
    
  } catch (error) {
    console.error("Error generating image prompt:", error);
    toast({
      title: "خطأ في إنشاء وصف الصورة",
      description: "حدث خطأ أثناء محاولة إنشاء وصف الصورة.",
      variant: "destructive",
    });
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // For demonstration, we'll return a placeholder image
    // In a real app, you would call a text-to-image API like Stable Diffusion or DALL-E
    console.log("Generating image with prompt:", prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a placeholder image
    return "https://placehold.co/600x400/9b87f5/ffffff?text=Generated+Story+Image";
    
  } catch (error) {
    console.error("Error generating image:", error);
    toast({
      title: "خطأ في إنشاء الصورة",
      description: "حدث خطأ أثناء محاولة إنشاء الصورة.",
      variant: "destructive",
    });
    throw error;
  }
};

export const generateGameContent = async (storyContent: string): Promise<string[][]> => {
  try {
    // For demonstration, we'll create a simple matching game
    // In a real app, you would use Gemini API to generate better game content
    console.log("Generating game content from story");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate simple word pairs for a matching game
    const wordPairs = [
      ["قصة", "Story"],
      ["بطل", "Hero"],
      ["مغامرة", "Adventure"],
      ["صداقة", "Friendship"],
      ["تعلم", "Learning"],
      ["شجاعة", "Courage"]
    ];
    
    return wordPairs;
    
  } catch (error) {
    console.error("Error generating game content:", error);
    toast({
      title: "خطأ في إنشاء محتوى اللعبة",
      description: "حدث خطأ أثناء محاولة إنشاء محتوى اللعبة.",
      variant: "destructive",
    });
    throw error;
  }
};
