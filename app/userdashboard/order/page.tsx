/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, Fragment } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; 
import { Loader2, User,  Maximize2, X, Save, Trash2 } from "lucide-react";
import { toast } from 'sonner';
import { FormProvider, useForm } from "react-hook-form";
import { AddressForm } from '@/components/checkouts/Addressform';

export default function UserOrdersTablePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const methods = useForm();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/userorders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Orders load nahi ho paye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (selectedOrder) {
      methods.reset({
        ...selectedOrder,
        addresses: [{ addressLine: selectedOrder.address || "" }]
      });
    }
  }, [selectedOrder, methods]);

  const onUpdateOrder = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/userorders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder.id, ...data }),
      });
      if (res.ok) {
        toast.success("Order updated successfully");
        setIsEditMode(false);
        fetchOrders();
        setSelectedOrder(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/userorders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus: 'cancelled' }),
      });
      if (res.ok) {
        toast.success("Order Cancelled");
        fetchOrders();
        setSelectedOrder(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 pt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            My <span className="text-blue-600">Orders</span>
          </h1>
        </div>

        {/* --- TABLE (AS PER IMAGE) --- */}
        <div className="rounded-[30px] border border-slate-100 overflow-hidden shadow-2xl bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="italic border-none">
                <TableHead className="font-black uppercase text-[11px] py-5 pl-8">Order ID</TableHead>
                <TableHead className="font-black uppercase text-[11px]">Customer</TableHead>
                <TableHead className="font-black uppercase text-[11px]">Address</TableHead>
                <TableHead className="font-black uppercase text-[11px]">Total</TableHead>
                <TableHead className="font-black uppercase text-[11px]">Status</TableHead>
                <TableHead className="text-right pr-10 uppercase text-[11px]">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-blue-50/40 transition-colors border-slate-50">
                  <TableCell className="font-black text-blue-600 italic py-5 pl-8">#{order.id}</TableCell>
                  <TableCell className="font-black text-slate-800 capitalize">{order.firstName} {order.lastName}</TableCell>
                  <TableCell className="text-[10px] font-bold text-slate-400 uppercase tracking-tight max-w-[200px] truncate">
                    {order.address}
                  </TableCell>
                  <TableCell className="font-black text-slate-900 italic text-lg">₹{order.total}</TableCell>
                  <TableCell>
                    <Badge className={`uppercase text-[10px] font-black px-4 py-1.5 rounded-xl border-none ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setIsEditMode(false); }} className="text-blue-600 hover:bg-blue-100 rounded-2xl h-10 w-10">
                      <Maximize2 size={18} className="rotate-45" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- SIDEBAR (FULL HEIGHT ADMIN STYLE) --- */}
      {selectedOrder && (
        <Fragment>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={() => setSelectedOrder(null)} />
          
          {/* Sidebar Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-100">
            
            {/* Sidebar Header */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3 bg-white p-2 px-5 rounded-full border-2 border-slate-100 shadow-sm">
                 <Switch checked={isEditMode} onCheckedChange={setIsEditMode} disabled={selectedOrder.status === 'delivered'} />
                 <Label className="text-[10px] font-black uppercase text-orange-500 tracking-tighter">Enable Edit</Label>
              </div>
              <Button onClick={() => setSelectedOrder(null)} variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-slate-200 text-slate-900">
                <X size={20} strokeWidth={3} />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <User size={30} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 tracking-tighter leading-none capitalize">{selectedOrder.firstName} {selectedOrder.lastName}</h3>
                  <Badge className="mt-2 bg-blue-50 text-blue-600 font-black text-[9px] px-2 py-0.5 rounded-md border-none italic">ID: #{selectedOrder.id}</Badge>
                </div>
              </div>

              <FormProvider {...methods}>
                <form id="user-sidebar-form" onSubmit={methods.handleSubmit(onUpdateOrder)} className="space-y-6">
                  {isEditMode ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <AddressForm />
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">First Name</Label>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-800 text-sm">{selectedOrder.firstName}</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Last Name</Label>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-800 text-sm">{selectedOrder.lastName}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Address *</Label>
                        <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 font-black italic text-slate-900 text-sm leading-relaxed">
                          {selectedOrder.address}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <Label className="text-[9px] font-black uppercase text-slate-400">City</Label>
                          <p className="font-bold text-slate-800 text-sm">{selectedOrder.city}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <Label className="text-[9px] font-black uppercase text-slate-400">State</Label>
                          <p className="font-bold text-slate-800 text-sm">{selectedOrder.state}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</Label>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-blue-600 text-sm italic">
                          {selectedOrder.phone}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </FormProvider>
            </div>

            {/* Sidebar Footer */}
            <div className="p-10 border-t bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                  <p className="text-4xl font-black text-blue-600 tracking-tighter italic mt-1">₹{selectedOrder.total}</p>
                </div>
                <Badge className="bg-green-100 text-green-600 font-black px-4 py-1.5 rounded-xl text-[9px] border-none">PAID ONLINE</Badge>
              </div>

              {isEditMode ? (
                <Button form="user-sidebar-form" type="submit" disabled={saving} className="w-full bg-blue-600 text-white font-black h-14 rounded-2xl shadow-xl shadow-blue-100 italic tracking-tighter">
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} SAVE UPDATES
                </Button>
              ) : (
                selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => cancelOrder(selectedOrder.id)}
                    className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white border-none transition-all duration-300"
                  >
                    <Trash2 size={16} /> Cancel This Order
                  </Button>
                )
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}