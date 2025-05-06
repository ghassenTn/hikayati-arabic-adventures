
import React, { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
};

const defaultSettings: SettingsContextType = {
  showChat: true,
  setShowChat: () => {},
  showStats: true,
  setShowStats: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showChat, setShowChat] = useState(() => {
    const saved = localStorage.getItem("hikayati-show-chat");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [showStats, setShowStats] = useState(() => {
    const saved = localStorage.getItem("hikayati-show-stats");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hikayati-show-chat", JSON.stringify(showChat));
  }, [showChat]);

  useEffect(() => {
    localStorage.setItem("hikayati-show-stats", JSON.stringify(showStats));
  }, [showStats]);

  return (
    <SettingsContext.Provider
      value={{
        showChat,
        setShowChat,
        showStats,
        setShowStats,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
