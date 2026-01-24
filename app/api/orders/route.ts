/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, formData, paymentMethod, orderType } = body;

    if (!items || !total || !formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Yahan hum addresses array ko ek single string mein convert kar rahe hain
    // taaki Prisma ke 'address' (String) column mein fit ho jaye
    const formattedAddress = formData.addresses
      .map((addr: any) => addr.addressLine)
      .join(" | "); // Example: "Address 1 | Address 2"

    const newOrder = await prisma.order.create({
      data: {
        total: Number(total),
        items: items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || ""
        })),
        status: "pending",
        paymentMethod: paymentMethod,
        orderType: orderType,
        firstName: formData.firstName,
        lastName: formData.lastName || "",
        gender: formData.gender,
        state: formData.state,
        
        address: formattedAddress, 
        
        city: formData.city,
        pinCode: formData.pinCode,
        phone: formData.phone,
      },
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save order", message: error.message }, 
      { status: 500 }
    );
  }
}