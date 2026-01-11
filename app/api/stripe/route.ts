// app/api/stripe/route.ts

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // latest stable version
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // paise me
      currency: "inr",
      payment_method_types: ["card"],
      description: "Food Order Payment",
      metadata: { order_id: Date.now().toString() },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    return Response.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}