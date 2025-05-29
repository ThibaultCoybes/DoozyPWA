'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import styles from './create.module.css';

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState('camera'); // camera, preview, form
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState<string | null>(null);
  const [postData, setPostData] = useState({
    title: '',
    description: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialiser la caméra
  useEffect(() => {
    if (mode === 'camera') {
      initCamera();
    }

    // Nettoyer la caméra lors du démontage du composant
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

  const initCamera = async () => {
    try {
      // Demander l'accès à la caméra arrière (environment) pour un meilleur résultat dans ce contexte
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { exact: "environment" }, // Préférer la caméra arrière
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error('Erreur de lecture vidéo:', e));
      }

      streamRef.current = stream;
      setHasPermission(true);

      // Préparer l'enregistreur de média
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Réinitialiser les chunks vidéo
      setVideoChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setVideoChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoUrl);
        // Générer une miniature à partir de la vidéo enregistrée
        generateThumbnail(videoUrl).then(thumbnail => {
          setGeneratedThumbnailUrl(thumbnail);
        });
        setMode('preview');
      };
    } catch (err) {
      console.error('Erreur d\'accès à la caméra:', err);
      setHasPermission(false);
      // Afficher une alerte pour informer l'utilisateur
      alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions de votre navigateur.');
    }
  };

  // Gérer l'enregistrement de la vidéo
  const handleRecord = () => {
    if (!hasPermission || !mediaRecorder) {
      // Si on n'a pas la permission ou pas d'enregistreur, tenter d'initialiser la caméra
      initCamera();
      return;
    }

    if (isRecording) {
      // Arrêter l'enregistrement
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Arrêter les tracks de la caméra si on ne veut pas continuer à l'utiliser
      // (Commenté car on pourrait vouloir réenregistrer)
      // if (streamRef.current) {
      //   streamRef.current.getTracks().forEach(track => track.stop());
      // }
    } else {
      // Démarrer l'enregistrement
      setVideoChunks([]); // Réinitialiser les chunks
      mediaRecorder.start(100); // Collecter des données toutes les 100ms
      setIsRecording(true);
      
      // Optionnel : Limiter la durée d'enregistrement à 30 secondes
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 30000);
    }
  };

  // Gérer la sélection d'une vidéo depuis la galerie
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setRecordedVideo(videoUrl);
      generateThumbnail(videoUrl).then(thumbnail => {
        setGeneratedThumbnailUrl(thumbnail);
      });
      setMode('preview');
    }
  };

  // Fonction pour générer une miniature à partir d'une URL de vidéo
  const generateThumbnail = async (videoUrl: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous'; // Important si la source vidéo est distante et pour éviter les tainted canvas
      video.src = videoUrl;
      video.currentTime = 1; // Chercher à 1 seconde, ou une autre valeur appropriée

      video.onloadeddata = () => {
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          // Utiliser les dimensions de la vidéo ou des dimensions fixes pour la miniature
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg')); // ou 'image/png'
          } else {
            resolve(null);
          }
          // Nettoyer l'URL de l'objet vidéo si c'était un blob URL créé ici
          // URL.revokeObjectURL(videoUrl); // Attention: ne pas le faire si videoUrl est utilisé ailleurs
        };
        // Déclencher la recherche après que les données soient chargées
        video.currentTime = 1; // Remettre au cas où onloadeddata se déclenche avant que currentTime soit effectif
      };

      video.onerror = () => {
        console.error('Erreur de chargement de la vidéo pour la génération de miniature.');
        resolve(null);
      };
    });
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer la publication de la vidéo
  const handlePublish = async () => {
    // Vérifier que toutes les données nécessaires sont présentes
    if (!recordedVideo || !user) {
      alert('Vous devez être connecté et avoir une vidéo pour publier.');
      return;
    }

    if (!postData.title.trim()) {
      alert('Veuillez ajouter un titre à votre vidéo.');
      return;
    }

    try {
      // Générer un ID unique pour la vidéo
      const videoId = Date.now().toString();
      
      // Dans une vraie app, on téléchargerait la vidéo sur un serveur
      // Pour cette démo, on va utiliser une vidéo par défaut si c'est un blob URL
      let finalVideoUrl = recordedVideo;
      if (recordedVideo.startsWith('blob:')) {
        // Les blob URLs ne sont pas persistants, utiliser une vidéo de démo
        finalVideoUrl = '/videos/video.mp4';
      }
      
      // Créer un objet vidéo complet
      const newVideo = {
        id: videoId,
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        title: postData.title,
        description: postData.description,
        videoUrl: finalVideoUrl,
        thumbnailUrl: generatedThumbnailUrl || '/images/thumbnails/default.jpg',
        likes: 0,
        comments: 0,
        shares: 0,
        categories: ['diy', 'craft'],
        createdAt: new Date().toISOString()
      };

      // 1. Récupérer les vidéos existantes de localStorage
      let allVideos = [];
      const storedVideos = localStorage.getItem('doozy_videos');
      if (storedVideos) {
        try {
          allVideos = JSON.parse(storedVideos);
        } catch (e) {
          console.error('Erreur lors de la récupération des vidéos existantes:', e);
          allVideos = [];
        }
      }

      // 2. Ajouter la nouvelle vidéo au début du tableau (pour qu'elle apparaisse en premier)
      allVideos.unshift(newVideo);
      
      // 3. Sauvegarder dans localStorage
      localStorage.setItem('doozy_videos', JSON.stringify(allVideos));

      // 4. Mettre à jour les données de l'utilisateur
      if (typeof localStorage !== 'undefined') {
        const userStr = localStorage.getItem('doozy_current_user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          
          // S'assurer que le tableau videos existe
          if (!userData.videos) {
            userData.videos = [];
          }
          
          // Ajouter l'ID de la vidéo aux vidéos de l'utilisateur
          userData.videos.unshift(videoId);
          
          // Sauvegarder les modifications
          localStorage.setItem('doozy_current_user', JSON.stringify(userData));
        }
      }

      // Afficher un message de succès
      alert('Votre vidéo a été publiée avec succès! Elle apparaîtra maintenant dans le feed.');
      
      // Rediriger vers le feed principal pour voir la vidéo
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      alert('Une erreur est survenue lors de la publication. Veuillez réessayer.');
    }
  };

  // Annuler et retourner au mode caméra
  const handleCancel = () => {
    setRecordedVideo(null);
    setMode('camera');
  };

  // Rendu du mode caméra
  const renderCameraMode = () => (
    <>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className={styles.title}>Ma reproduction</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.cameraContainer}>
          <div className={styles.cameraView}>
            {/* Afficher le flux de la caméra */}
            <div style={{
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              backgroundColor: '#000000'
            }}>
              {hasPermission ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)' // Effet miroir optionnel, à ajuster selon les besoins
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f0f0f0',
                  color: '#666'
                }}>
                  <p>Accès à la caméra requis</p>
                  <button 
                    onClick={initCamera}
                    style={{
                      padding: '8px 16px',
                      margin: '10px',
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    Autoriser l'accès
                  </button>
                </div>
              )}
              {/* Grille de la caméra */}
              <div className={styles.cameraGridOverlay}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={styles.gridLine} />
                ))}
              </div>
            </div>
            <div>
                <button 
                  className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`} 
                  onClick={handleRecord}
                >
                  {isRecording ? (
                    <div className={styles.recordingIndicator}>
                      <span className={styles.recordingDot}></span>
                      <span>REC</span>
                    </div>
                  ) : (
                    <img src="/icons/cameraBTN.svg" alt="Record" width="70" height="70" />
                  )}
                </button>
              </div>
          </div>          
          <div className={styles.orText}>ou</div>

          <label className={styles.galleryButton}>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleGallerySelect} 
              style={{ display: 'none' }} 
            />
            Choisir dans ma gallerie
          </label>
        </div>
      </div>
    </>
  );

  // Rendu du mode prévisualisation et formulaire
  const renderPreviewMode = () => (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={styles.title}>Publier</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.publishForm}>
          <div className={styles.videoPreview}>
            {recordedVideo && (
              <div className={styles.videoPlayerContainer}>
                <video 
                  className={styles.previewVideo} 
                  src={recordedVideo} 
                  controls 
                  autoPlay 
                  loop
                  playsInline
                  poster={generatedThumbnailUrl || undefined} 
                />
                <div className={styles.videoOverlayControls}>
                  <h3 className={styles.videoTitle}>
                    {postData.title || 'Ajouter un titre...'}
                  </h3>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.formFields}>
            <input
              type="text"
              name="title"
              placeholder="Titre de votre vidéo"
              className={styles.inputField}
              value={postData.title}
              onChange={handleInputChange}
            />
            
            <textarea
              name="description"
              placeholder="Ajoutez une description..."
              className={styles.textareaField}
              value={postData.description}
              onChange={handleInputChange}
            />
            
            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Annuler
              </button>
              <button className={styles.publishButton} onClick={handlePublish}>
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      {mode === 'camera' || mode === 'recording' ? renderCameraMode() : renderPreviewMode()}
    </div>
  );
}