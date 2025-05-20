// Database enums
export type SubscriptionStatus = 'active' | 'paused';
export type SubscriptionType = 'Chef\'s Choice' | 'My Choice';
export type ProductItemType = 'Bundled Meal' | 'Meal Prep';
export type OrderStatus = 'ToBeDelivered' | 'AlreadyDelivered';

// Database tables
export interface Customer {
  id: number;
  name: string;
  email: string;
  subscription_status: SubscriptionStatus;
  subscription_type: SubscriptionType;
  main_subscription_label: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductItem {
  id: number;
  name: string;
  type: ProductItemType;
}

export interface ProductBundle {
  id: number;
  subscriptionmeals: number | null;
  categoryfilter: number | null;
  priceineurcents: number;
  stripeproductid: string | null;
  stripepriceid: string | null;
  fullname: string | null;
  category?: Category;
}

export interface Order {
  id: number;
  customerid: number | null;
  deliverydate: string;
  productitemid: number | null;
  quantity: number;
  status: OrderStatus;
  product?: ProductItem;
}

// Helper functions
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(cents / 100);
}