
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, Product, Order, Review, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS } from './constants';
import ClientView from './components/ClientView';
import AdminView from './components/AdminView';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('CLIENT');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize data from local storage
  useEffect(() => {
    const savedProducts = localStorage.getItem('sd_products');
    const savedOrders = localStorage.getItem('sd_orders');
    const savedReviews = localStorage.getItem('sd_reviews');
    
    setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);
    setOrders(savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS);
    setReviews(savedReviews ? JSON.parse(savedReviews) : INITIAL_REVIEWS);
    
    const savedCart = localStorage.getItem('sd_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Persist data
  useEffect(() => {
    if (products.length > 0) localStorage.setItem('sd_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('sd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (reviews.length > 0) localStorage.setItem('sd_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sd_cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-black selection:text-white">
      {/* View Switcher (For Demo Only) */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button 
          onClick={() => setViewMode(viewMode === 'CLIENT' ? 'ADMIN' : 'CLIENT')}
          className="bg-black text-white px-6 py-3 rounded-full shadow-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
        >
          {viewMode === 'CLIENT' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Switch to Admin
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 118 0m-8 4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Switch to Store
            </>
          )}
        </button>
      </div>

      {viewMode === 'CLIENT' ? (
        <ClientView 
          products={products} 
          orders={orders} 
          setOrders={setOrders}
          reviews={reviews}
          setReviews={setReviews}
          cart={cart}
          setCart={setCart}
        />
      ) : (
        <AdminView 
          products={products} 
          setProducts={setProducts} 
          orders={orders} 
          setOrders={setOrders}
          reviews={reviews}
          setReviews={setReviews}
        />
      )}
    </div>
  );
};

export default App;
