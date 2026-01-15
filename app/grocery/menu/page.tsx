'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Sparkles, SearchX, ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { dummyGrocery } from '@/prisma/data/dummydata'; 
import { useCart } from '@/app/context/cartcontext';

export default function GroceryMenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { groceryCart, addToGroceryCart } = useCart();

  // Filter logic ab sirf search par kaam karegi
  const filteredGrocery = useMemo(() => {
    return dummyGrocery.filter((item) => {
      return searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      {/* Hero Section */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-slate-950 rounded-b-[80px] shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-green-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-emerald-600/20 blur-[100px] rounded-full animate-bounce duration-[8s]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-green-500/20 mb-6">
              <Sparkles className="text-green-400 h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-300 italic">Fresh & Healthy</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              GROCERY <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">HERE.</span> <br />
              SHOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">NOW.</span>
            </h1>
            
            <p className="mt-6 text-slate-400 font-bold max-w-xl mx-auto text-lg md:text-xl tracking-tight leading-relaxed">
              Fresh groceries, daily essentials delivered fast with <span className="text-white">premium quality</span> and care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section (Switch Hata Diya) */}
      <div className="container mx-auto px-6 -mt-12 relative z-30">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-2xl p-6 rounded-[35px] shadow-xl border border-white">
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="SEARCH YOUR GROCERY NEEDS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-7 text-sm font-black italic rounded-[22px] border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-green-500 shadow-inner w-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Grocery Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-12">
          <ShoppingBag className="text-green-600" size={28} />
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">Grocery Store</h2>
        </div>

        <AnimatePresence mode="wait">
          {filteredGrocery.length === 0 ? (
            <motion.div key="no-res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-[60px] border-2 border-dashed border-slate-200">
              <SearchX size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-black italic uppercase">Nothing Found</h3>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredGrocery.map((item) => {
                const isInCart = groceryCart.some((c) => c.id === item.id);
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group bg-white rounded-[45px] p-6 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2">
                    <div className="relative h-64 w-full overflow-hidden rounded-[35px] bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      
                      {/* Veg Badge removed from here */}

                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link href={`/grocery/${item.id}`}>
                          <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                            <Eye className="h-6 w-6 text-slate-900" />
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-8 px-2">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 line-clamp-1">{item.name}</h3>
                      <p className="text-[13px] font-bold text-slate-400 mt-2 line-clamp-2 leading-relaxed italic">
                        {item.description || "Fresh & premium quality item."}
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        <span className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{item.price}</span>
                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase italic tracking-tighter border border-green-200">
                          FRESH STOCK
                        </div>
                      </div>

                      <div className="mt-8 flex items-center gap-3">
                        <Button 
                          onClick={() => { 
                            if(!isInCart) { 
                              addToGroceryCart(item); 
                              toast.success(`${item.name} added to cart!`); 
                            }
                          }}
                          className={`flex-1 h-16 rounded-[22px] font-black italic uppercase tracking-tighter transition-all ${
                            isInCart ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white hover:bg-green-600'
                          }`}
                        >
                          {isInCart ? 'ADDED' : <span className="flex items-center gap-2"><ShoppingCart size={18} /> ADD TO CART</span>}
                        </Button>

                        <Link href={`/grocery/${item.id}`}>
                          <Button variant="outline" className="h-16 w-16 rounded-[22px] border-2 border-slate-100 bg-white active:scale-90">
                            <Sparkles className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}