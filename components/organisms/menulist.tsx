import MenuItemCard from '@/components/molecules/menuitemcard';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  veg?: boolean;
};

export default function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
          image={item.image}
          veg={item.veg ?? false}
        />
      ))}
    </div>
  );
}