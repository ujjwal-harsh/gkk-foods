import {
  City,
  Kitchen,
  DeliveryZone,
  Category,
  Product,
  DailyMenu,
  Order,
  OrderStatus,
  WaitlistEntry,
  CorporateLead,
  AuditLogEntry,
  FeatureFlags,
  CartItem,
  Customer,
  Address
} from '../types';

import {
  INITIAL_CITIES,
  INITIAL_KITCHENS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DAILY_MENUS,
  INITIAL_FEATURE_FLAGS,
  INITIAL_DEMO_CUSTOMER
} from './defaultData';

const STORAGE_KEYS = {
  CITIES: 'gkk_cities_v1',
  KITCHENS: 'gkk_kitchens_v1',
  ZONES: 'gkk_zones_v1',
  CATEGORIES: 'gkk_categories_v1',
  PRODUCTS: 'gkk_products_v1',
  MENUS: 'gkk_menus_v1',
  ORDERS: 'gkk_orders_v1',
  WAITLIST: 'gkk_waitlist_v1',
  CORP_LEADS: 'gkk_corp_leads_v1',
  AUDIT_LOGS: 'gkk_audit_logs_v1',
  FLAGS: 'gkk_flags_v1',
  CART: 'gkk_cart_v1',
  SERVICEABILITY: 'gkk_serviceability_v1',
  CUSTOMER: 'gkk_customer_v1'
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse localStorage key ${key}`, e);
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save localStorage key ${key}`, e);
  }
}

class CMSStore {
  private subscribers: Set<() => void> = new Set();

