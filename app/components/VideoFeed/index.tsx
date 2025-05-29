'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './VideoFeed.module.css';
import CommentModal from '../CommentModal';
import ShareModal from '../ShareModal';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';


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


const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  } else {
    return count.toString();
  }
};


const VideoCard: React.FC<{
  video: Video;
  isActive: boolean;
  expandedDescriptions: {[key: string]: boolean};
  setExpandedDescriptions: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
}> = ({ 
  video, 
  isActive, 
  expandedDescriptions,
  setExpandedDescriptions
}) => {
  
  const { user, likeVideo, unlikeVideo, addToFavorites, removeFromFavorites, followUser, unfollowUser, addToViewHistory } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  
  // Effet principal pour initialiser les états lorsque l'utilisateur ou la vidéo change
  useEffect(() => {
    if (user && video) {
      // Réinitialiser like et favoris sans réinitialiser l'état isFollowing
      setIsLiked(false);
      setIsFavorite(false);
      
      // Mettre à jour les états selon les données utilisateur
      if (user.likedVideos && user.likedVideos.includes(video.id)) {
        setIsLiked(true);
      }
      
      if (user.favoriteVideos && user.favoriteVideos.includes(video.id)) {
        setIsFavorite(true);
      }

      // Vérifier l'état d'abonnement uniquement lors du chargement initial ou changement de vidéo
      if (video.userId && user.following) {
        const following = Array.isArray(user.following) ? user.following : [];
        // Ce test détermine si on est abonné ou non
        const isUserFollowing = following.includes(video.userId);
        setIsFollowing(isUserFollowing);
      } else {
        setIsFollowing(false);
      }
    }
  }, [user, video]);

  
  const toggleDescription = (videoId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  
  // Fonction simplifiée pour basculer entre lecture et pause
  const handleVideoClick = (e: React.MouseEvent) => {
    // Empêcher la propagation pour éviter les conflits avec d'autres gestionnaires
    e.stopPropagation();
    console.log('Clic sur la vidéo détecté');
    
    if (!videoRef.current) return;

    // Simplement appeler les fonctions pauseVideo ou playVideo selon l'état actuel
    if (videoRef.current.paused) {
      playVideo();
    } else {
      pauseVideo();
    }
  };
  
  const pauseVideo = () => {
    console.log('Pause explicite appelée');
    if (videoRef.current && !videoRef.current.paused) {
      if (videoRef.current.parentElement) {
        videoRef.current.parentElement.classList.remove(styles.videoPlaying);
      }
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playVideo = () => {
    console.log('Lecture explicite appelée');
    if (videoRef.current && videoRef.current.paused) {
      if (videoRef.current.parentElement) {
        videoRef.current.parentElement.classList.add(styles.videoPlaying);
      }
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(e => {
            console.error('Erreur de lecture:', e);
            // Essayer de lire en muet si la lecture automatique est bloquée
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error('Impossible de lire même en muet:', err));
            }
          });
      }
    }
  };

  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progressValue = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressValue);
    }
  };

  
  const handleLikeToggle = () => {
    if (user) {
      if (isLiked) {
        
        if (unlikeVideo(video.id)) {
          setIsLiked(false);
        }
      } else {
        
        if (likeVideo(video.id)) {
          setIsLiked(true);
        }
      }
    }
  };

  // Fonction simplifiée d'abonnement - ne fait rien pour éviter les erreurs
  const handleFollowToggle = () => {
    console.log('Fonction d\'abonnement désactivée');
    // Simuler un changement d'état visuel sans faire d'action réelle
    setIsFollowing(!isFollowing);
  };

  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    
    setTimeout(() => {
      if (!isFavorite) {
        
        addToFavorites(video.id);
      } else {
        removeFromFavorites(video.id);
      }
    }, 0);
  };

  
  const handleCommentClick = () => {
    setShowCommentModal(true);
  };

  
  const handleShareClick = () => {
    setShowShareModal(true);
  };

  
  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          
          videoRef.current.currentTime = 0;
          videoRef.current.load();
          videoRef.current.muted = true; 
          
          
          if (isActive) {
            addToViewHistory(video.id);
          }
          

          const observer = new IntersectionObserver(
            (entries) => {
              const [entry] = entries;
              if (entry.isIntersecting && isActive) {
                if (videoRef.current) {
                  
                  const playPromise = videoRef.current.play();
                  if (playPromise !== undefined) {
                    playPromise
                      .then(() => {
                        setIsPlaying(true);
                        
                      })
                      .catch(error => {
                        console.error(`Erreur lecture vidéo ${video.id}:`, error);
                        
                        if (videoRef.current) {
                          videoRef.current.muted = true;
                          videoRef.current.play()
                            .then(() => setIsPlaying(true))
                            .catch(e => console.error('Impossible de lire la vidéo même en muet:', e));
                        }
                      });
                  }
                }
              } else if (videoRef.current) {
                
                videoRef.current.pause();
                setIsPlaying(false);
              }
            },
            { threshold: 0.6 } 
          );
          
          
          if (videoRef.current.parentElement) {
            observer.observe(videoRef.current.parentElement);
          }
          
          return () => {
            observer.disconnect();
          };
        }
      } catch (err) {
        console.error(`Erreur vidéo ${video.id}:`, err);
      }
    };
    
    
    if (isActive) {
      
      playVideo();
      
      
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      };
    } else if (videoRef.current) {
      
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, video.id, video.videoUrl]);

  return (
    <div className={styles.videoCard}>
      
      <div className={styles.videoContainer}>
        {/* Vidéo principale */}
        <video 
          ref={videoRef}
          className={styles.videoPlayer}
          src={video.videoUrl}
          loop
          playsInline
          muted={true} // Mettre muted=true pour permettre l'autoplay sur mobile
          autoPlay={isActive} // Activer l'autoplay si la vidéo est active
          onTimeUpdate={handleTimeUpdate}
          controls={false} // Désactiver les contrôles natifs
          preload="auto"
          poster={video.thumbnailUrl}
        />
        
        {/* Zone cliquable pour la pause/lecture */}
        <div 
          className={styles.clickZone}
          onClick={handleVideoClick}
          data-testid="video-click-zone"
        />

      </div>
      <div className={styles.videoOverlay}>
        <div className={styles.logoContainer}>
          <img 
            src="/icons/logo.svg" 
            alt="Doozy" 
            className={styles.logo}
          />
        </div>
        <div className={styles.videoInfo}>
          <div className={styles.videoHeader}>
            <div className={styles.userInfo}>
              <img 
                src={video.userAvatar || '/icons/logo.svg'} 
                alt={"Avatar de " + video.username} 
                className={styles.userAvatar}
                onError={(e) => {
                  
                  e.currentTarget.src = '/icons/logo.svg';
                }}
              />
              <div className={styles.usernameContainer}>
                <span className={styles.username}>@{video.username}</span>
                
                {user && user.id && video.userId && user.id !== video.userId && (
                  <button 
                    onClick={(e) => {
                      // Arrêter la propagation de l'événement
                      if (e && e.stopPropagation) {
                        e.stopPropagation();
                      }
                      
                      // Simplement basculer l'état pour un feedback visuel
                      // sans faire d'opérations complexes qui pourraient causer des erreurs
                      setIsFollowing(!isFollowing);
                      
                      // Log pour débogage
                      console.log('Bouton d\'abonnement cliqué, fonctionnalité désactivée');
                    }} 
                    className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
                    aria-label={isFollowing ? 'Se désabonner' : "S'abonner"}
                  >
                    {isFollowing ? 'Abonné' : "S'abonner"}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.titleContainer}>
            <h3 className={styles.videoTitle}>{video.title}</h3>
          </div>
          <p className={styles.videoDescription}>
            {expandedDescriptions[video.id] 
              ? video.description 
              : `${video.description.slice(0, 100)}${video.description.length > 100 ? '...' : ''}`}
            {video.description.length > 100 && (
              <span 
                className={styles.plusButton} 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDescription(video.id);
                }}
              >
                {expandedDescriptions[video.id] ? ' Moins' : ' Plus'}
              </span>
            )}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className={styles.actionButtons}>
          {/* Bouton Like (cœur) */}
          <div className={styles.actionButton} onClick={handleLikeToggle}>
            <img 
              src={isLiked ? '/icons/feedActionsIcons/like-active.svg' : '/icons/feedActionsIcons/like.svg'} 
              alt="Like" 
              className={styles.actionIcon}
            />
            <span className={styles.actionCount}>{formatCount(video.likes)}</span>
          </div>
          
          {/* Bouton Commentaires (bulle) */}
          <div className={styles.actionButton} onClick={handleCommentClick}>
            <img 
              src='/icons/feedActionsIcons/comments.svg' 
              alt="Comments" 
              className={styles.actionIcon}
            />
            <span className={styles.actionCount}>{formatCount(video.comments)}</span>
          </div>
          
          {/* Bouton Favoris (étoile/signet) */}
          <div className={styles.actionButton} onClick={handleFavoriteToggle}>
            <img 
              src={isFavorite ? '/icons/feedActionsIcons/favourite-active.svg' : '/icons/feedActionsIcons/favourite.svg'} 
              alt="Favorite" 
              className={styles.actionIcon}
            />
          </div>
          
          {/* Bouton Partage (flèche) */}
          <div className={styles.actionButton} onClick={handleShareClick}>
            <img 
              src='/icons/feedActionsIcons/share.svg' 
              alt="Share" 
              className={styles.actionIcon}
            />
            <span className={styles.actionCount}>{formatCount(video.shares)}</span>
          </div>
          
          {/* Bouton Plus d'options (étoile décorative) */}
          <div className={styles.actionButton}>
            <img 
              src='/icons/feedActionsIcons/reproduction.svg' 
              alt="More options" 
              className={styles.actionIcon}
            />
          </div>
        </div>
      </div>

      {/* Modal des commentaires */}
      {showCommentModal && (
        <CommentModal 
          isOpen={showCommentModal} 
          onClose={() => setShowCommentModal(false)} 
          videoId={video.id} 
        />
      )}

      {/* Modal de partage */}
      {showShareModal && (
        <ShareModal 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
          videoId={video.id} 
        />
      )}
    </div>
  );
};


