
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
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  items: Item[];
  isApproved: boolean;
  createdBy: string; // userId
}

export interface CategorySubmission {
  name: string;
  description: string;
  items: { name: string; description: string }[];
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
}
