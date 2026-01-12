/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure karein ki path sahi hai (@/lib/prisma ya @/prisma)

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Data load nahi ho paya" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, newStatus, addresses, ...otherData } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(orderId) }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order nahi mila" }, { status: 404 });
    }

    if (existingOrder.status === 'delivered') {
      return NextResponse.json({ error: "Delivered order ko change nahi kar sakte" }, { status: 400 });
    }

    const flatAddress = addresses && addresses.length > 0 
      ? addresses[0].addressLine 
      : otherData.address;

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        ...(newStatus && { status: newStatus }), 
        ...otherData,                           
        address: flatAddress,                   
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}