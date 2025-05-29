'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useUI } from '@/app/contexts/UIContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('home');
  const { isModalOpen } = useUI();
  
  // Mettre à jour l'élément actif en fonction du chemin
  useEffect(() => {
    if (pathname === '/') {
      setActiveItem('home');
    } else if (pathname === '/search') {
      setActiveItem('search');
    } else if (pathname === '/create') {
      setActiveItem('create');
    } else if (pathname === '/messages') {
      setActiveItem('messages');
    } else if (pathname === '/profile') {
      setActiveItem('profile');
    }
  }, [pathname]);
  
  // Si une modale est ouverte, masquer la navbar
  if (isModalOpen) {
    return null;
  }
  
  return (
    <nav className={styles.navbar}>
      <Link href="/" onClick={() => setActiveItem('home')}>
        <div className={`${styles.navItem} ${activeItem === 'home' ? styles.active : ''}`}>
          <img 
            src={activeItem === 'home' ? '/icons/home-active.svg' : '/icons/home.svg'} 
            alt="Home" 
            className={styles.icon} 
          />
        </div>
      </Link>
      
      <Link href="/search" onClick={() => setActiveItem('search')}>
        <div className={`${styles.navItem} ${activeItem === 'search' ? styles.active : ''}`}>
          <img 
            src={activeItem === 'search' ? '/icons/search-active.svg' : '/icons/search.svg'} 
            alt="Search" 
            className={styles.icon} 
          />
        </div>
      </Link>
      
      <Link href="/create" onClick={() => setActiveItem('create')}>
        <div className={`${styles.navItem} ${activeItem === 'create' ? styles.active : ''}`}>
          <div className={styles.centerIcon}>
            <img 
              src="/icons/createPostBTN.svg" 
              alt="Create Post" 
              width={40} 
              height={40} 
            />
          </div>
        </div>
      </Link>
      
      <Link href="/messages" onClick={() => setActiveItem('messages')}>
        <div className={`${styles.navItem} ${activeItem === 'messages' ? styles.active : ''}`}>
          <img 
            src={activeItem === 'messages' ? '/icons/notif-active.svg' : '/icons/notif.svg'} 
            alt="Messages" 
            className={styles.icon} 
          />
        </div>
      </Link>
      
      <Link href="/profile" onClick={() => setActiveItem('profile')}>
        <div className={`${styles.navItem} ${activeItem === 'profile' ? styles.active : ''}`}>
          <img 
            src={activeItem === 'profile' ? '/icons/profile-active.svg' : '/icons/profile.svg'} 
            alt="Profile" 
            className={styles.icon} 
          />
        </div>
      </Link>
    </nav>
  );
}
