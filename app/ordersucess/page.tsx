'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id'); // Checkout se aayi ID

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-10 text-center max-w-lg w-full rounded-[40px] shadow-2xl border-none bg-white relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl" />
          
          <div className="flex justify-center mb-6">
            <motion.div 
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              className="bg-green-100 p-5 rounded-full"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </motion.div>
          </div>
          
          <h1 className="text-5xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">
            Order <span className="text-green-600">Placed!</span>
          </h1>
          
          <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px] mb-8">
            Your items are being prepared. Order ID: #{orderId || "N/A"}
          </p>

          <div className="space-y-4">
            {/* Primary Action: Track Order */}
            <Button 
              asChild 
              className="w-full bg-orange-600 hover:bg-orange-700 h-16 rounded-2xl font-black italic text-xl shadow-lg shadow-orange-100 transition-all active:scale-95 group"
            >
              <Link href={`/food/track?id=${orderId}`}>
                TRACK ORDER <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            
            {/* Secondary Action: Shop More */}
            <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl border-2 border-gray-900 font-black italic uppercase">
                    <Link href="/food/menu">Food Menu</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl border-2 border-gray-900 font-black italic uppercase">
                    <Link href="/shop">Shop More</Link>
                </Button>
            </div>
          </div>

          <p className="mt-8 text-xs font-bold text-gray-400 italic uppercase">
            Thank you for choosing E-Shop!
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

// Next.js mein SearchParams use karne ke liye Suspense boundary zaroori hai
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-black italic uppercase text-gray-400 animate-pulse">
        Processing Order...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}