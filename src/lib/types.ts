// Database enums
export type OrderStatus = 'ToBeDelivered' | 'AlreadyDelivered';
export type ProductItemType = 'Bundled Meal' | 'Meal Prep';
export type SubscriptionStatus = 'active' | 'paused';
export type SubscriptionType = 'Chef\'s choice' | 'Custom';

// Database tables
export interface Customer {
  id: number;
  name: string;
  email: string;
  locale: string | null;
}

export interface CurrentSubscription {
  id: number;
  customerId: number;
  status: SubscriptionStatus;
  type: SubscriptionType | null;
}

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  type: ProductItemType;
  price: number;
}

// Helper functions
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(cents / 100);
}