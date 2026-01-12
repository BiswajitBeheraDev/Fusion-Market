"use client"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  // Agar user pehle se logged in hai, toh redirect karein
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Please sign in to access your dashboard</p>
        
        <button 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://authjs.dev/img/providers/google.svg" width="24" height="24" alt="Google" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}