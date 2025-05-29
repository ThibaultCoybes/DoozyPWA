'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur sur la console
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center',
    }}>
      <h2 style={{ marginBottom: '20px', color: '#ff4557' }}>
        Une erreur s'est produite
      </h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Nous sommes désolés, quelque chose s'est mal passé lors du chargement de la page.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff4557',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
