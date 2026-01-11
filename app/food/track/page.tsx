/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Package, Truck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Status values exactly matching your database (lowercased for safety)
const STATUS_STEPS = [
  { label: 'Order Placed', key: 'pending', icon: Package },
  { label: 'Processing', key: 'processing', icon: Loader2 },
  { label: 'Shipped', key: 'shipped', icon: Truck },
  { label: 'Delivered', key: 'delivered', icon: CheckCircle2 },
];

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return toast.error("Please enter Order ID");

    setLoading(true);
    try {
      const res = await fetch(`/api/myorders/${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
        toast.success("Order Status Updated!");
      } else {
        toast.error(data.error || "Order not found");
        setOrder(null);
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Logic to find progress: current order status vs our steps
  const currentStatus = order?.status?.toLowerCase() || "";
  const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === currentStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Search Bar */}
        <Card className="p-2 border-none shadow-2xl rounded-3xl mb-10 bg-white">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <Input 
                placeholder="Enter Order ID" 
                className="h-14 pl-12 border-none bg-transparent text-lg font-bold focus-visible:ring-0"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <Button disabled={loading} className="h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-200">
              {loading ? <Loader2 className="animate-spin" /> : "TRACK NOW"}
            </Button>
          </form>
        </Card>

        {order && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* PROGRESS CARD */}
            <Card className="p-6 md:p-10 border-none shadow-xl rounded-[40px] bg-white overflow-hidden relative">
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
                <div>
                  <Badge className="bg-orange-600 text-white font-black px-4 py-1 rounded-full text-[10px] uppercase mb-3">Order #{order.id}</Badge>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">Status: {order.status}</h2>
                </div>
                <div className="md:text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Delivery</p>
                   <p className="font-black text-slate-700 italic text-lg tracking-tighter underline decoration-orange-500">3-5 WORKING DAYS</p>
                </div>
              </div>

              {/* THE LINE LOGIC */}
              <div className="relative pt-4 pb-10">
                {/* Background Dull Line */}
                <div className="absolute top-[22px] left-0 w-full h-[6px] bg-slate-100 rounded-full" />
                
                {/* Progress Glowing Line */}
                <div 
                  className={`absolute top-[22px] left-0 h-[6px] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(249,115,22,0.4)] ${currentStatus === 'delivered' ? 'bg-green-500 shadow-green-200' : 'bg-orange-500'}`}
                  style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                />

                {/* Steps Icons */}
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center group">
                        <div className={`
                          h-12 w-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-700 border-4 bg-white
                          ${isCompleted ? (currentStatus === 'delivered' ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500') : 'border-slate-100 text-slate-300'}
                          ${isActive ? 'scale-125 shadow-xl rotate-3' : 'scale-100'}
                        `}>
                          <Icon size={20} strokeWidth={3} className={isActive ? 'animate-pulse' : ''} />
                        </div>
                        <p className={`mt-4 text-[9px] md:text-[10px] font-black uppercase text-center w-16 md:w-24 tracking-tighter ${isCompleted ? 'text-slate-800' : 'text-slate-300'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-none shadow-lg rounded-[32px] bg-white border-t-4 border-orange-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Shipping To</p>
                <div className="font-black text-slate-800 space-y-1">
                  <p className="text-xl tracking-tight">{order.firstName} {order.lastName}</p>
                  <p className="text-sm text-slate-500 font-bold uppercase">{order.address}</p>
                  <p className="text-sm text-slate-500 font-bold italic">{order.city}, {order.state} - {order.pinCode}</p>
                </div>
              </Card>

              <Card className="p-8 border-none shadow-lg rounded-[32px] bg-white flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Package size={80} /></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Payment Summary</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{order.total}</p>
                    <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md mt-2 inline-block">PAID VIA ONLINE</p>
                  </div>
                  <div className="bg-slate-900 text-white p-3 rounded-2xl rotate-6 shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}