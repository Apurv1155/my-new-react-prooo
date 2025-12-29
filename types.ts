
export enum OrderStatus {
  ORDERED = 'Ordered',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'T-Shirt' | 'Shirt';
  sizes: Size[];
  images: string[];
  stock: number;
  offerTitle?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImg: string;
  userName: string;
  rating: number;
  comment: string;
  images: string[];
  approved: boolean;
  date: string;
}

export interface Order {
  id: string;
  items: { productId: string; quantity: number; size: Size; priceAtOrder: number; name: string; img: string }[];
  total: number;
  status: OrderStatus;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  deliveryDate: string;
  reason?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: Size;
}

export type ViewMode = 'CLIENT' | 'ADMIN';
