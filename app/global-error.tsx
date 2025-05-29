'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur sur la console
    console.error('Erreur globale:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'white',
        }}>
          <h2 style={{ marginBottom: '20px', color: '#ff4557' }}>
            Erreur Système
          </h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            L'application a rencontré une erreur critique. Nous sommes désolés pour le désagrément.
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
      </body>
    </html>
  );
}
