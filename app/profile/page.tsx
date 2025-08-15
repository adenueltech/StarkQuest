"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Mail,
  MapPin,
  LinkIcon,
  Github,
  Twitter,
  Edit,
  Save,
  Star,
  Trophy,
  Target,
  Calendar,
  DollarSign,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [skills] = useState([
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Solidity", level: 75 },
    { name: "StarkNet", level: 80 },
    { name: "UI/UX Design", level: 70 },
  ])

  const stats = [
    { label: "Bounties Completed", value: "24", icon: Trophy, color: "text-starknet-orange" },
    { label: "Total Earned", value: "12.5 ETH", icon: DollarSign, color: "text-starknet-pink" },
    { label: "Success Rate", value: "96%", icon: Target, color: "text-starknet-blue" },
    { label: "Avg Rating", value: "4.9", icon: Star, color: "text-starknet-orange" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-starknet-blue via-starknet-pink to-starknet-orange opacity-5 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(12,12,79,0.1),transparent_50%)] animate-pulse"></div>

      <div className="absolute top-20 right-20 w-40 h-40 bg-starknet-orange/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-starknet-pink/5 rounded-full animate-bounce delay-2000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-starknet-orange hover:text-starknet-pink transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          
          {/* Profile Header */}
          <Card className="mb-8 border-2 border-transparent bg-gradient-to-r from-starknet-orange via-starknet-pink to-starknet-blue p-[2px] animate-gradient-border">
            <div className="bg-background rounded-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-starknet-orange/20">
                      <AvatarImage src={user?.avatar || "/placeholder.svg?height=128&width=128"} alt="Profile" />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-starknet-orange to-starknet-pink text-white">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-starknet-orange text-white rounded-full p-2 animate-pulse">
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-starknet-orange to-starknet-pink bg-clip-text text-transparent">
                          {user?.username || "Your Name"}
                        </h1>
                        <p className="text-muted-foreground">Full-Stack Developer & StarkNet Specialist</p>
                      </div>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-gradient-to-r from-starknet-orange to-starknet-pink hover:from-starknet-pink hover:to-starknet-blue transition-all duration-500"
                      >
                        {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                        {isEditing ? "Save" : "Edit Profile"}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user?.email || "your.email@example.com"}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined March 2024
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {user?.twitter && (
                        <a href={`https://x.com/${user.twitter.replace(/^@/, "")}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="border-starknet-pink text-starknet-pink hover:bg-starknet-pink hover:text-white transition-all duration-300 bg-transparent">
                            <Twitter className="mr-1 h-4 w-4" />
                            @{user.twitter.replace(/^@/, "")}
                          </Button>
                        </a>
                      )}
                      {user?.instagram && (
                        <a href={`https://instagram.com/${user.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="border-starknet-orange text-starknet-orange hover:bg-starknet-orange hover:text-white transition-all duration-300 bg-transparent">
                            <Instagram className="mr-1 h-4 w-4" />
                            @{user.instagram.replace(/^@/, "")}
                          </Button>
                        </a>
                      )}
                      {user?.linkedin && (
                        <a href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="border-starknet-blue text-starknet-blue hover:bg-starknet-blue hover:text-white transition-all duration-300 bg-transparent">
                            <LinkIcon className="mr-1 h-4 w-4" />
                            LinkedIn
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="border-2 border-transparent bg-gradient-to-r from-starknet-orange via-starknet-pink to-starknet-blue p-[1px] animate-gradient-border"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-background rounded-lg">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-starknet-orange/10 via-starknet-pink/10 to-starknet-blue/10">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-starknet-orange data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-starknet-pink data-[state=active]:text-white"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="data-[state=active]:bg-starknet-blue data-[state=active]:text-white"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-starknet-orange data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="border-2 border-starknet-orange/20">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                  {user?.skills && user.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.skills.map((s, i) => (
                        <span key={i} className="inline-flex items-center rounded-full border px-2 py-1 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                      className="min-h-32 border-2 focus:border-starknet-orange transition-all duration-300"
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      Passionate full-stack developer with 5+ years of experience building decentralized applications.
                      Specialized in StarkNet ecosystem development and have contributed to multiple DeFi protocols.
                      Love solving complex problems and building user-friendly interfaces.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card className="border-2 border-starknet-pink/20">
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>Your expertise levels in different technologies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <Card
                    key={item}
                    className="border-2 border-starknet-blue/20 hover:border-starknet-blue/40 transition-all duration-300 transform hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-starknet-orange/20 to-starknet-pink/20 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground">Project Screenshot</span>
                      </div>
                      <h3 className="font-semibold mb-2">DeFi Dashboard Project</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Built a comprehensive DeFi dashboard for StarkNet with real-time analytics and portfolio
                        tracking.
                      </p>
                      <div className="flex flex-wrap gap-2">
                      {user?.twitter && (
                        <a href={`https://x.com/${user.twitter.replace(/^@/, "")}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="border-starknet-pink text-starknet-pink hover:bg-starknet-pink hover:text-white transition-all duration-300 bg-transparent">
                            <Twitter className="mr-1 h-4 w-4" />
                            @{user.twitter.replace(/^@/, "")}
                          </Button>
                        </a>
                      )}
                      {user?.instagram && (
                        <a href={`https://instagram.com/${user.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="border-starknet-orange text-starknet-orange hover:bg-starknet-orange hover:text-white transition-all duration-300 bg-transparent">
                            <Instagram className="mr-1 h-4 w-4" />
                            @{user.instagram.replace(/^@/, "")}
                          </Button>
                        </a>
                      )}
                      {user?.linkedin && (
                        <a href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="border-starknet-blue text-starknet-blue hover:bg-starknet-blue hover:text-white transition-all duration-300 bg-transparent">
                            <LinkIcon className="mr-1 h-4 w-4" />
                            LinkedIn
                          </Button>
                        </a>
                      )}
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-2 border-starknet-orange/20">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        defaultValue={user?.username}
                        className="border-2 focus:border-starknet-orange transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        className="border-2 focus:border-starknet-pink transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="border-2 focus:border-starknet-blue transition-all duration-300"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-starknet-orange to-starknet-pink hover:from-starknet-pink hover:to-starknet-blue transition-all duration-500">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
