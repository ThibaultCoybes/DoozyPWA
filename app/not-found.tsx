import Link from 'next/link';

export default function NotFound() {
  return (
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
        Page non trouvée
      </h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link href="/" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff4557',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
