/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingBag, UtensilsCrossed, Star } from 'lucide-react';

export default function Dashboard() {
  const [isFood, setIsFood] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFood((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#7171da] overflow-hidden font-sans">
      <section className="relative pt-12 pb-24 md:py-32 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 items-center gap-16">
          
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border mb-6">
                <Star className="text-orange-500 fill-orange-500" size={16} />
                <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Trusted by 10k+ users</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic text-gray-900 leading-[0.95]">
                WELCOME TO <br />
                <span className="text-orange-600 drop-shadow-sm">MYSTORE</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-500 font-medium max-w-lg mx-auto lg:mx-0">
                Shop latest products or order delicious food – all in one place. Switch between your needs seamlessly.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-black italic shadow-xl shadow-orange-200 transition-all hover:-translate-y-1">
                <Link href="/shopping"> <ShoppingBag className="mr-2" /> START SHOPPING</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-2 border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white text-lg font-black italic transition-all hover:-translate-y-1">
                <Link href="/food/menu"> <UtensilsCrossed className="mr-2" /> ORDER FOOD</Link>
              </Button>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center items-center relative py-12">
            <div className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-orange-200/30 rounded-full blur-[100px] -z-10" />

            <motion.div
              className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
              animate={{ rotateY: isFood ? 0 : 180 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-gray rounded-full shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[15px] border-white flex items-center justify-center overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {isFood ? (
                    <motion.div
                      key="food-content"
                      className="flex flex-col items-center justify-center p-6"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src="/images (1).jpeg" 
                        alt="Burger" 
                        className="w-[100%] h-auto drop-shadow-2xl"
                      />
                      <span className="absolute bottom-10 bg-black text-white px-4 py-1 rounded-full text-xs font-black italic">HOT & FRESH</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="shop-content"
                      className="flex flex-col items-center justify-center p-6"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 180 }} 
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src="/shoe.jpg" 
                        alt="Shoe" 
                        className="w-[85%] h-auto drop-shadow-2xl -rotate-12"
                      />
                      <span className="absolute bottom-10 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-black italic uppercase">New Arrivals</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
              >
                <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-3">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                   <span className="font-black italic text-sm tracking-tight">LIVE UPDATES</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="container mx-auto px-6 flex justify-center items-center gap-2">
           <div className="w-2 h-2 bg-orange-600 rounded-full" />
           <p className="text-xs font-bold text-red-400 uppercase tracking-[0.2em]">Logged in successfully! Ready to serve.</p>
        </div>
      </section>

    </main>
  );
}