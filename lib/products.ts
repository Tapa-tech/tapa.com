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

export function resolveKitForGuide(slug: string): ServerProduct {
  const clean = (slug || '').toLowerCase().trim();
  if (clean.includes('navratri') || clean.includes('shakti') || clean.includes('sharad')) {
    return SERVER_PRODUCTS_CATALOG['shakti-kit'];
  }
  if (clean.includes('teej') || clean.includes('hartalika')) {
    return SERVER_PRODUCTS_CATALOG['teej-pujan-kit'];
  }
  if (clean.includes('ganesh') || clean.includes('chaturthi')) {
    return SERVER_PRODUCTS_CATALOG['ganesh-sthapana-kit'];
  }
  if (clean.includes('sundarkand') || clean.includes('kandas')) {
    return SERVER_PRODUCTS_CATALOG['sundarkand-kit'];
  }
  if (clean.includes('ekadash') || clean.includes('vrat')) {
    return SERVER_PRODUCTS_CATALOG['shubh-ekadash'];
  }
  if (clean.includes('diwali') || clean.includes('lakshmi')) {
    return SERVER_PRODUCTS_CATALOG['lakshmi-pujan-kit'];
  }
  if (clean.includes('shivaratri') || clean.includes('shiva')) {
    return SERVER_PRODUCTS_CATALOG['maha-shivaratri-kit'];
  }
  if (clean.includes('rudra')) {
    return SERVER_PRODUCTS_CATALOG['rudrabhishek-kit'];
  }
  if (clean.includes('satyanarayan')) {
    return SERVER_PRODUCTS_CATALOG['satyanarayan-kit'];
  }
  return SERVER_PRODUCTS_CATALOG['sundarkand-kit'];
}

export interface SamagriItemInput {
  id?: string;
  itemName: string;
  quantity: string;
  unit: string;
}

export type ProductCategoryType = 'BY_FESTIVAL' | 'BY_RITUAL' | 'GRIHA_LIFE_EVENTS' | 'DAILY_PUJA_ESSENTIALS';

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: ProductCategoryType | string | null;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';

  featuredImage?: string | null;
  imagesJson?: string | null;
  samagriItemsJson?: string | null;
  significanceLabel?: string | null;
  significanceHeading?: string | null;
  significanceDescription?: string | null;
  whatsInsideLabel?: string | null;
  whatsInsideHeading?: string | null;
  whatsInsideDescription?: string | null;
  howToUseLabel?: string | null;
  howToUseHeading?: string | null;
  howToUseStepsJson?: string | null;
  supportingText?: string | null;
  dispatchInfo?: string | null;
  expectedDelivery?: string | null;
  serviceableAreas?: string | null;
  courierInfo?: string | null;
  cancellationInfo?: string | null;
  cancellationPolicyText?: string | null;
  cancellationPolicyUrl?: string | null;
  returnsInfo?: string | null;
  returnsPolicyText?: string | null;
  returnsPolicyUrl?: string | null;
  damageInTransitInfo?: string | null;
  damageClaimText?: string | null;
  damageClaimUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}



export const IN_MEMORY_PRODUCTS_STORE = globalThis as unknown as {
  products: Map<string, ProductRecord>;
};

if (!IN_MEMORY_PRODUCTS_STORE.products) {
  IN_MEMORY_PRODUCTS_STORE.products = new Map<string, ProductRecord>();

  // Pre-seed in-memory store with default catalog items
  Object.values(SERVER_PRODUCTS_CATALOG).forEach((item) => {
    const defaultImages = ['/images/placeholder-kit.jpg'];
    IN_MEMORY_PRODUCTS_STORE.products.set(item.id, {
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: `Complete authentic puja kit for ${item.name}. Included sacred samagri ingredients for auspicious rituals.`,
      category: item.name.includes('Navratri') ? 'Navratri Pujan · Season 1' : 'Ritual Kits',
      price: item.price,
      stock: 25,
      status: 'ACTIVE',
      featuredImage: defaultImages[0],
      imagesJson: JSON.stringify(defaultImages),
      samagriItemsJson: JSON.stringify([
        { id: 'sam-1', itemName: 'Ganga Jal', quantity: '25', unit: 'ml' },
        { id: 'sam-2', itemName: 'Roli Kumkum', quantity: '50', unit: 'g' },
        { id: 'sam-3', itemName: 'Akshat Rice', quantity: '100', unit: 'g' },
        { id: 'sam-4', itemName: 'Moli Thread', quantity: '1', unit: 'pcs' },
      ]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
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
