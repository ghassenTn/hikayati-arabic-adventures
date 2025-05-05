
import { toast } from "@/components/ui/use-toast";

export type Story = {
  id?: number;
  title: string;
  subject: string;
  hero: string;
  content: string;
  image?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  length?: number;
  includeMoral?: boolean;
  culturalSetting?: string;
  ageGroup?: string;
};

const DB_NAME = "hikayati_stories";
const STORIES_STORE = "stories";

// Initialize the database
export const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
      console.error("Database error:", event);
      toast({
        title: "خطأ في قاعدة البيانات",
        description: "لم نتمكن من فتح قاعدة البيانات",
        variant: "destructive",
      });
      reject("Could not open database");
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORIES_STORE)) {
        const store = db.createObjectStore(STORIES_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("title", "title", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("isFavorite", "isFavorite", { unique: false });
      }
    };
  });
};

// Add a new story
export const addStory = async (story: Omit<Story, "id" | "createdAt" | "updatedAt">): Promise<Story> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORIES_STORE], "readwrite");
    const store = transaction.objectStore(STORIES_STORE);
    
    const now = new Date().toISOString();
    const newStory = { 
      ...story, 
      isFavorite: story.isFavorite || false,
      createdAt: now, 
      updatedAt: now 
    };
    
    const request = store.add(newStory);
    
    request.onsuccess = (event) => {
      const id = (event.target as IDBRequest).result as number;
      resolve({ ...newStory, id });
    };
    
    request.onerror = () => {
      reject("Error adding story");
    };
  });
};

// Get all stories
export const getAllStories = async (): Promise<Story[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORIES_STORE], "readonly");
    const store = transaction.objectStore(STORIES_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject("Error getting stories");
    };
  });
};

// Get favorite stories
export const getFavoriteStories = async (): Promise<Story[]> => {
  try {
    // Get all stories first
    const allStories = await getAllStories();
    
    // Filter the stories that are marked as favorites
    const favorites = allStories.filter(story => story.isFavorite === true);
    
    return favorites;
  } catch (error) {
    console.error("Error loading favorite stories:", error);
    throw error;
  }
};

// Get a story by id
export const getStoryById = async (id: number): Promise<Story> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORIES_STORE], "readonly");
    const store = transaction.objectStore(STORIES_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result);
      } else {
        reject("Story not found");
      }
    };
    
    request.onerror = () => {
      reject("Error getting story");
    };
  });
};

// Update a story
export const updateStory = async (story: Story): Promise<Story> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORIES_STORE], "readwrite");
    const store = transaction.objectStore(STORIES_STORE);
    
    const updatedStory = { 
      ...story, 
      updatedAt: new Date().toISOString() 
    };
    
    const request = store.put(updatedStory);
    
    request.onsuccess = () => {
      resolve(updatedStory);
    };
    
    request.onerror = () => {
      reject("Error updating story");
    };
  });
};

// Toggle story favorite status
export const toggleFavorite = async (id: number): Promise<Story> => {
  try {
    const story = await getStoryById(id);
    const updatedStory = { 
      ...story, 
      isFavorite: !story.isFavorite,
    };
    return await updateStory(updatedStory);
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Could not toggle favorite status");
  }
};

// Delete a story
export const deleteStory = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORIES_STORE], "readwrite");
    const store = transaction.objectStore(STORIES_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject("Error deleting story");
    };
  });
};
