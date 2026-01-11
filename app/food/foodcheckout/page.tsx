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
import { Loader2, Truck, CreditCard, ShoppingBag, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function FoodCheckoutContent() {
  const { foodCart, getFoodTotal, clearFoodCart } = useCart();
  const subtotal = getFoodTotal();

  // --- Same Algorithm as Cart Page ---
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

  const onOrderSubmit = async (formData: OrderFormData) => {
    setLoading(true);
    try {
      if (paymentMethod === 'online') {
        if (!stripe || !elements) throw new Error("Stripe not loaded");
        const res = await fetch('/api/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(finalGrandTotal * 100) }), // Multiplied by 100 for cents/paise
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
          items: foodCart, 
          total: finalGrandTotal, // Sending Final Amount to DB
          formData, 
          paymentMethod, 
          orderType: 'food' 
        }),
      });

      if (!dbRes.ok) throw new Error("DB Save Failed");
      toast.success("Order Placed Successfully! 🍕");
      clearFoodCart();
      window.location.href = "/ordersucess";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (foodCart.length === 0) return <div className="p-20 text-center text-xl font-black italic uppercase tracking-tighter">Your cart is empty! 🍕</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 mt-10 max-w-6xl">
      <h1 className="text-4xl font-black tracking-tighter mb-8 uppercase italic flex items-center gap-3">
        <ShoppingBag className="text-orange-600" /> Checkout
      </h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onOrderSubmit)} className="grid lg:grid-cols-5 gap-8">
          
          {/* LEFT: Address Form */}
          <Card className="lg:col-span-3 shadow-xl border-none rounded-[32px] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="flex items-center gap-2 font-black uppercase text-sm tracking-widest text-slate-500">
                <Truck size={18} /> Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <AddressForm />
            </CardContent>
          </Card>

          {/* RIGHT: Summary & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detailed Bill Receipt */}
            <Card className="shadow-xl border-none rounded-[32px] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <ReceiptText size={18} /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Shipping Charge</span>
                  <span>₹{shippingCharge}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm border-b pb-4">
                  <span>Delivery Fee</span>
                  <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-black text-slate-900 pt-2 tracking-tighter italic">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{finalGrandTotal}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selector */}
            <Card className="p-6 space-y-4 shadow-xl border-none rounded-[32px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Payment Method</p>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-3">
                <Label 
                  htmlFor="cod" 
                  className={cn(
                    "flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", 
                    paymentMethod === 'cod' ? "border-orange-500 bg-orange-50" : "border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <span className="font-bold">Cash on Delivery</span>
                  </div>
                  <Truck className={paymentMethod === 'cod' ? "text-orange-500" : "text-slate-300"} />
                </Label>

                <Label 
                  htmlFor="online" 
                  className={cn(
                    "flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", 
                    paymentMethod === 'online' ? "border-orange-500 bg-orange-50" : "border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="online" id="online" />
                    <span className="font-bold">Online Payment (Stripe)</span>
                  </div>
                  <CreditCard className={paymentMethod === 'online' ? "text-orange-500" : "text-slate-300"} />
                </Label>
              </RadioGroup>

              {paymentMethod === 'online' && (
                <div className="p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 mt-4 animate-in fade-in zoom-in-95">
                  <CardElement options={{ style: { base: { fontSize: '16px', fontWeight: '500' } } }} />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-orange-600 hover:bg-orange-700 h-16 text-lg font-black rounded-2xl shadow-lg shadow-orange-100 mt-4 uppercase tracking-tighter"
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

export default function FoodCheckoutPage() {
  return <Elements stripe={stripePromise}><FoodCheckoutContent /></Elements>;
}