/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. GET: Saare orders fetch karne ke liye (Dashboard)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json([]);
  }
}

// 2. PATCH: Status badalne aur Order edit karne ke liye
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    // newStatus: Toggle se aata hai | otherData: Edit sidebar se aata hai
    const { orderId, newStatus, ...otherData } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        // Agar toggle use kiya toh status update hoga, 
        // Agar sidebar save kiya toh baki data update hoga
        ...(newStatus && { status: newStatus }), 
        ...otherData,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}