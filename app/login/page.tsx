'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Github } from "lucide-react"; // GitHub icon
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Login Failed", {
        description: "Invalid email or password",
      });
    } else {
      toast.success("Welcome back!", {
        description: "Login successful",
      });
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  const handleFacebookLogin = () => {
    signIn("facebook", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 px-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl rounded-3xl border-0">
        <div className="p-10">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="p-1 bg-gradient-to-br from-orange-400 to-red-600 rounded-full">
              <Avatar className="h-28 w-28 border-4 border-white">
                <AvatarImage src="/avatar.png" alt="MyStore" />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-600 text-white text-3xl font-bold">
                  M
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
            Welcome Back
          </h1>

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 rounded-2xl h-12"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 rounded-2xl h-12"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Logins - GitHub + Facebook */}
          <div className="grid grid-cols-2 gap-4">
            {/* GitHub */}
            <Button
              variant="outline"
              className="h-12 rounded-2xl"
              onClick={handleGitHubLogin}
              disabled={loading}
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              className="h-12 rounded-2xl"
              onClick={handleFacebookLogin}
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>

          <p className="text-center mt-8 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="font-bold text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}