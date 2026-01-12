/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Build safety: Key na milne par crash nahi hoga
const stripeKey = process.env.STRIPE_SECRET_KEY || "";

const stripe = stripeKey 
  ? new Stripe(stripeKey, {
      apiVersion: "2025-12-15.clover" as any, // Aapka version
      typescript: true,
    })
  : null;

export async function POST(request: Request) {
  // Agar Stripe initialize nahi hua (Missing Key), toh build crash nahi, 500 error dega
  if (!stripe) {
    console.error("STRIPE_SECRET_KEY is missing!");
    return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
  }

  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), 
      currency: "inr",
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