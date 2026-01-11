import MenuList from '@/components/organisms/menulist';

export default function FoodTemplate() {
  const menuItems = [
    { id: 1, name: 'Margherita Pizza', price: 399, veg: true },
    { id: 2, name: 'Butter Chicken', price: 499, veg: false },
    { id: 3, name: 'Paneer Tikka', price: 349, veg: true },
    // Add more...
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">Order Delicious Food</h1>
      <MenuList items={menuItems} />
    </div>
  );
}