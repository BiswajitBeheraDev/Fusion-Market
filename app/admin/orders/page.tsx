/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Fragment, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw, Maximize2, X, Save, ShieldCheck, User } from "lucide-react";
import { OrderStatusToggle } from '@/components/admin/OrderstausToggle';
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form"; 
import { AddressForm } from '@/components/checkouts/Addressform'; 

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      phone: '',
      city: '',
      state: '',
      pinCode: '',
      addresses: [{ addressLine: '' }]
    }
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Sync Form with Selected Order
  useEffect(() => {
    if (selectedOrder) {
      methods.reset({
        ...selectedOrder,
        addresses: [{ addressLine: selectedOrder.address || "" }]
      });
    }
  }, [selectedOrder, methods]);

  const onFormSubmit = async (data: any) => {
    setSaving(true);
    try {
      // Backend ko orderId aur baaki data bhej rahe hain
      // Backend logic (prisma update) humne already update kar li hai
      const res = await fetch(`/api/admin/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          ...data,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Order Updated Successfully!");
        setIsEditMode(false);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
       <Loader2 className="animate-spin text-orange-600" size={48} />
    </div>
  );

  return (
    <div className="p-2 md:p-8 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
            ADMIN <ShieldCheck className="text-orange-600" size={36} />
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Order Control Panel</p>
        </div>
        <Button onClick={fetchOrders} size="sm" variant="outline" className="bg-white rounded-xl border-2 hover:bg-orange-50 font-bold shadow-sm">
          <RefreshCcw size={16} className="mr-2" /> REFRESH
        </Button>
      </div>

      {/* TABLE - Address & Total wapas add kar diye hain */}
      <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100/50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase text-center w-[100px]">Order ID</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Customer</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Address</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center">Total</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase pr-6">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id} className="hover:bg-orange-50/30 transition-colors border-b border-gray-100">
                  <TableCell className="font-mono text-xs font-bold text-blue-600 italic text-center">#{order.id}</TableCell>
                  <TableCell className="font-black text-gray-800 text-sm leading-tight">{order.firstName} {order.lastName}</TableCell>
                  <TableCell>
                    <div className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[200px]">
                      {order.city}, {order.state}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-sm text-gray-900 text-center">₹{order.total}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OrderStatusToggle orderId={order.id} currentStatus={order.status} onUpdate={fetchOrders} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setIsEditMode(false); }} className="hover:bg-orange-100 text-orange-600 rounded-xl">
                      <Maximize2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* SIDEBAR */}
      {selectedOrder && (
        <Fragment>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setSelectedOrder(null)} />
          
          <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-3 bg-white p-2 px-4 rounded-2xl border-2 shadow-sm">
                <Switch 
                    checked={isEditMode} 
                    onCheckedChange={setIsEditMode} 
                />
                <Label className="text-[10px] font-black uppercase text-orange-600">Enable Edit</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full bg-gray-100 hover:rotate-90 transition-all">
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex items-center gap-4 border-b-2 border-orange-100 pb-6 mb-8">
                <div className="h-16 w-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-100">
                  <User size={32} strokeWidth={3} />
                </div>
                <div>
                   <h3 className="font-black text-2xl text-gray-800 tracking-tighter leading-none">{selectedOrder.firstName} {selectedOrder.lastName}</h3>
                   <Badge className="mt-2 bg-blue-100 text-blue-700 font-bold text-[9px] uppercase tracking-tighter">ID: #{selectedOrder.id}</Badge>
                </div>
              </div>

              <FormProvider {...methods}>
                <form id="admin-order-form" onSubmit={methods.handleSubmit(onFormSubmit)}>
                  {isEditMode ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <AddressForm />
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">First Name</Label>
                          <div className="p-4 bg-gray-50/80 rounded-[20px] border-2 border-gray-100 font-bold text-gray-800 shadow-sm">{selectedOrder.firstName}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Last Name</Label>
                          <div className="p-4 bg-gray-50/80 rounded-[20px] border-2 border-gray-100 font-bold text-gray-800 shadow-sm">{selectedOrder.lastName}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic">Address *</Label>
                        <div className="p-5 bg-orange-50/30 rounded-[24px] border-2 border-orange-100/50 text-sm font-bold leading-relaxed text-gray-900 shadow-sm italic">
                          {selectedOrder.address}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">City</Label>
                          <div className="p-4 bg-gray-50/80 rounded-[20px] border-2 border-gray-100 font-bold text-gray-800 shadow-sm">{selectedOrder.city}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">State</Label>
                          <div className="p-4 bg-gray-50/80 rounded-[20px] border-2 border-gray-100 font-bold text-gray-800 shadow-sm">{selectedOrder.state}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Phone Number</Label>
                        <div className="p-4 bg-gray-50/80 rounded-[20px] border-2 border-gray-100 font-bold text-blue-600 shadow-sm">{selectedOrder.phone}</div>
                      </div>
                    </div>
                  )}
                </form>
              </FormProvider>
            </div>

            {/* Footer */}
            <div className="p-8 border-t bg-white rounded-t-[40px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
              {isEditMode ? (
                <Button 
                  form="admin-order-form" 
                  type="submit" 
                  disabled={saving} 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black h-14 rounded-2xl shadow-xl transition-all"
                >
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} SAVE UPDATES
                </Button>
              ) : (
                <div className="flex justify-between items-center px-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-orange-600 italic tracking-tighter">₹{selectedOrder.total}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 font-black px-5 py-2.5 rounded-2xl text-[10px] border-none shadow-sm">PAID ONLINE</Badge>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}