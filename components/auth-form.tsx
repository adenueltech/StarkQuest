"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wallet, Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface AuthFormProps {
  mode: "login" | "signup";
}

const supportedWallets = [
  {
    name: "ArgentX",
    icon: "/placeholder.svg?height=40&width=40",
    description: "The most popular StarkNet wallet",
    id: "argentX"
  },
  {
    name: "Braavos",
    icon: "/placeholder.svg?height=40&width=40", 
    description: "Smart wallet for StarkNet",
    id: "braavos"
  }
]

export function AuthForm({ mode }: AuthFormProps) {
  const { signup, login, loginWithWallet } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"creator" | "hunter">("hunter");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wallet connection states
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Add missing state variables
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (!skills.includes(v)) setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    setSkills((prev) => prev.filter((x) => x !== s));
  };

  const onSkillKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const checkWalletInstallation = () => {
    const isArgentXInstalled = typeof window !== 'undefined' && 
      (window as any).starknet_argentX && 
      typeof (window as any).starknet_argentX.enable === 'function'
    
    const isBraavosInstalled = typeof window !== 'undefined' && 
      (window as any).starknet_braavos && 
      typeof (window as any).starknet_braavos.enable === 'function'

    return supportedWallets.map(wallet => ({
      ...wallet,
      installed: wallet.id === "argentX" ? isArgentXInstalled : isBraavosInstalled
    }))
  }

  const handleWalletConnect = async (walletName: string) => {
    setIsConnectingWallet(true)
    setSelectedWallet(walletName)
    setWalletError(null)
    
    try {
      console.log(`Attempting to connect to ${walletName}...`);
      
      let walletObj;
      
      // Get the correct wallet object
      if (walletName.toLowerCase() === "argentx") {
        walletObj = (window as any).starknet_argentX;
      } else if (walletName.toLowerCase() === "braavos") {
        walletObj = (window as any).starknet_braavos;
      }
      
      if (!walletObj) {
        throw new Error(`${walletName} wallet is not installed. Please install the extension first.`);
      }

      // Check if wallet is available and has enable method
      if (typeof walletObj.enable !== 'function') {
        throw new Error(`${walletName} wallet is not properly initialized.`);
      }

      // Enable the wallet connection
      console.log(`Enabling ${walletName}...`);
      
      // Try enabling with a timeout
      const enablePromise = walletObj.enable();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout - please check your wallet')), 30000)
      );
      
      await Promise.race([enablePromise, timeoutPromise]);
      
      console.log(`${walletName} enabled successfully`);

      // Check if wallet is connected
      if (!walletObj.isConnected) {
        throw new Error(`${walletName} wallet is not connected after enable`);
      }

      // Get the account
      const account = walletObj.account;
      if (!account || !account.address) {
        throw new Error("Failed to get account from wallet");
      }

      console.log(`Connected to address: ${account.address}`);

      // Close wallet modal
      setShowWalletModal(false);

      // Trigger auto sign-in with wallet
      await loginWithWallet(account.address, walletName);
      
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      
      if (error.message?.includes("timeout") || error.message?.includes("Timeout")) {
        userMessage = "Connection timed out. Please check your wallet extension and try again. Make sure to approve the connection prompt.";
      } else if (error.message?.includes("User rejected") || error.message?.includes("cancelled") || error.message?.includes("denied")) {
        userMessage = "Connection was cancelled. Please try again and approve the connection in your wallet.";
      } else if (error.message?.includes("not installed") || error.message?.includes("not found")) {
        userMessage = `${walletName} wallet extension not found. Please make sure it's installed and enabled.`;
      } else if (error.message?.includes("not initialized")) {
        userMessage = `${walletName} wallet is not ready. Please refresh the page and try again.`;
      }
      
      setWalletError(userMessage);
    } finally {
      setIsConnectingWallet(false)
      setSelectedWallet(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithWallet = async () => {
    setError(null);
    setWalletError(null);
    setShowWalletModal(true);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const signupData = {
        username,
        email,
        password,
        role,
        ...(role === "hunter" && {
          skills,
          social: { twitter, instagram, linkedin },
          avatarDataUrl,
        }),
        ...(role === "creator" && {
          company,
          website,
          social: { twitter, instagram, linkedin },
          avatarDataUrl,
        }),
      };
      await signup(signupData);
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const walletsWithInstallation = checkWalletInstallation();

  const FormFields = (
    <div className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="stark_builder"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@stark.quest"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {mode === "signup" && (
        <>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border">
                {avatarDataUrl ? (
                  <img
                    src={avatarDataUrl}
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <Input type="file" accept="image/*" onChange={onAvatarChange} />
            </div>
          </div>

          {/* Social Media section - shared by both roles */}
          <div className="space-y-2">
            <Label>Social Media (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="@yourhandle"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="@yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/you"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>
          </div>

          {role === "hunter" && (
            <div className="space-y-2">
              <Label>Skills & Expertise</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-starknet-blue/10"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="opacity-60 hover:opacity-100"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="Add your skills (e.g., Solidity, Cairo, UX Design, Testing)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKeyDown}
                onBlur={addSkill}
              />
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add multiple skills
              </p>
            </div>
          )}

          {role === "creator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company/Project Name</Label>
                <Input
                  id="company"
                  placeholder="Your Company or Project"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
          )}
        </>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="submit"
        className="w-full bg-starknet-orange hover:bg-starknet-orange/90"
        disabled={isLoading}
        onClick={mode === "login" ? handleLogin : handleSignup}
      >
        <Mail className="w-4 h-4 mr-2" />
        {isLoading
          ? mode === "login"
            ? "Signing in..."
            : "Creating account..."
          : mode === "login"
          ? "Sign In with Email"
          : "Create Account"}
      </Button>
    </div>
  );

  return (
    <>
      <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80 dark:[background:linear-gradient(135deg,rgba(12,12,79,.8),rgba(17,22,80,.9))] border border-starknet-pink/20 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>{mode === "login" ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Access your StarkEarn profile"
              : "Join the StarkNet bounty ecosystem"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleLoginWithWallet}
              disabled={isLoading}
              size="lg"
              className="w-full bg-starknet-blue hover:bg-starknet-blue/90 text-white"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting..." : "Connect StarkNet Wallet"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet to access StarkNet features. You can also sign
              in with email first.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {mode === "signup" ? (
            <Tabs
              value={role}
              onValueChange={(v) => setRole(v as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hunter">Bounty Hunter</TabsTrigger>
                <TabsTrigger value="creator">Bounty Creator</TabsTrigger>
              </TabsList>
              <TabsContent value="hunter" className="mt-4">
                {FormFields}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  As a bounty hunter, you'll be able to browse and complete
                  bounties. By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-starknet-pink hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-starknet-pink hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </TabsContent>
              <TabsContent value="creator" className="mt-4">
                {FormFields}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  As a bounty creator, you'll be able to post bounties, manage
                  submissions, and handle payouts. By creating an account, you
                  agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-starknet-pink hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-starknet-pink hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </TabsContent>
            </Tabs>
          ) : (
            FormFields
          )}

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link
                  href="/signup"
                  className="text-starknet-pink hover:underline"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-starknet-pink hover:underline"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Wallet Connection Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your StarkNet wallet to {mode === "login" ? "sign in" : "create an account"} and start earning rewards.
            </p>

            {walletError && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <div className="font-medium">Connection Error</div>
                  <div>{walletError}</div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {walletsWithInstallation.map((wallet) => (
                <Card
                  key={wallet.name}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !wallet.installed ? "opacity-50 cursor-not-allowed" : ""
                  } ${selectedWallet === wallet.name ? "border-starknet-blue" : ""}`}
                  onClick={() => wallet.installed && handleWalletConnect(wallet.name)}
                >
                  <CardContent className="flex items-center space-x-3 p-4">
                    <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="h-8 w-8 rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{wallet.name}</div>
                      <div className="text-sm text-muted-foreground">{wallet.description}</div>
                      {isConnectingWallet && selectedWallet === wallet.name && (
                        <div className="text-xs text-starknet-orange mt-1">
                          Check your wallet for connection prompt...
                        </div>
                      )}
                    </div>
                    {!wallet.installed && <Badge variant="outline">Not Installed</Badge>}
                    {isConnectingWallet && selectedWallet === wallet.name && <Loader2 className="h-4 w-4 animate-spin" />}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-medium">New to StarkNet?</div>
                <div>
                  Install a wallet extension to get started. We recommend ArgentX for beginners.{" "}
                  <a href="https://www.argent.xyz/argent-x/" target="_blank" rel="noopener noreferrer" className="underline">
                    Install ArgentX
                  </a>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}