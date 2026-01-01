
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  votes: Record<string, string>; // categoryId: itemId
}

export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  voteCount: number;
  productUrl?: string;
  affiliateUrl?: string;
}

export interface CategorySettings {
  displayVoteAs: 'count' | 'percentage';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  items: Item[];
  isApproved: boolean;
  createdBy: string; // userId
  settings: CategorySettings;
  categoryGroup?: string;
}

export interface CategorySubmission {
  name: string;
  description: string;
  items: { 
    name: string; 
    description: string;
    productUrl?: string;
    imageUrl?: string;
  }[];
  categoryGroup?: string;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
}
