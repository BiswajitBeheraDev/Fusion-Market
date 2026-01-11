import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">FoodKart</h2>
          <p className="mt-3 text-sm text-neutral-400">
            Fresh food & daily essentials delivered fast at your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shoppping" className="hover:text-white">Home</Link></li>
            <li><Link href="/shopping/cart" className="hover:text-white">Shopping cart</Link></li>
            <li><Link href="/food/menu" className="hover:text-white">Food Menu</Link></li>
            <li><Link href="/food/foodcart" className="hover:text-white">food cart</Link></li>
            <li><Link href="/food/track" className="hover:text-white">Track Orders</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/About" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" aria-label="Website" className="hover:text-white">🌐</a>
            <a href="#" aria-label="Facebook" className="hover:text-white">📘</a>
            <a href="#" aria-label="Instagram" className="hover:text-white">📸</a>
            <a href="#" aria-label="Twitter" className="hover:text-white">🐦</a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-800 text-center py-4 text-sm text-neutral-400">
        © {new Date().getFullYear()} FoodKart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
