'use client';

import { useEffect } from 'react';
import styles from './auth.module.css';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur sur la console
    console.error('Erreur d\'authentification:', error);
  }, [error]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formCard} style={{ textAlign: 'center' }}>
        <h1 className={styles.formTitle}>Oups !</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Une erreur s'est produite lors du chargement de la page d'authentification.
        </p>
        <button
          onClick={() => reset()}
          className={styles.submitButton}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
