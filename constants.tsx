
import { Product, Order, Review, OrderStatus } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ghost White Linen Shirt',
    description: 'Bespoke fit linen shirt with a subtle waffle texture. Perfect for high-end coastal living and evening gallas.',
    price: 3499,
    originalPrice: 4999,
    category: 'Shirt',
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1621072156002-e2fcced0b170?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    offerTitle: 'Premium Choice'
  },
  {
    id: '2',
    name: 'Obsidian Oversized Tee',
    description: '300GSM heavy cotton oversized tee with drop shoulder silhouette. The ultimate streetwear essential.',
    price: 1599,
    originalPrice: 1999,
    category: 'T-Shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    offerTitle: 'Best Seller'
  },
  {
    id: '3',
    name: 'Sahara Sand Cuban Collar',
    description: 'Retro-inspired sand-colored shirt with a relaxed Cuban collar and breathable weave.',
    price: 2899,
    category: 'Shirt',
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15
  },
  {
    id: '4',
    name: 'Electric Cobalt Tee',
    description: 'Vibrant cobalt blue tee in a slim athletic fit. Moisture-wicking technology for the modern athlete.',
    price: 1299,
    originalPrice: 1599,
    category: 'T-Shirt',
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574180563860-563b0bb1a5ee?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    offerTitle: 'Flash Sale'
  }
];

export const CLIENT_USER = {
  name: 'Apurv Vala',
  email: 'nextge.bywala@gmail.com',
  phone: '+91123456789',
  address: 'c-15 maruti 2 singarva ahmedabad 382430'
};

export const ADMIN_USER = {
  name: 'Admin',
  email: 'admin.nextgen@gmail.com',
  phone: '+91123456789'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-77218',
    items: [
      { productId: '1', quantity: 1, size: 'L', priceAtOrder: 3499, name: 'Ghost White Linen Shirt', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800' }
    ],
    total: 3499,
    status: OrderStatus.SHIPPED,
    customerName: CLIENT_USER.name,
    email: CLIENT_USER.email,
    phone: CLIENT_USER.phone,
    address: CLIENT_USER.address,
    date: '15/12/2023',
    deliveryDate: '25/12/2023'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: '1',
    productName: 'Ghost White Linen Shirt',
    productImg: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    userName: CLIENT_USER.name,
    rating: 5,
    comment: 'The fit is absolutely divine. I wore this to a beach wedding and received so many compliments. Stream & Dream really delivered on the quality!',
    images: ['https://images.unsplash.com/photo-1621072156002-e2fcced0b170?auto=format&fit=crop&q=80&w=400'],
    approved: true,
    date: '01/12/2023'
  },
  {
    id: 'rev-2',
    productId: '2',
    productName: 'Obsidian Oversized Tee',
    productImg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    userName: 'Rajesh Kumar',
    rating: 4,
    comment: 'Great heavyweight material. Only reason for 4 stars is that it runs REALLY oversized, so maybe size down if you want a regular fit.',
    images: [],
    approved: true,
    date: '05/12/2023'
  }
];
