import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CartItem({ name, price, quantity }: { name: string; price: number; quantity: number }) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-gray-500">₹{price} each</p>
      </div>
      <div className="flex items-center gap-4">
        <Input type="number" value={quantity} className="w-16 text-center" min={1} />
        <span className="font-bold">₹{price * quantity}</span>
        <Button variant="destructive" size="sm">Remove</Button>
      </div>
    </div>
  );
}