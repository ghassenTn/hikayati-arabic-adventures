import React, { createContext, useState, useEffect, useContext } from "react";

export interface User {
  email: string;
  name?: string;
  picture?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true,
  googleLogin: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem("hikayati-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("hikayati-user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("hikayati-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hikayati-user");
    
    // Revoke Google authentication if it was used
    const auth2 = window.google?.accounts?.oauth2;
    if (auth2) {
      auth2.revoke();
    }
  };

  // Google Sign In
  const googleLogin = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!window.google) {
          throw new Error("Google API not loaded");
        }

        window.google.accounts.id.initialize({
          client_id: "1018066995615-iatsm5h6lh82pkderq4jdnpvcrho3qvg.apps.googleusercontent.com", // Replace with your actual Google Client ID
          callback: handleGoogleResponse,
        });
        
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error("Google sign-in prompt was not displayed or was skipped"));
          }
        });
        
        resolve();
      } catch (error) {
        console.error("Error during Google login:", error);
        reject(error);
      }
    });
  };
  
  const handleGoogleResponse = (response: any) => {
    if (response.credential) {
      // Decode the JWT token to get user information
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { email, name, picture } = JSON.parse(jsonPayload);
      
      // Login with the Google user data
      login({
        email,
        name,
        picture,
        provider: 'google'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
