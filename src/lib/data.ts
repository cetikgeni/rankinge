
import { User, Category, Item } from './types';

// Demo users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@categlorium.com',
    isAdmin: true,
    votes: {}
  },
  {
    id: '2',
    username: 'john_doe',
    email: 'john@example.com',
    isAdmin: false,
    votes: { '1': '2', '2': '6' }
  },
  {
    id: '3',
    username: 'jane_smith',
    email: 'jane@example.com',
    isAdmin: false,
    votes: { '1': '1', '2': '5' }
  }
];

// Demo categories with items
export const categories: Category[] = [
  {
    id: '1',
    name: 'Soft Drinks',
    description: 'Popular carbonated beverages from around the world',
    imageUrl: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=2787&auto=format&fit=crop',
    isApproved: true,
    createdBy: '1',
    items: [
      {
        id: '1',
        name: 'Coca-Cola',
        description: 'The classic cola beverage known worldwide',
        imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=2865&auto=format&fit=crop',
        voteCount: 245
      },
      {
        id: '2',
        name: 'Pepsi',
        description: 'Popular cola beverage with a distinct flavor',
        imageUrl: 'https://images.unsplash.com/photo-1629203432180-71e9b18d91d3?q=80&w=2864&auto=format&fit=crop',
        voteCount: 186
      },
      {
        id: '3',
        name: 'Sprite',
        description: 'Lemon-lime flavored clear soda',
        imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=2787&auto=format&fit=crop',
        voteCount: 172
      },
      {
        id: '4',
        name: 'Fanta',
        description: 'Fruit-flavored carbonated soft drink',
        imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=2940&auto=format&fit=crop',
        voteCount: 154
      }
    ]
  },
  {
    id: '2',
    name: 'Sneakers',
    description: 'Popular athletic and casual footwear brands',
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2825&auto=format&fit=crop',
    isApproved: true,
    createdBy: '1',
    items: [
      {
        id: '5',
        name: 'Nike',
        description: 'American multinational known for its athletic footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2940&auto=format&fit=crop',
        voteCount: 312
      },
      {
        id: '6',
        name: 'Adidas',
        description: 'German multinational corporation that designs and manufactures shoes',
        imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2940&auto=format&fit=crop',
        voteCount: 287
      },
      {
        id: '7',
        name: 'Puma',
        description: 'German multinational corporation that designs athletic footwear',
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=3074&auto=format&fit=crop',
        voteCount: 176
      },
      {
        id: '8',
        name: 'New Balance',
        description: 'American sports footwear manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2941&auto=format&fit=crop',
        voteCount: 145
      }
    ]
  },
  {
    id: '3',
    name: 'Coffee Chains',
    description: 'Major coffee shop brands from around the world',
    imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2787&auto=format&fit=crop',
    isApproved: true,
    createdBy: '2',
    items: [
      {
        id: '9',
        name: 'Starbucks',
        description: 'American multinational chain of coffeehouses',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 289
      },
      {
        id: '10',
        name: 'Costa Coffee',
        description: 'British coffeehouse chain with locations worldwide',
        imageUrl: 'https://images.unsplash.com/photo-1601000938259-9e91b70c20fd?q=80&w=2942&auto=format&fit=crop',
        voteCount: 176
      },
      {
        id: '11',
        name: 'Tim Hortons',
        description: 'Canadian-based multinational fast food restaurant',
        imageUrl: 'https://images.unsplash.com/photo-1577805515148-f4529c38befd?q=80&w=3032&auto=format&fit=crop',
        voteCount: 156
      },
      {
        id: '12',
        name: 'Dunkin\'',
        description: 'American multinational coffee and doughnut company',
        imageUrl: 'https://images.unsplash.com/photo-1575377427642-087fc0a9c7f2?q=80&w=2940&auto=format&fit=crop',
        voteCount: 145
      }
    ]
  },
  {
    id: '4',
    name: 'Smartphones',
    description: 'Leading smartphone brands and manufacturers',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2680&auto=format&fit=crop',
    isApproved: true,
    createdBy: '3',
    items: [
      {
        id: '13',
        name: 'Apple',
        description: 'American technology company known for iPhone',
        imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2940&auto=format&fit=crop',
        voteCount: 356
      },
      {
        id: '14',
        name: 'Samsung',
        description: 'South Korean multinational conglomerate',
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2671&auto=format&fit=crop',
        voteCount: 312
      },
      {
        id: '15',
        name: 'Google',
        description: 'American technology company known for Pixel phones',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 178
      },
      {
        id: '16',
        name: 'Xiaomi',
        description: 'Chinese electronics company',
        imageUrl: 'https://images.unsplash.com/photo-1591370409347-2f1f6758eeb9?q=80&w=2642&auto=format&fit=crop',
        voteCount: 167
      }
    ]
  }
];

