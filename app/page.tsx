'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "./components/Navbar";
import './components/VideoFeed/video-page.css';
import VideoFeed from './components/VideoFeed';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    if (!isLoading && !isAuthenticated()) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Style pour le loader
  const loaderStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#fff'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(255, 69, 87, 0.2)',
      borderRadius: '50%',
      borderTop: '4px solid #ff4557',
      animation: 'spin 1s linear infinite'
    }
  };
  
  // Afficher un écran de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="loading-container" style={loaderStyles.container}>
        <div className="spinner" style={loaderStyles.spinner}></div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié, afficher le contenu normal
  // Sinon, la redirection se fera automatiquement grâce au useEffect
  return (
    <div className="video-page-container">
      <VideoFeed />
      <Navbar />
    </div>
  );
}
