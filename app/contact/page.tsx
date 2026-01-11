import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactUs() {
  const whatsappNumber = "+916371675164"; 
  const message = "Hi! I saw your website and want to get in touch.";

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12 bg-white rounded-[40px] overflow-hidden border shadow-2xl">
          
          <div className="lg:col-span-5 bg-gray-900 p-12 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-5xl font-black italic tracking-tighter">GET IN TOUCH</h2>
              <p className="text-gray-400">Have questions? We are here to help you 24/7.</p>
            </div>

            <div className="space-y-8 py-12">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-2xl text-orange-500"><Mail /></div>
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Email</p>
                  <p className="text-lg font-bold">support@yourbrand.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-2xl text-orange-500"><Phone /></div>
                <div>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Call</p>
                  <p className="text-lg font-bold">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Response time: &lt; 2 Hours
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7 p-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold">Full Name</Label>
                  <Input placeholder="Enter your name" className="h-12 rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Email Address</Label>
                  <Input type="email" placeholder="email@example.com" className="h-12 rounded-xl border-2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Message</Label>
                <textarea 
                  className="w-full min-h-[160px] p-4 rounded-xl border-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                  placeholder="How can we help you?" 
                />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl font-black text-lg italic shadow-xl shadow-orange-100">
                SEND MESSAGE <Send className="ml-2" size={20} />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-3"
      >
        <span className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border">
          Chat with us!
        </span>
        
        <div className="bg-[#25D366] p-4 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce hover:animate-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            fill="white" 
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        </div>
      </a>
    </div>
  );
}