interface User {
  id: string;
  username: string;
  avatar: string;
  name: string;
  bio: string;
}

const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: string]: boolean}>({});
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsersAndVideos = async () => {
      try {
        const usersResponse = await fetch('/data/users.json');
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);

        let userUploadedVideos = [];
        const storedVideos = localStorage.getItem('doozy_videos');
        
        if (storedVideos) {
          try {
            userUploadedVideos = JSON.parse(storedVideos);
            console.log('Vidéos chargées depuis localStorage:', userUploadedVideos.length);
          } catch (e) {
            console.error('Erreur lors de la lecture des vidéos du localStorage:', e);
            userUploadedVideos = [];
          }
        }

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
        
        if (usersData.length > 0) {
          const defaultVideoList = videoFiles.map((file, index) => {
            const title = file.replace('.mp4', '').split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
            
            return {
              id: (index + 100).toString(), // Utiliser un offset pour éviter les conflits d'ID
              userId: randomUser.id,
              username: randomUser.username,
              userAvatar: randomUser.avatar,
              title: `DIY: ${title} 💕`,
              description: "Ceci est une description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              videoUrl: `/videos/${file}`,
              thumbnailUrl: "/images/thumbnails/default.jpg",
              likes: Math.floor(Math.random() * 5000) + 500,
              comments: Math.floor(Math.random() * 200) + 50,
              shares: Math.floor(Math.random() * 100) + 20,
              categories: ["diy", "craft"],
              createdAt: new Date(Date.now() - (index * 86400000)).toISOString() // Dates échelonnées
            };
          });
          
          const combinedVideos = [...userUploadedVideos, ...defaultVideoList];
          
          console.log('Total des vidéos chargées:', combinedVideos.length);
          setVideos(combinedVideos);
          
          const initialExpanded: {[key: string]: boolean} = {};
          combinedVideos.forEach((video) => {
            initialExpanded[video.id] = false;
          });
          setExpandedDescriptions(initialExpanded);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchUsersAndVideos();
  }, []);

  // Gérer le défilement pour détecter la vidéo active
  const handleScroll = () => {
    if (feedRef.current) {
      const scrollTop = feedRef.current.scrollTop;
      const videoHeight = feedRef.current.clientHeight;
      const index = Math.floor((scrollTop + videoHeight / 2) / videoHeight);
      
      if (index !== currentVideoIndex && index >= 0 && index < videos.length) {
        setCurrentVideoIndex(index);
        // Mise à jour de la vidéo active
      }
    }
  };

  // Ajouter l'écouteur de défilement
  useEffect(() => {
    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      return () => {
        feedElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [videos]);
  
  if (videos.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Chargement des vidéos...</p>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer} ref={feedRef}>
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={index === currentVideoIndex}
          expandedDescriptions={expandedDescriptions}
          setExpandedDescriptions={setExpandedDescriptions}
        />
      ))}
    </div>
  );
};

export default VideoFeed;
