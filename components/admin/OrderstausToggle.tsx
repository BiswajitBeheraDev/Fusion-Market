/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface OrderStatusProps {
  orderId: string;
  currentStatus: string;
  onUpdate: () => void; // List refresh karne ke liye
}

export function OrderStatusToggle({ orderId, currentStatus, onUpdate }: OrderStatusProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Status updated to ${newStatus}`);
      onUpdate(); // Dashboard ki list refresh karega
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="h-4 w-4 animate-spin text-orange-600" />}
      <Select
        defaultValue={currentStatus}
        onValueChange={handleStatusChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[130px] h-8 text-xs capitalize">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending ⏳</SelectItem>
          <SelectItem value="processing">Processing ⚙️</SelectItem>
          <SelectItem value="shipped">Shipped 🚚</SelectItem>
          <SelectItem value="delivered">Delivered ✅</SelectItem>
          <SelectItem value="cancelled">Cancelled ❌</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}