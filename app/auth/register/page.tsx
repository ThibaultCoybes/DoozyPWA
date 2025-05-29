'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import authService from '@/app/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Vérifier la force du mot de passe
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setIsLoading(true);

    try {
      const user = await authService.register(username, email, password);
      if (user) {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.logoContainer}>
        <img 
          src="/icons/logo.svg" 
          alt="Doozy" 
          className={styles.logo} 
        />
        <p className={styles.tagline}>Rejoignez la communauté des créateurs</p>
      </div>

      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Créer un compte</h1>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              className={styles.formInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choisissez un nom d'utilisateur"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Mot de passe</label>
            <input
              id="password"
              type="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Créez un mot de passe"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.formInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
          
          <p className={styles.switchLink}>
            Déjà un compte ? {' '}
            <a href="/auth/login" className={styles.switchLinkText}>
              Se connecter
            </a>
          </p>
        </form>
        
        <div className={styles.socialButtonsContainer}>
          <p className={styles.socialButtonsLabel}>Ou inscrivez-vous avec</p>
          <div className={styles.socialButtons}>
            <button className={styles.socialButton} type="button" aria-label="S'inscrire avec Google">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F8F8F8"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12.0007 5.16432C14.2021 5.16432 16.1005 6.01887 17.4867 7.35767L14.9912 9.85317C14.2124 9.11403 13.1778 8.67692 12.0007 8.67692C9.79703 8.67692 8.00348 10.4705 8.00348 12.6741C8.00348 14.8778 9.79703 16.6714 12.0007 16.6714C13.6472 16.6714 15.0539 15.7524 15.6647 14.3947H12.0007V10.8822H19.2157C19.3204 11.379 19.3761 11.8999 19.3761 12.4395C19.3761 16.5609 16.3385 19.5231 12.0007 19.5231C7.58212 19.5231 4 15.9409 4 12.6741C4 9.40731 7.58212 5.16432 12.0007 5.16432Z" fill="#167EE6"/>
              </svg>
            </button>
            <button className={styles.socialButton} type="button" aria-label="S'inscrire avec Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#3B5998"/>
                <path d="M15.0166 12.4737H13.0068V19.4358H10.0216V12.4737H8.59961V9.96842H10.0216V8.30105C10.0216 7.10105 10.5569 5.23158 13.0392 5.23158L15.2319 5.24V7.67368H13.6364C13.3501 7.67368 13.0069 7.80421 13.0069 8.40211V9.97053H15.2248L15.0166 12.4737Z" fill="white"/>
              </svg>
            </button>
            <button className={styles.socialButton} type="button" aria-label="S'inscrire avec Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#55ACEE"/>
                <path d="M19.2 7.91999C18.722 8.16 18.2 8.32199 17.652 8.39999C18.2 8.07999 18.626 7.56 18.826 6.92C18.304 7.24 17.726 7.47999 17.122 7.59999C16.618 7.07999 15.894 6.76 15.116 6.76C13.562 6.76 12.324 8.01199 12.324 9.55999C12.324 9.79999 12.35 10.04 12.404 10.28C10.118 10.16 8.08 9.04 6.75 7.32C6.49 7.76 6.33 8.32 6.33 8.89999C6.33 10.04 6.894 11.04 7.724 11.6C7.274 11.6 6.854 11.44 6.5 11.28V11.32C6.5 12.68 7.45 13.8 8.722 14.08C8.47 14.16 8.192 14.2 7.908 14.2C7.706 14.2 7.51 14.16 7.32 14.12C7.714 15.24 8.766 16.04 9.994 16.08C9.022 16.8 7.814 17.24 6.494 17.24C6.246 17.24 6.008 17.2 5.77 17.16C7.01 17.96 8.47 18.4 10.062 18.4C15.114 18.4 17.868 14.24 17.868 10.64C17.868 10.48 17.868 10.36 17.862 10.24C18.394 9.92 18.854 9.48 19.2 8.96V7.91999Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
