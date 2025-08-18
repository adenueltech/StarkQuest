"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, Clock, DollarSign, Target, Edit, Eye, MessageSquare, Plus, Settings, Search, Filter } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

// Mock dashboard data for hunters
const hunterDashboardData = {
  user: {
    name: "Alex Chen",
    username: "alex_chen",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 4.9,
    completedBounties: 23,
    totalEarned: 45000,
  },
  stats: {
    activeBounties: 2,
    pendingApplications: 5,
    totalEarnings: 45000,
    avgRating: 4.9,
    completionRate: 96,
    responseTime: 2,
  },
  activeBounties: [
    {
      id: "1",
      title: "Build Mobile Wallet Integration",
      client: "MobileStark",
      reward: 4000,
      currency: "STRK",
      deadline: "2024-03-01",
      progress: 65,
      status: "in-progress",
      lastUpdate: "2024-01-20",
    },
    {
      id: "2",
      title: "Optimize Smart Contract Gas Usage",
      client: "SwapStark",
      reward: 3000,
      currency: "STRK",
      deadline: "2024-02-12",
      progress: 30,
      status: "in-progress",
      lastUpdate: "2024-01-18",
    },
  ],
  pendingApplications: [
    {
      id: "1",
      title: "Create Brand Identity for DeFi Protocol",
      client: "YieldStark",
      reward: 1500,
      currency: "STRK",
      appliedAt: "2024-01-19",
      status: "pending",
    },
    {
      id: "2",
      title: "Write StarkNet Tutorial Series",
      client: "StarkNet Foundation",
      reward: 1200,
      currency: "STRK",
      appliedAt: "2024-01-17",
      status: "pending",
    },
  ],
  recentEarnings: [
    { date: "2024-01-10", amount: 2500, bounty: "DeFi Analytics Dashboard" },
    { date: "2023-12-20", amount: 3200, bounty: "NFT Marketplace Contract" },
    { date: "2023-11-15", amount: 1800, bounty: "Yield Farming Protocol UI" },
  ],
}

function HunterDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={hunterDashboardData.user.avatar || "/placeholder.svg"} alt={hunterDashboardData.user.name} />
              <AvatarFallback className="text-lg">{hunterDashboardData.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {hunterDashboardData.user.name}!</h1>
              <p className="text-muted-foreground">@{hunterDashboardData.user.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/profile">
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-starknet-orange" />
                <div className="text-2xl font-bold">{hunterDashboardData.stats.activeBounties}</div>
              </div>
              <p className="text-xs text-muted-foreground">Active Bounties</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-starknet-orange" />
                <div className="text-2xl font-bold">{hunterDashboardData.stats.pendingApplications}</div>
              </div>
              <p className="text-xs text-muted-foreground">Pending Applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-starknet-pink" />
                <div className="text-2xl font-bold">{hunterDashboardData.stats.totalEarnings.toLocaleString()}</div>
              </div>
              <p className="text-xs text-muted-foreground">Total Earned (STRK)</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <div className="text-2xl font-bold">{hunterDashboardData.stats.avgRating}</div>
              </div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active">Active Work</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Active Work Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Bounties</h2>
              <Button className="bg-starknet-orange hover:bg-starknet-orange/90" asChild>
                <Link href="/bounties">
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Bounties
                </Link>
              </Button>
            </div>

            <div className="grid gap-6">
              {hunterDashboardData.activeBounties.map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{bounty.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">Client: {bounty.client}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{bounty.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-starknet-orange">
                          {bounty.reward.toLocaleString()} {bounty.currency}
                        </div>
                        <div className="text-sm text-muted-foreground">Reward</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{new Date(bounty.deadline).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">Deadline</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{bounty.progress}%</div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{bounty.progress}%</span>
                      </div>
                      <Progress value={bounty.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last updated: {new Date(bounty.lastUpdate).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bounties/${bounty.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Client
                          </Link>
                        </Button>
                        <Button size="sm" className="bg-starknet-blue hover:bg-starknet-blue/90">
                          Update Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pending Applications</h2>
              <Button variant="outline" asChild>
                <Link href="/bounties">
                  View All Bounties
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {hunterDashboardData.pendingApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{application.title}</h3>
                        <p className="text-sm text-muted-foreground">Client: {application.client}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">{application.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-starknet-orange">
                        {application.reward.toLocaleString()} {application.currency}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Earnings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hunterDashboardData.recentEarnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{earning.bounty}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(earning.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-starknet-orange">
                        +{earning.amount.toLocaleString()} STRK
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-starknet-orange">
                      {hunterDashboardData.stats.totalEarnings.toLocaleString()} STRK
                    </div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-starknet-orange">
                      {Math.round(
                        hunterDashboardData.stats.totalEarnings / hunterDashboardData.user.completedBounties,
                      ).toLocaleString()}{" "}
                      STRK
                    </div>
                    <div className="text-sm text-muted-foreground">Average per Bounty</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Overview</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Reputation</div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold">{hunterDashboardData.user.reputation}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Completed Bounties</div>
                      <div className="text-lg font-semibold">{hunterDashboardData.user.completedBounties}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
                      <div className="text-lg font-semibold">{hunterDashboardData.stats.completionRate}%</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Response Time</div>
                      <div className="text-lg font-semibold">{hunterDashboardData.stats.responseTime} hours</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Profile Views</div>
                      <div className="text-lg font-semibold">1,247</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Profile Completeness</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Skills & Expertise</span>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Skills
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Technical Skills</div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between">
                            <span>React</span>
                            <span className="text-sm text-muted-foreground">Advanced</span>
                          </div>
                          <Progress value={90} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>TypeScript</span>
                            <span className="text-sm text-muted-foreground">Advanced</span>
                          </div>
                          <Progress value={85} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Solidity</span>
                            <span className="text-sm text-muted-foreground">Intermediate</span>
                          </div>
                          <Progress value={70} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>StarkNet</span>
                            <span className="text-sm text-muted-foreground">Intermediate</span>
                          </div>
                          <Progress value={75} className="h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Problem Solving</Badge>
                        <Badge variant="secondary">Communication</Badge>
                        <Badge variant="secondary">Teamwork</Badge>
                        <Badge variant="secondary">Time Management</Badge>
                        <Badge variant="secondary">Adaptability</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Certifications</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>StarkNet Developer Certification</span>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Ethereum Developer Certification</span>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Make sure to use default export
export default HunterDashboard