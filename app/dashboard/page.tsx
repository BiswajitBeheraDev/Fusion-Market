/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingBag, UtensilsCrossed, Star, Loader2, Apple } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // 0: Food, 1: Shopping, 2: Grocery
  const [index, setIndex] = useState(0);

  const content = [
    {
      id: 'food',
      title: 'HOT & READY',
      label: 'ORDER FOOD',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800', // Burger
      color: 'bg-orange-600',
      icon: <UtensilsCrossed className="mr-2" />
    },
    {
      id: 'shop',
      title: 'NEW ARRIVALS',
      label: 'START SHOPPING',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', // Shoe
      color: 'bg-blue-600',
      icon: <ShoppingBag className="mr-2" />
    },
    {
      id: 'grocery',
      title: 'FRESH & ORGANIC',
      label: 'GET GROCERIES',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800', // Grocery
      color: 'bg-green-600',
      icon: <Apple className="mr-2" />
    }
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % content.length);
    }, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#7171da] flex flex-col items-center justify-center text-white font-sans">
        <Loader2 className="animate-spin mb-4" size={48} />
        <h2 className="text-2xl font-black italic tracking-tighter">SECURE ACCESS...</h2>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#7171da] overflow-x-hidden font-sans">
      <section className="relative pt-12 pb-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
          
          {/* Left Side: Text and Buttons */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-xs font-bold tracking-widest text-white uppercase">
                  Happy to see you, {session?.user?.name?.split(" ")[0]}!
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white leading-[0.9] uppercase">
                WELCOME TO <br />
                <span className="text-orange-500">MYSTORE</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 font-medium max-w-lg mx-auto lg:mx-0">
                Hi shop latest products, order delicious food, or get fresh groceries – all in one place.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button asChild size="lg" className="h-16 px-8 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-black italic shadow-xl transition-all hover:-translate-y-1 active:scale-95">
                <Link href="/shopping"> <ShoppingBag className="mr-2" /> SHOPPING</Link>
              </Button>
              <Button asChild size="lg" className="h-16 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black italic shadow-xl transition-all hover:-translate-y-1 active:scale-95">
                <Link href="/food/menu"> <UtensilsCrossed className="mr-2" /> ORDER FOOD</Link>
              </Button>
              <Button asChild size="lg" className="h-16 px-8 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-lg font-black italic shadow-xl transition-all hover:-translate-y-1 active:scale-95">
                <Link href="/grocery/menu"> <Apple className="mr-2" /> GROCERIES</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Side: Circular Animated Gallery */}
          <div className="order-1 lg:order-2 flex justify-center items-center relative py-10">
            {/* Background Glow */}
            <div className="absolute w-[300px] h-[300px] md:w-[550px] md:h-[550px] bg-white/20 rounded-full blur-[100px] -z-10" />

            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              {/* Outer White Ring */}
              <div className="absolute inset-0 rounded-full border-[10px] md:border-[20px] border-white shadow-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={content[index].id}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <img 
                      src={content[index].image} 
                      alt={content[index].id} 
                      className="w-full h-full object-cover"
                    />
                    {/* Floating Label inside Image */}
                    <div className={`absolute bottom-12 ${content[index].color} text-white px-6 py-2 rounded-full text-sm font-black italic shadow-lg`}>
                      {content[index].title}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Live Updates Badge */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
              >
                <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                   <span className="font-black italic text-xs md:text-sm tracking-tight text-gray-800">LIVE UPDATES</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* User Info Footer */}
        <div className="mt-16 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
             <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
             <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">
               Connected: {session.user?.email}
             </p>
           </div>
        </div>
      </section>
    </main>
  );
}