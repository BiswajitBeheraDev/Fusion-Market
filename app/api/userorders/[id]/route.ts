import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js 15 mein params Promise hota hai, isliye humne 'await' add kiya hai
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Type ko Promise banaya
) {
  try {
    // 1. Params ko unwrap (await) karna zaroori hai Next.js 15 mein
    const resolvedParams = await params;
    const idFromURL = resolvedParams.id;

    // 2. String ID ko Number mein badlein
    const orderId = parseInt(idFromURL);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // 3. Database query
    const order = await prisma.order.findUnique({
      where: { 
        id: orderId 
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}