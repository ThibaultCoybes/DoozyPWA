'use client';

import { useState } from 'react';
import Navbar from "../components/Navbar";
import Image from 'next/image';
import authService from '../services/authService';
import styles from './search.module.css';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Historique de recherche',
  ]);

  // Gérer la suppression d'un élément de l'historique
  const handleRemoveHistoryItem = (index: number) => {
    const updatedSearches = [...recentSearches];
    updatedSearches.splice(index, 1);
    setRecentSearches(updatedSearches);
  };

  // Gérer la soumission de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Ajouter la recherche à l'historique si elle n'y est pas déjà
      if (!recentSearches.includes(searchQuery)) {
        const user = authService.getCurrentUser();
        if (user) {
          authService.addToSearchHistory(searchQuery);
        }
        setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
      }
      // Réinitialiser le champ de recherche
      setSearchQuery('');
    }
  };

  // Catégories pour les filtres
  const categories = [
    { id: 1, name: 'Fil d\'actués' },
    { id: 2, name: 'Art culinaire' },
    { id: 3, name: 'Papier à...' },
    { id: 4, name: 'Bricolage' },
  ];

  return (
    <div className={styles.container}>
      {/* Zone de défilement principale */}
      <main className={styles.mainContent}>
        {/* Logo en haut */}
        <div className={styles.logoContainer}>
          <Image
            src="/icons/logo.svg"
            alt="Doozy Logo"
            width={155}
            height={70}
          />
        </div>

        {/* Barre de recherche */}
        <div className={styles.searchBarContainer}>
          <form onSubmit={handleSearch}>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher"
                className={styles.searchInput}
              />
              <div className={styles.micIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19V23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 23H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </form>

          {/* Catégories / Filtres */}
          <div className={styles.categoriesContainer}>
            {categories.map(category => (
              <div key={category.id} className={styles.categoryItem}>
                {category.name}
              </div>
            ))}
          </div>
          
          {/* Historique de recherche */}
          {recentSearches.length > 0 && (
            <div className={styles.historyContainer}>
              {recentSearches.map((search, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.historyItemLeft}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="#FF8FAA" strokeWidth="1.5"/>
                      <path d="M12 7V12L15 15" stroke="#FF8FAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={styles.historyItemText}>{search}</span>
                  </div>
                  <div 
                    onClick={() => handleRemoveHistoryItem(index)}
                    className={styles.deleteButton}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tendances actuelles */}
        <div className={styles.trendingContainer}>
          <h2 className={styles.trendingTitle}>
            Tendances actuelles
          </h2>

          {/* Grille de contenu */}
          <div className={styles.trendingGrid}>
            {/* Génération de contenu pour démonstration */}
            {Array.from({ length: 8 }, (_, i) => (
              <div 
                key={i} 
                className={styles.trendingItem}
                style={{ 
                  aspectRatio: '9/16' // Variation des formats que nous gardons en inline
                }}
              >
                <div 
                  className={styles.trendingItemContent}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#FFE9D9' : '#FFF8F5' // Alternance de couleurs gardée en inline
                  }}
                >
                  <Image 
                    src="/icons/logo.svg" 
                    alt={`Tendance ${i+1}`} 
                    width={40} 
                    height={40} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Navbar */}
      <Navbar />
    </div>
  );
}
