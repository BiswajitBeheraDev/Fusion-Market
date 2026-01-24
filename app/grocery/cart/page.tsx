'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, Truck, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/cartcontext';
import { toast } from 'sonner';

export default function GroceryCartPage() {
  const { groceryCart, updateGroceryQuantity, removeFromGroceryCart, getGroceryTotal } = useCart();
  
  const subtotal = getGroceryTotal();
  
  // --- Pricing Logic (Matching Food Cart Style) ---
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center shadow-2xl rounded-[40px] border-none">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-emerald-600" size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">BASKET IS EMPTY</h2>
          <p className="text-gray-500 font-medium mb-8">Stock up your kitchen with fresh groceries!</p>
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl font-bold shadow-lg transition-all active:scale-95">
            <Link href="/grocery">BROWSE GROCERIES</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-12">
      <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-10">
            <Link href="/grocery" className="p-2 bg-white rounded-full shadow-sm hover:text-emerald-600 transition-colors">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase">Grocery Basket</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: Product List (Exactly like Food Cart) */}
          <div className="lg:col-span-2 space-y-4">
            {groceryCart.map((item) => (
              <Card key={item.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-3 sm:p-6">
                  {/* Neat Horizontal Row for Mobile & Desktop */}
                  <div className="flex items-center justify-between gap-2 sm:gap-6">
                    
                    {/* Image & Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative h-16 w-16 sm:h-24 sm:w-24 bg-gray-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                        <Image 
                          src={item.image || "/fallback-grocery.jpg"} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[11px] sm:text-lg font-black text-gray-800 uppercase tracking-tight truncate leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-emerald-600 font-black text-[10px] sm:text-lg italic mt-1 leading-none">₹{item.price}</p>
                      </div>
                    </div>

                    {/* Quantity & Price Row */}
                    <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
                      {/* Numeric Input (Matching Food Cart Style) */}
                      <div className="flex items-center bg-gray-100 rounded-lg sm:rounded-xl p-0.5 border border-gray-200 flex-shrink-0">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateGroceryQuantity(item.id, Math.max(1, Number(e.target.value)))}
                          className="w-8 h-7 sm:w-14 sm:h-10 border-none bg-transparent text-center font-black text-xs sm:text-lg focus-visible:ring-0 p-0"
                        />
                      </div>
                      
                      {/* Subtotal */}
                      <p className="text-[11px] sm:text-xl font-black text-gray-900 min-w-[45px] sm:min-w-[80px] text-right italic">
                        ₹{item.price * item.quantity}
                      </p>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            removeFromGroceryCart(item.id);
                            toast.error("Removed from basket");
                        }}
                        className="hover:bg-red-50 text-red-500 h-7 w-7 sm:h-10 sm:w-10 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT: Bill Details (Exactly like Food Cart) */}
          <div className="lg:sticky lg:top-28 h-fit">
            <Card className="border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center">
                <h2 className="text-xl font-black tracking-widest uppercase flex items-center justify-center gap-2 italic">
                  <CreditCard size={20} /> Bill Details
                </h2>
              </div>
              
              <CardContent className="p-6 sm:p-8 space-y-5">
                <div className="space-y-3 pb-4 border-b border-dashed border-gray-200">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Summary</p>
                   {groceryCart.map(item => (
                     <div key={item.id} className="flex justify-between text-[11px] sm:text-sm font-bold text-gray-600">
                       <span className="truncate pr-4">{item.name} x {item.quantity}</span>
                       <span>₹{item.price * item.quantity}</span>
                     </div>
                   ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-gray-700 text-xs sm:text-sm">
                    <span className="uppercase tracking-tighter">Basket Total</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between font-bold text-gray-500 text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1 uppercase tracking-tighter">Packaging Fee</span>
                    <span>₹{packagingFee}</span>
                  </div>

                  <div className="flex justify-between font-bold text-gray-500 text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1 uppercase tracking-tighter"><Truck size={14} /> Delivery Fee</span>
                    <span className={deliveryCharge === 0 ? "text-emerald-600" : ""}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </div>

                {/* Total & Checkout */}
                <div className="pt-6 border-t-4 border-slate-900">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">To Pay</p>
                      <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter italic leading-none">₹{grandTotal}</p>
                    </div>
                    {deliveryCharge === 0 && (
                      <Badge className="bg-emerald-100 text-emerald-700 font-black border-none px-3 py-1 uppercase tracking-tighter">SAVED ₹50</Badge>
                    )}
                  </div>

                  <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-14 sm:h-16 rounded-2xl shadow-xl uppercase tracking-widest text-base sm:text-lg transition-transform active:scale-95">
                    <Link href="/grocery/grocerycheckout">Confirm Order</Link>
                  </Button>

                  <p className="text-center mt-4">
                    <Link href="/grocery" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                      ← Add More Groceries
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`text-[10px] rounded-md px-2 py-1 ${className}`}>
      {children}
    </span>
  )
}