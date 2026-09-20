export type ContentStatus = 'VERIFIED' | 'PLANNED' | 'PLACEHOLDER' | 'INTERNAL';

export interface GovernedEntity {
  contentStatus: ContentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export type CityStatus = 'LIVE' | 'COMING_SOON' | 'INACTIVE';

export interface City extends GovernedEntity {
  id: string;
  name: string;
  slug: string;
  state: string;
  status: CityStatus;
  seoTitle: string;
  seoDescription: string;
  description: string;
  heroTagline?: string;
}

export type KitchenStatus = 'ACTIVE' | 'BUSY' | 'TEMPORARILY_CLOSED' | 'INACTIVE';

export interface Kitchen extends GovernedEntity {
  id: string;
  cityId: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  status: KitchenStatus;
  serviceablePinCodes: string[];
  capacityPerHour: number;
  operatingHoursNote: string;
}

export interface DeliveryZone extends GovernedEntity {
  id: string;
  kitchenId: string;
  name: string;
  pinCodes: string[];
  deliveryFee: number;
  minimumOrder: number;
  estimatedMinutes: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Category extends GovernedEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export type DietaryTag = 'VEG' | 'NON_VEG' | 'EGG';

export interface Product extends GovernedEntity {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  includes: string[];
  imageUrl: string;
  dietaryTag: DietaryTag;
  allergens: string[];
  isDemo: boolean;
  active: boolean;
}

export interface MenuItem {
  productId: string;
  price: number;
  isAvailable: boolean;
  isSoldOut: boolean;
  sortOrder: number;
}

export interface DailyMenu extends GovernedEntity {
  id: string;
  kitchenId: string;
  date: string; // YYYY-MM-DD
  published: boolean;
  items: MenuItem[];
  announcementNote?: string;
}

export interface CartItem {
  product: Product;
  unitPrice: number;
  quantity: number;
  notes?: string;
}

export interface Address {
  id?: string;
  name: string;
  phone: string;
  flatHouse: string;
  building?: string;
  street: string;
  locality: string;
  landmark?: string;
  pinCode: string;
  city: string;
  state: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  dietaryTag: DietaryTag;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  kitchenId: string;
  cityId: string;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  placedAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface WaitlistEntry {
  id: string;
  city: string;
  pinCode: string;
  locality?: string;
  contact: string;
  consent: boolean;
  createdAt: string;
}

export interface CorporateLead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  approxMealsDaily: string;
  notes?: string;
  createdAt: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue: any;
  newValue: any;
}

export interface FeatureFlags {
  directOrdering: boolean;
  onlinePayment: boolean;
  cashOnDelivery: boolean;
  subscriptions: boolean;
  corporateOrders: boolean;
  studentProgramme: boolean;
  liveTracking: boolean;
  whatsappOrdering: boolean;
  loyaltyProgram: boolean;
  contentAuditBadge: boolean;
}

export interface FAQItem {
  id: string;
  category: 'about' | 'ordering' | 'delivery' | 'food_quality' | 'policy';
  question: string;
  answer: string;
  isVerified: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
  createdAt: string;
}
