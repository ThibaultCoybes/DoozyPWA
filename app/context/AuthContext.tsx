'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import authService, { User } from '@/app/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  likeVideo: (videoId: string) => boolean;
  unlikeVideo: (videoId: string) => boolean;
  addToFavorites: (videoId: string) => boolean;
  removeFromFavorites: (videoId: string) => boolean;
  addToViewHistory: (videoId: string) => boolean;
  addToSearchHistory: (searchTerm: string) => boolean;
  isAuthenticated: () => boolean;
  followUser: (userId: string) => boolean;
  unfollowUser: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const newUser = await authService.register(username, email, password);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const likeVideo = (videoId: string) => {
    // Vérifier que videoId n'est pas confondu avec l'utilisateur
    if (!videoId || typeof videoId !== 'string') {
      console.error('ID de vidéo invalide:', videoId);
      return false;
    }
    
    // Effectuer la mise à jour en arrière-plan sans recharger l'interface
    setTimeout(() => {
      const result = authService.likeVideo(videoId);
      const currentUser = authService.getCurrentUser();
      
      // Vérifier que currentUser est valide avant de mettre à jour le state
      if (currentUser && typeof currentUser === 'object') {
        // Mise à jour non-bloquante du state
        setUser(prev => {
          // Ne déclencher un re-render que si les propriétés importantes ont changé
          if (JSON.stringify(prev?.likedVideos) !== JSON.stringify(currentUser.likedVideos)) {
            return currentUser;
          }
          return prev;
        });
      } else {
        console.error('Utilisateur invalide retourné par getCurrentUser');
      }
    }, 10);
    
    return true; // Retourne toujours true pour le feedback immédiat
  };

  const unlikeVideo = (videoId: string) => {
    // Vérifier que videoId n'est pas confondu avec l'utilisateur
    if (!videoId || typeof videoId !== 'string') {
      console.error('ID de vidéo invalide:', videoId);
      return false;
    }
    
    // Effectuer la mise à jour en arrière-plan sans recharger l'interface
    setTimeout(() => {
      const result = authService.unlikeVideo(videoId);
      const currentUser = authService.getCurrentUser();
      
      // Vérifier que currentUser est valide avant de mettre à jour le state
      if (currentUser && typeof currentUser === 'object') {
        // Mise à jour non-bloquante du state
        setUser(prev => {
          // Ne déclencher un re-render que si les propriétés importantes ont changé
          if (JSON.stringify(prev?.likedVideos) !== JSON.stringify(currentUser.likedVideos)) {
            return currentUser;
          }
          return prev;
        });
      } else {
        console.error('Utilisateur invalide retourné par getCurrentUser');
      }
    }, 10);
    
    return true; // Retourne toujours true pour le feedback immédiat
  };

  const addToFavorites = (videoId: string) => {
    // Vérifier que videoId n'est pas confondu avec l'utilisateur
    if (!videoId || typeof videoId !== 'string') {
      console.error('ID de vidéo invalide pour les favoris:', videoId);
      return false;
    }
    
    // Effectuer la mise à jour en arrière-plan sans recharger l'interface
    setTimeout(() => {
      const result = authService.addToFavorites(videoId);
      const currentUser = authService.getCurrentUser();
      
      // Vérifier que currentUser est valide avant de mettre à jour le state
      if (currentUser && typeof currentUser === 'object') {
        // Mise à jour non-bloquante du state
        setUser(prev => {
          // Ne déclencher un re-render que si les propriétés importantes ont changé
          if (JSON.stringify(prev?.favoriteVideos) !== JSON.stringify(currentUser.favoriteVideos)) {
            return currentUser;
          }
          return prev;
        });
      } else {
        console.error('Utilisateur invalide retourné par getCurrentUser');
      }
    }, 10);
    
    return true; // Retourne toujours true pour le feedback immédiat
  };

  const removeFromFavorites = (videoId: string) => {
    // Vérifier que videoId n'est pas confondu avec l'utilisateur
    if (!videoId || typeof videoId !== 'string') {
      console.error('ID de vidéo invalide pour supprimer des favoris:', videoId);
      return false;
    }
    
    // Effectuer la mise à jour en arrière-plan sans recharger l'interface
    setTimeout(() => {
      const result = authService.removeFromFavorites(videoId);
      const currentUser = authService.getCurrentUser();
      
      // Vérifier que currentUser est valide avant de mettre à jour le state
      if (currentUser && typeof currentUser === 'object') {
        // Mise à jour non-bloquante du state
        setUser(prev => {
          // Ne déclencher un re-render que si les propriétés importantes ont changé
          if (JSON.stringify(prev?.favoriteVideos) !== JSON.stringify(currentUser.favoriteVideos)) {
            return currentUser;
          }
          return prev;
        });
      } else {
        console.error('Utilisateur invalide retourné par getCurrentUser');
      }
    }, 10);
    
    return true; // Retourne toujours true pour le feedback immédiat
  };


  const addToViewHistory = (videoId: string) => {
    // Vérifier que videoId n'est pas confondu avec l'utilisateur
    if (!videoId || typeof videoId !== 'string') {
      console.error('ID de vidéo invalide pour l\'historique:', videoId);
      return false;
    }
    
    // Effectuer la mise à jour en arrière-plan sans recharger l'interface
    setTimeout(() => {
      const result = authService.addToViewHistory(videoId);
      const currentUser = authService.getCurrentUser();
      
      // Vérifier que currentUser est valide avant de mettre à jour le state
      if (currentUser && typeof currentUser === 'object') {
        // Mise à jour non-bloquante du state
        setUser(prev => {
          // Ne déclencher un re-render que si les propriétés importantes ont changé
          if (JSON.stringify(prev?.viewHistory) !== JSON.stringify(currentUser.viewHistory)) {
            return currentUser;
          }
          return prev;
        });
      } else {
        console.error('Utilisateur invalide retourné par getCurrentUser');
      }
    }, 10);
    
    return true; // Retourne toujours true pour le feedback immédiat
  };

  const addToSearchHistory = (searchTerm: string) => {
    const result = authService.addToSearchHistory(searchTerm);
    setUser(authService.getCurrentUser());
    return result;
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const followUser = (userId: string) => {
    // Vérifier que userId est valide
    if (!userId || typeof userId !== 'string') {
      console.error('ID utilisateur invalide pour followUser:', userId);
      return false;
    }
    
    try {
      // Appeler directement le service d'authentification pour la modification
      const success = authService.followUser(userId);
      
      if (success) {
        // Obtenir l'utilisateur mis à jour depuis le service
        const updatedUser = authService.getCurrentUser();
        
        // Mettre à jour le state avec l'utilisateur complet
        if (updatedUser) {
          setUser(updatedUser);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      return false;
    }
  };

  const unfollowUser = (userId: string) => {
    // Vérifier que userId est valide
    if (!userId || typeof userId !== 'string') {
      console.error('ID utilisateur invalide pour unfollowUser:', userId);
      return false;
    }
    
    try {
      // Appeler directement le service d'authentification pour la modification
      const success = authService.unfollowUser(userId);
      
      if (success) {
        // Obtenir l'utilisateur mis à jour depuis le service
        const updatedUser = authService.getCurrentUser();
        
        // Mettre à jour le state avec l'utilisateur complet
        if (updatedUser) {
          setUser(updatedUser);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    likeVideo,
    unlikeVideo,
    addToFavorites,
    removeFromFavorites,
    addToViewHistory,
    addToSearchHistory,
    isAuthenticated,
    followUser,
    unfollowUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
