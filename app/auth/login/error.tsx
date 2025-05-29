'use client';

import { useEffect } from 'react';
import styles from '../auth.module.css';
import Link from 'next/link';

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur de connexion:', error);
  }, [error]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formCard} style={{ textAlign: 'center' }}>
        <h1 className={styles.formTitle}>Erreur de connexion</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Une erreur s'est produite lors du chargement de la page de connexion.
        </p>
        <button
          onClick={() => reset()}
          className={styles.submitButton}
          style={{ marginBottom: '15px' }}
        >
          Réessayer
        </button>
        <Link href="/" className={styles.switchLinkText}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
