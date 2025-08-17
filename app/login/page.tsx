import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-starknet-blue to-starknet-orange flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-starknet-orange hover:bg-starknet-orange/10 hover:text-starknet-orange"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-starknet-blue font-bold">SQ</span>
            </div>
            <span className="font-bold text-2xl text-starknet-orange">
              StarkEarn
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-starknet-orange mb-2">
            Welcome Back
          </h1>
          <p className="text-starknet-orange/80">
            Sign in to access your profile. You can connect your wallet later.
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
