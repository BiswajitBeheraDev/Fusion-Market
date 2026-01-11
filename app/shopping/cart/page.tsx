'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, Truck, CreditCard, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/cartcontext';

export default function ShoppingCartPage() {
  const { shoppingCart, updateShoppingQuantity, removeFromShoppingCart, getShoppingTotal } = useCart();
  
  const subtotal = getShoppingTotal();
  
  // --- Algorithm (Same as Food Cart) ---
  const shippingCharge = subtotal > 0 ? 30 : 0; // Flat 30
  
  let deliveryCharge = 0;
  if (subtotal > 0 && subtotal < 500) {
    deliveryCharge = 40;
  } else if (subtotal >= 500 && subtotal <= 1000) {
    deliveryCharge = 35;
  } else {
    deliveryCharge = 0; // Free delivery above 1000
  }

  const grandTotal = subtotal + shippingCharge + deliveryCharge;

  if (shoppingCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center shadow-2xl rounded-[40px] border-none">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-blue-600" size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2 italic">CART EMPTY</h2>
          <p className="text-gray-500 font-medium mb-8 uppercase text-xs tracking-widest">Add products to see them here</p>
          <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 h-14 rounded-2xl font-bold">
            <Link href="/shopping">BACK TO SHOP</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-10 italic uppercase flex items-center gap-4">
           Shopping Bag <span className="text-lg bg-slate-100 px-4 py-1 rounded-full not-italic tracking-normal">({shoppingCart.length})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: Products */}
          <div className="lg:col-span-2 space-y-4">
            {shoppingCart.map((item) => (
              <Card key={item.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all border-l-4 border-l-blue-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative h-28 w-28 bg-slate-50 rounded-2xl overflow-hidden shadow-inner">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-black text-[10px] uppercase">No Product</div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{item.category || 'General'}</p>
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{item.name}</h3>
                      <p className="text-slate-500 font-black text-sm">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateShoppingQuantity(item.id, Math.max(1, Number(e.target.value)))}
                          className="w-14 h-10 border-none bg-transparent text-center font-black text-lg focus-visible:ring-0"
                        />
                      </div>
                      
                      <p className="text-xl font-black text-slate-900 min-w-[80px] text-right">
                        ₹{item.price * item.quantity}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromShoppingCart(item.id)}
                        className="hover:bg-red-50 text-red-500 rounded-full"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT: Bill Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <Card className="border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center">
                <h2 className="text-xl font-black tracking-widest uppercase flex items-center justify-center gap-2 italic">
                  <CreditCard size={20} className="not-italic" /> Checkout Bill
                </h2>
              </div>
              
              <CardContent className="p-8 space-y-5">
                {/* Product Detail List */}
                <div className="space-y-3 pb-4 border-b border-dashed border-slate-200">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Package Details</p>
                   {shoppingCart.map(item => (
                     <div key={item.id} className="flex justify-between text-xs font-bold text-slate-600">
                        <span className="truncate max-w-[150px]">{item.name} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                     </div>
                   ))}
                </div>

                {/* Calculations */}
                <div className="space-y-4">
                  <div className="flex justify-between font-black text-slate-700">
                    <span className="flex items-center gap-2 uppercase text-[11px]">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between font-bold text-slate-500 text-sm">
                    <span className="flex items-center gap-2 uppercase text-[11px]"><Truck size={14} /> Shipping</span>
                    <span>₹{shippingCharge}</span>
                  </div>

                  <div className="flex justify-between font-bold text-slate-500 text-sm">
                    <span className="flex items-center gap-2 uppercase text-[11px]"><Info size={14} /> Delivery</span>
                    <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t-4 border-slate-900">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Net Payable</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{grandTotal}</p>
                    </div>
                    {deliveryCharge === 0 && (
                      <div className="bg-green-100 text-green-700 font-black px-3 py-1 rounded-lg text-[10px] uppercase">Free Delivery</div>
                    )}
                  </div>

                  <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest text-lg transition-all active:scale-95">
                    <Link href="/shopping/checkout">PROCEED TO PAY</Link>
                  </Button>

                  <p className="text-center mt-6">
                    <Link href="/shopping" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center justify-center gap-2">
                      <ArrowLeft size={12} /> Continue Shopping
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