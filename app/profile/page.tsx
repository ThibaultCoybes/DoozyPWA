'use client';

import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import authService from '../services/authService';
import { User } from '../services/authService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Interface pour les vidu00e9os
interface Video {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  shares: number;
  categories: string[];
  createdAt: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'liked', 'favorite'
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const router = useRouter();

  // Fonction pour rafraîchir les données utilisateur depuis le localStorage
  const refreshUserData = () => {
    // Forcer la récupération des données directement depuis localStorage
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('doozy_current_user');
        if (userStr) {
          const freshUser = JSON.parse(userStr);
          setCurrentUser(freshUser);
          return freshUser;
        }
      } catch (e) {
        console.error('Erreur lors de la lecture de localStorage:', e);
      }
    }
    
    // Méthode standard si l'accès direct échoue
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Rafraîchir les données utilisateur à chaque fois que la page devient visible
  useEffect(() => {
    // Fonction pour rafraîchir les données lorsque la page devient visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUserData();
      }
    };

    // Ajouter l'écouteur d'événement pour détecter quand l'utilisateur revient sur la page
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Nettoyage lors du démontage du composant
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Charger l'utilisateur et les vidéos au chargement de la page
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = refreshUserData();
    if (user) {
      
      // Charger les données des vidéos
      const loadVideos = async () => {
        try {
          // Utiliser directement les vidéos disponibles dans le dossier public/videos
          const videoFiles = [
            'bracelet perles.mp4',
            'broderie.mp4',
            'custom.mp4',
            'diamond painting.mp4',
            'peinture tote bag.mp4',
            'peinture.mp4',
            'poterie.mp4',
            'tricot.mp4',
            'video.mp4'
          ];
          
          // Créer des objets vidéo à partir des noms de fichiers
          const createVideoFromFile = (file: string, index: number) => {
            const title = file.replace('.mp4', '').split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            return {
              id: `profile-${index}`,
              userId: user.id,
              username: user.username,
              userAvatar: user.avatar,
              title: `DIY: ${title} 💕`,
              description: "Tutoriel DIY fait maison. Suivez les étapes pour créer votre propre projet artisanal. N'oubliez pas de partager vos créations en commentaire !",
              videoUrl: `/videos/${file}`,
              thumbnailUrl: "/images/thumbnails/default.jpg",
              likes: Math.floor(Math.random() * 100) + 10,
              comments: Math.floor(Math.random() * 20) + 5,
              shares: Math.floor(Math.random() * 30) + 3,
              categories: ["diy", "craft"],
              createdAt: new Date(Date.now() - (index * 86400000)).toISOString()
            };
          };
          
          // Créer tous les objets vidéo
          const allVideos = videoFiles.map((file, index) => createVideoFromFile(file, index));
          
          // Assigner des vidéos à l'utilisateur (ses propres vidéos)
          // Pour cette démo, on attribue les 3 premières vidéos comme si elles étaient les siennes
          const userOwnVideos = allVideos.slice(0, 3);
          setUserVideos(userOwnVideos);
          
          // Pour la démo, assigner certaines vidéos comme "liked" par l'utilisateur
          const userLikedVideos = [allVideos[3], allVideos[4], allVideos[5]];
          setLikedVideos(userLikedVideos);
          
          // Pour la démo, assigner certaines vidéos comme favorites
          const userFavoriteVideos = [allVideos[6], allVideos[7], allVideos[8]];
          setFavoriteVideos(userFavoriteVideos);

          setIsLoading(false);
        } catch (error) {
          console.error('Erreur lors du chargement des vidéos:', error);
          setIsLoading(false);
        }
      };

      loadVideos();
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push('/login');
    }
  }, [router]);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/auth/login');
    }
  }, [isLoading, currentUser, router]);
  
  // Formater le nombre pour l'affichage (1200 -> 1.2K)
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return count.toString();
    }
  };

  // Gérer le changement d'onglet
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Fonction pour ouvrir une vidéo
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  // Fonction pour fermer le modal vidéo
  const closeVideoModal = () => {
    setShowVideoModal(false);
    // Pause la vidéo quand on ferme le modal
    setTimeout(() => {
      setSelectedVideo(null);
    }, 300); // Attendre la fin de l'animation
  };

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!currentUser) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="container" style={{ 
      background: 'linear-gradient(180deg, #F7ECD9 0%, #F4D9CE 100%)', 
      height: '100vh',
      maxWidth: '500px',
      margin: '0 auto',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Zone de défilement principale */}
      <main style={{ 
        flex: '1 1 auto',
        overflowY: 'auto',
        paddingBottom: '80px', // Espace pour la navbar
        padding: '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#FF7844 #FFF5EB',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          marginBottom: '10px'
        }}> 
          <div style={{
            cursor: 'pointer',
            padding: '5px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="12" r="2" fill="#FF8FAA" />
              <circle cx="12" cy="12" r="2" fill="#FF8FAA" />
              <circle cx="19" cy="12" r="2" fill="#FF8FAA" />
            </svg>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: 'white',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <Image 
              src={'/images/avatars/avatar.jpg'} 
              alt={`Avatar de ${currentUser.username}`} 
              width={100} 
              height={100} 
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                // Si l'image ne peut pas être chargée, utiliser l'avatar par défaut
                e.currentTarget.src = '/images/avatars/avatar.jpg';
              }}
            />
          </div>
          
          <p style={{ margin: '5px 0 15px 0', color: '#999', fontSize: '16px', fontWeight: '500' }}>@{currentUser.username}</p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            margin: '0 0 15px 0'
          }}>
            <div style={{ textAlign: 'center', marginRight: '1rem' }}>
              <p style={{ fontWeight: 'bold', margin: '0', color: '#FF7844' }}>{userVideos.length}</p>
              <p style={{ fontSize: '14px', margin: '0', color: '#FF7844' }}>Publications</p>
            </div>
            <div style={{ textAlign: 'center', marginRight: '1rem' }}>
              <p style={{ fontWeight: 'bold', margin: '0', color: '#FF7844' }}>{currentUser.following && Array.isArray(currentUser.following) ? formatCount(currentUser.following.length) : '0'}</p>
              <p style={{ fontSize: '14px', margin: '0', color: '#FF7844' }}>Abonnements</p>
            </div>
            <div style={{ textAlign: 'center', marginRight: '1rem' }}>
              <p style={{ fontWeight: 'bold', margin: '0', color: '#FF7844' }}>{currentUser.followers && Array.isArray(currentUser.followers) ? formatCount(currentUser.followers.length) : '0'}</p>
              <p style={{ fontSize: '14px', margin: '0', color: '#FF7844' }}>Abonnés</p>
            </div>
          </div>
          
          <button style={{
            backgroundColor: '#FF8FAA',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>
            Modifier le profil
          </button>
          
          <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
            marginBottom: '20px'
          }}>
            <div 
              onClick={() => handleTabChange('posts')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: activeTab === 'posts' ? 1 : 0.6,
                cursor: 'pointer'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8l8 5 8-5" stroke="#FF7844" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 8v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8" stroke="#FF7844" strokeWidth="2" />
              </svg>
            </div>
            <div 
              onClick={() => handleTabChange('liked')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: activeTab === 'liked' ? 1 : 0.6,
                cursor: 'pointer'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="none" stroke="#FF7844" strokeWidth="2" />
              </svg>
            </div>
            <div 
              onClick={() => handleTabChange('favorite')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: activeTab === 'favorite' ? 1 : 0.6,
                cursor: 'pointer'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="#FF7844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          
          <div style={{ width: '100%' }}>
            {activeTab === 'posts' && (
              <>
                <h3 style={{ 
                  textAlign: 'left', 
                  color: '#FF7844', 
                  fontWeight: '700',
                  fontSize: '24px',
                  fontFamily: 'Maven Pro, sans-serif',
                  marginBottom: '15px'
                }}>
                  Vos vidéos
                </h3>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  paddingBottom: '20px'
                }}>
                  {userVideos.length > 0 ? (
                    userVideos.map((video, index) => (
                      <div key={index} 
                        onClick={() => handleVideoClick(video)}
                        style={{ 
                          borderRadius: '20px',
                          overflow: 'hidden',
                          aspectRatio: '9/16',
                          backgroundColor: '#F0F0F0',
                          position: 'relative',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          width: '100%',
                          maxWidth: '250px',
                          margin: '0 auto',
                          cursor: 'pointer'
                        }}>
                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
                          <Image 
                            src={video.thumbnailUrl && video.thumbnailUrl !== '' ? video.thumbnailUrl : '/images/thumbnails/default.jpg'} 
                            alt={video.title} 
                            fill
                            style={{ objectFit: 'cover', display: 'block' }}
                            sizes="(max-width: 500px) 100vw, 50vw"
                            priority={index < 4}
                          />
                          {/* Overlay Play */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.35)',
                            borderRadius: '50%',
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                          }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.18)"/>
                              <polygon points="10,8 16,12 10,16" fill="#fff" />
                            </svg>
                          </div>
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                          padding: '10px',
                          color: 'white',
                          textAlign: 'center'
                        }}>
                          <p style={{
                            margin: '0',
                            fontWeight: 'bold',
                            fontSize: '24px',
                            textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                            fontFamily: 'cursive',
                            color: '#FF8FAA'
                          }}>lets<br/>create<br/>aesthetic</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px' }}>
                      <p>Vous n'avez pas encore publié de vidéos.</p>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'liked' && (
              <>
                <h3 style={{ 
                  textAlign: 'left', 
                  color: '#FF7844', 
                  fontWeight: '700',
                  fontSize: '24px',
                  fontFamily: 'Maven Pro, sans-serif',
                  marginBottom: '15px'
                }}>
                  Vidéos que vous aimez
                </h3>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  paddingBottom: '20px'
                }}>
                  {likedVideos.length > 0 ? (
                    likedVideos.map((video, index) => (
                      <div key={index} 
                        onClick={() => handleVideoClick(video)}
                        style={{ 
                          borderRadius: '10px',
                          overflow: 'hidden',
                          aspectRatio: '9/16',
                          backgroundColor: '#F0F0F0',
                          position: 'relative',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }}>
                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
  <Image 
    src={video.thumbnailUrl && video.thumbnailUrl !== '' ? video.thumbnailUrl : '/images/thumbnails/default.jpg'} 
    alt={video.title} 
    fill
    style={{ objectFit: 'cover', display: 'block' }}
    sizes="(max-width: 500px) 100vw, 50vw"
    priority={index < 4}
  />
  {/* Overlay Play */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.35)',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.18)"/>
      <polygon points="10,8 16,12 10,16" fill="#fff" />
    </svg>
  </div>
</div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                          padding: '10px',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          <p style={{ margin: '0', fontWeight: 'bold' }}>{video.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <span style={{ marginRight: '10px' }}>❤ {formatCount(video.likes)}</span>
                            <span>💬 {formatCount(video.comments)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px' }}>
                      <p>Vous n'avez pas encore aimé de vidéos.</p>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'favorite' && (
              <>
                <h3 style={{ 
                  textAlign: 'left', 
                  color: '#FF7844', 
                  fontWeight: '700',
                  fontSize: '24px',
                  fontFamily: 'Maven Pro, sans-serif',
                  marginBottom: '15px'
                }}>
                  Vos favoris
                </h3>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  paddingBottom: '20px'
                }}>
                  {favoriteVideos.length > 0 ? (
                    favoriteVideos.map((video, index) => (
                      <div key={index}
                        onClick={() => handleVideoClick(video)}
                        style={{ 
                          borderRadius: '10px',
                          overflow: 'hidden',
                          aspectRatio: '9/16',
                          backgroundColor: '#F0F0F0',
                          position: 'relative',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }}>
                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
  <Image 
    src={video.thumbnailUrl && video.thumbnailUrl !== '' ? video.thumbnailUrl : '/images/thumbnails/default.jpg'} 
    alt={video.title} 
    fill
    style={{ objectFit: 'cover', display: 'block' }}
    sizes="(max-width: 500px) 100vw, 50vw"
    priority={index < 4}
  />
  {/* Overlay Play */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.35)',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.18)"/>
      <polygon points="10,8 16,12 10,16" fill="#fff" />
    </svg>
  </div>
</div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                          padding: '10px',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          <p style={{ margin: '0', fontWeight: 'bold' }}>{video.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <span style={{ marginRight: '10px' }}>❤ {formatCount(video.likes)}</span>
                            <span>💬 {formatCount(video.comments)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px' }}>
                      <p>Vous n'avez pas encore ajouté de vidéos aux favoris.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Modal Vidéo */}
      {showVideoModal && selectedVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Bouton Fermer */}
          <div 
            onClick={closeVideoModal}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 1001
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Conteneur Vidéo */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Vidéo */}
            <div style={{
              width: '100%',
              aspectRatio: '9/16',
              backgroundColor: '#000',
              borderRadius: '15px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <video
                src={selectedVideo.videoUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                controls
                autoPlay
                playsInline
              />
            </div>
            
            {/* Informations de la vidéo */}
            <div style={{
              width: '100%',
              padding: '15px',
              color: 'white',
              textAlign: 'left',
              marginTop: '10px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{selectedVideo.title}</h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '10px'
                }}>
                  <Image
                    src={selectedVideo.userAvatar || '/images/avatars/avatar.jpg'}
                    alt={selectedVideo.username}
                    width={30}
                    height={30}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span>@{selectedVideo.username}</span>
              </div>
              
              <p style={{ margin: '0', fontSize: '14px', opacity: 0.8 }}>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Style pour les barres de défilement sur WebKit (Chrome, Safari) */}
      <style jsx global>{`
        /* Style pour la barre de défilement principale */
        main::-webkit-scrollbar {
          width: 6px;
        }
        main::-webkit-scrollbar-track {
          background: #FFF5EB;
          border-radius: 10px;
        }
        main::-webkit-scrollbar-thumb {
          background-color: #FF7844;
          border-radius: 10px;
          border: 2px solid #FFF5EB;
        }
        
        /* Animation pour le modal */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
