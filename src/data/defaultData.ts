import {
  City,
  Kitchen,
  DeliveryZone,
  Category,
  Product,
  DailyMenu,
  FeatureFlags,
  FAQItem,
  Customer
} from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'city-delhi',
    name: 'Delhi',
    slug: 'delhi',
    state: 'Delhi NCR',
    status: 'LIVE',
    seoTitle: 'GKK Foods Delhi | Everyday Meals That Feel Like Home',
    seoDescription: 'Order everyday Indian home-inspired meals from GKK Foods in Delhi. Fresh dal, sabzi, roti, and rice combos prepared in our standardized cloud kitchen.',
    description: 'Our founding hub serving students, working professionals, and residents across central and south Delhi.',
    heroTagline: 'Everyday meals, delivered fresh across Delhi.',
    contentStatus: 'VERIFIED',
    verifiedBy: 'GKK Corporate',
    verifiedAt: '2022'
  },
  {
    id: 'city-indore',
    name: 'Indore',
    slug: 'indore',
    state: 'Madhya Pradesh',
    status: 'COMING_SOON',
    seoTitle: 'GKK Foods Indore | Coming Soon',
    seoDescription: 'GKK Foods is preparing to launch in Indore. Join our expansion waitlist to get notified when deliveries begin.',
    description: 'Planned expansion hub for Madhya Pradesh.',
    heroTagline: 'GKK is coming soon to Indore.',
    contentStatus: 'PLANNED'
  },
  {
    id: 'city-hyderabad',
    name: 'Hyderabad',
    slug: 'hyderabad',
    state: 'Telangana',
    status: 'COMING_SOON',
    seoTitle: 'GKK Foods Hyderabad | Coming Soon',
    seoDescription: 'GKK Foods is planning kitchen hubs in Hyderabad. Register your area on our waitlist.',
    description: 'Planned tech corridor expansion hub.',
    heroTagline: 'GKK is coming soon to Hyderabad.',
    contentStatus: 'PLANNED'
  },
  {
    id: 'city-pune',
    name: 'Pune',
    slug: 'pune',
    state: 'Maharashtra',
    status: 'COMING_SOON',
    seoTitle: 'GKK Foods Pune | Coming Soon',
    seoDescription: 'GKK Foods is planning kitchen hubs in Pune for students and young professionals.',
    description: 'Planned student and IT hub expansion.',
    heroTagline: 'GKK is coming soon to Pune.',
    contentStatus: 'PLANNED'
  }
];

