/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  veg?: boolean;
  type: 'shopping' | 'food' | 'grocery';
  quantity: number;
};

type CartContextType = {
  shoppingCart: CartItem[];
  foodCart: CartItem[];
  groceryCart: CartItem[];  // ← NEW: Grocery Cart added
  addToShoppingCart: (item: Omit<CartItem, 'quantity' | 'type'>) => void;
  addToFoodCart: (item: Omit<CartItem, 'quantity' | 'type'> & { veg: boolean }) => void;
  addToGroceryCart: (item: Omit<CartItem, 'quantity' | 'type'>) => void;  // ← NEW
  updateShoppingQuantity: (id: number, quantity: number) => void;
  updateFoodQuantity: (id: number, quantity: number) => void;
  updateGroceryQuantity: (id: number, quantity: number) => void;  // ← NEW
  removeFromShoppingCart: (id: number) => void;
  removeFromFoodCart: (id: number) => void;
  removeFromGroceryCart: (id: number) => void;  // ← NEW
  getShoppingCount: () => number;
  getFoodCount: () => number;
  getGroceryCount: () => number;  // ← NEW
  getShoppingTotal: () => number;
  getFoodTotal: () => number;
  getGroceryTotal: () => number;  // ← NEW
  clearShoppingCart: () => void;
  clearFoodCart: () => void;
  clearGroceryCart: () => void;  // ← NEW
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [shoppingCart, setShoppingCart] = useState<CartItem[]>([]);
  const [foodCart, setFoodCart] = useState<CartItem[]>([]);
  const [groceryCart, setGroceryCart] = useState<CartItem[]>([]);  // ← NEW state

  // Load from localStorage
  useEffect(() => {
    const shopping = localStorage.getItem('shoppingCart');
    const food = localStorage.getItem('foodCart');
    const grocery = localStorage.getItem('groceryCart');  // ← NEW
    if (shopping) setShoppingCart(JSON.parse(shopping));
    if (food) setFoodCart(JSON.parse(food));
    if (grocery) setGroceryCart(JSON.parse(grocery));  // ← NEW
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  useEffect(() => {
    localStorage.setItem('foodCart', JSON.stringify(foodCart));
  }, [foodCart]);

  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(groceryCart));  // ← NEW
  }, [groceryCart]);

  const addToShoppingCart = (item: Omit<CartItem, 'quantity' | 'type'>) => {
    setShoppingCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, type: 'shopping', quantity: 1 }];
    });
  };

  const addToFoodCart = (item: Omit<CartItem, 'quantity' | 'type'> & { veg: boolean }) => {
    setFoodCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, type: 'food', quantity: 1 }];
    });
  };

  const addToGroceryCart = (item: Omit<CartItem, 'quantity' | 'type'>) => {  // ← NEW function
    setGroceryCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, type: 'grocery', quantity: 1 }];
    });
  };

  const updateShoppingQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setShoppingCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const updateFoodQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setFoodCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const updateGroceryQuantity = (id: number, quantity: number) => {  // ← NEW
    if (quantity < 1) return;
    setGroceryCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const removeFromShoppingCart = (id: number) => {
    setShoppingCart(prev => prev.filter(i => i.id !== id));
  };

  const removeFromFoodCart = (id: number) => {
    setFoodCart(prev => prev.filter(i => i.id !== id));
  };

  const removeFromGroceryCart = (id: number) => {  // ← NEW
    setGroceryCart(prev => prev.filter(i => i.id !== id));
  };

  const getShoppingCount = () => shoppingCart.reduce((sum, i) => sum + i.quantity, 0);
  const getFoodCount = () => foodCart.reduce((sum, i) => sum + i.quantity, 0);
  const getGroceryCount = () => groceryCart.reduce((sum, i) => sum + i.quantity, 0);  // ← NEW

  const getShoppingTotal = () => shoppingCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getFoodTotal = () => foodCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getGroceryTotal = () => groceryCart.reduce((sum, i) => sum + i.price * i.quantity, 0);  // ← NEW

  const clearShoppingCart = () => setShoppingCart([]);
  const clearFoodCart = () => setFoodCart([]);
  const clearGroceryCart = () => setGroceryCart([]);  // ← NEW

  return (
    <CartContext.Provider value={{
      shoppingCart,
      foodCart,
      groceryCart,  // ← NEW
      addToShoppingCart,
      addToFoodCart,
      addToGroceryCart,  // ← NEW
      updateShoppingQuantity,
      updateFoodQuantity,
      updateGroceryQuantity,  // ← NEW
      removeFromShoppingCart,
      removeFromFoodCart,
      removeFromGroceryCart,  // ← NEW
      getShoppingCount,
      getFoodCount,
      getGroceryCount,  // ← NEW
      getShoppingTotal,
      getFoodTotal,
      getGroceryTotal,  // ← NEW
      clearShoppingCart,
      clearFoodCart,
      clearGroceryCart,  // ← NEW
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}