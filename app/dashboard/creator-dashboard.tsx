"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Edit,
  Eye,
  MessageSquare,
  Plus,
  Settings,
  Search,
  Filter,
  Trophy,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

// Mock dashboard data for creators
const creatorDashboardData = {
  user: {
    name: "StarkDeFi Protocol",
    username: "starkdefi",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 4.8,
    completedBounties: 23,
    totalRewardsGiven: 45000,
  },
  stats: {
    activeBounties: 3,
    pendingApplications: 12,
    totalRewardsGiven: 45000,
    avgRating: 4.8,
    completionRate: 92,
    responseTime: 1,
  },
  activeBounties: [
    {
      id: "1",
      title: "Build DeFi Dashboard UI",
      description:
        "Create a modern, responsive dashboard for DeFi protocol analytics",
      reward: 2500,
      Asset: "STRK",
      deadline: "2024-03-20",
      applications: 12,
      status: "active",
      category: "Design",
    },
    {
      id: "2",
      title: "Smart Contract Audit",
      description: "Security audit for lending protocol smart contracts",
      reward: 5000,
      Asset: "STRK",
      deadline: "2024-03-25",
      applications: 6,
      status: "active",
      category: "Development",
    },
    {
      id: "3",
      title: "Technical Documentation",
      description: "Comprehensive API documentation and integration guides",
      reward: 1200,
      Asset: "STRK",
      deadline: "2024-03-18",
      applications: 8,
      status: "active",
      category: "Content",
    },
  ],
  recentEarnings: [
    { date: "2024-01-10", amount: 2500, bounty: "DeFi Analytics Dashboard" },
    { date: "2023-12-20", amount: 3200, bounty: "NFT Marketplace Contract" },
    { date: "2023-11-15", amount: 1800, bounty: "Yield Farming Protocol UI" },
  ],
  recentApplications: [
    {
      id: "1",
      bounty: "Build DeFi Dashboard UI",
      applicant: "Alex Chen",
      appliedAt: "2024-01-19",
      status: "pending",
    },
    {
      id: "2",
      bounty: "Smart Contract Audit",
      applicant: "Sarah Kim",
      appliedAt: "2024-01-18",
      status: "pending",
    },
  ],
};

export default function CreatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={creatorDashboardData.user.avatar || "/placeholder.svg"}
                alt={creatorDashboardData.user.name}
              />
              <AvatarFallback className="text-lg">
                {creatorDashboardData.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {creatorDashboardData.user.name}!
              </h1>
              <p className="text-muted-foreground">
                @{creatorDashboardData.user.username}
              </p>
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
                <div className="text-2xl font-bold">
                  {creatorDashboardData.stats.activeBounties}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Active Bounties</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-starknet-orange" />
                <div className="text-2xl font-bold">
                  {creatorDashboardData.stats.pendingApplications}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Pending Applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-starknet-pink" />
                <div className="text-2xl font-bold">
                  {creatorDashboardData.stats.totalRewardsGiven.toLocaleString()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Total Rewards Given (STRK)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <div className="text-2xl font-bold">
                  {creatorDashboardData.stats.avgRating}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active">Active Bounties</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Active Bounties Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Bounties</h2>
              <Button
                className="bg-starknet-orange hover:bg-starknet-orange/90"
                asChild
              >
                <Link href="/post-bounty">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Bounty
                </Link>
              </Button>
            </div>

            <div className="grid gap-6">
              {creatorDashboardData.activeBounties.map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {bounty.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {bounty.description}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {bounty.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-starknet-orange">
                          {bounty.reward.toLocaleString()} {bounty.Asset}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reward
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {new Date(bounty.deadline).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Deadline
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {bounty.applications} applications
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Applicants
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bounties/${bounty.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/bounties/${bounty.id}/edit`}>
                            Edit Bounty
                          </Link>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        Close Bounty
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <Button variant="outline" asChild>
                <Link href="/my-bounties">View All Bounties</Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {creatorDashboardData.recentApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {application.bounty}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applicant: {application.applicant}
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {application.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Applied{" "}
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                        <Button
                          size="sm"
                          className="bg-starknet-blue hover:bg-starknet-blue/90"
                        >
                          Accept
                        </Button>
                      </div>
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
                  {creatorDashboardData.recentEarnings.map((earning, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
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
                      {creatorDashboardData.stats.totalRewardsGiven.toLocaleString()}{" "}
                      STRK
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Rewards Given
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-starknet-orange">
                      {Math.round(
                        creatorDashboardData.stats.totalRewardsGiven /
                          creatorDashboardData.user.completedBounties
                      ).toLocaleString()}{" "}
                      STRK
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average per Bounty
                    </div>
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
                      <div className="text-sm font-medium text-muted-foreground">
                        Reputation
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold">
                          {creatorDashboardData.user.reputation}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Bounties Posted
                      </div>
                      <div className="text-lg font-semibold">
                        {creatorDashboardData.user.completedBounties}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Success Rate
                      </div>
                      <div className="text-lg font-semibold">
                        {creatorDashboardData.stats.completionRate}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Response Time
                      </div>
                      <div className="text-lg font-semibold">
                        {creatorDashboardData.stats.responseTime} hours
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Rewards Given
                      </div>
                      <div className="text-lg font-semibold">
                        {creatorDashboardData.user.totalRewardsGiven.toLocaleString()}{" "}
                        STRK
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Profile Completeness
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Project Portfolio</span>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-starknet-blue/20 hover:border-starknet-blue/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-starknet-orange/20 to-starknet-pink/20 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground">
                          DeFi Dashboard Project
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        DeFi Analytics Dashboard
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Built a comprehensive DeFi dashboard for StarkNet with
                        real-time analytics and portfolio tracking.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          React
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          TypeScript
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          StarkNet
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Completed: Jan 2024
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-starknet-orange/20 hover:border-starknet-orange/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-starknet-blue/20 to-starknet-pink/20 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground">
                          NFT Marketplace
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        NFT Marketplace Contract
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Developed smart contracts and frontend for a
                        decentralized NFT marketplace on StarkNet.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          Cairo
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Solidity
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Web3
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Completed: Dec 2023
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
