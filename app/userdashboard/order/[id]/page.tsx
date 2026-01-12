'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Package, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params?.id) return;
      try {
        const res = await fetch(`/api/userorders/${params.id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Order details nahi mil payi!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params?.id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#fafafa]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!order) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="font-black text-slate-400 uppercase tracking-widest">Data Not Found</p>
      <Button onClick={() => router.back()} variant="link">Go Back</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 pt-24">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => router.back()} variant="ghost" className="mb-8 gap-2 hover:bg-white rounded-2xl font-black italic uppercase text-xs">
          <ArrowLeft size={16} /> Back
        </Button>
        
        <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-10 pb-10 border-b border-slate-50">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">
              Order <span className="text-blue-600">#{order.id}</span>
            </h1>
            <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-black uppercase text-[10px]">
              {order.status}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <Package size={14} />
                  <p className="font-black uppercase text-[10px] tracking-widest">Items Detail</p>
                </div>
                
                {/* ✅ Yahan Logic Change kiya hai: Agar items object hai toh string banayega */}
                <div className="text-xl font-bold italic text-slate-800 uppercase bg-slate-50 p-4 rounded-2xl">
                  {typeof order.items === 'object' 
                    ? JSON.stringify(order.items) 
                    : (order.items || "No items description")}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <Calendar size={14} />
                  <p className="font-black uppercase text-[10px] tracking-widest">Order Date</p>
                </div>
                <p className="font-bold text-slate-700">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[40px] flex flex-col justify-center items-center text-center">
               <Tag size={24} className="mb-4 text-blue-400" />
               <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-2 opacity-60">Total Amount</p>
               <p className="text-6xl font-black italic tracking-tighter text-blue-400">₹{order.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}