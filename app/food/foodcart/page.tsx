'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, Truck, CreditCard, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/cartcontext';

export default function FoodCartPage() {
  const { foodCart, updateFoodQuantity, removeFromFoodCart, getFoodTotal } = useCart();
  
  const subtotal = getFoodTotal();
  
  // --- Naya Pricing Algorithm ---
  const shippingCharge = subtotal > 0 ? 30 : 0; // Flat 30
  
  // Delivery Charge Algorithm
  let deliveryCharge = 0;
  if (subtotal > 0 && subtotal < 500) {
    deliveryCharge = 40;
  } else if (subtotal >= 500 && subtotal <= 1000) {
    deliveryCharge = 35;
  } else {
    deliveryCharge = 0; // Free delivery above 1000
  }

  const grandTotal = subtotal + shippingCharge + deliveryCharge;

  if (foodCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center shadow-2xl rounded-[40px] border-none">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-orange-600" size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">CART IS EMPTY</h2>
          <p className="text-gray-500 font-medium mb-8">Add some delicious food to start your order!</p>
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl font-bold">
            <Link href="/food/menu">BROWSE MENU</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-10 italic uppercase">Your Food Cart</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: Product List */}
          <div className="lg:col-span-2 space-y-4">
            {foodCart.map((item) => (
              <Card key={item.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative h-28 w-28 bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 font-bold text-xs uppercase">No Dish</div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className={`w-3 h-3 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{item.name}</h3>
                      </div>
                      <p className="text-orange-600 font-black text-lg">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-gray-100 rounded-xl p-1 border">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateFoodQuantity(item.id, Number(e.target.value))}
                          className="w-14 h-10 border-none bg-transparent text-center font-black text-lg focus-visible:ring-0"
                        />
                      </div>
                      
                      <p className="text-xl font-black text-gray-900 min-w-[80px] text-right">
                        ₹{item.price * item.quantity}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromFoodCart(item.id)}
                        className="hover:bg-red-50 text-red-500"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT: Price Breakdown */}
          <div className="lg:sticky lg:top-28 h-fit">
            <Card className="border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center">
                <h2 className="text-xl font-black tracking-widest uppercase flex items-center justify-center gap-2">
                  <CreditCard size={20} /> Bill Details
                </h2>
              </div>
              
              <CardContent className="p-8 space-y-5">
                {/* Item Summary */}
                <div className="space-y-3 pb-4 border-b border-dashed">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Summary</p>
                   {foodCart.map(item => (
                     <div key={item.id} className="flex justify-between text-sm font-bold text-gray-600">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                     </div>
                   ))}
                </div>

                {/* Charges */}
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-gray-700">
                    <span className="flex items-center gap-2">Item Total</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between font-bold text-gray-500 text-sm">
                    <span className="flex items-center gap-2 uppercase text-[11px]"><Truck size={14} /> Shipping Charge</span>
                    <span>₹{shippingCharge}</span>
                  </div>

                  <div className="flex justify-between font-bold text-gray-500 text-sm">
                    <span className="flex items-center gap-2 uppercase text-[11px]"><Info size={14} /> Delivery Fee</span>
                    <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t-4 border-slate-900">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">To Pay</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{grandTotal}</p>
                    </div>
                    {deliveryCharge === 0 && (
                      <Badge className="bg-green-100 text-green-700 font-black border-none px-3 py-1">SAVED ₹35</Badge>
                    )}
                  </div>

                  <Button asChild size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-orange-100 uppercase tracking-widest text-lg transition-transform active:scale-95">
                    <Link href="/food/foodcheckout">Confirm Order</Link>
                  </Button>

                  <p className="text-center mt-4">
                    <Link href="/food/menu" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors">
                      ← Add More Items
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

// Chota Badge component agar imported nahi hai
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`text-[10px] rounded-md px-2 py-1 ${className}`}>
      {children}
    </span>
  )
}