
import React, { useState } from 'react';
import { Product, Order, Review, OrderStatus, Size } from '../types';
import { ADMIN_USER } from '../constants';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const AdminView: React.FC<AdminViewProps> = ({ products, setProducts, orders, setOrders, reviews, setReviews }) => {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'ORDERS' | 'OFFERS' | 'REVIEWS'>('STOCK');
  const [showAddStock, setShowAddStock] = useState(false);

  // New product form state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '', description: '', price: 0, stock: 0, category: 'T-Shirt', sizes: [], images: []
  });

  const toggleSize = (size: Size) => {
    setNewProd(prev => {
      const sizes = prev.sizes || [];
      return { ...prev, sizes: sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size] };
    });
  };

  const addProduct = () => {
    if (!newProd.name || !newProd.price) return;
    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProd.name!,
      description: newProd.description!,
      price: Number(newProd.price),
      category: newProd.category as any,
      sizes: (newProd.sizes as Size[]) || [],
      images: Array(4).fill(0).map((_, i) => `https://picsum.photos/seed/${newProd.name}-${i}/600/800`),
      stock: Number(newProd.stock || 0)
    };
    setProducts([p, ...products]);
    setShowAddStock(false);
    setNewProd({ name: '', description: '', price: 0, stock: 0, category: 'T-Shirt', sizes: [], images: [] });
  };

  const deleteProduct = (id: string) => {
    if (confirm('Delete this item?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const applyOffer = (productId: string, offerTitle: string, discountPrice: number) => {
    setProducts(products.map(p => {
       if (p.id === productId) {
         return { ...p, offerTitle, originalPrice: p.price, price: discountPrice };
       }
       return p;
    }));
    alert('Offer applied!');
  };

  const approveReview = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <nav className="sticky top-0 z-50 py-6 glass flex items-center justify-between border-b border-gray-100 mb-8 px-4 rounded-b-2xl shadow-sm">
        <h1 className="text-2xl font-black tracking-tighter text-black flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">AD</span>
          </div>
          SD Admin Panel
        </h1>
        <div className="flex gap-4 md:gap-8 items-center overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('STOCK')} className={`text-sm font-bold whitespace-nowrap px-3 py-2 rounded-xl transition-all ${activeTab === 'STOCK' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Stock</button>
          <button onClick={() => setActiveTab('ORDERS')} className={`text-sm font-bold whitespace-nowrap px-3 py-2 rounded-xl transition-all ${activeTab === 'ORDERS' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Live Orders</button>
          <button onClick={() => setActiveTab('OFFERS')} className={`text-sm font-bold whitespace-nowrap px-3 py-2 rounded-xl transition-all ${activeTab === 'OFFERS' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Offers</button>
          <button onClick={() => setActiveTab('REVIEWS')} className={`text-sm font-bold whitespace-nowrap px-3 py-2 rounded-xl transition-all ${activeTab === 'REVIEWS' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Reviews</button>
        </div>
      </nav>

      <div className="flex items-center gap-4 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">A</div>
        <div>
          <h2 className="text-lg font-bold">{ADMIN_USER.name}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">{ADMIN_USER.email}</p>
        </div>
      </div>

      {activeTab === 'STOCK' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black italic uppercase">Inventory Management</h3>
            <button 
              onClick={() => setShowAddStock(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add New Stock
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group">
                <div className="flex gap-4">
                  <img src={p.images[0]} className="w-24 h-32 rounded-2xl object-cover shadow-md" alt="" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg leading-tight group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{p.category}</p>
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {p.sizes.map(s => <span key={s} className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded uppercase">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-bold text-gray-400">STOCK</p>
                        <p className={`text-lg font-black ${p.stock < 10 ? 'text-red-500' : 'text-black'}`}>{p.stock}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Stock Modal */}
          {showAddStock && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddStock(false)}></div>
              <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
                 <h4 className="text-3xl font-black mb-8 uppercase italic">Inventory Entry</h4>
                 <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="col-span-2">
                     <label className="text-xs font-bold uppercase text-gray-400 ml-4 mb-2 block">Product Identity</label>
                     <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="e.g. Vintage Denim Shirt"
                      value={newProd.name}
                      onChange={e => setNewProd({...newProd, name: e.target.value})}
                     />
                   </div>
                   <div className="col-span-2">
                     <textarea 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="Describe the aesthetic and fit..."
                      rows={3}
                      value={newProd.description}
                      onChange={e => setNewProd({...newProd, description: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold uppercase text-gray-400 ml-4 mb-2 block">Base Price (₹)</label>
                     <input 
                      type="number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="1299"
                      value={newProd.price || ''}
                      onChange={e => setNewProd({...newProd, price: Number(e.target.value)})}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold uppercase text-gray-400 ml-4 mb-2 block">Category</label>
                     <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none"
                      value={newProd.category}
                      onChange={e => setNewProd({...newProd, category: e.target.value as any})}
                     >
                       <option value="T-Shirt">T-Shirt</option>
                       <option value="Shirt">Shirt</option>
                     </select>
                   </div>
                   <div className="col-span-2">
                     <label className="text-xs font-bold uppercase text-gray-400 ml-4 mb-4 block">Available Sizes</label>
                     <div className="flex gap-4 flex-wrap">
                       {(['S', 'M', 'L', 'XL', 'XXL'] as Size[]).map(s => (
                         <button 
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`w-14 h-14 rounded-2xl border-2 font-black transition-all ${newProd.sizes?.includes(s) ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
                         >
                           {s}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowAddStock(false)} className="flex-1 py-5 rounded-2xl font-bold bg-gray-100 text-gray-500">Cancel</button>
                    <button onClick={addProduct} className="flex-[2] py-5 rounded-2xl font-black bg-black text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">Archive Item</button>
                 </div>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === 'ORDERS' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-2xl font-black italic uppercase mb-8">Fulfillment Dashboard</h3>
           <div className="space-y-6">
             {orders.map(order => (
               <div key={order.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                 <div className="flex flex-col lg:flex-row gap-8">
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{order.id}</span>
                            <h4 className="text-xl font-bold mt-2">{order.customerName}</h4>
                            <p className="text-sm text-gray-500">{order.email} • {order.phone}</p>
                         </div>
                         <p className="text-2xl font-black">₹{order.total}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                         <p className="text-sm text-gray-600 italic">"{order.address}"</p>
                      </div>
                      <div className="flex gap-4">
                        {order.items.map((item, i) => (
                           <div key={i} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                              <img src={item.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                              <div className="text-[10px] font-bold">
                                 <p className="truncate w-24">{item.name}</p>
                                 <p className="text-gray-400">SZ: {item.size} • QTY: {item.quantity}</p>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="lg:w-80 space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Change Logistics Status</label>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          {([OrderStatus.ORDERED, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED] as const).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Expected Delivery</label>
                        <input 
                          type="date"
                          value={order.deliveryDate}
                          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold"
                          onChange={(e) => setOrders(orders.map(o => o.id === order.id ? { ...o, deliveryDate: e.target.value } : o))}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Reason / Log (Optional)</label>
                        <textarea 
                          placeholder="Note for client or log..."
                          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm"
                          value={order.reason || ''}
                          onChange={(e) => setOrders(orders.map(o => o.id === order.id ? { ...o, reason: e.target.value } : o))}
                        />
                      </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </section>
      )}

      {activeTab === 'OFFERS' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-2xl font-black italic uppercase mb-8">Promotional Campaigns</h3>
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
              <h4 className="font-bold mb-4">Create Flash Offer</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <select id="prod-select" className="bg-gray-50 p-4 rounded-2xl outline-none border border-gray-100">
                   <option>Select Product</option>
                   {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
                 <input id="offer-title" placeholder="Offer Title (e.g. FLAT 20)" className="bg-gray-50 p-4 rounded-2xl outline-none border border-gray-100" />
                 <input id="offer-price" placeholder="New Price" type="number" className="bg-gray-50 p-4 rounded-2xl outline-none border border-gray-100" />
                 <button 
                  onClick={() => {
                    const pid = (document.getElementById('prod-select') as HTMLSelectElement).value;
                    const title = (document.getElementById('offer-title') as HTMLInputElement).value;
                    const price = (document.getElementById('offer-price') as HTMLInputElement).value;
                    if (pid && title && price) applyOffer(pid, title, Number(price));
                  }}
                  className="bg-black text-white font-bold rounded-2xl"
                 >
                   Apply Individual
                 </button>
              </div>
           </div>
           
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-2xl">
              <h4 className="text-xl font-black mb-2 uppercase italic">Global Season Surge</h4>
              <p className="text-indigo-100 text-sm mb-6">Apply a flat percentage or fixed discount to ALL inventory items in one click.</p>
              <div className="flex gap-4">
                 <input placeholder="Percentage %" className="bg-white/10 border border-white/20 p-4 rounded-2xl flex-1 outline-none text-white placeholder-indigo-200" />
                 <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors">Apply Global</button>
              </div>
           </div>
        </section>
      )}

      {activeTab === 'REVIEWS' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-2xl font-black italic uppercase mb-8">Reputation Management</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <div key={review.id} className={`bg-white rounded-3xl p-6 shadow-sm border ${review.approved ? 'border-green-100' : 'border-amber-100 animate-pulse'}`}>
                   <div className="flex gap-4 mb-4">
                      <img src={review.productImg} className="w-16 h-20 rounded-xl object-cover shadow-sm" alt="" />
                      <div>
                         <h5 className="font-bold text-sm">{review.productName}</h5>
                         <p className="text-xs text-gray-400">Review by <span className="text-indigo-500 font-bold">{review.userName}</span></p>
                         <div className="flex gap-0.5 mt-1">
                            {Array(5).fill(0).map((_, i) => (
                              <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                         </div>
                      </div>
                   </div>
                   <p className="text-sm text-gray-600 mb-4 italic leading-relaxed">"{review.comment}"</p>
                   {review.images.length > 0 && (
                     <div className="flex gap-2 mb-6">
                        {review.images.map((img, idx) => <img key={idx} src={img} className="w-16 h-16 rounded-xl object-cover border border-gray-100" alt="" />)}
                     </div>
                   )}
                   <div className="flex gap-3">
                      {!review.approved && (
                        <button 
                          onClick={() => approveReview(review.id)}
                          className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-200"
                        >
                          Approve Review
                        </button>
                      )}
                      <button 
                        onClick={() => setReviews(reviews.filter(r => r.id !== review.id))}
                        className={`py-3 rounded-2xl font-bold text-sm ${review.approved ? 'w-full bg-red-50 text-red-500' : 'flex-1 bg-gray-50 text-gray-400'}`}
                      >
                        {review.approved ? 'Delete Entry' : 'Reject'}
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}
    </div>
  );
};

export default AdminView;
