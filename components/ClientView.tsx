
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Order, Review, CartItem, OrderStatus, Size } from '../types';
import { CLIENT_USER } from '../constants';

interface ClientViewProps {
  products: Product[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ClientView: React.FC<ClientViewProps> = ({ products, orders, setOrders, reviews, setReviews, cart, setCart }) => {
  const [activeTab, setActiveTab] = useState<'SHOP' | 'PROFILE' | 'CART'>('SHOP');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Shirt' | 'T-Shirt'>('ALL');

  // For Detail View
  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId), 
    [selectedProductId, products]
  );

  const [detailActiveSize, setDetailActiveSize] = useState<Size | null>(null);
  const [detailActiveImage, setDetailActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setDetailActiveImage(selectedProduct.images[0]);
      setDetailActiveSize(selectedProduct.sizes[0] || null);
    }
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  const addToCart = (productId: string, size: Size | null) => {
    if (!size) {
      alert('Please select a size first');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.size === size);
      if (existing) {
        return prev.map(item => item.productId === productId && item.size === size ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1, size }];
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
      items: cart.map(c => {
        const p = products.find(x => x.id === c.productId)!;
        return {
          productId: c.productId,
          quantity: c.quantity,
          size: c.size,
          priceAtOrder: p.price,
          name: p.name,
          img: p.images[0]
        };
      }),
      total: cartTotal,
      status: OrderStatus.ORDERED,
      customerName: CLIENT_USER.name,
      email: CLIENT_USER.email,
      phone: CLIENT_USER.phone,
      address: CLIENT_USER.address,
      date: new Date().toLocaleDateString(),
      deliveryDate: '2024-01-05'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('PROFILE');
    alert('Order placed successfully (COD)!');
  };

  const getStatusProgress = (status: OrderStatus) => {
    const stages = [OrderStatus.ORDERED, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED];
    const index = stages.indexOf(status);
    return ((index + 1) / stages.length) * 100;
  };

  const productReviews = useMemo(() => 
    reviews.filter(r => r.productId === selectedProductId && r.approved), 
    [reviews, selectedProductId]
  );

