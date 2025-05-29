'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './CommentModal.module.css';
import { useUI } from '@/app/contexts/UIContext';

interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, videoId }) => {
  const { setModalOpen } = useUI();
  
  // Mettre à jour l'état global quand le modal s'ouvre ou se ferme
  useEffect(() => {
    setModalOpen(isOpen);
    return () => {
      if (isOpen) setModalOpen(false);
    };
  }, [isOpen, setModalOpen]);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '101',
      username: 'Pseudo',
      text: 'Ceci est un commentaire. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      likes: 5,
      timestamp: 'il y a 2h',
      isLiked: false
    },
    {
      id: '2',
      userId: '102',
      username: 'Pseudo',
      text: 'Ceci est un commentaire. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      likes: 12,
      timestamp: 'il y a 4h',
      isLiked: true
    },
    {
      id: '3',
      userId: '103',
      username: 'Pseudo',
      text: 'Ceci est un commentaire. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      likes: 3,
      timestamp: 'il y a 1j',
      isLiked: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [showShareSection, setShowShareSection] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Gérer l'envoi d'un commentaire
  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        userId: '999', // ID utilisateur actuel
        username: 'Vous',
        text: newComment,
        likes: 0,
        timestamp: 'à l\'instant',
        isLiked: false
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    }
  };

  // Gérer le like d'un commentaire
  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.isLiked;
          return {
            ...comment,
            isLiked: newIsLiked,
            likes: newIsLiked ? comment.likes + 1 : comment.likes - 1
          };
        }
        return comment;
      })
    );
  };

  // Liste de contacts pour le partage
  const contacts = [
    { id: '1', name: 'XXX' },
    { id: '2', name: 'XXX' },
    { id: '3', name: 'XXX' },
    { id: '4', name: 'XXX' },
    { id: '5', name: 'XXX' },
    { id: '6', name: 'XXX' },
    { id: '7', name: 'XXX' }
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer} ref={modalRef}>
          <>
            {/* Entête du modal */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Commentaires</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>

            {/* Liste des commentaires */}
            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.avatar}>
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt={comment.username} />
                    ) : (
                      comment.username.charAt(0)
                    )}
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.userInfo}>
                      <span className={styles.username}>{comment.username}</span>
                      <span className={styles.userTag}>{comment.timestamp}</span>
                    </div>
                    <div className={styles.commentTextContainer}>
                      <p className={styles.commentText}>{comment.text}</p>
                      <div className={styles.commentActions}>
                        <button 
                          className={styles.likeButton} 
                          onClick={() => handleLikeComment(comment.id)}
                        >
                        <img 
                          src={comment.isLiked ? '/icons/feedActionsIcons/like-active.svg' : '/icons/feedActionsIcons/like.svg'} 
                          alt="Like" 
                          className={styles.likeIcon} 
                        />
                      </button>
                    </div>
                    </div>
                    <button className={styles.replyButton}>Répondre</button>

                  </div>
                </div>
              ))}
            </div>

            {/* Formulaire de commentaire */}
            <form onSubmit={handleSubmitComment} className={styles.commentInputContainer}>
              <div className={styles.userAvatar}>P</div>
              <input
                type="text"
                placeholder="Écrire un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.commentInput}
              />
              <button type="submit" className={styles.sendButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="#FF7844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#FF7844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </>
      </div>
    </div>
  );
};

export default CommentModal;
