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

  type: 'shopping' | 'food';

  quantity: number;

};



type CartContextType = {

  shoppingCart: CartItem[];

  foodCart: CartItem[];

  addToShoppingCart: (item: Omit<CartItem, 'quantity' | 'type'>) => void;

  addToFoodCart: (item: Omit<CartItem, 'quantity' | 'type'> & { veg: boolean }) => void;

  updateShoppingQuantity: (id: number, quantity: number) => void;

  updateFoodQuantity: (id: number, quantity: number) => void;

  removeFromShoppingCart: (id: number) => void;

  removeFromFoodCart: (id: number) => void;

  getShoppingCount: () => number;

  getFoodCount: () => number;

  getShoppingTotal: () => number;

  getFoodTotal: () => number;

  clearShoppingCart: () => void;      

  clearFoodCart: () => void;

};



const CartContext = createContext<CartContextType | undefined>(undefined);



export function CartProvider({ children }: { children: ReactNode }) {

  const [shoppingCart, setShoppingCart] = useState<CartItem[]>([]);

  const [foodCart, setFoodCart] = useState<CartItem[]>([]);



  // Load from localStorage

  useEffect(() => {

    const shopping = localStorage.getItem('shoppingCart');

    const food = localStorage.getItem('foodCart');

    if (shopping) setShoppingCart(JSON.parse(shopping));

    if (food) setFoodCart(JSON.parse(food));

  }, []);



  // Save to localStorage

  useEffect(() => {

    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

  }, [shoppingCart]);



  useEffect(() => {

    localStorage.setItem('foodCart', JSON.stringify(foodCart));

  }, [foodCart]);



  const addToShoppingCart = (item: Omit<CartItem, 'quantity' | 'type'>) => {

    setShoppingCart((prev) => {

      const existing = prev.find(i => i.id === item.id);

      if (existing) {

        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);

      }

      return [...prev, { ...item, type: 'shopping', quantity: 1 }];

    });

  };

const clearShoppingCart = () => setShoppingCart([]);  // ← NEW

  const clearFoodCart = () => setFoodCart([]);

  const addToFoodCart = (item: Omit<CartItem, 'quantity' | 'type'> & { veg: boolean }) => {

    setFoodCart((prev) => {

      const existing = prev.find(i => i.id === item.id);

      if (existing) {

        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);

      }

      return [...prev, { ...item, type: 'food', quantity: 1 }];

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



  const removeFromShoppingCart = (id: number) => {

    setShoppingCart(prev => prev.filter(i => i.id !== id));

  };



  const removeFromFoodCart = (id: number) => {

    setFoodCart(prev => prev.filter(i => i.id !== id));

  };



  const getShoppingCount = () => shoppingCart.reduce((sum, i) => sum + i.quantity, 0);

  const getFoodCount = () => foodCart.reduce((sum, i) => sum + i.quantity, 0);

  const getShoppingTotal = () => shoppingCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getFoodTotal = () => foodCart.reduce((sum, i) => sum + i.price * i.quantity, 0);



  return (

    <CartContext.Provider value={{

      shoppingCart,

      foodCart,

      addToShoppingCart,

      addToFoodCart,

      updateShoppingQuantity,

      updateFoodQuantity,

      removeFromShoppingCart,

      removeFromFoodCart,

      getShoppingCount,

      getFoodCount,

      getShoppingTotal,

      getFoodTotal,

      clearShoppingCart,      

      clearFoodCart,

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