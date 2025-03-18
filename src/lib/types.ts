
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
  voteHistory?: VoteHistoryPoint[]; // Added vote history
  productUrl?: string; // Make it explicit
}

export interface VoteHistoryPoint {
  date: string; // ISO date string
  position: number;
  voteCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  items: Item[];
  isApproved: boolean;
  createdBy: string; // userId
  displayVoteAs?: 'count' | 'percentage'; // Admin setting for display preference
}

export interface CategorySubmission {
  name: string;
  description: string;
  items: { 
    name: string; 
    description: string;
    productUrl?: string; 
  }[];
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
}
