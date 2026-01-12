/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet'; // Added Header, Title, Description
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingCart,
  Utensils,
  Home,
  Menu,
  Search,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Grid,
  ShoppingBag,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState, useMemo } from 'react';
import { useCart } from '@/app/context/cartcontext';
import { signOut } from 'next-auth/react';

export const dummyproducts = [
  { id: 1, category: "Electronics" },
  { id: 2, category: "Mobiles" },        
  { id: 3, category: "Food-Drink" },
  { id: 4, category: "Accessories" },
  { id: 5, category: "Footwear" },       
  { id: 6, category: "Home-Office" },
  { id: 7, category: "Kitchen-Dining" },
  { id: 8, category: "Home-Decor" },
  { id: 9, category: "Watches" },        
  { id: 10, category: "Sports-Fitness" },
  { id: 12, category: "Toys-Games" },
  { id: 14, category: "Apparel" },
  { id: 16, category: "Hobbies-Music" },
  { id: 18, category: "Art-Hobbies" },
  { id: 19, category: "Outdoor-Sports" },
  { id: 25, category: "Books" },
];

function MobileNav({ shoppingCount, foodCount }: any) {
  const pathname = usePathname();
  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Shopping', href: '/shopping', icon: ShoppingCart },
    { name: 'Food Menu', href: '/food/menu', icon: Utensils },
    { name: 'Admin Dashboard', href: '/admin/orders', icon: LayoutDashboard },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-11 w-11 bg-white border rounded-xl shadow-sm">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-[#fafafa]">
        {/* --- FIX: Added SheetHeader and Title for Accessibility --- */}
        <SheetHeader className="text-left border-b pb-4">
          <SheetTitle className="text-2xl font-black italic text-orange-600 tracking-tighter flex items-center gap-2">
            <Utensils className="h-7 w-7" /> MYSTORE
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation Menu for Mobile Users
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-lg font-black italic tracking-tight transition-all ${
                  pathname === item.href ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shoppingCart, foodCart } = useCart();

  const [searchInput, setSearchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(dummyproducts.map(p => p.category)));
    return uniqueCats.sort();
  }, []);

  const isShoppingPage = pathname.startsWith('/shopping');
  const isFoodPage = pathname.startsWith('/food');
  const isCartPage = pathname.includes('/cart') || pathname.includes('/foodcart');

  const shoppingCount = shoppingCart.length;
  const foodCount = foodCart.length;

  const activeCount = isShoppingPage ? shoppingCount : isFoodPage ? foodCount : (shoppingCount + foodCount);
  const activeCartLink = isShoppingPage ? '/shopping/cart' : '/food/foodcart';

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    if (!isShoppingPage) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput.trim()) params.set('search', searchInput.trim());
      else params.delete('search');
      router.push(`/shopping?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[#fafafa]/80 backdrop-blur-md">
        {/* Main Top Navbar */}
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 gap-2 md:gap-4">
          
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl md:text-3xl font-black italic text-gray-900 tracking-tighter shrink-0 transition-transform hover:scale-105">
            <Utensils className="h-7 w-7 md:h-8 md:w-8 text-orange-600" />
            <span className="hidden sm:inline uppercase">MYSTORE</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className={`text-xs font-black italic uppercase tracking-widest ${pathname === '/dashboard' ? 'text-orange-600' : 'text-gray-500'}`}>Home</Link>
            <Link href="/shopping" className={`text-xs font-black italic uppercase tracking-widest ${isShoppingPage ? 'text-orange-600' : 'text-gray-500'}`}>Shopping</Link>
            <Link href="/food/menu" className={`text-xs font-black italic uppercase tracking-widest ${isFoodPage ? 'text-orange-600' : 'text-gray-500'}`}>Food</Link>
          </nav>

          {/* Desktop Search & Store */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2 max-w-xl">
            {isShoppingPage && (
              <>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="SEARCH PRODUCTS..."
                    className="pl-10 h-10 border-2 border-gray-100 bg-white rounded-xl font-bold italic text-[10px]"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 rounded-xl border-2 border-gray-100 bg-white font-black italic uppercase text-[9px] tracking-tighter flex gap-1">
                      Store <ChevronDown size={12} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52 mt-2 rounded-2xl p-2 shadow-2xl border-none bg-white max-h-[400px] overflow-y-auto" align="end">
                    <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 p-2">Categories</DropdownMenuLabel>
                    <DropdownMenuItem asChild className="rounded-xl p-2.5 font-bold italic uppercase text-[10px] focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                      <Link href="/shopping" className="flex items-center gap-2"><Grid size={14}/> All Items</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {categories.map((cat) => (
                      <DropdownMenuItem key={cat} asChild className="rounded-xl p-2.5 font-bold italic uppercase text-[10px] focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                        <Link href={`/shopping?category=${cat.toLowerCase()}`} className="flex items-center gap-2">
                          <Tag size={14}/> {cat}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Cart Badge */}
            {!isCartPage && activeCount > 0 && (
              <Button variant="ghost" size="icon" className="relative h-11 w-11 bg-white shadow-sm border rounded-xl" asChild>
                <Link href={activeCartLink}>
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-600 text-[10px] font-black border-2 border-[#fafafa]">
                    {activeCount}
                  </Badge>
                </Link>
              </Button>
            )}

           {/* Profile Menu */}
           {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-11 w-11 rounded-xl p-0 overflow-hidden ring-2 ring-orange-50">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="font-black">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-3 rounded-2xl p-2 shadow-2xl border-none bg-white" align="end">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Account Panel</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem asChild className="rounded-xl p-3 font-bold italic uppercase text-[10px] focus:bg-orange-50 focus:text-orange-600 cursor-pointer transition-all">
                    <Link href="/userdashboard/order" className="flex items-center gap-3">
                      <ShoppingBag size={16} className="text-orange-600"/> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-3 font-bold italic uppercase text-[10px] focus:bg-blue-50 focus:text-blue-600 cursor-pointer transition-all">
                    <Link href="/admin/orders" className="flex items-center gap-3">
                      <LayoutDashboard size={16} className="text-blue-600"/> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onSelect={(e) => {
                      e.preventDefault(); 
                      signOut({ callbackUrl: "/login", redirect: true });
                    }}
                  >
                    <LogOut size={16} className="mr-3" /> signout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <MobileNav 
              shoppingCount={shoppingCount} 
              foodCount={foodCount} 
              isShoppingPage={isShoppingPage} 
              isFoodPage={isFoodPage}
              isCartPage={isCartPage}
            />
          </div>
        </div>

        {/* --- MOBILE SEARCH BAR & CATEGORIES (VISIBLE ON MOBILE ONLY) --- */}
        {isShoppingPage && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t pt-3 border-gray-100 bg-white">
            {/* Mobile Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="SEARCH PRODUCTS..."
                className="pl-10 h-10 border-2 border-gray-100 bg-gray-50 rounded-xl font-bold italic text-[11px]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            
            {/* Mobile Categories Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <Link href="/shopping">
                <Badge 
                  variant="outline" 
                  className={`whitespace-nowrap rounded-lg px-4 py-1.5 font-black italic uppercase text-[9px] border-2 transition-all ${
                    !searchParams.get('category') 
                    ? 'bg-orange-600 text-white border-orange-600' 
                    : 'bg-white text-gray-500 border-gray-100'
                  }`}
                >
                  All Items
                </Badge>
              </Link>
              {categories.map((cat) => (
                <Link key={cat} href={`/shopping?category=${cat.toLowerCase()}`}>
                  <Badge 
                    variant="outline" 
                    className={`whitespace-nowrap rounded-lg px-4 py-1.5 font-black italic uppercase text-[9px] border-2 transition-all ${
                      searchParams.get('category') === cat.toLowerCase() 
                      ? 'bg-orange-600 text-white border-orange-600' 
                      : 'bg-white text-gray-500 border-gray-100'
                    }`}
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}