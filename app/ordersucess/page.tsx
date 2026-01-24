'use client';

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Copy, ShoppingBag, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";

function SuccessContent() {
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    // Sequential ID Logic using LocalStorage
    const lastId = localStorage.getItem('last_order_id');
    const nextId = lastId ? parseInt(lastId) + 1 : 1;
    
    // Sirf ek baar set karein taaki refresh par change na ho (Session storage better ho sakta hai depending on use-case)
    const currentSessionId = sessionStorage.getItem('current_order_id');
    
    if (currentSessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderId(currentSessionId);
    } else {
      const finalId = nextId.toString();
      setOrderId(finalId);
      localStorage.setItem('last_order_id', finalId);
      sessionStorage.setItem('current_order_id', finalId);
    }

    // Celebration effect
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ea580c', '#2563eb', '#22c55e']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ea580c', '#2563eb', '#22c55e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const copyId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success("Order ID Copied!");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card className="p-8 md:p-12 text-center rounded-[50px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border-none bg-white relative overflow-hidden">
          
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse" />
              <div className="bg-green-500 p-6 rounded-full relative shadow-xl shadow-green-100">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-slate-900 mb-4 uppercase">
            Order <span className="text-orange-600 underline decoration-blue-500">Confirmed!</span>
          </h1>

          <p className="text-slate-500 font-bold mb-8 text-sm md:text-base px-4">
            Sit back and relax! Your order has been placed successfully and our team is already on it.
          </p>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-4 mb-10 flex items-center justify-between group">
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">#{orderId}</p>
            </div>
            <button 
              onClick={copyId}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
            >
              <Copy size={18} />
            </button>
          </div>

          <div className="grid gap-4">
            <Button 
              asChild 
              className="w-full bg-slate-900 hover:bg-slate-800 h-16 rounded-2xl font-black italic text-xl group transition-all shadow-lg"
            >
              <Link href={`/food/track`}>
                TRACK ORDER <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-14 rounded-2xl border-2 border-slate-200 font-black italic uppercase gap-2">
                    <Link href="/food"><UtensilsCrossed size={18}/> Food</Link>
                </Button>
                <Button asChild variant="outline" className="h-14 rounded-2xl border-2 border-slate-200 font-black italic uppercase gap-2">
                    <Link href="/shopping"><ShoppingBag size={18}/> Shop</Link>
                </Button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Next-Gen Marketplace Experience
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black animate-pulse uppercase">Verifying Success...</div>}>
      <SuccessContent />
    </Suspense>
  );
}