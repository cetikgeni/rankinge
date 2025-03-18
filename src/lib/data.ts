import { Category, Item, User } from './types';

// Mock user data
export let currentUser: User | null = {
  id: 'user1',
  username: 'Test User',
  email: 'test@example.com',
  isAdmin: true,
  votes: {},
};

// Function to simulate user login
export const loginUser = (user: User) => {
  currentUser = user;
};

// Function to simulate user logout
export const logoutUser = () => {
  currentUser = null;
};

// Mock category data
export let categories: Category[] = [
  {
    id: 'category1',
    name: 'Best Smartphones 2024',
    description: 'The top-rated smartphones of the year, based on performance, camera quality, and user experience.',
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
    items: [
      {
        id: 'item1',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'The ultimate Android phone with a stunning display and top-tier performance.',
        imageUrl: 'https://images.unsplash.com/photo-1608789229404-46cb5639c452?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbXN1bmclMjBwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
        voteCount: 120,
      },
      {
        id: 'item2',
        name: 'Apple iPhone 15 Pro',
        description: 'The latest iPhone with a powerful processor and advanced camera system.',
        imageUrl: 'https://images.unsplash.com/photo-1663190243794-1149b794491e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D',
        voteCount: 150,
      },
      {
        id: 'item3',
        name: 'Google Pixel 8 Pro',
        description: 'The best of Google in a phone, with a focus on AI and photography.',
        imageUrl: 'https://images.unsplash.com/photo-1697446498724-4c8138457a4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z29vZ2xlJTIwcGl4ZWwlMjA4fGVufDB8fDB8fHx8MA%3D%3D',
        voteCount: 95,
      },
    ],
    isApproved: true,
    createdBy: 'admin',
  },
  {
    id: 'category2',
    name: 'Top Electric Cars 2024',
    description: 'The most innovative and efficient electric vehicles on the market this year.',
    imageUrl: 'https://images.unsplash.com/photo-1617274234573-c9731747a6e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWMlMjBjYXJzfGVufDB8fDB8fHx8MA%3D%3D',
    items: [
      {
        id: 'item4',
        name: 'Tesla Model 3',
        description: 'The best-selling electric car, known for its performance and range.',
        imageUrl: 'https://images.unsplash.com/photo-1584241357354-9c4494956e13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlc2xhJTIwbW9kZWwlMjAzfGVufDB8fDB8fHx8MA%3D%3D',
        voteCount: 130,
      },
      {
        id: 'item5',
        name: 'Ford Mustang Mach-E',
        description: 'An electric SUV that combines style and practicality.',
        imageUrl: 'https://images.unsplash.com/photo-1635419433480-493c1314a89c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEV2JTIwY2FyfGVufDB8fDB8fHx8MA%3D%3D',
        voteCount: 110,
      },
      {
        id: 'item6',
        name: 'Chevrolet Bolt EV',
        description: 'An affordable electric car with a long driving range.',
        imageUrl: 'https://images.unsplash.com/photo-1626544775547-038449498e03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEV2JTIwY2FyfGVufDB8fDB8fHx8MA%3D%3D',
        voteCount: 80,
      },
    ],
    isApproved: true,
    createdBy: 'admin',
  },
  {
    id: 'category3',
    name: 'Best Vacation Spots 2024',
    description: 'The most popular and exotic vacation destinations to visit this year.',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZjYXRpb258ZW58MHx8MHx8fDA%3D',
    items: [
      {
        id: 'item7',
        name: 'Bora Bora, French Polynesia',
        description: 'A tropical paradise with crystal-clear waters and luxurious resorts.',
        imageUrl: 'https://images.unsplash.com/photo-1615874958954-9435bec5236e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZjYXRpb258ZW58MHx8MHx8fDA%3D',
        voteCount: 140,
      },
      {
        id: 'item8',
        name: 'Kyoto, Japan',
        description: 'A city rich in culture, with beautiful temples and traditional gardens.',
        imageUrl: 'https://images.unsplash.com/photo-1573497074974-e5e362ca9f95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZjYXRpb258ZW58MHx8MHx8fDA%3D',
        voteCount: 100,
      },
      {
        id: 'item9',
        name: 'Santorini, Greece',
        description: 'Famous for its stunning sunsets and white-washed buildings.',
        imageUrl: 'https://images.unsplash.com/photo-1624444344149-d492943b999a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZjYXRpb258ZW58MHx8MHx8fDA%3D',
        voteCount: 115,
      },
    ],
    isApproved: true,
    createdBy: 'admin',
  },
  {
    id: 'category4',
    name: 'Best New Gadgets',
    description: 'The latest and greatest gadgets that are making waves in the tech world.',
    imageUrl: 'https://images.unsplash.com/photo-1517672058929-478542eb839f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    items: [
      {
        id: 'item10',
        name: 'Wireless Charging Pad',
        description: 'A sleek and efficient way to charge your devices without the hassle of cables.',
        imageUrl: 'https://images.unsplash.com/photo-1561886940-a9c94b89e52a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        voteCount: 55,
      },
      {
        id: 'item11',
        name: 'Noise Cancelling Headphones',
        description: 'Immerse yourself in your favorite music with these high-quality headphones.',
        imageUrl: 'https://images.unsplash.com/photo-1564424224673-1b7994446138?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        voteCount: 70,
      },
      {
        id: 'item12',
        name: 'Smart Watch',
        description: 'Stay connected and track your fitness goals with this stylish smartwatch.',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        voteCount: 40,
      },
    ],
    isApproved: false,
    createdBy: 'user2',
  },
];

