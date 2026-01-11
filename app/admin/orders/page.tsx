/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Fragment, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw, Maximize2, MapPin, Phone, X, Save, ShieldCheck, User } from "lucide-react";
import { OrderStatusToggle } from '@/components/admin/OrderstausToggle';
import { toast } from "sonner";
import { INDIAN_STATES } from "@/app/context/state"; 

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Form Validation Logic (As per your Zod Schema)
  const validateForm = () => {
    if (!selectedOrder.firstName || selectedOrder.firstName.length < 2) {
      toast.error("First name is required (min 2 chars)");
      return false;
    }
    if (!selectedOrder.lastName || selectedOrder.lastName.length < 1) {
      toast.error("Last name is required");
      return false;
    }
    if (!selectedOrder.address || selectedOrder.address.length < 5) {
      toast.error("Full address is required (min 5 chars)");
      return false;
    }
    if (!selectedOrder.city) {
      toast.error("City is required");
      return false;
    }
    if (!selectedOrder.state || !INDIAN_STATES.includes(selectedOrder.state)) {
      toast.error("Please select a valid state");
      return false;
    }
    if (!/^\d{10}$/.test(selectedOrder.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    if (!validateForm()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          firstName: selectedOrder.firstName,
          lastName: selectedOrder.lastName,
          gender: selectedOrder.gender,
          address: selectedOrder.address,
          city: selectedOrder.city,
          state: selectedOrder.state,
          pinCode: selectedOrder.pinCode,
          phone: selectedOrder.phone,
        }),
      });

      if (res.ok) {
        toast.success("Order Updated Successfully!");
        setIsEditMode(false);
        fetchOrders();
      } else {
        throw new Error("Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="font-black italic tracking-tighter text-gray-400 uppercase">Loading Master Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="p-2 md:p-8 bg-gray-50/50 min-h-screen">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
            ADMIN <ShieldCheck className="text-orange-600" size={36} />
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Order Control Panel</p>
        </div>
        <Button onClick={fetchOrders} size="sm" variant="outline" className="bg-white rounded-xl border-2 hover:bg-orange-50 font-bold">
          <RefreshCcw size={16} className="mr-2" /> REFRESH
        </Button>
      </div>

      {/* --- TABLE SECTION --- */}
      <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100/50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase">Order ID</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Customer</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Total</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id} className="hover:bg-orange-50/30 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-blue-600 italic">#{order.id}</TableCell>
                  <TableCell>
                    <div className="font-black text-gray-800 text-sm leading-tight">{order.firstName} {order.lastName}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{order.city}, {order.state}</div>
                  </TableCell>
                  <TableCell className="font-black text-sm text-gray-900">₹{order.total}</TableCell>
                  <TableCell>
                    <OrderStatusToggle orderId={order.id} currentStatus={order.status} onUpdate={fetchOrders} />
                  </TableCell>
                  <TableCell className="text-right">
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

      {/* --- SIDEBAR DRAWER --- */}
      {selectedOrder && (
        <Fragment>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setSelectedOrder(null)} />
          
          <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            
            {/* Sidebar Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-3 bg-white p-2 px-4 rounded-2xl border-2 shadow-sm">
                <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
                <Label className="text-[10px] font-black uppercase text-orange-600">Enable Edit</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full bg-gray-100 hover:rotate-90 transition-all">
                <X size={20} />
              </Button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-orange-100 pb-6">
                <div className="h-16 w-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-100">
                  <User size={32} strokeWidth={3} />
                </div>
                <div>
                   <h3 className="font-black text-2xl text-gray-800 tracking-tighter leading-none">{selectedOrder.firstName} {selectedOrder.lastName}</h3>
                   <Badge className="mt-2 bg-blue-100 text-blue-700 font-bold text-[9px] uppercase tracking-tighter">ID: #{selectedOrder.id}</Badge>
                </div>
              </div>

              <div className="space-y-5">
                {/* Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-gray-400">First Name <span className="text-red-500">*</span></Label>
                    {isEditMode ? <Input className="rounded-xl border-2 font-bold" value={selectedOrder.firstName} onChange={(e)=>setSelectedOrder({...selectedOrder, firstName:e.target.value})} /> : 
                    <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold">{selectedOrder.firstName}</div>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-gray-400">Last Name <span className="text-red-500">*</span></Label>
                    {isEditMode ? <Input className="rounded-xl border-2 font-bold" value={selectedOrder.lastName} onChange={(e)=>setSelectedOrder({...selectedOrder, lastName:e.target.value})} /> : 
                    <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold">{selectedOrder.lastName}</div>}
                  </div>
                </div>

                {/* Gender Dropdown */}
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Gender <span className="text-red-500">*</span></Label>
                  {isEditMode ? (
                    <select className="w-full h-11 px-3 rounded-xl border-2 text-sm font-bold bg-white" value={selectedOrder.gender} onChange={(e)=>setSelectedOrder({...selectedOrder, gender:e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold">{selectedOrder.gender}</div>}
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><MapPin size={12}/> Address <span className="text-red-500">*</span></Label>
                  {isEditMode ? <textarea className="w-full p-4 rounded-xl border-2 text-sm font-bold min-h-[90px]" value={selectedOrder.address} onChange={(e)=>setSelectedOrder({...selectedOrder, address:e.target.value})} /> : 
                  <div className="p-4 bg-orange-50/40 rounded-2xl border-2 border-orange-100/50 text-sm font-bold leading-relaxed">{selectedOrder.address}</div>}
                </div>

                {/* City & State Dropdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-gray-400">City <span className="text-red-500">*</span></Label>
                    {isEditMode ? <Input className="rounded-xl border-2 font-bold" value={selectedOrder.city} onChange={(e)=>setSelectedOrder({...selectedOrder, city:e.target.value})} /> : 
                    <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold">{selectedOrder.city}</div>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-gray-400">State <span className="text-red-500">*</span></Label>
                    {isEditMode ? (
                      <select className="w-full h-11 px-3 rounded-xl border-2 text-sm font-bold bg-white" value={selectedOrder.state || ""} onChange={(e)=>setSelectedOrder({...selectedOrder, state:e.target.value})}>
                        <option value="" disabled>Select State</option>
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold">{selectedOrder.state}</div>}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1 pt-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400">Phone <span className="text-red-500">*</span></Label>
                  {isEditMode ? <Input className="rounded-xl border-2 h-12 font-bold" value={selectedOrder.phone} onChange={(e)=>setSelectedOrder({...selectedOrder, phone:e.target.value})} /> : 
                  <a href={`tel:${selectedOrder.phone}`} className="p-4 bg-blue-600 text-white rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-all">
                    <span className="font-black text-lg tracking-tight">{selectedOrder.phone}</span>
                    <div className="bg-white/20 p-2 rounded-lg"><Phone size={18} fill="white" /></div>
                  </a>}
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-8 border-t bg-white rounded-t-[40px] shadow-inner">
              {isEditMode ? (
                <Button onClick={handleUpdate} disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-orange-200">
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} SAVE UPDATES
                </Button>
              ) : (
                <div className="flex justify-between items-center px-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Grand Total</span>
                    <span className="text-3xl font-black text-orange-600 italic tracking-tighter">₹{selectedOrder.total}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl text-[10px]">PAID ONLINE</Badge>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}