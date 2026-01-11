'use client';

import ProductList from '@/components/organisms/productlist';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { dummyproducts } from '@/prisma/data/dummydata';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Filter, SearchX } from 'lucide-react';

export default function ShoppingPage() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const categoryFilter = searchParams.get('category') || '';

  // Filtered products logic
  const filteredProducts = useMemo(() => {
    return dummyproducts.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);

      let matchesCategory = true;
      if (categoryFilter) {
        const normalizedProductCategory = product.category
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/&/g, 'and');
        matchesCategory = normalizedProductCategory === categoryFilter;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const currentCategoryObj = dummyproducts.find((p) => {
    const normalized = p.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    return normalized === categoryFilter;
  });

  const currentCategoryName = currentCategoryObj?.category || 'Exclusive Trends';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      {/* --- CYBER 3D HERO SECTION --- */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-slate-950 rounded-b-[80px] shadow-2xl">
        {/* Neon Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-purple-600/20 blur-[100px] rounded-full animate-bounce duration-[8s]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-blue-500/20 mb-6">
              <Sparkles className="text-blue-400 h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 italic">Premium Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              {categoryFilter ? (
                <>SHOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{currentCategoryName}</span></>
              ) : (
                <>NEW <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ARRIVALS</span></>
              )}
            </h1>
            
            <p className="mt-6 text-slate-400 font-bold max-w-xl mx-auto text-lg md:text-xl tracking-tight leading-relaxed">
              Elevate your lifestyle with our curated collection of 
              <span className="text-white"> Next-Gen </span> products.
            </p>

            <div className="mt-10 flex justify-center gap-4">
               <Button size="lg" className="bg-white text-slate-950 hover:bg-blue-50 h-16 px-10 rounded-[20px] font-black italic text-lg shadow-xl transition-all active:scale-95" asChild>
                 <Link href="/shopping/cart">CHECKOUT BAG</Link>
               </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SEARCH INFO PANEL (Glassmorphism) --- */}
      <div className="container mx-auto px-6 -mt-12 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-2xl p-6 rounded-[35px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-white flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Filter size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Results Found</p>
                <h3 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter">
                  {filteredProducts.length} Products Available
                </h3>
             </div>
          </div>

          {searchQuery && (
            <div className="hidden md:flex bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
               <p className="text-sm font-black italic text-blue-600 uppercase">
                 Searching for: &quot;{searchQuery}&quot;
               </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <section className="container mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 bg-white rounded-[60px] border-2 border-dashed border-slate-200"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX size={48} className="text-slate-300" />
              </div>
              <h3 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">Oops! Nothing Found</h3>
              <p className="text-slate-400 font-bold mt-2 mb-8 uppercase tracking-widest text-xs">Try adjusting your filters or search term</p>
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-slate-900 font-black italic" asChild>
                <Link href="/shopping">BROWSE ALL PRODUCTS</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="product-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-12">
                <ShoppingBag className="text-blue-600" size={28} />
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
                  {searchQuery || categoryFilter ? 'Filtered Selection' : 'Current Collection'}
                </h2>
              </div>
              <ProductList products={filteredProducts} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}