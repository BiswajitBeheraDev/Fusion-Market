 
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UtensilsCrossed, Sparkles, SearchX, ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

import { dummyMenu } from '@/prisma/data/dummydata'; 
import { useCart } from '@/app/context/cartcontext';

export default function FoodMenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const { foodCart, addToFoodCart } = useCart();

  const filteredMenu = useMemo(() => {
    return dummyMenu.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.veg === true;
      return matchesSearch && matchesVeg;
    });
  }, [searchQuery, isVegOnly]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-slate-950 rounded-b-[80px] shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-red-600/20 blur-[100px] rounded-full animate-bounce duration-[8s]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-orange-500/20 mb-6">
              <Sparkles className="text-orange-400 h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-300 italic">Premium Dining Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              CRAVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">IT.</span> <br />
              ORDER <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">IT.</span>
            </h1>
            
            <p className="mt-6 text-slate-400 font-bold max-w-xl mx-auto text-lg md:text-xl tracking-tight leading-relaxed">
              Experience the finest culinary delights delivered with <span className="text-white"> 3D-Speed </span> and premium taste.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-12 relative z-30">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-2xl p-6 rounded-[35px] shadow-xl border border-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="SEARCH YOUR FAVORITE FOOD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-7 text-sm font-black italic rounded-[22px] border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-orange-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-6 bg-slate-50 px-8 py-3.5 rounded-[22px] border border-slate-100 shadow-sm w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Dietary</span>
              <span className={`text-xs font-black italic uppercase ${isVegOnly ? 'text-green-600' : 'text-slate-800'}`}>
                {isVegOnly ? 'Veg Only' : 'All Foods'}
              </span>
            </div>
            <Switch checked={isVegOnly} onCheckedChange={setIsVegOnly} className="data-[state=checked]:bg-green-600" />
          </div>
        </motion.div>
      </div>

      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-12">
          <UtensilsCrossed className="text-orange-600" size={28} />
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">Our Menu</h2>
        </div>

        <AnimatePresence mode="wait">
          {filteredMenu.length === 0 ? (
            <motion.div key="no-res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-[60px] border-2 border-dashed border-slate-200">
              <SearchX size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-black italic uppercase">Nothing Found</h3>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredMenu.map((item) => {
                const isInCart = foodCart.some((c) => c.id === item.id);
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group bg-white rounded-[45px] p-6 shadow-lg border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2">
                    <div className="relative h-64 w-full overflow-hidden rounded-[35px] bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-5 left-5">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic text-slate-900 shadow-sm border border-white/50">
                          {item.veg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link href={`/food/menu/${item.id}`}>
                          <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                            <Eye className="h-6 w-6 text-slate-900" />
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-8 px-2">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 line-clamp-1">{item.name}</h3>
                      <p className="text-[13px] font-bold text-slate-400 mt-2 line-clamp-2 leading-relaxed italic">
                        {item.description || "Explore this premium culinary masterpiece."}
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        <span className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{item.price}</span>
                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase italic tracking-tighter border border-green-200">
                          SPECIAL PRICE
                        </div>
                      </div>

                      <div className="mt-8 flex items-center gap-3">
                        <Button 
                          onClick={() => { if(!isInCart) { addToFoodCart(item); toast.success(`${item.name} added!`); } }}
                          className={`flex-1 h-16 rounded-[22px] font-black italic uppercase tracking-tighter transition-all ${
                            isInCart ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white hover:bg-orange-600'
                          }`}
                        >
                          {isInCart ? 'ADDED' : <span className="flex items-center gap-2"><ShoppingCart size={18} /> ORDER NOW</span>}
                        </Button>

                        <Link href={`/food/${item.id}`}>
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