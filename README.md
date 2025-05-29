# Doozy - Application de Partage Vidéo pour Créateurs

Doozy est une application web de partage de vidéos inspirée par TikTok, conçue pour les créateurs de contenu DIY et artisanal. L'application permet aux utilisateurs de visionner, partager et interagir avec des vidéos de projets créatifs.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (v16.x ou supérieur)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)
- [Git](https://git-scm.com/) (pour cloner le dépôt)

## Installation

Suivez ces étapes pour installer et configurer le projet sur votre ordinateur :

1. Clonez le dépôt Git :

```bash
git clone https://github.com/ThibaultCoybes/DoozyPWA.git
cd doozy-test
```

2. Installez les dépendances :

```bash
npm install
# ou
yarn install
```

## Démarrage du projet

Pour lancer l'application en mode développement :

```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## Accès à l'application

Une fois l'application lancée, vous serez redirigé vers la page de connexion.

Pour vous connecter rapidement, utilisez le bouton "Connexion Instantanée" qui utilise ces identifiants par défaut :
- Email : user@doozy.com
- Mot de passe : password123

## Fonctionnalités principales

### Parcourir les vidéos

- Faites défiler le flux principal pour découvrir des vidéos DIY et artisanales
- Cliquez sur une vidéo pour la lire ou la mettre en pause
- Les vidéos en cours de lecture ont un effet de pulsation visuelle

### Profil utilisateur

- Accédez à votre profil pour voir vos vidéos téléchargées
- Consultez les vidéos que vous avez aimées ou ajoutées en favoris
- Cliquez sur une vidéo dans votre profil pour l'ouvrir et la visionner

### Téléchargement de vidéos

- Utilisez la page de création pour télécharger vos propres vidéos
- Prévisualisez votre vidéo avant de la publier
- Ajoutez un titre et une description à votre contenu

## Structure du projet

```
doozy-test/
├── app/                  # Code source principal
│   ├── auth/              # Pages d'authentification
│   ├── components/        # Composants réutilisables
│   ├── context/           # Contextes React (auth, UI)
│   ├── create/            # Page de création de vidéo
│   ├── profile/           # Page de profil utilisateur
│   ├── search/            # Page de recherche
│   ├── services/          # Services (auth, etc.)
│   ├── globals.css        # Styles globaux
│   └── layout.tsx         # Layout principal
├── public/               # Fichiers statiques
│   ├── icons/             # Icônes de l'application
│   ├── images/            # Images utilisées dans l'app
│   └── videos/            # Vidéos de démonstration
├── package.json          # Dépendances et scripts
└── next.config.js        # Configuration Next.js
```

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React avec rendu côté serveur
- [TypeScript](https://www.typescriptlang.org/) - Typage statique pour JavaScript
- [CSS Modules](https://github.com/css-modules/css-modules) - Styles scopés aux composants
- [localStorage API](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage) - Stockage local des données utilisateur
- [MediaRecorder API](https://developer.mozilla.org/fr/docs/Web/API/MediaRecorder) - Enregistrement vidéo côté client

## Génération du QR Code pour accès mobile

Pour générer un QR code permettant d'accéder à l'application depuis un appareil mobile (via ngrok) :

```bash
node generate-qr.js
```

Cela créera un fichier QR code dans le répertoire `public/` que vous pourrez scanner avec votre appareil mobile.

## Notes pour le jury

### Points d'intérêt

1. **Interface utilisateur intuitive** : L'application a été conçue pour offrir une expérience utilisateur fluide et intuitive, avec une navigation simple et des interactions naturelles avec les vidéos.

2. **Gestion des vidéos** : Le système permet de lire/mettre en pause les vidéos d'un simple clic, avec un retour visuel (effet de pulsation) pour indiquer quelle vidéo est en cours de lecture.

3. **Prévisualisation des vidéos** : Lors du téléchargement, les utilisateurs peuvent prévisualiser leurs vidéos avant de les publier.

4. **Stockage local** : Pour faciliter les tests, l'application utilise localStorage pour persister les données utilisateur et les vidéos téléchargées.

### Axes d'amélioration futurs

- Implémentation d'un backend avec base de données pour le stockage permanent des données
- Ajout de fonctionnalités sociales avancées (commentaires, partage, etc.)
- Optimisation des performances pour les appareils mobiles
- Intégration d'outils d'édition vidéo

## Licence

Ce projet est distribué sous licence MIT.

---

© 2025 Doozy - Tous droits réservés.