export const INITIAL_KITCHENS: Kitchen[] = [
  {
    id: 'kitchen-delhi-01',
    cityId: 'city-delhi',
    name: 'GKK Delhi Central Hub',
    code: 'DEL-CENTRAL-01',
    address: 'Cloud Kitchen Facility, South Extension / Hauz Khas Area [EXACT ADDRESS TO BE PROVIDED BY GKK]',
    latitude: 28.5672,
    longitude: 77.2100,
    status: 'ACTIVE',
    serviceablePinCodes: [
      '110001', '110002', '110003', '110016', '110017', 
      '110019', '110020', '110024', '110048', '110049'
    ],
    capacityPerHour: 60,
    operatingHoursNote: 'Lunch & Dinner delivery windows [HOURS TO BE CONFIRMED BY GKK]',
    contentStatus: 'VERIFIED',
    verifiedBy: 'GKK Operations'
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-delhi-core',
    kitchenId: 'kitchen-delhi-01',
    name: 'Central & South Delhi Core Zone',
    pinCodes: ['110016', '110017', '110024', '110048', '110049'],
    deliveryFee: 30,
    minimumOrder: 120,
    estimatedMinutes: '35–45 min',
    status: 'ACTIVE',
    contentStatus: 'VERIFIED'
  },
  {
    id: 'zone-delhi-extended',
    kitchenId: 'kitchen-delhi-01',
    name: 'Delhi Central Extended Zone',
    pinCodes: ['110001', '110002', '110003', '110019', '110020'],
    deliveryFee: 45,
    minimumOrder: 150,
    estimatedMinutes: '45–60 min',
    status: 'ACTIVE',
    contentStatus: 'VERIFIED'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-combos',
    name: 'Daily Meal Combos',
    slug: 'meal-combos',
    description: 'Balanced, familiar lunch and dinner combinations with dal, seasonal sabzi, hot rotis, and steamed rice.',
    sortOrder: 1,
    contentStatus: 'VERIFIED'
  },
  {
    id: 'cat-staples',
    name: 'Everyday Staples',
    slug: 'everyday-staples',
    description: 'Comforting home-style bowls: khichdi, dal-chawal, rajma-chawal, and light everyday plates.',
    sortOrder: 2,
    contentStatus: 'VERIFIED'
  },
  {
    id: 'cat-regional',
    name: 'Regional Favourites',
    slug: 'regional-favourites',
    description: 'Rotating traditional recipes that bring the comfort of hometown cooking.',
    sortOrder: 3,
    contentStatus: 'VERIFIED'
  },
  {
    id: 'cat-addons',
    name: 'Sides & Add-ons',
    slug: 'sides-and-addons',
    description: 'Freshly tossed salads, roasted papad, extra rotis, curd, and homestyle sides.',
    sortOrder: 4,
    contentStatus: 'VERIFIED'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-combo-standard',
    name: 'GKK Everyday Meal Combo',
    slug: 'everyday-meal-combo',
    categoryId: 'cat-combos',
    description: 'A complete, balanced meal with homestyle yellow dal tadka, fresh seasonal dry sabzi, 4 whole wheat phulkas, and steamed jeera rice.',
    includes: ['Yellow Dal Tadka', 'Seasonal Sukhi Sabzi', '4 Whole Wheat Phulkas', 'Steamed Rice', 'Homestyle Salad'],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Wheat (Gluten)'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT: Representative everyday combo until GKK uploads final menu sheet]'
  },
  {
    id: 'prod-combo-special',
    name: 'GKK Special Ghar Ka Thali',
    slug: 'special-ghar-ka-thali',
    categoryId: 'cat-combos',
    description: 'Hearty homestyle meal featuring 2 sabzis (paneer gravy + dry seasonal vegetable), dal fry, 4 phulkas, fragrant pulao, curd, and roasted papad.',
    includes: ['Paneer Gravy', 'Seasonal Dry Sabzi', 'Dal Fry', '4 Whole Wheat Phulkas', 'Pulao Rice', 'Fresh Curd', 'Papad'],
    imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Wheat (Gluten)', 'Dairy'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  },
  {
    id: 'prod-staple-dal-chawal',
    name: 'Homestyle Dal Chawal Box',
    slug: 'homestyle-dal-chawal-box',
    categoryId: 'cat-staples',
    description: 'Simple, comforting yellow arhar dal with ghee tadka served over fluffy steamed basmati rice with pickle and papad.',
    includes: ['Arhar Dal Tadka with Ghee', 'Fluffy Steamed Rice', 'Aam ka Achaar', 'Roasted Papad'],
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Dairy (Ghee)'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  },
  {
    id: 'prod-staple-rajma-chawal',
    name: 'Delhi Rajma Chawal',
    slug: 'delhi-rajma-chawal',
    categoryId: 'cat-staples',
    description: 'Slow-simmered Punjabi style red kidney beans in a spiced tomato-onion gravy over long grain steamed rice with onion salad.',
    includes: ['Homestyle Rajma Gravy', 'Steamed Basmati Rice', 'Lachha Onion Salad', 'Mint Chutney'],
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: [],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  },
  {
    id: 'prod-staple-khichdi',
    name: 'Moong Dal Comfort Khichdi',
    slug: 'moong-dal-comfort-khichdi',
    categoryId: 'cat-staples',
    description: 'Light, restorative moong dal and rice khichdi prepared with mild cumin tempering, served with fresh curd and roasted papad.',
    includes: ['Yellow Moong Khichdi', 'Fresh Curd (Dahi)', 'Roasted Papad', 'Lemon Pickle'],
    imageUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Dairy (Curd/Ghee)'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  },
  {
    id: 'prod-regional-kadhi',
    name: 'Homestyle Kadhi Pakora with Rice',
    slug: 'kadhi-pakora-rice',
    categoryId: 'cat-regional',
    description: 'Tangy spiced besan-yogurt kadhi with crispy onion-methi fritters, served over steamed rice with dry potato roast.',
    includes: ['Kadhi with Crispy Pakoras', 'Steamed Rice', 'Jeera Aloo Side', 'Papad'],
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Dairy (Yogurt)'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  },
  {
    id: 'prod-addon-rotis',
    name: 'Tawa Phulkas (Set of 4)',
    slug: 'tawa-phulkas-set-of-4',
    categoryId: 'cat-addons',
    description: 'Hot, soft whole wheat rotis freshly prepared on a traditional tawa with light ghee.',
    includes: ['4 Whole Wheat Phulkas with Ghee'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Wheat (Gluten)', 'Dairy (Ghee)'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  },
  {
    id: 'prod-addon-curd',
    name: 'Fresh Set Curd Bowl',
    slug: 'fresh-set-curd-bowl',
    categoryId: 'cat-addons',
    description: 'Pure, chilled homemade-style set curd (dahi) in an eco-friendly cup.',
    includes: ['150g Fresh Dahi'],
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&auto=format&fit=crop&q=80',
    dietaryTag: 'VEG',
    allergens: ['Dairy'],
    isDemo: true,
    active: true,
    contentStatus: 'PLACEHOLDER',
    notes: '[DEMO PRODUCT]'
  }
];

// Today's date ISO string for initial menu publication
const TODAY = new Date().toISOString().split('T')[0];

export const INITIAL_DAILY_MENUS: DailyMenu[] = [
  {
    id: `menu-delhi-${TODAY}`,
    kitchenId: 'kitchen-delhi-01',
    date: TODAY,
    published: true,
    announcementNote: 'Today’s lunch & dinner menu freshly prepared in our Delhi cloud kitchen facility.',
    items: [
      { productId: 'prod-combo-standard', price: 149, isAvailable: true, isSoldOut: false, sortOrder: 1 },
      { productId: 'prod-combo-special', price: 199, isAvailable: true, isSoldOut: false, sortOrder: 2 },
      { productId: 'prod-staple-rajma-chawal', price: 129, isAvailable: true, isSoldOut: false, sortOrder: 3 },
      { productId: 'prod-staple-dal-chawal', price: 119, isAvailable: true, isSoldOut: false, sortOrder: 4 },
      { productId: 'prod-staple-khichdi', price: 119, isAvailable: true, isSoldOut: false, sortOrder: 5 },
      { productId: 'prod-regional-kadhi', price: 139, isAvailable: true, isSoldOut: false, sortOrder: 6 },
      { productId: 'prod-addon-rotis', price: 40, isAvailable: true, isSoldOut: false, sortOrder: 7 },
      { productId: 'prod-addon-curd', price: 30, isAvailable: true, isSoldOut: false, sortOrder: 8 }
    ],
    contentStatus: 'VERIFIED'
  }
];

export const INITIAL_FEATURE_FLAGS: FeatureFlags = {
  directOrdering: true,
  onlinePayment: true,
  cashOnDelivery: true,
  subscriptions: false, // Flagged false: GKK has not launched subscriptions yet
  corporateOrders: true, // Lead capture enabled ("Talk to GKK")
  studentProgramme: false, // Flagged false until GKK introduces formal student discount
  liveTracking: false, // Flagged false: Factual status updates only, no fake moving maps
  whatsappOrdering: false, // Flagged false until GKK provisions official WhatsApp Business API
  loyaltyProgram: false,
  contentAuditBadge: true
};

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'about',
    question: 'What is GKK Foods?',
    answer: 'GKK Foods (founded in 2022) is a branded cloud-kitchen food delivery business. We prepare everyday Indian meals—like dal, sabzi, roti, and rice—inspired by the comfort of home food, but produced with the standardized consistency, hygiene, and reliability of an organized food business.',
    isVerified: true
  },
  {
    id: 'faq-2',
    category: 'about',
    question: 'Is GKK food cooked in a private home?',
    answer: 'No. GKK meals are not cooked in private residences. We operate standardized, hygienic commercial cloud kitchens designed exclusively for food preparation and delivery. Our recipes are inspired by home eating, but prepared in professional culinary environments.',
    isVerified: true
  },
  {
    id: 'faq-3',
    category: 'delivery',
    question: 'Where does GKK currently deliver?',
    answer: 'GKK currently operates in Delhi. Enter your PIN code on our homepage or city page to verify whether your specific locality is within our active delivery zones.',
    isVerified: true
  },
  {
    id: 'faq-4',
    category: 'ordering',
    question: 'How do I place an order?',
    answer: 'Enter your PIN code to confirm serviceability, view today\'s freshly published menu, add your desired meal combinations to the cart, enter your delivery address, and proceed to checkout.',
    isVerified: true
  },
  {
    id: 'faq-5',
    category: 'ordering',
    question: 'Can I reorder my previous meals?',
    answer: 'Yes. In your Customer Account, you can select any past order and click "Reorder". The system automatically verifies that the items exist on today\'s active menu and are in stock before adding them to your cart.',
    isVerified: true
  },
  {
    id: 'faq-6',
    category: 'food_quality',
    question: 'Does the menu change every day?',
    answer: 'Yes. Our menu is designed around daily-changing meal combinations so that regular diners enjoy fresh variety just like home eating.',
    isVerified: true
  },
  {
    id: 'faq-7',
    category: 'policy',
    question: 'What is your cancellation and refund policy?',
    answer: '[CANCELLATION & REFUND POLICY TO BE OFFICIALLY PROVIDED BY GKK. ORDERS CURRENTLY CANCELLED BEFORE PREPARATION STAGE WILL BE REFUNDED TO THE ORIGINAL PAYMENT SOURCE WITHIN APPLICABLE BANK TIMELINES.]',
    isVerified: false
  },
  {
    id: 'faq-8',
    category: 'policy',
    question: 'Do you offer monthly tiffin subscriptions or meal plans?',
    answer: 'GKK currently operates on a direct everyday ordering model. Subscriptions and recurring meal plans are in planning and will be launched once operational infrastructure is confirmed.',
    isVerified: true
  }
];

export const INITIAL_DEMO_CUSTOMER: Customer = {
  id: 'cust-demo-01',
  name: 'Ananya Sharma',
  phone: '9876543210',
  email: 'ananya.sharma@example.com',
  createdAt: '2024-01-15T10:30:00Z',
  addresses: [
    {
      id: 'addr-1',
      name: 'Ananya Sharma',
      phone: '9876543210',
      flatHouse: 'Flat 304, Green Heights',
      building: 'Block C',
      street: 'Outer Ring Road',
      locality: 'Hauz Khas',
      landmark: 'Near Metro Station Gate 2',
      pinCode: '110016',
      city: 'Delhi',
      state: 'Delhi',
      deliveryInstructions: 'Leave with guard if unreachable',
      isDefault: true
    }
  ]
};
