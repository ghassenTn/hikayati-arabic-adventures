
import { toast } from "@/components/ui/use-toast";
import { GoogleGenAI } from "@google/genai";

export const generateStoryWithGemini = async (subject: string, hero: string, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }
    
    // Initialize the Gemini API client with the provided API key
    const genAI = new GoogleGenAI({apiKey});
    
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
      const genAI = new GoogleGenAI({apiKey});
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
      const genAI = new GoogleGenAI({apiKey});
      console.log("Using provided API key for coloring image generation:", apiKey.substring(0, 5) + "...");
      
      // In a real implementation, we would use Gemini to generate a coloring page based on the story content
      // For now, we'll return a placeholder coloring image for demonstration purposes
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a simple black and white outline image that's suitable for coloring
    // In a real implementation, we would generate or fetch actual coloring pages
    const coloringPages = [
      "https://cdn.pixabay.com/photo/2020/11/10/01/34/coloring-5728135_1280.png",
      "https://cdn.pixabay.com/photo/2022/12/10/16/50/owl-7647984_1280.png", 
      "https://cdn.pixabay.com/photo/2020/03/30/21/46/mandala-4985014_1280.png",
      "https://cdn.pixabay.com/photo/2020/12/01/19/20/coloring-5795424_1280.png",
      "https://cdn.pixabay.com/photo/2022/12/17/05/58/coloring-7660674_1280.png"
    ];
    
    // Select a random coloring page from the array
    const randomIndex = Math.floor(Math.random() * coloringPages.length);
    return coloringPages[randomIndex];
    
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

export const generateWordSearchPuzzle = async (storyContent: string): Promise<{grid: string[][], words: string[]}> => {
  try {
    console.log("Generating word search puzzle from story");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract unique words from the story content (Arabic words 3+ letters long)
    const allWords = storyContent.split(/\s+/)
      .map(word => word.replace(/[^\u0600-\u06FF]/g, '')) // Keep only Arabic characters
      .filter(word => word.length >= 3)
      .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates
    
    // Take up to 8 words for the puzzle
    const selectedWords = allWords.slice(0, 8);
    
    // Create a 10x10 grid for the word search
    const size = 10;
    const grid = Array(size).fill(0).map(() => Array(size).fill(''));
    const arabicChars = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
    
    // Fill grid with random Arabic characters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        grid[i][j] = arabicChars[Math.floor(Math.random() * arabicChars.length)];
      }
    }
    
    // Directions for word placement (right-to-left for Arabic)
    const directions = [
      [-1, 0],  // Up
      [1, 0],   // Down
      [0, -1],  // Right-to-left (for Arabic)
      [0, 1],   // Left-to-right
      [-1, -1], // Up-right
      [-1, 1],  // Up-left
      [1, -1],  // Down-right
      [1, 1]    // Down-left
    ];
    
    // Place words in the grid
    for (const word of selectedWords) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        attempts++;
        
        // Random starting position and direction
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        
        // Check if word fits at this position and direction
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          const r = row + i * direction[0];
          const c = col + i * direction[1];
          
          if (r < 0 || r >= size || c < 0 || c >= size) {
            fits = false;
            break;
          }
          
          if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            fits = false;
            break;
          }
        }
        
        // Place the word if it fits
        if (fits) {
          for (let i = 0; i < word.length; i++) {
            const r = row + i * direction[0];
            const c = col + i * direction[1];
            grid[r][c] = word[i];
          }
          placed = true;
        }
      }
    }
    
    return {
      grid,
      words: selectedWords
    };
    
  } catch (error) {
    console.error("Error generating word search puzzle:", error);
    toast({
      title: "خطأ في إنشاء لغز الكلمات",
      description: "حدث خطأ أثناء محاولة إنشاء لغز الكلمات.",
      variant: "destructive",
    });
    throw error;
  }
};

export const generateQuizQuestions = async (storyContent: string, apiKey?: string): Promise<Array<{question: string, options: string[], correctAnswer: string}>> => {
  try {
    console.log("Generating quiz questions from story content");
    
    if (apiKey) {
      // Initialize the Gemini API client
      const genAI = new GoogleGenAI({apiKey});
      console.log("Using provided API key for quiz generation:", apiKey.substring(0, 5) + "...");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract key story elements to generate questions about
    // In a production app, we would use the Gemini API to generate these
    const storyWords = storyContent
      .split(/\s+/)
      .filter(word => word.length > 3)
      .map(word => word.replace(/[^\u0600-\u06FFa-zA-Z]/g, ''));
    
    const uniqueWords = [...new Set(storyWords)];
    const selectedWords = uniqueWords.slice(0, Math.min(10, uniqueWords.length));
    
    // Generate 5 quiz questions (or fewer if not enough content)
    const questionCount = Math.min(5, Math.floor(selectedWords.length / 2));
    const questions = [];
    
    for (let i = 0; i < questionCount; i++) {
      // Choose a word from the story to base the question on
      const targetWord = selectedWords[i * 2];
      
      // Generate a simple question
      let question = "";
      if (i % 3 === 0) {
        question = `ما هو معنى كلمة "${targetWord}" في سياق القصة؟`;
      } else if (i % 3 === 1) {
        question = `ما الذي حدث بعد أن ${targetWord}؟`;
      } else {
        question = `لماذا ${targetWord} في القصة؟`;
      }
      
      // Generate multiple choice options
      const correctAnswer = `إجابة صحيحة عن ${targetWord}`; // In a real app, this would be generated
      const incorrectOptions = [
        `إجابة خاطئة عن ${targetWord} - 1`,
        `إجابة خاطئة عن ${targetWord} - 2`,
        `إجابة خاطئة عن ${targetWord} - 3`
      ];
      
      // Randomize the order of options
      const options = [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5);
      
      questions.push({
        question,
        options,
        correctAnswer
      });
    }
    
    return questions;
    
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    toast({
      title: "خطأ في إنشاء الأسئلة",
      description: "حدث خطأ أثناء محاولة إنشاء أسئلة الاختبار.",
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
    const genAI = new GoogleGenAI({apiKey});
    console.log("Using Gemini API with provided key to generate image from prompt:", prompt);
    
    // Placeholder return for frontend development
    return "https://placehold.co/600x400/9b87f5/ffffff?text=Generated+Story+Image";
    
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
};
