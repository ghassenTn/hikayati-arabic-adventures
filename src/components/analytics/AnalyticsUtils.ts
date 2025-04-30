
import { Story } from "@/lib/db";

// Generate data for daily activities based on stories
export const generateActivityData = (stories: Story[]) => {
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  
  // For each day, calculate metrics based on story timestamps
  return days.map(day => {
    // Count stories created on each day (using a simplistic approach for demo)
    const storyCount = stories.length > 0 ? 
      Math.max(1, Math.floor(Math.random() * stories.length)) : 0;
    
    return {
      name: day,
      قراءة: storyCount + Math.floor(Math.random() * 3),
      اختبارات: Math.max(1, Math.floor(storyCount * 0.7)),
      تلوين: Math.max(1, Math.floor(storyCount * 0.8))
    };
  });
};

// Generate learning progress data based on story count
export const generateLearningData = (stories: Story[]) => {
  // Create 4 weeks of data based on story accumulation
  const totalStories = stories.length;
  const storiesPerWeek = Math.ceil(totalStories / 4);
  
  return Array.from({ length: 4 }, (_, i) => ({
    name: `الأسبوع ${i + 1}`,
    تعلم: Math.min(totalStories, (i + 1) * storiesPerWeek || 5 + i * 5)
  }));
};

// Generate quiz performance data based on story content
export const generateQuizPerformance = (stories: Story[]) => {
  // Calculate performance metrics based on story complexity or length
  const totalStories = stories.length || 1;
  
  // Simplistic calculation: longer stories = better mastery levels
  const excellentPercentage = Math.floor((stories.filter(s => s.content?.length > 500).length / totalStories) * 100) || 60;
  const goodPercentage = Math.floor((stories.filter(s => s.content?.length > 300 && s.content?.length <= 500).length / totalStories) * 100) || 25;
  const averagePercentage = Math.floor((stories.filter(s => s.content?.length > 100 && s.content?.length <= 300).length / totalStories) * 100) || 10;
  const poorPercentage = 100 - excellentPercentage - goodPercentage - averagePercentage;
  
  return [
    { name: "ممتاز", value: Math.max(excellentPercentage, 5), color: "#9b87f5" },
    { name: "جيد", value: Math.max(goodPercentage, 5), color: "#E5DEFF" },
    { name: "متوسط", value: Math.max(averagePercentage, 5), color: "#F97316" },
    { name: "ضعيف", value: Math.max(poorPercentage, 5), color: "#ef4444" },
  ];
};

// Generate story-specific completion data
export const generateStoryCompletionData = (stories: Story[]) => {
  return stories.map((story, index) => {
    // Calculate completion rates based on story content length and complexity
    const contentLength = story.content?.length || 0;
    const readingRate = Math.min(100, Math.floor((contentLength / 1000) * 100) || Math.floor(Math.random() * 100));
    const quizRate = Math.floor(readingRate * (0.7 + Math.random() * 0.3));
    const coloringRate = Math.floor(readingRate * (0.6 + Math.random() * 0.4));
    
    return {
      id: story.id,
      name: `قصة ${index + 1}`,
      title: story.title,
      قراءة: readingRate,
      اختبارات: quizRate,
      تلوين: coloringRate,
    };
  });
};

// Calculate total activities completed
export const calculateTotalActivities = (activityData: any[]) => {
  return activityData.reduce((acc, day) => acc + day.قراءة + day.اختبارات + day.تلوين, 0);
};

// Calculate completion rate
export const calculateCompletionRate = (stories: Story[], storyCompletionData: any[]) => {
  const totalPossible = stories.length * 3; // 3 activities per story (reading, quizzes, coloring)
  const completed = storyCompletionData.reduce(
    (acc, story) => {
      // Consider an activity "complete" if it's above 50%
      const readingComplete = story.قراءة >= 50 ? 1 : 0;
      const quizComplete = story.اختبارات >= 50 ? 1 : 0;
      const coloringComplete = story.تلوين >= 50 ? 1 : 0;
      return acc + readingComplete + quizComplete + coloringComplete;
    }, 
    0
  );
  
  return totalPossible > 0 ? Math.floor((completed / totalPossible) * 100) : 0;
};
