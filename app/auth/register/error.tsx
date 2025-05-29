'use client';

import { useEffect } from 'react';
import styles from '../auth.module.css';
import Link from 'next/link';

export default function RegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur d\'inscription:', error);
  }, [error]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formCard} style={{ textAlign: 'center' }}>
        <h1 className={styles.formTitle}>Erreur d'inscription</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Une erreur s'est produite lors du chargement de la page d'inscription.
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
