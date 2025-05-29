// Type pour les utilisateurs
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: string;
  followers: string[]; // IDs des utilisateurs qui suivent cet utilisateur
  following: string[]; // IDs des utilisateurs que cet utilisateur suit
  likedVideos: string[]; // IDs des vidéos aimées
  favoriteVideos: string[]; // IDs des vidéos favorites
  viewHistory: string[]; // IDs des vidéos vues
  searchHistory: string[]; // Historique de recherche
}

class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  // Charger les utilisateurs depuis localStorage ou fichier JSON
  private loadUsers(): void {
    if (typeof window !== 'undefined') {
      const usersJSON = localStorage.getItem('doozy_users');
      if (usersJSON) {
        try {
          this.users = JSON.parse(usersJSON);
        } catch (error) {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          this.users = [];
        }
      } else {
        // Aucun utilisateur trouvé, chargeons l'utilisateur par défaut pour le développement
        this.loadDefaultUser();
      }
    }
  }
  
  // Charger l'utilisateur par défaut pour le développement
  private loadDefaultUser(): void {
    try {
      // Créer un utilisateur par défaut avec les mêmes identifiants que dans le bouton de connexion rapide
      const defaultUser: User = {
        id: "1001",
        username: "Doozy_User",
        email: "user@doozy.com", // Identifiants correspondant au bouton de connexion rapide
        password: "password123",  // Identifiants correspondant au bouton de connexion rapide
        avatar: "/icons/logo.svg",
        createdAt: "2025-05-26T12:00:00.000Z",
        followers: [],
        following: [],
        likedVideos: ["1", "3", "5"],
        favoriteVideos: ["2", "4"],
        viewHistory: ["1", "2", "3", "4", "5"],
        searchHistory: ["DIY", "crafts", "painting"]
      };
      
      this.users = [defaultUser];
      this.saveUsers(); // Enregistrer l'utilisateur par défaut dans localStorage
      
      // Utilisateur par défaut chargé
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur par défaut:', error);
      
      // Créer un utilisateur de secours en cas d'erreur
      const fallbackUser: User = {
        id: "1001",
        username: "Doozy_User",
        email: "user@doozy.com",
        password: "password123",
        avatar: "/icons/logo.svg",
        createdAt: "2025-05-26T12:00:00.000Z",
        followers: [],
        following: [],
        likedVideos: [],
        favoriteVideos: [],
        viewHistory: [],
        searchHistory: []
      };
      
      this.users = [fallbackUser];
      this.saveUsers();
    }
  }

  // Sauvegarder les utilisateurs dans localStorage
  private saveUsers(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('doozy_users', JSON.stringify(this.users));
    }
  }

  // Charger l'utilisateur courant depuis localStorage
  private loadCurrentUser(): void {
    if (typeof window !== 'undefined') {
      const userJSON = localStorage.getItem('doozy_current_user');
      if (userJSON) {
        try {
          this.currentUser = JSON.parse(userJSON);
        } catch (error) {
          console.error('Erreur lors du chargement de l\'utilisateur courant:', error);
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
    }
  }

  // Sauvegarder l'utilisateur courant dans localStorage
  private saveCurrentUser(): void {
    if (typeof window !== 'undefined') {
      if (this.currentUser) {
        localStorage.setItem('doozy_current_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('doozy_current_user');
      }
    }
  }

  // Inscription d'un nouvel utilisateur
  public async register(username: string, email: string, password: string): Promise<User | null> {
    if (!username || !email || !password) {
      throw new Error('Tous les champs sont requis');
    }

    // Vérifier si l'email existe déjà
    if (this.users.some(user => user.email === email)) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password, // Dans une vraie app, il faudrait hacher le mot de passe
      avatar: `/images/avatars/default.jpg`,
      createdAt: new Date().toISOString(),
      followers: [],
      following: [],
      likedVideos: [],
      favoriteVideos: [],
      viewHistory: [],
      searchHistory: []
    };

    // Ajouter l'utilisateur à la liste
    this.users.push(newUser);
    this.saveUsers();
    
    // Connecter automatiquement l'utilisateur
    this.currentUser = newUser;
    this.saveCurrentUser();
    
    return newUser;
  }

  // Connexion d'un utilisateur
  public async login(email: string, password: string): Promise<User | null> {
    // Identifiants de développement pour faciliter les tests
    const devEmail = 'test@gmail.com';
    const devPassword = 'testtest';

    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }

    // Accepter toujours les identifiants de développement pour faciliter les tests
    if (email === devEmail && password === devPassword) {
      // Connexion avec les identifiants de développement
      
      // Créer un utilisateur par défaut si nécessaire
      let defaultUser = this.users.find(u => u.email === devEmail);
      
      if (!defaultUser) {
        // L'utilisateur n'existe pas encore, le créer
        defaultUser = {
          id: "1001",
          username: "demo",
          email: devEmail,
          password: devPassword,
          avatar: "/icons/logo.svg",
          createdAt: new Date().toISOString(),
          followers: [],
          following: [],
          likedVideos: ["1", "3", "5"],
          favoriteVideos: ["2", "4"],
          viewHistory: ["1", "2", "3", "4", "5"],
          searchHistory: ["DIY", "crafts", "painting"]
        };
        
        // Ajouter l'utilisateur à la liste
        this.users.push(defaultUser);
        this.saveUsers();
      }
      
      // Connecter l'utilisateur
      this.currentUser = defaultUser;
      this.saveCurrentUser();
      return defaultUser;
    }

    // Sinon, recherche normale de l'utilisateur
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    if (user.password !== password) { // Dans une vraie app, il faudrait comparer les hachages
      throw new Error('Email ou mot de passe incorrect');
    }

    // Mettre à jour l'utilisateur courant
    this.currentUser = user;
    this.saveCurrentUser();
    
    return user;
  }

  // Déconnexion
  public logout(): void {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  // Vérifier si l'utilisateur est connecté
  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Obtenir l'utilisateur courant
  public getCurrentUser(): User | null {
    // Vérifier que this.currentUser est bien un objet et non un nombre ou une autre valeur primitive
    if (this.currentUser !== null && (typeof this.currentUser !== 'object' || Array.isArray(this.currentUser))) {
      console.error('Erreur: currentUser n\'est pas un objet valide dans getCurrentUser:', this.currentUser);
      // Réinitialiser currentUser à null si ce n'est pas un objet valide
      this.currentUser = null;
      this.saveCurrentUser();
    }
    return this.currentUser;
  }

  // Mettre à jour les informations utilisateur
  public updateUser(updatedUser: Partial<User>): User | null {
    if (!this.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }

    // Mettre à jour l'utilisateur courant
    this.currentUser = { ...this.currentUser, ...updatedUser };
    
    // Mettre à jour l'utilisateur dans la liste
    const index = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (index !== -1) {
      this.users[index] = this.currentUser;
      this.saveUsers();
    }
    
    this.saveCurrentUser();
    return this.currentUser;
  }

  // Suivre un utilisateur
  public followUser(userId: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Vérifier si l'utilisateur existe
    const userToFollow = this.users.find(u => u.id === userId);
    if (!userToFollow) {
      return false;
    }

    // S'assurer que following est bien un tableau
    if (!this.currentUser.following) {
      this.currentUser.following = [];
    }

    // Vérifier si l'utilisateur suit déjà cet utilisateur
    if (this.currentUser.following.includes(userId)) {
      return true; // Déjà suivi
    }

    // Ajouter l'ID à la liste des utilisateurs suivis
    this.currentUser.following.push(userId);
    
    // S'assurer que followers est bien un tableau sur l'utilisateur qu'on suit
    if (!userToFollow.followers) {
      userToFollow.followers = [];
    }
    
    // Ajouter l'ID de l'utilisateur courant aux followers de l'utilisateur suivi
    userToFollow.followers.push(this.currentUser.id);
    
    // Mettre à jour les utilisateurs dans la liste
    const currentUserIndex = this.users.findIndex(u => u.id === this.currentUser?.id);
    const followedUserIndex = this.users.findIndex(u => u.id === userId);
    
    if (currentUserIndex !== -1 && followedUserIndex !== -1) {
      this.users[currentUserIndex] = this.currentUser;
      this.users[followedUserIndex] = userToFollow;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Ne plus suivre un utilisateur
  public unfollowUser(userId: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Vérifier si l'utilisateur existe
    const userToUnfollow = this.users.find(u => u.id === userId);
    if (!userToUnfollow) {
      return false;
    }

    // S'assurer que following est bien un tableau
    if (!this.currentUser.following) {
      this.currentUser.following = [];
      return true; // Déjà non suivi puisque following est vide
    }

    // Vérifier si l'utilisateur suit cet utilisateur
    const followingIndex = this.currentUser.following.indexOf(userId);
    if (followingIndex === -1) {
      return true; // Déjà non suivi
    }

    // Supprimer l'ID de la liste des utilisateurs suivis
    this.currentUser.following.splice(followingIndex, 1);
    
    // S'assurer que followers est bien un tableau sur l'utilisateur qu'on ne suit plus
    if (!userToUnfollow.followers) {
      userToUnfollow.followers = [];
    } else {
      // Supprimer l'ID de l'utilisateur courant des followers de l'utilisateur non suivi
      const followerIndex = userToUnfollow.followers.indexOf(this.currentUser.id);
      if (followerIndex !== -1) {
        userToUnfollow.followers.splice(followerIndex, 1);
      }
    }
    
    // Mettre à jour les utilisateurs dans la liste
    const currentUserIndex = this.users.findIndex(u => u.id === this.currentUser?.id);
    const unfollowedUserIndex = this.users.findIndex(u => u.id === userId);
    
    if (currentUserIndex !== -1 && unfollowedUserIndex !== -1) {
      this.users[currentUserIndex] = this.currentUser;
      this.users[unfollowedUserIndex] = userToUnfollow;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Aimer une vidéo
  public likeVideo(videoId: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Vérifier que this.currentUser est bien un objet et non un nombre ou une autre valeur primitive
    if (typeof this.currentUser !== 'object' || this.currentUser === null) {
      console.error('Erreur: currentUser n\'est pas un objet valide dans likeVideo:', this.currentUser);
      return false;
    }

    // S'assurer que likedVideos existe
    if (!this.currentUser.likedVideos) {
      this.currentUser.likedVideos = [];
    }

    // Vérifier si la vidéo est déjà aimée
    if (this.currentUser.likedVideos.includes(videoId)) {
      return true; // Déjà aimée
    }

    // Ajouter l'ID à la liste des vidéos aimées
    this.currentUser.likedVideos.push(videoId);
    
    // Mettre à jour l'utilisateur dans la liste
    const index = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (index !== -1) {
      this.users[index] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Ne plus aimer une vidéo
  public unlikeVideo(videoId: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Vérifier que this.currentUser est bien un objet et non un nombre ou une autre valeur primitive
    if (typeof this.currentUser !== 'object' || this.currentUser === null) {
      console.error('Erreur: currentUser n\'est pas un objet valide dans unlikeVideo:', this.currentUser);
      return false;
    }

    // S'assurer que likedVideos existe
    if (!this.currentUser.likedVideos) {
      this.currentUser.likedVideos = [];
      return true; // Pas besoin de retirer quelque chose qui n'existe pas
    }

    // Vérifier si la vidéo est aimée
    const index = this.currentUser.likedVideos.indexOf(videoId);
    if (index === -1) {
      return true; // Déjà non aimée
    }

    // Supprimer l'ID de la liste des vidéos aimées
    this.currentUser.likedVideos.splice(index, 1);
    
    // Mettre à jour l'utilisateur dans la liste
    const userIndex = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Ajouter une vidéo aux favoris
  public addToFavorites(videoId: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Vérifier que this.currentUser est bien un objet et non un nombre ou une autre valeur primitive
    if (typeof this.currentUser !== 'object' || this.currentUser === null) {
      console.error('Erreur: currentUser n\'est pas un objet valide dans addToFavorites:', this.currentUser);
      return false;
    }

    // S'assurer que favoriteVideos existe
    if (!this.currentUser.favoriteVideos) {
      this.currentUser.favoriteVideos = [];
    }

    // Vérifier si la vidéo est déjà dans les favoris
    if (this.currentUser.favoriteVideos.includes(videoId)) {
      return true; // Déjà dans les favoris
    }

    // Ajouter l'ID à la liste des vidéos favorites
    this.currentUser.favoriteVideos.push(videoId);
    
    // Mettre à jour l'utilisateur dans la liste
    const index = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (index !== -1) {
      this.users[index] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Supprimer une vidéo des favoris
  public removeFromFavorites(videoId: string): boolean {
    if (!this.currentUser) {
      return false;
    }
    
    // Vérifier que this.currentUser est bien un objet et non un nombre ou une autre valeur primitive
    if (typeof this.currentUser !== 'object' || this.currentUser === null) {
      console.error('Erreur: currentUser n\'est pas un objet valide dans removeFromFavorites:', this.currentUser);
      return false;
    }
    
    // S'assurer que favoriteVideos existe
    if (!this.currentUser.favoriteVideos) {
      this.currentUser.favoriteVideos = [];
      return true; // Pas besoin de retirer quelque chose qui n'existe pas
    }

    // Vérifier si la vidéo est dans les favoris
    const index = this.currentUser.favoriteVideos.indexOf(videoId);
    if (index === -1) {
      return true; // Déjà non favorite
    }

    // Supprimer l'ID de la liste des vidéos favorites
    this.currentUser.favoriteVideos.splice(index, 1);
    
    // Mettre à jour l'utilisateur dans la liste
    const userIndex = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Ajouter une vidéo à l'historique de visionnage
  public addToViewHistory(videoId: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Vérifier que this.currentUser est bien un objet et non un nombre ou une autre valeur primitive
    if (typeof this.currentUser !== 'object' || this.currentUser === null) {
      console.error('Erreur: currentUser n\'est pas un objet valide:', this.currentUser);
      return false;
    }

    // S'assurer que viewHistory existe
    if (!this.currentUser.viewHistory) {
      this.currentUser.viewHistory = [];
    }

    // Vérifier si la vidéo est déjà dans l'historique
    const index = this.currentUser.viewHistory.indexOf(videoId);
    if (index !== -1) {
      // La vidéo est déjà dans l'historique, la supprimer pour la remettre en tête
      this.currentUser.viewHistory.splice(index, 1);
    }

    // Ajouter l'ID au début de l'historique
    this.currentUser.viewHistory.unshift(videoId);
    
    // Limiter la taille de l'historique à 100 éléments
    if (this.currentUser.viewHistory.length > 100) {
      this.currentUser.viewHistory = this.currentUser.viewHistory.slice(0, 100);
    }
    
    // Mettre à jour l'utilisateur dans la liste
    const userIndex = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }

  // Ajouter une recherche à l'historique
  public addToSearchHistory(searchTerm: string): boolean {
    if (!this.currentUser || !searchTerm) {
      return false;
    }
    
    // S'assurer que searchHistory existe
    if (!this.currentUser.searchHistory) {
      this.currentUser.searchHistory = [];
    }

    // Vérifier si la recherche est déjà dans l'historique
    const index = this.currentUser.searchHistory.indexOf(searchTerm);
    if (index !== -1) {
      // La recherche est déjà dans l'historique, la supprimer pour la remettre en tête
      this.currentUser.searchHistory.splice(index, 1);
    }

    // Ajouter la recherche au début de l'historique
    this.currentUser.searchHistory.unshift(searchTerm);
    
    // Limiter la taille de l'historique à 20 éléments
    if (this.currentUser.searchHistory.length > 20) {
      this.currentUser.searchHistory = this.currentUser.searchHistory.slice(0, 20);
    }
    
    // Mettre à jour l'utilisateur dans la liste
    const userIndex = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
      return true;
    }
    
    return false;
  }
}

// Créer une instance unique du service
const authService = new AuthService();

export default authService;