// Pending categories awaiting approval
export const pendingCategories: Category[] = [
  {
    id: '5',
    name: 'Gaming Consoles',
    description: 'Popular video game console platforms',
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2619&auto=format&fit=crop',
    isApproved: false,
    createdBy: '2',
    items: [
      {
        id: '17',
        name: 'PlayStation 5',
        description: 'Sony\'s fifth home video game console',
        imageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2327&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '18',
        name: 'Xbox Series X',
        description: 'Microsoft\'s fourth generation of the Xbox console',
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=2832&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '19',
        name: 'Nintendo Switch',
        description: 'Hybrid console that can be used as a home console and portable device',
        imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=2940&auto=format&fit=crop',
        voteCount: 0
      }
    ]
  }
];

// Get all categories (approved + pending)
export const getAllCategories = () => {
  return [...categories, ...pendingCategories];
};

// Get approved categories only
export const getApprovedCategories = () => {
  return categories;
};

// Get pending categories only
export const getPendingCategories = () => {
  return pendingCategories;
};

// Get category by ID
export const getCategoryById = (id: string) => {
  return getAllCategories().find(category => category.id === id);
};

// Mock current user (for demo purposes)
export let currentUser: User | null = null;

// Login function (for demo purposes)
export const login = (username: string, password: string): User | null => {
  // For demo, we'll just check if username exists and return that user
  const user = users.find(u => u.username === username);
  if (user) {
    currentUser = user;
    return user;
  }
  return null;
};

// Register function (for demo purposes)
export const register = (username: string, email: string, password: string): User | null => {
  // Check if username already exists
  if (users.find(u => u.username === username)) {
    return null;
  }
  
  // Create new user
  const newUser: User = {
    id: String(users.length + 1),
    username,
    email,
    isAdmin: false,
    votes: {}
  };
  
  // Add to users array
  users.push(newUser);
  currentUser = newUser;
  return newUser;
};

// Logout function
export const logout = () => {
  currentUser = null;
};

// Vote for an item
export const voteForItem = (categoryId: string, itemId: string): boolean => {
  if (!currentUser) return false;
  
  // Check if user has already voted in this category
  if (currentUser.votes[categoryId]) {
    // If already voted for the same item, do nothing
    if (currentUser.votes[categoryId] === itemId) {
      return true;
    }
    
    // If voted for a different item, remove previous vote
    const prevItemId = currentUser.votes[categoryId];
    const category = getCategoryById(categoryId);
    if (category) {
      const prevItem = category.items.find(item => item.id === prevItemId);
      if (prevItem) {
        prevItem.voteCount--;
      }
    }
  }
  
  // Add new vote
  currentUser.votes[categoryId] = itemId;
  
  // Increment vote count for the item
  const category = getCategoryById(categoryId);
  if (category) {
    const item = category.items.find(item => item.id === itemId);
    if (item) {
      item.voteCount++;
      return true;
    }
  }
  
  return false;
};

// Submit new category
export const submitCategory = (submission: CategorySubmission): boolean => {
  if (!currentUser) return false;
  
  const newCategory: Category = {
    id: String(getAllCategories().length + 1),
    name: submission.name,
    description: submission.description,
    imageUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=2940&auto=format&fit=crop',
    isApproved: false,
    createdBy: currentUser.id,
    items: submission.items.map((item, index) => ({
      id: `new-${getAllCategories().length + 1}-${index + 1}`,
      name: item.name,
      description: item.description,
      imageUrl: 'https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=2940&auto=format&fit=crop',
      voteCount: 0
    }))
  };
  
  pendingCategories.push(newCategory);
  return true;
};

// Approve a category
export const approveCategory = (categoryId: string): boolean => {
  if (!currentUser?.isAdmin) return false;
  
  const categoryIndex = pendingCategories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) return false;
  
  const category = pendingCategories[categoryIndex];
  category.isApproved = true;
  
  // Move from pending to approved
  categories.push(category);
  pendingCategories.splice(categoryIndex, 1);
  
  return true;
};

// Reject a category
export const rejectCategory = (categoryId: string): boolean => {
  if (!currentUser?.isAdmin) return false;
  
  const categoryIndex = pendingCategories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) return false;
  
  // Remove from pending
  pendingCategories.splice(categoryIndex, 1);
  
  return true;
};
