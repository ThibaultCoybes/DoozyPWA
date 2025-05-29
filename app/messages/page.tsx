'use client';

import Navbar from "../components/Navbar";

export default function MessagesPage() {
  return (
    <div className="container">
      <main className="page-content">
        <h1 style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>Messages</h1>
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <div 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--light-gray)',
              margin: '30px auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                stroke="var(--dark-gray)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p>Aucun message pour le moment</p>
          <p style={{ color: 'var(--dark-gray)', marginTop: '10px', fontSize: 'var(--font-size-sm)' }}>
            Vos conversations avec d'autres utilisateurs apparaîtront ici
          </p>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
