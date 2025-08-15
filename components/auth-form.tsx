"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Wallet, Mail } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signup, login, loginWithWallet } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [role, setRole] = useState<"creator" | "hunter">("hunter")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Add missing state variables
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [company, setCompany] = useState("")
  const [website, setWebsite] = useState("")

  const addSkill = () => {
    const v = skillInput.trim()
    if (!v) return
    if (!skills.includes(v)) setSkills(prev => [...prev, v])
    setSkillInput("")
  }

  const removeSkill = (s: string) => {
    setSkills(prev => prev.filter(x => x !== s))
  }

  const onSkillKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
    }
  }

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarDataUrl(String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err?.message ?? "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginWithWallet = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await loginWithWallet()
    } catch (err: any) {
      setError(err?.message ?? "Wallet connection failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const signupData = {
        username,
        email,
        password,
        role,
        ...(role === "hunter" && {
          skills,
          social: { twitter, instagram, linkedin },
          avatarDataUrl
        }),
        ...(role === "creator" && {
          company,
          website,
          avatarDataUrl
        })
      }
      await signup(signupData)
    } catch (err: any) {
      setError(err?.message ?? "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const FormFields = (
    <div className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="stark_builder" autoComplete="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@stark.quest" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" autoComplete={mode==="login"?"current-password":"new-password"} value={password} onChange={(e)=>setPassword(e.target.value)} />
      </div>
      {mode === "signup" && (
        <>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border">
                {avatarDataUrl ? <img src={avatarDataUrl} alt="avatar preview" className="h-full w-full object-cover" /> : <img src="/placeholder.svg?height=48&width=48" alt="avatar" className="h-full w-full object-cover" />}
              </div>
              <Input type="file" accept="image/*" onChange={onAvatarChange} />
            </div>
          </div>

          {role === "hunter" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" placeholder="@yourhandle" value={twitter} onChange={(e)=>setTwitter(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="@yourhandle" value={instagram} onChange={(e)=>setInstagram(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="linkedin.com/in/you" value={linkedin} onChange={(e)=>setLinkedin(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Skills & Expertise</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-starknet-blue/10">
                      {s}
                      <button type="button" onClick={()=>removeSkill(s)} className="opacity-60 hover:opacity-100">&times;</button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add your skills (e.g., Solidity, Cairo, UX Design, Testing)"
                  value={skillInput}
                  onChange={(e)=>setSkillInput(e.target.value)}
                  onKeyDown={onSkillKeyDown}
                  onBlur={addSkill}
                />
                <p className="text-xs text-muted-foreground">Press Enter or comma to add multiple skills</p>
              </div>
            </>
          )}

          {role === "creator" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Project Name</Label>
                  <Input id="company" placeholder="Your Company or Project" value={company} onChange={(e)=>setCompany(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input id="website" placeholder="https://yourwebsite.com" value={website} onChange={(e)=>setWebsite(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {/* Social Media section for both roles */}
          <div className="space-y-2">
            <Label>Social Media (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter-social">Twitter</Label>
                <Input id="twitter-social" placeholder="@yourhandle" value={twitter} onChange={(e)=>setTwitter(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram-social">Instagram</Label>
                <Input id="instagram-social" placeholder="@yourhandle" value={instagram} onChange={(e)=>setInstagram(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin-social">LinkedIn</Label>
                <Input id="linkedin-social" placeholder="linkedin.com/in/you" value={linkedin} onChange={(e)=>setLinkedin(e.target.value)} />
              </div>
            </div>
          </div>
        </>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full bg-starknet-orange hover:bg-starknet-orange/90" disabled={isLoading}>
        <Mail className="w-4 h-4 mr-2" />
        {isLoading ? (mode==="login" ? "Signing in..." : "Creating account...") : (mode==="login" ? "Sign In with Email" : "Create Account")}
      </Button>
    </div>
  )

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80 dark:[background:linear-gradient(135deg,rgba(12,12,79,.8),rgba(17,22,80,.9))] border border-starknet-pink/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{mode === "login" ? "Sign In" : "Create Account"}</CardTitle>
        <CardDescription>
          {mode === "login" ? "Access your StarkQuest profile" : "Join the StarkNet bounty ecosystem"}
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
            Connect your wallet to access StarkNet features. You can also sign in with email first.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {mode === "signup" ? (
          <Tabs value={role} onValueChange={(v)=>setRole(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hunter">Bounty Hunter</TabsTrigger>
              <TabsTrigger value="creator">Bounty Creator</TabsTrigger>
            </TabsList>
            <TabsContent value="hunter" className="mt-4">
              <form onSubmit={handleSignup}>{FormFields}</form>
              <p className="text-xs text-muted-foreground text-center mt-2">
                As a bounty hunter, you'll be able to browse and complete bounties. By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-starknet-pink hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-starknet-pink hover:underline">Privacy Policy</Link>
              </p>
            </TabsContent>
            <TabsContent value="creator" className="mt-4">
              <form onSubmit={handleSignup}>{FormFields}</form>
              <p className="text-xs text-muted-foreground text-center mt-2">
                As a bounty creator, you'll be able to post bounties, manage submissions, and handle payouts. By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-starknet-pink hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-starknet-pink hover:underline">Privacy Policy</Link>
              </p>
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handleLogin}>{FormFields}</form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>New here? <Link href="/signup" className="text-starknet-pink hover:underline">Create an account</Link></>
          ) : (
            <>Already have an account? <Link href="/login" className="text-starknet-pink hover:underline">Sign in</Link></>
          )}
        </p>
      </CardContent>
    </Card>
  )
}