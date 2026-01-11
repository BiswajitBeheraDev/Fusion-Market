import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CartItem from '../molecules/cartitem';

export default function CartSummary() {
  // Dummy data for now
  const cartItems = [
    { name: 'Wireless Headphones', price: 2999, quantity: 1 },
    { name: 'T-Shirt', price: 799, quantity: 2 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Cart Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item, i) => (
          <CartItem key={i} {...item} />
        ))}
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
        <Button className="w-full" size="lg">Proceed to Checkout</Button>
      </CardContent>
    </Card>
  );
}