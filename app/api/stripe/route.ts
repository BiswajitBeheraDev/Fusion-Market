/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Version error fix karne ke liye humne string ko explicitly define kiya hai
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // 
  apiVersion: "2025-12-15.clover" as any, 
  typescript: true,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: "inr",
      // Isse saare payment options (UPI, Card, etc.) enable honge
      automatic_payment_methods: {
        enabled: true,
      },
      description: "Premium Marketplace Order",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" }, 
      { status: 500 }
    );
  }
}