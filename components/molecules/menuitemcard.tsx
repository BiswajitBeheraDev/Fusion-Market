/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingCart, Leaf, Flame, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/app/context/cartcontext';
import { motion } from 'framer-motion';

type MenuItemCardProps = {
  id: number;
  name: string;
  price: number;
  image?: string;
  veg: boolean;
};

export default function MenuItemCard({ id, name, price, image, veg }: MenuItemCardProps) {
  const { foodCart, addToFoodCart } = useCart();
  const isAlreadyAdded = foodCart.some((item) => item.id === id);

  const handleAddToCart = () => {
    if (isAlreadyAdded) {
      toast.info('Already in cart', { 
        description: `${name} is waiting for you!`,
        icon: <Star className="text-orange-500" /> 
      });
      return;
    }

    addToFoodCart({ id, name, price, image, veg });
    toast.success('Yummy! Added to Cart 🍕');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden bg-white border-none shadow-xl hover:shadow-[0_30px_60px_rgba(234,88,12,0.15)] rounded-[35px] transition-all duration-500 flex flex-col h-full">
        
        {/* Image Container with 3D Pop */}
        <div className="relative h-64 w-full p-3">
          <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-orange-50">
            {image ? (
              <Image 
                src={image} 
                alt={name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-orange-200 font-black italic tracking-tighter">DELICIOUS</div>
            )}

            {/* Veg/Non-Veg Glass Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={cn(
                "backdrop-blur-md border-none px-3 py-1.5 rounded-full font-black italic text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg",
                veg ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
              )}>
                {veg ? <Leaf size={12} fill="currentColor" /> : <Flame size={12} fill="currentColor" />}
                {veg ? 'Pure Veg' : 'Non-Veg'}
              </Badge>
            </div>
            
            {/* Rating Overlay */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Star size={12} className="fill-orange-500 text-orange-500" />
                <span className="text-[10px] font-black text-slate-800">4.5</span>
            </div>
          </div>
        </div>

        {/* Food Info */}
        <CardContent className="px-7 pt-4 pb-2 flex-grow">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase line-clamp-1 group-hover:text-orange-600 transition-colors">
            {name}
          </h3>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] mt-1 mb-4 flex items-center gap-2">
            <span className="w-1 h-1 bg-orange-400 rounded-full"></span> Best Seller
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-orange-600 tracking-tighter italic">₹</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter italic">
                {price}
            </span>
          </div>
        </CardContent>

        {/* Action Button */}
        <CardFooter className="p-7 pt-0">
          <Button 
            variant="default" 
            className={cn(
                "w-full h-16 rounded-[22px] font-black italic uppercase tracking-tighter text-lg transition-all duration-300 shadow-lg active:scale-95 flex gap-3",
                isAlreadyAdded 
                ? "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed shadow-none" 
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
            )}
            onClick={handleAddToCart}
          >
            {isAlreadyAdded ? (
              "Added to Plate"
            ) : (
              <>
                <ShoppingCart size={22} strokeWidth={3} /> Add to Cart
              </>
            )}
          </Button>
        </CardFooter>

        {/* Bottom Glow Decoration */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-10 bg-orange-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}