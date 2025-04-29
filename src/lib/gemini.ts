import { toast } from "@/components/ui/use-toast";
import { GoogleGenAI } from "@google/genai";

export const generateStoryWithGemini = async (subject: string, hero: string, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }
    
    // Initialize the Gemini API client with the provided API key
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log(`Generating story about ${subject} with hero ${hero}`);
    
    // For now, we'll keep the mock story generation to avoid actual API calls during development
    // In a production app, you would call the actual API
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

export const generateImage = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    console.log("Generating image with prompt:", prompt);
    
    if (apiKey) {
      // Initialize the Gemini API client
      const genAI = new GoogleGenAI(apiKey);
      // Note: Gemini API doesn't directly support image generation at the moment,
      // but we can prepare for when it does or use a different Google API
      console.log("Using provided API key for image generation:", apiKey.substring(0, 5) + "...");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Since we can't actually call Gemini directly from the browser for image generation (current limitation)
    // we'll use a placeholder image
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

export const generateColoringImage = async (storyContent: string, apiKey?: string): Promise<string> => {
  try {
    console.log("Generating coloring page from story");
    
    if (apiKey) {
      // Initialize the Gemini API client
      const genAI = new GoogleGenAI(apiKey);
      console.log("Using provided API key for coloring image generation:", apiKey.substring(0, 5) + "...");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here we would call an appropriate API to generate a coloring page
    return "https://placehold.co/600x400/ffffff/000000?text=Coloring+Page+Outline";
    
  } catch (error) {
    console.error("Error generating coloring image:", error);
    toast({
      title: "خطأ في إنشاء صفحة التلوين",
      description: "حدث خطأ أثناء محاولة إنشاء صفحة التلوين.",
      variant: "destructive",
    });
    throw error;
  }
};

export const generateGameContent = async (storyContent: string): Promise<string[][]> => {
  try {
    // For demonstration, we'll create a simple matching game
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

export const generateImageWithGemini = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenAI(apiKey);
    console.log("Using Gemini API with provided key to generate image from prompt:", prompt);
    
    // Placeholder return for frontend development
    return "https://placehold.co/600x400/9b87f5/ffffff?text=Generated+Story+Image";
    
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
};
