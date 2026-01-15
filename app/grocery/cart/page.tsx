'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/cartcontext';
import { toast } from 'sonner';

export default function GroceryCartPage() {
  const { groceryCart, updateGroceryQuantity, removeFromGroceryCart, getGroceryTotal } = useCart();
  
  const subtotal = getGroceryTotal();
  const packagingFee = subtotal > 0 ? 20 : 0; 
  
  let deliveryCharge = 0;
  if (subtotal > 0 && subtotal < 799) {
    deliveryCharge = 50;
  } else {
    deliveryCharge = 0; 
  }

  const grandTotal = subtotal + packagingFee + deliveryCharge;

  if (groceryCart.length === 0) {
    return (
      <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center shadow-2xl rounded-[40px] border-none bg-white">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-emerald-600" size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900 uppercase italic">Your Basket is Empty</h2>
          <p className="text-slate-500 font-medium mb-8">Stock up your kitchen with fresh groceries!</p>
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl font-black italic tracking-widest">
            <Link href="/grocery">SHOP GROCERIES</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-10">
            <Link href="/grocery" className="p-2 bg-white rounded-full shadow-sm hover:text-emerald-600">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Grocery Basket</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: Product List */}
          <div className="lg:col-span-2 space-y-4">
            {groceryCart.map((item) => (
              <Card key={item.id} className="border-none shadow-sm rounded-[30px] overflow-hidden bg-white hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative h-24 w-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image 
                        src={item.image || "/fallback-grocery.jpg"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                        />              
                     </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight line-clamp-1">{item.name}</h3>
                      <p className="text-emerald-600 font-black text-xl">₹{item.price}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Freshly Sourced</p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Quantity Controls - Fixed the Error here */}
                      <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl hover:bg-white hover:text-emerald-600"
                          onClick={() => updateGroceryQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        
                        <span className="w-8 text-center font-black text-md">
                          {item.quantity}
                        </span>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-xl hover:bg-white hover:text-emerald-600"
                          onClick={() => updateGroceryQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      <p className="text-xl font-black text-slate-900 min-w-[90px] text-right">
                        ₹{item.price * item.quantity}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            removeFromGroceryCart(item.id);
                            toast.error("Removed from basket");
                        }}
                        className="hover:bg-red-50 text-red-400"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <Card className="border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
              <div className="bg-emerald-600 p-6 text-white text-center">
                <h2 className="text-xl font-black tracking-widest uppercase flex items-center justify-center gap-2 italic">
                   Order Summary
                </h2>
              </div>
              
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Basket Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between font-bold text-slate-500 text-sm">
                    <span className="flex items-center gap-2 uppercase text-[11px] font-black italic">Packaging Fee</span>
                    <span>₹{packagingFee}</span>
                  </div>

                  <div className="flex justify-between font-bold text-slate-500 text-sm">
                    <span className="flex items-center gap-2 uppercase text-[11px] font-black italic"><Truck size={14} /> Delivery Charge</span>
                    <span className={deliveryCharge === 0 ? "text-emerald-600" : ""}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </div>

                {subtotal < 799 && (
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <ShieldCheck className="text-blue-500 flex-shrink-0" size={18} />
                        <p className="text-[10px] font-bold text-blue-700 leading-tight">
                            Add ₹{799 - subtotal} more to unlock <span className="underline">FREE DELIVERY</span>
                        </p>
                    </div>
                )}

                <div className="pt-6 border-t-2 border-slate-100">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Amount to pay</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{grandTotal}</p>
                    </div>
                    {deliveryCharge === 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase italic">Saved Delivery</span>
                    )}
                  </div>

                  <Button asChild size="lg" className="w-full bg-slate-950 hover:bg-emerald-600 text-white font-black h-16 rounded-[22px] shadow-xl uppercase tracking-widest text-lg transition-all active:scale-95">
                    <Link href="/grocery/grocerycheckout">Checkout Now</Link>
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 py-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">100% Safe & Secure Payments</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}