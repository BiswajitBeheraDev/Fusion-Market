/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, OrderFormData } from "@/lib/order-schema";
import { AddressForm } from '@/components/checkouts/Addressform';
import { useCart } from '@/app/context/cartcontext';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Truck, CreditCard, ShoppingBasket, ShieldCheck, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function GroceryCheckoutContent({ clientSecret }: { clientSecret: string }) {
  const { groceryCart, getGroceryTotal, clearGroceryCart } = useCart();
  const subtotal = getGroceryTotal();
  const stripe = useStripe();
  const elements = useElements();

  // --- Grocery Logic ---
  const packagingFee = subtotal > 0 ? 20 : 0;
  const deliveryCharge = (subtotal > 0 && subtotal < 799) ? 50 : 0;
  const finalGrandTotal = subtotal + packagingFee + deliveryCharge;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const methods = useForm<OrderFormData>({ resolver: zodResolver(orderSchema) });

  const onOrderSubmit = async (formData: OrderFormData) => {
    setLoading(true);
    try {
      if (paymentMethod === 'online') {
        if (!stripe || !elements) throw new Error("Stripe context not found");

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: `${window.location.origin}/ordersucess` },
          redirect: 'if_required', 
        });

        if (error) throw new Error(error.message);
        if (paymentIntent && paymentIntent.status !== 'succeeded') throw new Error("Payment failed");
      }

      const dbRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: groceryCart, 
          total: finalGrandTotal, 
          formData, 
          paymentMethod, 
          orderType: 'grocery' // Type change kiya
        }),
      });

      if (!dbRes.ok) throw new Error("Database update failed");
      
      toast.success("Groceries Booked! Freshness arriving soon! 🥦");
      clearGroceryCart();
      window.location.href = "/ordersucess";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-black tracking-tighter mb-8 uppercase italic flex items-center gap-3 text-emerald-700">
          <ShoppingBasket size={40} className="text-emerald-600" /> Finalize Your Basket
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onOrderSubmit)} className="grid lg:grid-cols-5 gap-8">
            
            {/* Left: Address Section */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden">
                <CardHeader className="bg-emerald-50 border-b p-6">
                  <CardTitle className="text-xs font-black uppercase text-emerald-700 tracking-widest flex items-center gap-2">
                    <Truck size={18} /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <AddressForm />
                </CardContent>
              </Card>

              {/* Payment Selection Card */}
              <Card className="p-8 shadow-2xl border-none rounded-[40px] bg-white">
                <h3 className="text-lg font-black uppercase mb-4 italic text-slate-800">Choose Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-4">
                  <Label htmlFor="cod" className={cn("flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all hover:bg-slate-50", paymentMethod === 'cod' ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100")}>
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 uppercase italic">Cash on Delivery</span>
                        <span className="text-[10px] text-slate-400 font-bold">Pay when your veggies arrive</span>
                      </div>
                    </div>
                  </Label>

                  <Label htmlFor="online" className={cn("flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all hover:bg-slate-50", paymentMethod === 'online' ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100")}>
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value="online" id="online" />
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 uppercase italic">Pay Online Now</span>
                        <span className="text-[10px] text-slate-400 font-bold">Secure Card / UPI / Netbanking</span>
                      </div>
                    </div>
                    <CreditCard className={paymentMethod === 'online' ? "text-emerald-600" : "text-slate-300"} />
                  </Label>
                </RadioGroup>

                {paymentMethod === 'online' && clientSecret && (
                  <div className="mt-6 p-4 border-2 border-emerald-100 rounded-[28px] bg-white animate-in zoom-in-95 duration-300">
                    <PaymentElement options={{ layout: 'accordion' }} />
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Summary Section */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden bg-slate-900 text-white">
                  <CardHeader className="bg-white/5 border-b border-white/10 p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                      <Receipt size={18} /> Invoice Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-5">
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Items Subtotal</span>
                      <span className="text-white">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Packaging Fee</span>
                      <span className="text-white">₹{packagingFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-400 border-b border-white/10 pb-4">
                      <span>Delivery Fee</span>
                      <span className={deliveryCharge === 0 ? "text-emerald-400" : "text-white"}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-3xl font-black pt-2 italic">
                      <span>To Pay</span>
                      <span className="text-emerald-400 tracking-tighter">₹{finalGrandTotal}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  onClick={() => methods.handleSubmit(onOrderSubmit)()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-20 text-xl font-black rounded-[30px] shadow-2xl shadow-emerald-200 uppercase tracking-widest transition-transform active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : `Place Order ₹${finalGrandTotal}`}
                </Button>

                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Safe & Secure Freshness</span>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function GroceryCheckoutPage() {
  const { groceryCart, getGroceryTotal } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const subtotal = getGroceryTotal();
  
  // Same calculation for Stripe
  const total = subtotal + (subtotal > 0 ? 20 : 0) + (subtotal > 0 && subtotal < 799 ? 50 : 0);

  useEffect(() => {
    if (total > 0) {
      fetch('/api/stripe', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ amount: Math.round(total * 100) }) 
      })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error("Stripe Error:", err));
    }
  }, [total]);

  if (groceryCart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <ShoppingBasket size={40} />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Your basket is empty! 🥦</h2>
        <Button asChild className="bg-emerald-600 rounded-xl">
            <a href="/grocery">Go Shopping</a>
        </Button>
      </div>
    );
  }

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ 
      clientSecret, 
      appearance: { 
        theme: 'flat', 
        variables: { colorPrimary: '#059669', borderRadius: '20px' } 
      } 
    }}>
      <GroceryCheckoutContent clientSecret={clientSecret} />
    </Elements>
  ) : (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
      <span className="font-black italic uppercase text-slate-400">Checking Freshness...</span>
    </div>
  );
}