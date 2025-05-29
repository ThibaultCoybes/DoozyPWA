'use client';

import React, { useRef, useEffect } from 'react';
import styles from './ShareModal.module.css';
import { useUI } from '@/app/contexts/UIContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, videoId }) => {
  const { setModalOpen } = useUI();

  // Mettre à jour l'état global quand le modal s'ouvre ou se ferme
  useEffect(() => {
    setModalOpen(isOpen);
    return () => {
      if (isOpen) setModalOpen(false);
    };
  }, [isOpen, setModalOpen]);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  // Fermer le modal si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Liste de contacts pour le partage avec de vrais utilisateurs et des avatars réalistes
  const contacts = [
    { 
      id: '1', 
      name: 'CreativeCrafts', 
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg' 
    },
    { 
      id: '2', 
      name: 'ArtisticJourney', 
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg' 
    },
    { 
      id: '3', 
      name: 'DIYQueen', 
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg' 
    },
    { 
      id: '4', 
      name: 'HandmadeHobbyist', 
      avatar: 'https://randomuser.me/api/portraits/men/26.jpg' 
    }
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        {/* Entête du modal */}
        <div className={styles.modalHeader}>
          <div></div> {/* Élément vide pour la flexbox */}
          <h3 className={styles.modalTitle}>Partager à</h3>
          <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
        </div>

        {/* Liste des contacts */}
        <div className={styles.usersList}>
          {contacts.map((contact) => (
            <div key={contact.id} className={styles.userOption}>
              <div className={styles.userCircle}>
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className={styles.userAvatar} 
                />
              </div>
              <span className={styles.userName}>{contact.name}</span>
            </div>
          ))}
        </div>

        {/* Bouton de partage */}
        <button className={styles.shareButton}>Partager!</button>
      </div>
    </div>
  );
};

export default ShareModal;
