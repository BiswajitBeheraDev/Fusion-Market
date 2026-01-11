/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function LegalPage({ title, content }: { title: string, content: any }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black tracking-tighter italic mb-8 border-b-4 border-orange-600 inline-block">{title}</h1>
      <div className="prose prose-orange max-w-none space-y-6 text-gray-700">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
          <p>Aapki privacy hamare liye bahut zaroori hai. Hum aapke data ko hamesha safe rakhte hain...</p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">2. Data Collection</h2>
          <p>Hum sirf wahi jaankari lete hain jo order delivery ke liye zaroori hai, jaise Naam, Address, aur Phone number.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">3. Usage</h2>
          <p>Hamari services use karke aap hamari terms aur policies se sehmat hote hain.</p>
        </section>
      </div>
    </div>
  );
}