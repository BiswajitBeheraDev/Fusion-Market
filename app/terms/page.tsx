export default function Terms() {
  const policies = [
    { title: "Acceptance", text: "By accessing this website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations." },
    { title: "User License", text: "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial viewing only." },
    { title: "Disclaimer", text: "The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, regarding accuracy or reliability." },
    { title: "Limitations", text: "In no event shall we or our suppliers be liable for any damages arising out of the use or inability to use our services." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-black italic tracking-tighter mb-12 border-l-8 border-orange-600 pl-6">TERMS OF SERVICE</h1>
      <div className="space-y-12">
        {policies.map((p, i) => (
          <section key={i} className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-orange-600 font-black">0{i+1}.</span> {p.title}
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium">{p.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}