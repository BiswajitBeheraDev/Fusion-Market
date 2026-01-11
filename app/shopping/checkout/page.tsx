/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, OrderFormData } from "@/lib/order-schema";
import { AddressForm } from '@/components/checkouts/Addressform';
import { useCart } from '@/app/context/cartcontext';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Truck, CreditCard, ReceiptText, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function ShoppingCheckoutContent() {
  const { shoppingCart, getShoppingTotal, clearShoppingCart } = useCart();
  const subtotal = getShoppingTotal();

  // --- Algorithm Sync (Same as Shopping Cart) ---
  const shippingCharge = subtotal > 0 ? 30 : 0;
  let deliveryCharge = 0;
  if (subtotal > 0 && subtotal < 500) {
    deliveryCharge = 40;
  } else if (subtotal >= 500 && subtotal <= 1000) {
    deliveryCharge = 35;
  } else {
    deliveryCharge = 0; // Free above 1000
  }

  const finalGrandTotal = subtotal + shippingCharge + deliveryCharge;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const methods = useForm<OrderFormData>({ resolver: zodResolver(orderSchema) });

  const onShoppingSubmit = async (formData: OrderFormData) => {
    setLoading(true);
    try {
      if (paymentMethod === 'online') {
        if (!stripe || !elements) throw new Error("Stripe not loaded");
        const res = await fetch('/api/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(finalGrandTotal * 100) }),
        });
        const { clientSecret } = await res.json();
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement)! }
        });
        if (error) throw new Error(error.message);
      }

      const dbRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: shoppingCart, 
          total: finalGrandTotal, 
          formData, 
          paymentMethod, 
          orderType: 'shopping' 
        }),
      });

      if (!dbRes.ok) throw new Error("Database Save Failed");
      toast.success("Order Placed! 🛒");
      clearShoppingCart();
      window.location.href = "/ordersucess";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (shoppingCart.length === 0) return (
    <div className="p-20 text-center font-black uppercase italic tracking-tighter text-slate-400">
      Shopping cart is empty! 🛒
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 mt-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <ShoppingBag size={24} />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Secure Checkout</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onShoppingSubmit)} className="grid lg:grid-cols-5 gap-10">
          
          {/* LEFT: Shipping Form */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden">
              <CardHeader className="bg-slate-50 p-6 border-b">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Truck size={16} /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <AddressForm />
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700">
              <ShieldCheck size={20} />
              <p className="text-xs font-bold uppercase tracking-wider">Your personal data is encrypted and secure</p>
            </div>
          </div>

          {/* RIGHT: Bill & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detailed Pricing Card */}
            <Card className="shadow-2xl border-none rounded-[40px] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-6 text-center">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 italic">
                  <ReceiptText size={16} className="not-italic" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between font-bold text-slate-600">
                  <span className="text-sm uppercase tracking-tighter">Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-500 text-sm">
                  <span className="text-[11px] uppercase tracking-wider">Standard Shipping</span>
                  <span>₹{shippingCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-500 text-sm border-b border-dashed pb-4">
                  <span className="text-[11px] uppercase tracking-wider">Service Delivery Fee</span>
                  <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-2">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Grand Total</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{finalGrandTotal}</p>
                   </div>
                   {deliveryCharge === 0 && (
                     <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full">OFFER APPLIED</span>
                   )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="p-8 shadow-2xl border-none rounded-[40px] space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Selection</p>
              
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-4">
                <Label 
                  htmlFor="cod" 
                  className={cn(
                    "flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all active:scale-95", 
                    paymentMethod === 'cod' ? "border-blue-600 bg-blue-50/50" : "border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <span className="font-black text-sm uppercase tracking-tight">Cash on Delivery</span>
                  </div>
                  <Truck className={paymentMethod === 'cod' ? "text-blue-600" : "text-slate-300"} size={20} />
                </Label>

                <Label 
                  htmlFor="online" 
                  className={cn(
                    "flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all active:scale-95", 
                    paymentMethod === 'online' ? "border-blue-600 bg-blue-50/50" : "border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="online" id="online" />
                    <span className="font-black text-sm uppercase tracking-tight">Credit / Debit Card</span>
                  </div>
                  <CreditCard className={paymentMethod === 'online' ? "text-blue-600" : "text-slate-300"} size={20} />
                </Label>
              </RadioGroup>

              {paymentMethod === 'online' && (
                <div className="p-5 border-2 border-slate-100 rounded-[28px] bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CardElement options={{ style: { base: { fontSize: '16px', color: '#1e293b', '::placeholder': { color: '#94a3b8' } } } }} />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 h-16 text-lg font-black rounded-3xl shadow-xl shadow-blue-100 uppercase tracking-widest mt-4"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : `Complete Order (₹${finalGrandTotal})`}
              </Button>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function ShoppingCheckoutPage() {
  return <Elements stripe={stripePromise}><ShoppingCheckoutContent /></Elements>;
}