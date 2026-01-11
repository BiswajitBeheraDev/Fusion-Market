import ProductList from '@/components/organisms/productlist';

export default function ShoppingTemplate({ children }: { children?: React.ReactNode }) {
  // Dummy products
  const products = [
    { id: 1, name: 'Smart Watch', price: 4999, category: 'Electronics' },
    { id: 2, name: 'Running Shoes', price: 3499, category: 'Footwear' },
    { id: 3, name: 'Backpack', price: 1999, category: 'Bags' },
    // Add more...
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">Online Shopping</h1>
      <ProductList products={products} />
      {children}
    </div>
  );
}