import { User, Category, Item, CategorySubmission, CategorySettings } from './types';

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

// Default category settings
const defaultCategorySettings: CategorySettings = {
  displayVoteAs: 'count'
};

// Demo categories with items
export const categories: Category[] = [
  {
    id: '1',
    name: 'Soft Drinks',
    description: 'Popular carbonated beverages from around the world',
    imageUrl: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=2787&auto=format&fit=crop',
    isApproved: true,
    createdBy: '1',
    settings: { ...defaultCategorySettings },
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
      },
      {
        id: '4a',
        name: 'Dr Pepper',
        description: 'Unique blend of 23 flavors in a carbonated soft drink',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2940&auto=format&fit=crop',
        voteCount: 135
      },
      {
        id: '4b',
        name: 'Mountain Dew',
        description: 'Citrus-flavored caffeinated soft drink',
        imageUrl: 'https://images.unsplash.com/photo-1581006652538-2a16e249adeE?q=80&w=2940&auto=format&fit=crop',
        voteCount: 125
      },
      {
        id: '4c',
        name: '7UP',
        description: 'Lemon-lime flavored non-caffeinated soft drink',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2940&auto=format&fit=crop',
        voteCount: 118
      },
      {
        id: '4d',
        name: 'Schweppes',
        description: 'Classic tonic water and mixed drink beverages',
        imageUrl: 'https://images.unsplash.com/photo-1581006652538-2a16e249adeE?q=80&w=2940&auto=format&fit=crop',
        voteCount: 95
      },
      {
        id: '4e',
        name: 'Root Beer',
        description: 'Sweet, carbonated beverage with vanilla and sassafras flavors',
        imageUrl: 'https://images.unsplash.com/photo-1581006652538-2a16e249adeE?q=80&w=2940&auto=format&fit=crop',
        voteCount: 82
      },
      {
        id: '4f',
        name: 'Ginger Ale',
        description: 'Carbonated soft drink flavored with ginger',
        imageUrl: 'https://images.unsplash.com/photo-1581006652538-2a16e249adeE?q=80&w=2940&auto=format&fit=crop',
        voteCount: 76
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
    settings: { ...defaultCategorySettings },
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
      },
      {
        id: '8a',
        name: 'Converse',
        description: 'American shoe company known for its iconic Chuck Taylor All Stars',
        imageUrl: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?q=80&w=2940&auto=format&fit=crop',
        voteCount: 132
      },
      {
        id: '8b',
        name: 'Vans',
        description: 'American manufacturer of skateboarding shoes and apparel',
        imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2943&auto=format&fit=crop',
        voteCount: 118
      },
      {
        id: '8c',
        name: 'Reebok',
        description: 'British-American footwear and apparel company',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2941&auto=format&fit=crop',
        voteCount: 98
      },
      {
        id: '8d',
        name: 'ASICS',
        description: 'Japanese multinational corporation producing footwear and sports equipment',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2941&auto=format&fit=crop',
        voteCount: 87
      },
      {
        id: '8e',
        name: 'Under Armour',
        description: 'American sports equipment company that manufactures footwear',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2941&auto=format&fit=crop',
        voteCount: 76
      },
      {
        id: '8f',
        name: 'Saucony',
        description: 'American manufacturer of athletic footwear',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2941&auto=format&fit=crop',
        voteCount: 65
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
    settings: { ...defaultCategorySettings },
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
      },
      {
        id: '12a',
        name: 'Peet\'s Coffee',
        description: 'American specialty coffee roaster and retailer',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 134
      },
      {
        id: '12b',
        name: 'Blue Bottle Coffee',
        description: 'American coffee roaster and retailer',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 121
      },
      {
        id: '12c',
        name: 'Caribou Coffee',
        description: 'American coffee company and coffeehouse chain',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 112
      },
      {
        id: '12d',
        name: 'McCafé',
        description: 'Coffee-house-style food and beverage chain by McDonald\'s',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 98
      },
      {
        id: '12e',
        name: 'The Coffee Bean & Tea Leaf',
        description: 'American coffee chain founded in Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 87
      },
      {
        id: '12f',
        name: 'Dutch Bros Coffee',
        description: 'American drive-through coffee chain',
        imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop',
        voteCount: 76
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
    settings: { ...defaultCategorySettings },
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
      },
      {
        id: '16a',
        name: 'OnePlus',
        description: 'Chinese smartphone manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 154
      },
      {
        id: '16b',
        name: 'Huawei',
        description: 'Chinese multinational technology company',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 143
      },
      {
        id: '16c',
        name: 'Sony',
        description: 'Japanese multinational conglomerate',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 124
      },
      {
        id: '16d',
        name: 'Motorola',
        description: 'American telecommunications company',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 98
      },
      {
        id: '16e',
        name: 'Nokia',
        description: 'Finnish multinational telecommunications company',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 85
      },
      {
        id: '16f',
        name: 'ASUS',
        description: 'Taiwanese multinational computer and phone hardware company',
        imageUrl: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?q=80&w=2942&auto=format&fit=crop',
        voteCount: 76
      }
    ]
  },
  {
    id: '6',
    name: 'Fast Food Chains',
    description: 'Popular fast food restaurants worldwide',
    imageUrl: 'https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?q=80&w=2874&auto=format&fit=crop',
    isApproved: true,
    createdBy: '2',
    settings: { ...defaultCategorySettings },
    items: [
      {
        id: '20',
        name: 'McDonald\'s',
        description: 'American multinational fast food chain',
        imageUrl: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?q=80&w=2942&auto=format&fit=crop',
        voteCount: 342
      },
      {
        id: '21',
        name: 'KFC',
        description: 'American fast food restaurant chain known for fried chicken',
        imageUrl: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=2944&auto=format&fit=crop',
        voteCount: 278
      },
      {
        id: '22',
        name: 'Subway',
        description: 'American fast food restaurant franchise specializing in submarine sandwiches',
        imageUrl: 'https://images.unsplash.com/photo-1619709153211-389142d898ea?q=80&w=2940&auto=format&fit=crop',
        voteCount: 234
      },
      {
        id: '23',
        name: 'Burger King',
        description: 'American multinational chain of hamburger fast food restaurants',
        imageUrl: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?q=80&w=2940&auto=format&fit=crop',
        voteCount: 198
      },
      {
        id: '24',
        name: 'Wendy\'s',
        description: 'American international fast food restaurant chain',
        imageUrl: 'https://images.unsplash.com/photo-1584729173061-0c1dcc5a4f48?q=80&w=2940&auto=format&fit=crop',
        voteCount: 176
      },
      {
        id: '25',
        name: 'Taco Bell',
        description: 'American chain of fast food restaurants specializing in Mexican-inspired foods',
        imageUrl: 'https://images.unsplash.com/photo-1618543544310-fed3ba87e15f?q=80&w=2940&auto=format&fit=crop',
        voteCount: 142
      },
      {
        id: '26',
        name: 'Domino\'s Pizza',
        description: 'American multinational pizza restaurant chain',
        imageUrl: 'https://images.unsplash.com/photo-1593246049226-ded77bf90326?q=80&w=2940&auto=format&fit=crop',
        voteCount: 123
      },
      {
        id: '27',
        name: 'Pizza Hut',
        description: 'American multinational restaurant chain and international franchise',
        imageUrl: 'https://images.unsplash.com/photo-1593246049226-ded77bf90326?q=80&w=2940&auto=format&fit=crop',
        voteCount: 102
      },
      {
        id: '28',
        name: 'Chipotle',
        description: 'American chain of fast casual restaurants specializing in Mexican food',
        imageUrl: 'https://images.unsplash.com/photo-1643218742458-9130506c7e8d?q=80&w=2790&auto=format&fit=crop',
        voteCount: 92
      },
      {
        id: '29',
        name: 'Popeyes',
        description: 'American multinational chain of fried chicken fast food restaurants',
        imageUrl: 'https://images.unsplash.com/photo-1626082929543-5bba7c1c4922?q=80&w=2940&auto=format&fit=crop',
        voteCount: 83
      }
    ]
  },
  {
    id: '7',
    name: 'Streaming Services',
    description: 'Popular video and music streaming platforms',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2940&auto=format&fit=crop',
    isApproved: true,
    createdBy: '3',
    settings: { ...defaultCategorySettings },
    items: [
      {
        id: '30',
        name: 'Netflix',
        description: 'American subscription streaming service and production company',
        imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2849&auto=format&fit=crop',
        voteCount: 387
      },
      {
        id: '31',
        name: 'Disney+',
        description: 'American subscription video on-demand streaming service owned by Disney',
        imageUrl: 'https://images.unsplash.com/photo-1604149382123-7b74c47354e2?q=80&w=2940&auto=format&fit=crop',
        voteCount: 324
      },
      {
        id: '32',
        name: 'Amazon Prime Video',
        description: 'American subscription video on-demand over-the-top streaming service',
        imageUrl: 'https://images.unsplash.com/photo-1585154536515-65e44645accf?q=80&w=2940&auto=format&fit=crop',
        voteCount: 256
      },
      {
        id: '33',
        name: 'HBO Max',
        description: 'American subscription video on-demand streaming service',
        imageUrl: 'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?q=80&w=2781&auto=format&fit=crop',
        voteCount: 198
      },
      {
        id: '34',
        name: 'Hulu',
        description: 'American subscription video on-demand streaming service',
        imageUrl: 'https://images.unsplash.com/photo-1596066378005-09e423783c62?q=80&w=2893&auto=format&fit=crop',
        voteCount: 176
      },
      {
        id: '35',
        name: 'YouTube Premium',
        description: 'Paid subscription service offered by YouTube',
        imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=2874&auto=format&fit=crop',
        voteCount: 154
      },
      {
        id: '36',
        name: 'Apple TV+',
        description: 'American subscription streaming service owned by Apple Inc.',
        imageUrl: 'https://images.unsplash.com/photo-1570610154365-4c74418e2533?q=80&w=2739&auto=format&fit=crop',
        voteCount: 132
      },
      {
        id: '37',
        name: 'Paramount+',
        description: 'American subscription video on-demand streaming service',
        imageUrl: 'https://images.unsplash.com/photo-1622446448424-pa0b8177a811?q=80&w=2895&auto=format&fit=crop',
        voteCount: 109
      },
      {
        id: '38',
        name: 'Peacock',
        description: 'American over-the-top streaming service operated by NBCUniversal',
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2866&auto=format&fit=crop',
        voteCount: 87
      },
      {
        id: '39',
        name: 'Discovery+',
        description: 'American streaming service owned by Warner Bros. Discovery',
        imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2940&auto=format&fit=crop',
        voteCount: 76
      }
    ]
  },
  {
    id: '8',
    name: 'Car Manufacturers',
    description: 'Leading automobile brands from around the world',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940&auto=format&fit=crop',
    isApproved: true,
    createdBy: '1',
    settings: { ...defaultCategorySettings },
    items: [
      {
        id: '40',
        name: 'Toyota',
        description: 'Japanese multinational automotive manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1596583279395-3ee2b842d0fa?q=80&w=2940&auto=format&fit=crop',
        voteCount: 298
      },
      {
        id: '41',
        name: 'Volkswagen',
        description: 'German multinational automotive manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1574800012193-2c1a1f9095af?q=80&w=2940&auto=format&fit=crop',
        voteCount: 267
      },
      {
        id: '42',
        name: 'BMW',
        description: 'German multinational manufacturer of luxury vehicles and motorcycles',
        imageUrl: 'https://images.unsplash.com/photo-1556800572-1b8aedf82c5e?q=80&w=2942&auto=format&fit=crop',
        voteCount: 245
      },
      {
        id: '43',
        name: 'Mercedes-Benz',
        description: 'German global automobile manufacturer known for luxury vehicles',
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop',
        voteCount: 234
      },
      {
        id: '44',
        name: 'Honda',
        description: 'Japanese public multinational conglomerate manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2940&auto=format&fit=crop',
        voteCount: 198
      },
      {
        id: '45',
        name: 'Ford',
        description: 'American multinational automobile manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?q=80&w=2940&auto=format&fit=crop',
        voteCount: 187
      },
      {
        id: '46',
        name: 'Tesla',
        description: 'American electric vehicle and clean energy company',
        imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2946&auto=format&fit=crop',
        voteCount: 176
      },
      {
        id: '47',
        name: 'Audi',
        description: 'German automobile manufacturer of luxury vehicles',
        imageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?q=80&w=2499&auto=format&fit=crop',
        voteCount: 154
      },
      {
        id: '48',
        name: 'Hyundai',
        description: 'South Korean multinational automotive manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1629042307576-a7041aca485f?q=80&w=2874&auto=format&fit=crop',
        voteCount: 132
      },
      {
        id: '49',
        name: 'Nissan',
        description: 'Japanese multinational automobile manufacturer',
        imageUrl: 'https://images.unsplash.com/photo-1511527844068-006294cf0337?q=80&w=2940&auto=format&fit=crop',
        voteCount: 121
      }
    ]
  },
  {
    id: '9',
    name: 'Video Game Consoles',
    description: 'Popular gaming platforms and systems',
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2619&auto=format&fit=crop',
    isApproved: true,
    createdBy: '2',
    settings: { ...defaultCategorySettings },
    items: [
      {
        id: '50',
        name: 'PlayStation 5',
        description: 'Sony\'s fifth home video game console',
        imageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2327&auto=format&fit=crop',
        voteCount: 345
      },
      {
        id: '51',
        name: 'Xbox Series X',
        description: 'Microsoft\'s fourth generation of the Xbox console',
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=2832&auto=format&fit=crop',
        voteCount: 298
      },
      {
        id: '52',
        name: 'Nintendo Switch',
        description: 'Hybrid console that can be used as a home console and portable device',
        imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=2940&auto=format&fit=crop',
        voteCount: 267
      },
      {
        id: '53',
        name: 'PlayStation 4',
        description: 'Sony\'s fourth home video game console',
        imageUrl: 'https://images.unsplash.com/photo-1585857188898-270bb90d882a?q=80&w=2729&auto=format&fit=crop',
        voteCount: 187
      },
      {
        id: '54',
        name: 'Xbox One',
        description: 'Microsoft\'s third generation of the Xbox console',
        imageUrl: 'https://images.unsplash.com/photo-1553524806-1291df916f84?q=80&w=2940&auto=format&fit=crop',
        voteCount: 154
      },
      {
        id: '55',
        name: 'Steam Deck',
        description: 'Portable gaming computer designed by Valve Corporation',
        imageUrl: 'https://images.unsplash.com/photo-1652467819435-fb4d6c1a6975?q=80&w=2832&auto=format&fit=crop',
        voteCount: 132
      },
      {
        id: '56',
        name: 'Nintendo Wii',
        description: 'Home video game console released by Nintendo',
        imageUrl: 'https://images.unsplash.com/photo-1591712681840-bc07f429be84?q=80&w=2787&auto=format&fit=crop',
        voteCount: 87
      },
      {
        id: '57',
        name: 'Sega Genesis',
        description: 'Fourth-generation home video game console developed by Sega',
        imageUrl: 'https://images.unsplash.com/photo-1586136194012-35ceaddbd773?q=80&w=2940&auto=format&fit=crop',
        voteCount: 76
      },
      {
        id: '58',
        name: 'Atari 2600',
        description: 'Home video game console developed by Atari, Inc.',
        imageUrl: 'https://images.unsplash.com/photo-1586136194012-35ceaddbd773?q=80&w=2940&auto=format&fit=crop',
        voteCount: 65
      },
      {
        id: '59',
        name: 'Nintendo 64',
        description: 'Home video game console developed by Nintendo',
        imageUrl: 'https://images.unsplash.com/photo-1635779154153-6c5544780e91?q=80&w=2940&auto=format&fit=crop',
        voteCount: 54
      }
    ]
  },
  {
    id: '10',
    name: 'Laptop Brands',
    description: 'Leading laptop and notebook computer manufacturers',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop',
    isApproved: true,
    createdBy: '3',
    settings: { ...defaultCategorySettings },
    items: [
      {
        id: '60',
        name: 'Apple',
        description: 'American technology company known for MacBooks',
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2940&auto=format&fit=crop',
        voteCount: 356
      },
      {
        id: '61',
        name: 'Dell',
        description: 'American multinational computer technology company',
        imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2864&auto=format&fit=crop',
        voteCount: 287
      },
      {
        id: '62',
        name: 'HP',
        description: 'American multinational information technology company',
        imageUrl: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?q=80&w=2864&auto=format&fit=crop',
        voteCount: 245
      },
      {
        id: '63',
        name: 'Lenovo',
        description: 'Chinese multinational technology company',
        imageUrl: 'https://images.unsplash.com/photo-1610572589441-5ab7aa668c38?q=80&w=2848&auto=format&fit=crop',
        voteCount: 234
      },
      {
        id: '64',
        name: 'ASUS',
        description: 'Taiwanese multinational computer and phone hardware company',
        imageUrl: 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?q=80&w=2832&auto=format&fit=crop',
        voteCount: 198
      },
      {
        id: '65',
        name: 'Acer',
        description: 'Taiwanese multinational hardware and electronics corporation',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2786&auto=format&fit=crop',
        voteCount: 176
      },
      {
        id: '66',
        name: 'Microsoft',
        description: 'American multinational technology corporation known for Surface laptops',
        imageUrl: 'https://images.unsplash.com/photo-1624571409063-e7eb97442a41?q=80&w=2864&auto=format&fit=crop',
        voteCount: 154
      },
      {
        id: '67',
        name: 'Razer',
        description: 'Global gaming hardware manufacturing company',
        imageUrl: 'https://images.unsplash.com/photo-1535615615570-3b839f4359be?q=80&w=2874&auto=format&fit=crop',
        voteCount: 132
      },
      {
        id: '68',
        name: 'MSI',
        description: 'Taiwanese multinational information technology corporation',
        imageUrl: 'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?q=80&w=2946&auto=format&fit=crop',
        voteCount: 109
      },
      {
        id: '69',
        name: 'Samsung',
        description: 'South Korean multinational manufacturing conglomerate',
        imageUrl: 'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?q=80&w=2940&auto=format&fit=crop',
        voteCount: 87
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
    settings: { ...defaultCategorySettings },
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
  },
  {
    id: '11',
    name: 'Social Media Platforms',
    description: 'Popular social networking services and platforms',
    imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=2874&auto=format&fit=crop',
    isApproved: false,
    createdBy: '1',
    settings: { ...defaultCategorySettings },
    items: [
      {
        id: '70',
        name: 'Instagram',
        description: 'Photo and video sharing social networking service',
        imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=2874&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '71',
        name: 'Facebook',
        description: 'American online social media and social networking service',
        imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=2874&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '72',
        name: 'Twitter',
        description: 'Microblogging and social networking service',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '73',
        name: 'TikTok',
        description: 'Short-form video hosting service',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '74',
        name: 'LinkedIn',
        description: 'Business and employment-focused social media platform',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '75',
        name: 'Snapchat',
        description: 'Multimedia instant messaging app and service',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '76',
        name: 'Pinterest',
        description: 'Image sharing and social media service',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '77',
        name: 'Reddit',
        description: 'Social news aggregation, content rating, and discussion website',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '78',
        name: 'Discord',
        description: 'VoIP and instant messaging social platform',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
        voteCount: 0
      },
      {
        id: '79',
        name: 'Telegram',
        description: 'Cloud-based instant messaging service and application',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop',
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

// Update category settings
export const updateCategorySettings = (categoryId: string, settings: Partial<CategorySettings>): boolean => {
  if (!currentUser?.isAdmin) return false;
  
  const category = getCategoryById(categoryId);
  if (!category) return false;
  
  category.settings = {
    ...category.settings,
    ...settings
  };
  
  return true;
};

// Update an existing category
export const updateCategory = (categoryId: string, submission: CategorySubmission): boolean => {
  if (!currentUser) return false;
  
  // Find the category to update
  const allCategories = getAllCategories();
  const categoryIndex = allCategories.findIndex(cat => cat.id === categoryId);
  
  if (categoryIndex === -1) return false;
  
  const category = allCategories[categoryIndex];
  
  // Check if user owns this category
  if (category.createdBy !== currentUser.id) return false;
  
  // Update the category
  const updatedCategory = {
    ...category,
    name: submission.name,
    description: submission.description,
    categoryGroup: submission.categoryGroup,
    imageUrl: submission.imageUrl || category.imageUrl,
    // Reset to pending if significant changes were made
    isApproved: false,
    items: submission.items.map((item, index) => {
      // Try to preserve existing item IDs and vote counts
      const existingItem = category.items[index];
      return {
        id: existingItem?.id || `updated-${Date.now()}-${index}`,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl || existingItem?.imageUrl || 'https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=2940&auto=format&fit=crop',
        voteCount: existingItem?.voteCount || 0,
        productUrl: item.productUrl
      };
    })
  };
  
  // Replace the category in the appropriate array
  if (category.isApproved) {
    const index = categories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      categories[index] = updatedCategory;
    }
  } else {
    const index = pendingCategories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      pendingCategories[index] = updatedCategory;
    }
  }
  
  return true;
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
    settings: { ...defaultCategorySettings },
    items: submission.items.map((item, index) => ({
      id: `new-${getAllCategories().length + 1}-${index + 1}`,
      name: item.name,
      description: item.description,
      imageUrl: 'https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=2940&auto=format&fit=crop',
      voteCount: 0,
      productUrl: item.productUrl
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
