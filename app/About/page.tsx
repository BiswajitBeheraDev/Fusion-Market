import { ShieldCheck, Truck, Clock, Award } from "lucide-react";

export default function AboutUs() {
  const features = [
    { icon: <Truck />, title: "Express Shipping", desc: "Reliable delivery to your doorstep." },
    { icon: <ShieldCheck />, title: "Secure Checkout", desc: "Protected by industry-standard encryption." },
    { icon: <Clock />, title: "24/7 Assistance", desc: "Always available for our customers." },
    { icon: <Award />, title: "Premium Quality", desc: "Handpicked products only for you." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center space-y-4 mb-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic text-gray-900">
          WHO WE <span className="text-orange-600">ARE</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Redefining the shopping experience with a focus on speed, quality, and customer satisfaction.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="bg-gray-100 aspect-square rounded-[50px] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent" />
          <div className="flex h-full items-center justify-center font-black text-gray-300 text-8xl italic">
            <img src="/images.png"/>
            </div>
        </div>
        
        <div className="space-y-8">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Crafting Excellence Since 2024</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            What started as a small vision has now grown into a community. We believe that everyone deserves access to high-quality products without the premium price tag. Our team works tirelessly to source, verify, and deliver the best directly to you.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {features.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="text-orange-600">{item.icon}</div>
                <h4 className="font-black text-sm uppercase tracking-wider">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}