  public subscribe(cb: () => void) {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => cb());
  }

  // State Getters
  public getCities(): City[] {
    return load(STORAGE_KEYS.CITIES, INITIAL_CITIES);
  }

  public getKitchens(): Kitchen[] {
    return load(STORAGE_KEYS.KITCHENS, INITIAL_KITCHENS);
  }

  public getDeliveryZones(): DeliveryZone[] {
    return load(STORAGE_KEYS.ZONES, INITIAL_DELIVERY_ZONES);
  }

  public getCategories(): Category[] {
    return load(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  public getProducts(): Product[] {
    return load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  public getDailyMenus(): DailyMenu[] {
    return load(STORAGE_KEYS.MENUS, INITIAL_DAILY_MENUS);
  }

  public getOrders(): Order[] {
    return load(STORAGE_KEYS.ORDERS, []);
  }

  public getWaitlist(): WaitlistEntry[] {
    return load(STORAGE_KEYS.WAITLIST, []);
  }

  public getCorporateLeads(): CorporateLead[] {
    return load(STORAGE_KEYS.CORP_LEADS, []);
  }

  public getAuditLogs(): AuditLogEntry[] {
    return load(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  public getFeatureFlags(): FeatureFlags {
    return load(STORAGE_KEYS.FLAGS, INITIAL_FEATURE_FLAGS);
  }

  public getCart(): CartItem[] {
    return load(STORAGE_KEYS.CART, []);
  }

  public getServiceability(): {
    cityId: string;
    kitchenId: string;
    pinCode: string;
    locality?: string;
    isServiceable: boolean;
  } | null {
    return load(STORAGE_KEYS.SERVICEABILITY, null);
  }

  public getCustomer(): Customer {
    return load(STORAGE_KEYS.CUSTOMER, INITIAL_DEMO_CUSTOMER);
  }

  // Audit Helper
  public logAudit(action: string, entity: string, entityId: string, oldValue: any, newValue: any, adminUser = 'Operations Manager') {
    const logs = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      adminUser,
      action,
      entity,
      entityId,
      oldValue,
      newValue
    };
    save(STORAGE_KEYS.AUDIT_LOGS, [entry, ...logs]);
    this.notify();
  }

  // Serviceability Routing
  public checkServiceability(citySlug: string, pinCode: string, locality?: string) {
    const cleanPin = pinCode.trim();
    const cities = this.getCities();
    const city = cities.find((c) => c.slug === citySlug || c.name.toLowerCase() === citySlug.toLowerCase());

    if (!city || city.status !== 'LIVE') {
      return {
        isServiceable: false,
        city: city || null,
        kitchen: null,
        zone: null,
        message: city?.status === 'COMING_SOON'
          ? `GKK is preparing to launch in ${city.name}. Deliveries have not begun here yet.`
          : `GKK is currently not operational in this region.`
      };
    }

    const kitchens = this.getKitchens().filter((k) => k.cityId === city.id && k.status !== 'INACTIVE');
    for (const kitchen of kitchens) {
      if (kitchen.serviceablePinCodes.includes(cleanPin)) {
        if (kitchen.status === 'TEMPORARILY_CLOSED') {
          return {
            isServiceable: false,
            city,
            kitchen,
            zone: null,
            message: `Our kitchen serving ${cleanPin} is temporarily closed for routine maintenance. Please check back later.`
          };
        }

        const zones = this.getDeliveryZones().filter((z) => z.kitchenId === kitchen.id && z.status === 'ACTIVE');
        const matchedZone = zones.find((z) => z.pinCodes.includes(cleanPin)) || zones[0];

        const session = {
          cityId: city.id,
          kitchenId: kitchen.id,
          pinCode: cleanPin,
          locality: locality || 'Delhi Zone',
          isServiceable: true
        };
        save(STORAGE_KEYS.SERVICEABILITY, session);
        this.notify();

        return {
          isServiceable: true,
          city,
          kitchen,
          zone: matchedZone,
          message: `Good news. GKK delivers to PIN code ${cleanPin} from our ${kitchen.name}.`
        };
      }
    }

    return {
      isServiceable: false,
      city,
      kitchen: null,
      zone: null,
      message: `We're not delivering to PIN code ${cleanPin} yet.`
    };
  }

  public clearServiceability() {
    save(STORAGE_KEYS.SERVICEABILITY, null);
    this.notify();
  }

  // Today's Menu Resolver
  public getTodaysMenu(kitchenId?: string): { menu: DailyMenu | null; items: Array<{ product: Product; price: number; isSoldOut: boolean }> } {
    const menus = this.getDailyMenus();
    const products = this.getProducts().filter((p) => p.active);
    const todayStr = new Date().toISOString().split('T')[0];

    const targetKitchenId = kitchenId || this.getServiceability()?.kitchenId || INITIAL_KITCHENS[0].id;
    
    // Check if menu for today exists and is published
    const menu = menus.find((m) => m.kitchenId === targetKitchenId && m.date === todayStr && m.published);

    if (!menu) {
      return { menu: null, items: [] };
    }

    const resolvedItems = menu.items
      .filter((mi) => mi.isAvailable)
      .map((mi) => {
        const prod = products.find((p) => p.id === mi.productId);
        if (!prod) return null;
        return {
          product: prod,
          price: mi.price,
          isSoldOut: mi.isSoldOut
        };
      })
      .filter(Boolean) as Array<{ product: Product; price: number; isSoldOut: boolean }>;

    return { menu, items: resolvedItems };
  }

  // Cart Management
  public addToCart(product: Product, unitPrice: number, quantity = 1, notes?: string) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((i) => i.product.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      if (notes) cart[existingIndex].notes = notes;
    } else {
      cart.push({ product, unitPrice, quantity, notes });
    }

    save(STORAGE_KEYS.CART, cart);
    this.notify();
  }

  public updateCartQuantity(productId: string, delta: number) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((i) => i.product.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += delta;
      if (cart[existingIndex].quantity <= 0) {
        cart.splice(existingIndex, 1);
      }
      save(STORAGE_KEYS.CART, cart);
      this.notify();
    }
  }

  public removeFromCart(productId: string) {
    const cart = this.getCart().filter((i) => i.product.id !== productId);
    save(STORAGE_KEYS.CART, cart);
    this.notify();
  }

  public clearCart() {
    save(STORAGE_KEYS.CART, []);
    this.notify();
  }

  // Order Placement (Factual snapshot architecture)
  public placeOrder(
    deliveryAddress: Address,
    paymentMethod: string,
    deliveryInstructions?: string
  ): Order {
    const cart = this.getCart();
    if (cart.length === 0) throw new Error('Cannot place an empty order');

    const serviceability = this.getServiceability();
    const kitchens = this.getKitchens();
    const kitchen = kitchens.find((k) => k.id === (serviceability?.kitchenId || INITIAL_KITCHENS[0].id)) || kitchens[0];
    const zones = this.getDeliveryZones().filter((z) => z.kitchenId === kitchen.id);
    const zone = zones.find((z) => z.pinCodes.includes(deliveryAddress.pinCode)) || zones[0] || { deliveryFee: 30 };

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = zone.deliveryFee;
    const taxAmount = Math.round(subtotal * 0.05); // 5% GST standard for food delivery
    const discountAmount = 0;
    const totalAmount = subtotal + deliveryFee + taxAmount - discountAmount;

    const orderNumber = `GKK-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: 'cust-demo-01',
      customerName: deliveryAddress.name,
      customerPhone: deliveryAddress.phone,
      kitchenId: kitchen.id,
      cityId: kitchen.cityId,
      status: 'PLACED',
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        subtotal: i.unitPrice * i.quantity,
        dietaryTag: i.product.dietaryTag
      })),
      subtotal,
      deliveryFee,
      taxAmount,
      discountAmount,
      totalAmount,
      deliveryAddress,
      deliveryInstructions,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'SUCCESS',
      paymentMethod,
      placedAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'PLACED',
          timestamp: now,
          note: 'Order placed by customer via direct digital checkout.'
        }
      ]
    };

    const orders = this.getOrders();
    save(STORAGE_KEYS.ORDERS, [order, ...orders]);
    this.clearCart();
    this.logAudit('ORDER_PLACED', 'Order', order.id, null, { orderNumber, totalAmount, kitchen: kitchen.name });
    this.notify();

    return order;
  }

  // Admin Order Status Advancer
  public updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string) {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx > -1) {
      const oldStatus = orders[idx].status;
      const now = new Date().toISOString();
      orders[idx].status = newStatus;
      orders[idx].updatedAt = now;
      orders[idx].statusHistory.push({
        status: newStatus,
        timestamp: now,
        note: note || `Status updated from ${oldStatus} to ${newStatus}`
      });
      save(STORAGE_KEYS.ORDERS, orders);
      this.logAudit('STATUS_CHANGE', 'Order', orderId, oldStatus, newStatus);
      this.notify();
    }
  }

  // Reorder with Verification Check
  public verifyAndReorder(order: Order): { success: boolean; addedCount: number; unavailableItems: string[] } {
    const { items: currentMenuItems } = this.getTodaysMenu(order.kitchenId);
    let addedCount = 0;
    const unavailableItems: string[] = [];

    for (const item of order.items) {
      const availableItem = currentMenuItems.find((m) => m.product.id === item.productId && !m.isSoldOut);
      if (availableItem) {
        this.addToCart(availableItem.product, availableItem.price, item.quantity);
        addedCount++;
      } else {
        unavailableItems.push(item.productName);
      }
    }

    return {
      success: addedCount > 0,
      addedCount,
      unavailableItems
    };
  }

  // Lead Collection
  public addWaitlist(city: string, pinCode: string, locality: string, contact: string, consent: boolean) {
    const entries = this.getWaitlist();
    const newEntry: WaitlistEntry = {
      id: `waitlist-${Date.now()}`,
      city,
      pinCode,
      locality,
      contact,
      consent,
      createdAt: new Date().toISOString()
    };
    save(STORAGE_KEYS.WAITLIST, [newEntry, ...entries]);
    this.logAudit('WAITLIST_SUBMISSION', 'Waitlist', newEntry.id, null, { city, pinCode });
    this.notify();
    return newEntry;
  }

  public addCorporateLead(data: Omit<CorporateLead, 'id' | 'createdAt' | 'status'>) {
    const leads = this.getCorporateLeads();
    const newLead: CorporateLead = {
      ...data,
      id: `corp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'NEW'
    };
    save(STORAGE_KEYS.CORP_LEADS, [newLead, ...leads]);
    this.logAudit('LEAD_SUBMISSION', 'CorporateLead', newLead.id, null, { company: data.companyName, contact: data.contactPerson });
    this.notify();
    return newLead;
  }

  // CMS Updates
  public updateDailyMenu(menu: DailyMenu) {
    const menus = this.getDailyMenus();
    const idx = menus.findIndex((m) => m.id === menu.id);
    if (idx > -1) {
      const old = menus[idx];
      menus[idx] = menu;
      this.logAudit('MENU_UPDATED', 'DailyMenu', menu.id, old, menu);
    } else {
      menus.push(menu);
      this.logAudit('MENU_CREATED', 'DailyMenu', menu.id, null, menu);
    }
    save(STORAGE_KEYS.MENUS, menus);
    this.notify();
  }

  public updateKitchen(kitchen: Kitchen) {
    const kitchens = this.getKitchens();
    const idx = kitchens.findIndex((k) => k.id === kitchen.id);
    if (idx > -1) {
      const old = kitchens[idx];
      kitchens[idx] = kitchen;
      save(STORAGE_KEYS.KITCHENS, kitchens);
      this.logAudit('KITCHEN_UPDATED', 'Kitchen', kitchen.id, old.status, kitchen.status);
      this.notify();
    }
  }

  public updateCity(city: City) {
    const cities = this.getCities();
    const idx = cities.findIndex((c) => c.id === city.id);
    if (idx > -1) {
      const old = cities[idx];
      cities[idx] = city;
      save(STORAGE_KEYS.CITIES, cities);
      this.logAudit('CITY_UPDATED', 'City', city.id, old.status, city.status);
      this.notify();
    }
  }

  public updateFeatureFlags(flags: FeatureFlags) {
    const old = this.getFeatureFlags();
    save(STORAGE_KEYS.FLAGS, flags);
    this.logAudit('FLAGS_UPDATED', 'FeatureFlags', 'global', old, flags);
    this.notify();
  }

  // Reset to Defaults (Development Utility)
  public resetToDefaults() {
    localStorage.clear();
    save(STORAGE_KEYS.CITIES, INITIAL_CITIES);
    save(STORAGE_KEYS.KITCHENS, INITIAL_KITCHENS);
    save(STORAGE_KEYS.ZONES, INITIAL_DELIVERY_ZONES);
    save(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    save(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    save(STORAGE_KEYS.MENUS, INITIAL_DAILY_MENUS);
    save(STORAGE_KEYS.FLAGS, INITIAL_FEATURE_FLAGS);
    save(STORAGE_KEYS.CUSTOMER, INITIAL_DEMO_CUSTOMER);
    this.notify();
  }
}

export const cmsStore = new CMSStore();