  const suggestedProducts = useMemo(() => 
    products.filter(p => p.category === selectedProduct?.category && p.id !== selectedProductId).slice(0, 4),
    [products, selectedProduct, selectedProductId]
  );

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <nav className="sticky top-0 z-[60] py-6 glass flex items-center justify-between border-b border-gray-100 mb-8 px-6 rounded-b-3xl shadow-sm transition-all duration-300">
        <div className="cursor-pointer flex items-center gap-2" onClick={() => { setActiveTab('SHOP'); setSelectedProductId(null); }}>
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-white text-sm font-black tracking-widest">SD</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase italic">
            Stream & Dream
          </h1>
        </div>
        <div className="flex gap-8 items-center">
          <button onClick={() => { setActiveTab('SHOP'); setSelectedProductId(null); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'SHOP' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Explore</button>
          <button onClick={() => { setActiveTab('PROFILE'); setSelectedProductId(null); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'PROFILE' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Profile</button>
          <button onClick={() => { setActiveTab('CART'); setSelectedProductId(null); }} className={`relative group p-2 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all`}>
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M16 11V7a4 4 0 118 0m-8 4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* Detail View Overlay */}
      {selectedProduct && activeTab === 'SHOP' && (
        <div className="fixed inset-0 z-[70] bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="max-w-7xl mx-auto px-4 py-8 relative">
            <button 
              onClick={() => setSelectedProductId(null)}
              className="fixed top-8 left-8 z-[80] bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                  <img src={detailActiveImage || ''} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-300" alt={selectedProduct.name} />
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
                  {selectedProduct.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setDetailActiveImage(img)}
                      className={`flex-shrink-0 w-24 h-32 rounded-2xl overflow-hidden border-2 transition-all ${detailActiveImage === img ? 'border-black scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-8">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 bg-indigo-50 px-4 py-1 rounded-full">{selectedProduct.category}</span>
                  <h2 className="text-5xl font-black mt-4 text-gray-900 leading-tight uppercase italic">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-4 mt-6">
                    <span className="text-4xl font-black text-black">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xl text-gray-300 line-through font-bold italic">₹{selectedProduct.originalPrice}</span>
                    )}
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-lg uppercase tracking-wider">Inclusive of all taxes</span>
                  </div>
                </div>

                <div className="mb-10">
                   <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                     Select Size
                     <span className="h-px flex-1 bg-gray-100"></span>
                   </h4>
                   <div className="flex gap-4 flex-wrap">
                      {selectedProduct.sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setDetailActiveSize(size)}
                          className={`w-16 h-16 rounded-2xl font-black transition-all flex items-center justify-center border-2 ${detailActiveSize === size ? 'bg-black border-black text-white shadow-2xl scale-110' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                          {size}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4 mb-10">
                   <button 
                    onClick={() => { addToCart(selectedProduct.id, detailActiveSize); alert('Bag updated!'); }}
                    className="w-full bg-black text-white py-6 rounded-3xl text-xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M16 11V7a4 4 0 118 0m-8 4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                     Add To Bag
                   </button>
                   <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Free Shipping & 14 Days easy returns</p>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-4">Product Details</h4>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    {selectedProduct.description} Crafted with the finest premium materials, this {selectedProduct.category.toLowerCase()} is designed for those who don't compromise on style or comfort.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <section className="mt-24">
              <h3 className="text-3xl font-black uppercase italic mb-12 flex items-center gap-4">
                Community Feedback
                <span className="h-px flex-1 bg-gray-100"></span>
              </h3>
              {productReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {productReviews.map(rev => (
                    <div key={rev.id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-indigo-500 shadow-sm border border-gray-100">
                          {rev.userName.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold">{rev.userName}</h5>
                          <div className="flex gap-0.5">
                            {Array(5).fill(0).map((_, i) => (
                              <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic leading-relaxed">"{rev.comment}"</p>
                      {rev.images.length > 0 && (
                        <div className="flex gap-2 mt-6">
                          {rev.images.map((img, i) => <img key={i} src={img} className="w-16 h-16 rounded-xl object-cover" />)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest">No verified reviews yet. Be the first!</p>
                </div>
              )}
            </section>

            {/* Suggested Section */}
            <section className="mt-24 pb-20">
               <h3 className="text-3xl font-black uppercase italic mb-12">Recommended For You</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {suggestedProducts.map(p => (
                    <div 
                      key={p.id} 
                      className="group cursor-pointer"
                      onClick={() => { setSelectedProductId(p.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 relative shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                        <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <h5 className="font-bold mt-4 text-sm truncate uppercase tracking-tighter">{p.name}</h5>
                      <p className="font-black text-lg">₹{p.price}</p>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        </div>
      )}

      {/* Main Views */}
      {activeTab === 'SHOP' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Hero / Promo */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-[3rem] p-12 mb-12 relative overflow-hidden shadow-2xl">
               <div className="relative z-10 max-w-lg">
                 <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/20">Summer 2024 Collection</div>
                 <h2 className="text-7xl font-black mb-6 uppercase italic tracking-tighter leading-none">A New Era <br/><span className="text-indigo-400">Of Style</span></h2>
                 <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">Redefining masculinity through minimalist design and premium textures. Discover the essence of Dreamwear.</p>
                 <button className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Shop The Drop</button>
               </div>
               <div className="absolute -right-20 -bottom-20 w-2/3 h-[120%] bg-cover opacity-60 mix-blend-overlay rotate-6 translate-x-12" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800')` }}></div>
               <div className="absolute top-10 right-10 w-20 h-20 bg-indigo-500/20 blur-3xl rounded-full"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  placeholder="Find your vibe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 rounded-3xl border border-gray-100 bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-xl placeholder:text-gray-300 font-bold"
                />
                <svg className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div className="flex gap-2 p-2 bg-white rounded-3xl shadow-xl border border-gray-50">
                {(['ALL', 'Shirt', 'T-Shirt'] as const).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filterCategory === cat ? 'bg-black shadow-lg text-white scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="group cursor-pointer relative"
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 relative shadow-md transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-3">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {product.offerTitle && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl animate-pulse">
                      {product.offerTitle}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                     <button 
                      className="bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs translate-y-4 group-hover:translate-y-0 transition-all delay-75 shadow-2xl"
                     >
                       Quick View
                     </button>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter text-xl italic leading-tight group-hover:text-indigo-600 transition-colors truncate">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-black text-2xl tracking-tighter">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-300 line-through font-bold italic">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {product.sizes.slice(0, 3).map(s => <span key={s} className="text-[9px] font-black bg-gray-100 px-2.5 py-1 rounded-lg uppercase text-gray-400">{s}</span>)}
                    {product.sizes.length > 3 && <span className="text-[9px] font-black bg-gray-100 px-2.5 py-1 rounded-lg uppercase text-gray-400">+{product.sizes.length - 3}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Profiles & Cart logic remain similar but with improved CSS classes for consistency */}
      {activeTab === 'PROFILE' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-50 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3">AV</div>
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">{CLIENT_USER.name}</h2>
                <p className="text-gray-400 font-bold tracking-widest text-sm mt-1">{CLIENT_USER.email} • {CLIENT_USER.phone}</p>
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Total Orders</span>
                    <span className="text-xl font-black">{orders.length}</span>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Tier</span>
                    <span className="text-xl font-black text-indigo-500 italic">Platinum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-black mb-8 uppercase italic flex items-center gap-4">
             Order History
             <span className="h-px flex-1 bg-gray-100"></span>
          </h3>

          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 transition-transform hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg">Order ID: {order.id}</span>
                    <h4 className="font-black text-xl mt-2 italic">{order.date}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-3xl tracking-tighter">₹{order.total}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-2 block">{order.status}</span>
                  </div>
                </div>

                {/* Track Order Bar */}
                <div className="mb-12 relative px-4">
                   <div className="h-2 bg-gray-100 rounded-full w-full relative">
                      <div 
                        className="h-full bg-black rounded-full transition-all duration-1000 shadow-lg shadow-black/20"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                      />
                   </div>
                   <div className="flex justify-between mt-6">
                      {([OrderStatus.ORDERED, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED] as const).map(stage => (
                        <div key={stage} className="flex flex-col items-center">
                           <div className={`w-4 h-4 rounded-full mb-3 border-4 transition-all ${getStatusProgress(order.status) >= getStatusProgress(stage) ? 'bg-black border-black scale-125' : 'bg-white border-gray-200'}`} />
                           <span className={`text-[9px] font-black uppercase tracking-widest hidden lg:block ${getStatusProgress(order.status) >= getStatusProgress(stage) ? 'text-black' : 'text-gray-300'}`}>
                             {stage}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <img src={item.img} className="w-20 h-24 rounded-2xl object-cover shadow-lg" alt="" />
                      <div>
                        <h5 className="text-sm font-black uppercase italic truncate w-40">{item.name}</h5>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                        <p className="font-black text-lg mt-1">₹{item.priceAtOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.reason && (
                  <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 text-sm text-amber-700 font-medium italic">
                    <span className="font-black uppercase tracking-widest text-[10px] block mb-1">Admin Update:</span>
                    {order.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'CART' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-12 uppercase italic tracking-tighter">My Bag</h2>
          {cart.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center shadow-2xl border border-gray-50">
               <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path d="M16 11V7a4 4 0 118 0m-8 4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               </div>
               <p className="text-gray-400 mb-10 text-xl font-medium">Your fashion voyage is just beginning...</p>
               <button onClick={() => setActiveTab('SHOP')} className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Explore Trends</button>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map((item, idx) => {
                const product = products.find(p => p.id === item.productId)!;
                return (
                  <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 flex flex-col md:flex-row gap-8 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-full translate-x-12 -translate-y-12"></div>
                    <img src={product.images[0]} className="w-full md:w-32 h-44 rounded-3xl object-cover shadow-2xl transition-transform group-hover:scale-105" alt="" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                           <h4 className="font-black text-2xl italic uppercase tracking-tighter">{product.name}</h4>
                           <button 
                             onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                             className="text-gray-200 hover:text-red-500 transition-colors"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                        </div>
                        <div className="flex gap-4 mt-3">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">Size: {item.size}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-6">
                         <span className="font-black text-3xl tracking-tighter">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-t-8 border-black">
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-gray-400 font-black uppercase tracking-[0.2em] text-xs"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                  <div className="flex justify-between text-gray-400 font-black uppercase tracking-[0.2em] text-xs"><span>Shipping</span><span className="text-green-500">Free</span></div>
                  <div className="h-px bg-gray-100 my-4"></div>
                  <div className="flex justify-between text-4xl font-black italic tracking-tighter"><span>Total</span><span>₹{cartTotal}</span></div>
                  <div className="flex gap-3 items-center text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 mt-6">
                    <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Payment: Cash on Delivery Secured
                  </div>
                </div>
                <button 
                  onClick={placeOrder}
                  className="w-full bg-black text-white py-7 rounded-[2rem] text-xl font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  Confirm (COD)
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ClientView;
