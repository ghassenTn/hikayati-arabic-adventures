import { toast } from "@/components/ui/use-toast";
import { GoogleGenAI, Modality } from "@google/genai";

// Interface for quiz question structure
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const generateStoryWithGemini = async (subject: string, apiKey: string,prompt: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }

    // const prompt = `Generate a short children's story written **entirely in Arabic** about "${subject}" featuring "${hero}" as the main character. The story should be engaging, culturally appropriate for young Arabic-speaking children, and include a meaningful moral or lesson. Do not include any English words or translations — the output must be in Arabic only.`;

    const genAI = new GoogleGenAI({ apiKey });
    const response = genAI.models.generateContent({ model: "gemini-2.0-flash",contents:prompt }); // or "gemini-pro", depending on API version

    const text =(await response).text
    console.log(text)

    if (!text) {
      throw new Error("No story generated");
    }

    return text;

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


export const generateImagePrompt = async (storyContent: string, apiKey: string): Promise<string> => {
  try {
    const prompt = `Based on this story content: "${storyContent.slice(0, 200)}", create a detailed prompt for generating a colorful Arabic children's story illustration that captures the main scene.`;
    const genAI = new GoogleGenAI({ apiKey });
    const response = genAI.models.generateContent({ model: "gemini-2.0-flash",contents:prompt });
    
    const text =(await response).text
    console.log(text)
    if (!text) {
      throw new Error("No story generated");
    }

    return text;

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

export const generateImageWithGemini = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }

    const genAI = new GoogleGenAI({ apiKey });

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    console.log(response);

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image part found in the response.");

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    toast({
      title: "خطأ في إنشاء الصورة",
      description: "حدث خطأ أثناء محاولة إنشاء الصورة.",
      variant: "destructive",
    });
    throw error;
  }
};


export const generateColoringImage = async (hero: string, apiKey?: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }

    const prompt = `image for coloring for kids about : "${hero}".`;

    const genAI = new GoogleGenAI({ apiKey });

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No coloring image generated");

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


export const generateGameContent = async (storyContent: string, apiKey: string): Promise<string[][]> => {
  try {
    const prompt = `
بناءً على هذه القصة: "${storyContent.slice(0, 200)}"، 
أنشئ 6 أزواج من الكلمات المتعلقة بالقصة، حيث يحتوي كل زوج على الكلمة العربية وترجمتها إلى الإنجليزية، لتستخدم في لعبة مطابقة للأطفال.
أعد النتيجة بتنسيق JSON فقط كمصفوفة من المصفوفات مثل:
[
  ["كلمة عربية", "English word"],
  ...
]
لا تضف أي شرح أو نص إضافي، فقط JSON خام.
    `;

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text || !text.startsWith("[")) {
      throw new Error("Invalid response format");
    }

    return JSON.parse(text);
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

export const generateWordSearchPuzzle = async (storyContent: string , apiKey): Promise<{ grid: string[][], words: string[] }> => {
  try {
    const prompt = `
قم بإنشاء لغز كلمات متقاطعة (10x10) باستخدام 8 كلمات عربية مستخلصة من القصة التالية:
"${storyContent.slice(0, 200)}"
أعد النتيجة ككائن JSON فقط، بدون أي شرح أو مقدمة، بالشكل التالي:

{
  "grid": [["أ", "ب", ...], [...], ...], 
  "words": ["كلمة1", "كلمة2", ..., "كلمة8"]
}

لا تكتب أي شيء خارج كائن JSON. لا تستخدم تنسيقات مثل Markdown أو نص إضافي. فقط أعد JSON خام فقط.
`;


    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });
    
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = text.match(/\{[\s\S]*\}/); // Match JSON-like block
    if (!match) throw new Error("No valid JSON found in Gemini response");

    return JSON.parse(match[0]);
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

export const generateQuizQuestions = async (storyContent: string, apiKey?: string): Promise<QuizQuestion[]> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }

    const prompt = `
أنشئ 5 أسئلة اختيار من متعدد باللغة العربية بناءً على القصة التالية:
"${storyContent.slice(0, 200)}".
كل سؤال يجب أن يحتوي على 4 خيارات، مع تحديد الإجابة الصحيحة.

أعد النتيجة فقط ككائن JSON بدون أي شرح أو تنسيق إضافي، بهذا الشكل بالضبط:
[
  {
    "question": "نص السؤال",
    "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
    "correctAnswer": "الخيار الصحيح"
  },
  ...
]
`;

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log("Raw Gemini Output:", text);

    const cleanedText = text?.replace(/```json|```/g, "").trim();

    if (!cleanedText) throw new Error("No quiz questions generated");

    return JSON.parse(cleanedText);

    return JSON.parse(text);
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


// Chat apis 

export const discussWithGemini = async (
  userMessage: string,
  storiesContext: string,
  conversationHistory: string,
  apiKey: string
): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("No API key provided");
    }
    
    // Initialize the Gemini API client with the provided API key
    const genAI = new GoogleGenAI({apiKey});
    
    console.log("Starting discussion with Gemini");
    
    // For development, we'll simulate the API response
    // In production, you would use the actual Gemini API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a system prompt that includes stories context
    const systemPrompt = `
    أنت مساعد تعليمي مختص في مناقشة القصص للأطفال ومساعدتهم على التعلم.
    
    معلومات عن القصص المتاحة:
    ${storiesContext}
    
    السياق السابق للمحادثة:
    ${conversationHistory}
    
    قواعد مهمة:
    1. أجب دائمًا باللغة العربية.
    2. كن ودودًا ومشجعًا وإيجابيًا.
    3. قدم إجابات مناسبة للأطفال.
    4. ركز على القيم التعليمية والأخلاقية في إجاباتك.
    5. اربط إجاباتك بمحتوى القصص عندما يكون ذلك مناسبًا.
    6. شجع على التفكير النقدي والإبداعي.
    `;
    
    // Generate a simulated response based on user input
    // In production, this would be replaced with an actual Gemini API call
    let response = "";
    
    if (userMessage.includes("قصة") || userMessage.includes("القصص")) {
      response = "لدينا مجموعة رائعة من القصص التعليمية! يمكنك استكشاف قصص عن الفضاء، البحار، الحيوانات وغيرها. هل تريد معرفة المزيد عن قصة معينة؟";
    } else if (userMessage.includes("تعلم") || userMessage.includes("دروس")) {
      response = "التعلم من خلال القصص هو طريقة ممتعة! كل قصة لدينا تحتوي على دروس قيمة حول الشجاعة، الصداقة، التعاون، والمزيد. ما المهارة التي ترغب في تطويرها؟";
    } else if (userMessage.includes("مرحبا") || userMessage.includes("أهلا")) {
      response = "مرحباً بك! يسعدني التحدث معك حول القصص والتعلم. هل هناك موضوع معين تود مناقشته أو قصة تريد معرفة المزيد عنها؟";
    } else {
      response = "شكراً لسؤالك! يمكنني مساعدتك في فهم القصص ومناقشة الدروس المستفادة منها. هل تريد أن أخبرك بالمزيد عن أنشطتنا التعليمية المتنوعة مثل الألعاب والاختبارات والرسم؟";
    }
    
    console.log("Generated response:", response);
    return response;
    
  } catch (error) {
    console.error("Error in discussion with Gemini:", error);
    throw error;
  }
};