// Function to get all categories
export const getAllCategories = (): Category[] => {
  return categories;
};

// Function to get approved categories
export const getApprovedCategories = (): Category[] => {
  return categories.filter(category => category.isApproved);
};

// Function to get a category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

// Function to submit a new category
export const submitCategory = (category: Omit<Category, 'id' | 'isApproved'>): Category => {
  const newCategory: Category = {
    id: `category${categories.length + 1}`,
    ...category,
    isApproved: false,
  };
  categories.push(newCategory);
  return newCategory;
};

// Function to approve a category (admin only)
export const approveCategory = (id: string): boolean => {
  if (!currentUser?.isAdmin) {
    console.warn('Non-admin user attempted to approve a category.');
    return false;
  }

  const category = categories.find(category => category.id === id);
  if (!category) {
    console.warn(`Category with id ${id} not found.`);
    return false;
  }

  category.isApproved = true;
  return true;
};

// Add this function to update category settings
export const updateCategorySettings = (categoryId: string, settings: Partial<Pick<Category, 'displayVoteAs'>>) => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return false;
  
  // Update the settings
  Object.assign(category, settings);
  return true;
};

// Update voteForItem function to include vote history
export const voteForItem = (categoryId: string, itemId: string) => {
  if (!currentUser) return false;
  
  const category = categories.find(c => c.id === categoryId);
  if (!category) return false;
  
  const item = category.items.find(i => i.id === itemId);
  if (!item) return false;
  
  // Check if the user has already voted for this item
  const previousVote = currentUser.votes[categoryId];
  
  // If user already voted for this item, don't do anything
  if (previousVote === itemId) return true;
  
  // If user voted for another item, decrement that item's vote count
  if (previousVote) {
    const previousItem = category.items.find(i => i.id === previousVote);
    if (previousItem) {
      previousItem.voteCount--;
    }
  }
  
  // Record the new vote
  currentUser.votes[categoryId] = itemId;
  item.voteCount++;
  
  // Update vote history
  const currentDate = new Date().toISOString();
  const sortedItems = [...category.items].sort((a, b) => b.voteCount - a.voteCount);
  const newPosition = sortedItems.findIndex(i => i.id === itemId) + 1;
  
  // Create vote history array if it doesn't exist
  if (!item.voteHistory) {
    item.voteHistory = [];
  }
  
  // Add new history point
  item.voteHistory.push({
    date: currentDate,
    position: newPosition,
    voteCount: item.voteCount
  });
  
  return true;
};

// Modify your categories data to include some vote history for demo purposes
// For example in your main categories array:
// Note: This is just a simplified example, you'd need to add this to your actual data

// Add this to initialize some history data for existing items
categories.forEach(category => {
  category.items.forEach(item => {
    // Initialize vote history if doesn't exist
    if (!item.voteHistory) {
      const now = new Date();
      item.voteHistory = [];
      
      // Generate some sample history points over the last 7 days
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const randomPosition = Math.floor(Math.random() * category.items.length) + 1;
        const randomVoteCount = Math.max(0, item.voteCount - Math.floor(Math.random() * 5) * i);
        
        item.voteHistory.push({
          date: date.toISOString(),
          position: i === 0 ? randomPosition : randomPosition + 1, // Slightly different position for history
          voteCount: randomVoteCount
        });
      }
    }
  });
});

// Mock function to simulate fetching user data
export const fetchUser = async (id: string): Promise<User | undefined> => {
  // In a real application, this would fetch user data from a database
  // For now, we'll just return a mock user
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  if (id === currentUser?.id) {
    return currentUser;
  }

  return undefined;
};
