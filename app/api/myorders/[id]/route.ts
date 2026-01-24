import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log("Searching Order ID:", id);

    const order = await prisma.order.findUnique({
      where: { 
        id: Number(id) 
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // BigInt handling for safety
    const safeOrder = JSON.parse(JSON.stringify(order, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(safeOrder);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}