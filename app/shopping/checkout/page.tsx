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
import { Loader2, Truck, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function ShoppingCheckoutContent({ clientSecret }: { clientSecret: string }) {
  const { shoppingCart, getShoppingTotal, clearShoppingCart } = useCart();
  const subtotal = getShoppingTotal();
  const stripe = useStripe();
  const elements = useElements();

  const shippingCharge = subtotal > 0 ? 30 : 0;
  const deliveryCharge = (subtotal > 0 && subtotal < 500) ? 40 : (subtotal >= 500 && subtotal <= 1000) ? 35 : 0;
  const finalGrandTotal = subtotal + shippingCharge + deliveryCharge;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const methods = useForm<OrderFormData>({ resolver: zodResolver(orderSchema) });

  const onShoppingSubmit = async (formData: OrderFormData) => {
    setLoading(true);
    try {
      if (paymentMethod === 'online') {
        if (!stripe || !elements) throw new Error("Stripe not loaded");

        // confirmPayment saare online methods (UPI redirect etc.) handle karega
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
        body: JSON.stringify({ items: shoppingCart, total: finalGrandTotal, formData, paymentMethod, orderType: 'shopping' }),
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

  return (
    <div className="container mx-auto p-4 md:p-6 mt-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-10 text-blue-600 font-black italic">
         <ShoppingBag size={32} /> <h1 className="text-4xl uppercase tracking-tighter">Shopping Checkout</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onShoppingSubmit)} className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden">
              <CardHeader className="bg-slate-50 border-b p-6"><CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Delivery Address</CardTitle></CardHeader>
              <CardContent className="p-8"><AddressForm /></CardContent>
            </Card>
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700 text-xs font-bold uppercase"><ShieldCheck size={20} /> Encrypted & Secure Payment</div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-6"><CardTitle className="text-xs font-black uppercase tracking-widest text-center italic">Order Summary</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-4 font-bold">
                <div className="flex justify-between text-slate-600"><span>Items Total</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-slate-400 text-sm border-b border-dashed pb-4"><span>Shipping</span><span>₹{shippingCharge + deliveryCharge}</span></div>
                <div className="pt-2 flex justify-between items-center"><span className="text-sm uppercase text-slate-400">Payable Amount</span><span className="text-4xl font-black italic tracking-tighter">₹{finalGrandTotal}</span></div>
              </CardContent>
            </Card>

            <Card className="p-8 shadow-2xl border-none rounded-[40px] space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-4">
                <Label htmlFor="cod" className={cn("flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all", paymentMethod === 'cod' ? "border-blue-600 bg-blue-50" : "border-slate-100")}>
                  <div className="flex items-center gap-3"><RadioGroupItem value="cod" id="cod" /><span className="font-black text-sm uppercase">Cash on Delivery</span></div>
                  <Truck className={paymentMethod === 'cod' ? "text-blue-600" : "text-slate-300"} />
                </Label>
                <Label htmlFor="online" className={cn("flex items-center justify-between p-5 border-2 rounded-3xl cursor-pointer transition-all", paymentMethod === 'online' ? "border-blue-600 bg-blue-50" : "border-slate-100")}>
                  <div className="flex items-center gap-3"><RadioGroupItem value="online" id="online" /><span className="font-black text-sm uppercase">Online Payment</span></div>
                  <CreditCard className={paymentMethod === 'online' ? "text-blue-600" : "text-slate-300"} />
                </Label>
              </RadioGroup>

              {paymentMethod === 'online' && clientSecret && (
                <div className="p-2 border-2 border-slate-100 rounded-[28px] bg-white animate-in fade-in zoom-in-95">
                  <PaymentElement options={{ layout: 'accordion' }} />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 h-16 text-lg font-black rounded-3xl uppercase tracking-widest">
                {loading ? <Loader2 className="animate-spin" /> : `Place Order ₹${finalGrandTotal}`}
              </Button>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function ShoppingCheckoutPage() {
  const { getShoppingTotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const subtotal = getShoppingTotal();
  const total = subtotal + (subtotal > 0 ? 30 : 0) + (subtotal > 0 && subtotal < 500 ? 40 : subtotal >= 500 && subtotal <= 1000 ? 35 : 0);

  useEffect(() => {
    if (total > 0) {
      fetch('/api/stripe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Math.round(total * 100) }) })
        .then(res => res.json()).then(data => setClientSecret(data.clientSecret));
    }
  }, [total]);

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat', variables: { colorPrimary: '#2563eb' } } }}>
      <ShoppingCheckoutContent clientSecret={clientSecret} />
    </Elements>
  ) : <div className="h-screen flex items-center justify-center font-black italic uppercase">Configuring Secure Payment...</div>;
}