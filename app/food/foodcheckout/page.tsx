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
import { Loader2, Truck, CreditCard, ShoppingBag, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function FoodCheckoutContent({ clientSecret }: { clientSecret: string }) {
  const { foodCart, getFoodTotal, clearFoodCart } = useCart();
  const subtotal = getFoodTotal();
  const stripe = useStripe();
  const elements = useElements();

  const shippingCharge = subtotal > 0 ? 30 : 0;
  const deliveryCharge = (subtotal > 0 && subtotal < 500) ? 40 : (subtotal >= 500 && subtotal <= 1000) ? 35 : 0;
  const finalGrandTotal = subtotal + shippingCharge + deliveryCharge;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const methods = useForm<OrderFormData>({ resolver: zodResolver(orderSchema) });

  const onOrderSubmit = async (formData: OrderFormData) => {
    setLoading(true);
    try {
      if (paymentMethod === 'online') {
        if (!stripe || !elements) throw new Error("Stripe not loaded");

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
        body: JSON.stringify({ items: foodCart, total: finalGrandTotal, formData, paymentMethod, orderType: 'food' }),
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

  return (
    <div className="container mx-auto p-4 md:p-6 mt-10 max-w-6xl">
      <h1 className="text-4xl font-black tracking-tighter mb-8 uppercase italic flex items-center gap-3">
        <ShoppingBag className="text-orange-600" /> Food Checkout
      </h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onOrderSubmit)} className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-none rounded-[32px] overflow-hidden">
              <CardHeader className="bg-slate-50 border-b p-6"><CardTitle className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Truck size={18} /> Delivery Details</CardTitle></CardHeader>
              <CardContent className="pt-8"><AddressForm /></CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-none rounded-[32px] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-6"><CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 italic"><ReceiptText size={18} /> Order Summary</CardTitle></CardHeader>
              <CardContent className="pt-6 space-y-4 font-bold">
                <div className="flex justify-between text-slate-600"><span>Bill Total</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-slate-500 text-sm border-b pb-4"><span>Delivery Charges</span><span>₹{shippingCharge + deliveryCharge}</span></div>
                <div className="flex justify-between text-2xl font-black text-slate-900 pt-2 italic"><span>Total Amount</span><span className="text-orange-600">₹{finalGrandTotal}</span></div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-xl border-none rounded-[32px] space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-3">
                <Label htmlFor="cod" className={cn("flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", paymentMethod === 'cod' ? "border-orange-500 bg-orange-50" : "border-slate-100")}>
                  <div className="flex items-center gap-3"><RadioGroupItem value="cod" id="cod" /><span className="font-bold">Cash on Delivery</span></div>
                  <Truck className={paymentMethod === 'cod' ? "text-orange-500" : "text-slate-300"} />
                </Label>
                <Label htmlFor="online" className={cn("flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", paymentMethod === 'online' ? "border-orange-500 bg-orange-50" : "border-slate-100")}>
                  <div className="flex items-center gap-3"><RadioGroupItem value="online" id="online" /><span className="font-bold">Online (UPI/GPay/Card)</span></div>
                  <CreditCard className={paymentMethod === 'online' ? "text-orange-500" : "text-slate-300"} />
                </Label>
              </RadioGroup>

              {paymentMethod === 'online' && clientSecret && (
                <div className="p-3 border-2 border-slate-100 rounded-2xl bg-white animate-in fade-in slide-in-from-top-2">
                  <PaymentElement options={{ layout: 'accordion' }} />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 h-16 text-lg font-black rounded-2xl shadow-lg uppercase">
                {loading ? <Loader2 className="animate-spin" /> : `Confirm Order ₹${finalGrandTotal}`}
              </Button>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function FoodCheckoutPage() {
  const { foodCart, getFoodTotal } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const subtotal = getFoodTotal();
  const total = subtotal + (subtotal > 0 ? 30 : 0) + (subtotal > 0 && subtotal < 500 ? 40 : subtotal >= 500 && subtotal <= 1000 ? 35 : 0);

  useEffect(() => {
    if (total > 0) {
      fetch('/api/stripe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Math.round(total * 100) }) })
        .then(res => res.json()).then(data => setClientSecret(data.clientSecret));
    }
  }, [total]);

  if (foodCart.length === 0) return <div className="p-20 text-center font-black italic uppercase">Cart is empty! 🍕</div>;

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat', variables: { colorPrimary: '#ea580c' } } }}>
      <FoodCheckoutContent clientSecret={clientSecret} />
    </Elements>
  ) : <div className="h-screen flex items-center justify-center font-black italic uppercase">Preparing Menu...</div>;
}