// Central Server-Side Ritual Kit Product Catalog & Price Validation

export interface ServerProduct {
  id: string;
  slug: string;
  name: string;
  price: number; // Server source of truth price in INR
  isPreBook?: boolean;
}

export const SERVER_PRODUCTS_CATALOG: Record<string, ServerProduct> = {
  'ganesh-sthapana-kit': {
    id: 'ganesh-sthapana-kit',
    slug: 'ganesh-sthapana-kit',
    name: 'Ganesh Sthapana Kit',
    price: 1650,
    isPreBook: true,
  },
  'teej-pujan-kit': {
    id: 'teej-pujan-kit',
    slug: 'teej-pujan-kit',
    name: 'Hartalika Teej Kit',
    price: 950,
    isPreBook: true,
  },
  'shakti-kit': {
    id: 'shakti-kit',
    slug: 'shakti-kit',
    name: 'Shakti Kit (Sharad Navratri)',
    price: 1751,
    isPreBook: true,
  },
  'shubh-akshaya': {
    id: 'shubh-akshaya',
    slug: 'shubh-akshaya',
    name: 'Shubh Akshaya Samagri Box',
    price: 1250,
  },
  'rudrabhishek-kit': {
    id: 'rudrabhishek-kit',
    slug: 'rudrabhishek-kit',
    name: 'Rudrabhishek Kit',
    price: 1450,
  },
  'satyanarayan-kit': {
    id: 'satyanarayan-kit',
    slug: 'satyanarayan-kit',
    name: 'Satyanarayan Kit',
    price: 1951,
  },
  'sundarkand-kit': {
    id: 'sundarkand-kit',
    slug: 'sundarkand-kit',
    name: 'Sundarkand Path Kit',
    price: 1150,
  },
  'griha-pravesh-kit': {
    id: 'griha-pravesh-kit',
    slug: 'griha-pravesh-kit',
    name: 'Griha Pravesh Mahakit',
    price: 3100,
  },
  'vahan-pujan-kit': {
    id: 'vahan-pujan-kit',
    slug: 'vahan-pujan-kit',
    name: 'Vahan Pujan Kit',
    price: 651,
  },
  'shraddha-samagri-kit': {
    id: 'shraddha-samagri-kit',
    slug: 'shraddha-samagri-kit',
    name: 'Shraddha Samagri Pack',
    price: 850,
  },
  'shubh-ekadash': {
    id: 'shubh-ekadash',
    slug: 'shubh-ekadash',
    name: 'Shubh Ekadash Diya',
    price: 850,
  },
  'lakshmi-pujan-kit': {
    id: 'lakshmi-pujan-kit',
    slug: 'lakshmi-pujan-kit',
    name: 'Deepawali Lakshmi Pujan Kit',
    price: 2100,
  },
  'maha-shivaratri-kit': {
    id: 'maha-shivaratri-kit',
    slug: 'maha-shivaratri-kit',
    name: 'Maha Shivaratri Special Kit',
    price: 1850,
  },
  'janmashtami-kit': {
    id: 'janmashtami-kit',
    slug: 'janmashtami-kit',
    name: 'Shri Krishna Janmashtami Kit',
    price: 1550,
  },
  'daily-consumables-pack': {
    id: 'daily-consumables-pack',
    slug: 'daily-consumables-pack',
    name: 'Daily Puja Consumables Pack',
    price: 550,
  },
};

export function getServerProduct(sku: string): ServerProduct | null {
  if (!sku) return null;
  const normalizedSku = sku.toLowerCase().trim();
  return SERVER_PRODUCTS_CATALOG[normalizedSku] || null;
}

// Resilient in-memory store fallback for orders
export const IN_MEMORY_ORDERS_STORE = globalThis as unknown as {
  orders: Map<string, any>;
};

if (!IN_MEMORY_ORDERS_STORE.orders) {
  IN_MEMORY_ORDERS_STORE.orders = new Map<string, any>();
}

// Resilient in-memory store fallback for customer registration
export const IN_MEMORY_CUSTOMER_USERS = globalThis as unknown as {
  users: Map<string, { id: string; name: string; email: string; passwordHash: string; role: string }>;
};

if (!IN_MEMORY_CUSTOMER_USERS.users) {
  IN_MEMORY_CUSTOMER_USERS.users = new Map<string, { id: string; name: string; email: string; passwordHash: string; role: string }>();
}
