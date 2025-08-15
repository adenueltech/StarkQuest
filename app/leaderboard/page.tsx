import { Header } from "@/components/header"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Award, Crown, Target, DollarSign, Users, Calendar } from "lucide-react"

// Mock leaderboard data
const topEarners = [
  {
    rank: 1,
    user: {
      username: "alex_chen",
      displayName: "Alex Chen",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.9,
      badges: ["Top Performer", "DeFi Expert", "Verified"],
    },
    stats: {
      totalEarned: 45000,
      completedBounties: 23,
      successRate: 96,
      avgRating: 4.9,
    },
    change: "+2",
    trend: "up" as const,
  },
  {
    rank: 2,
    user: {
      username: "sarah_kim",
      displayName: "Sarah Kim",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.8,
      badges: ["Smart Contract Pro", "Rising Star"],
    },
    stats: {
      totalEarned: 38500,
      completedBounties: 19,
      successRate: 94,
      avgRating: 4.8,
    },
    change: "-1",
    trend: "down" as const,
  },
  {
    rank: 3,
    user: {
      username: "mike_dev",
      displayName: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.7,
      badges: ["Frontend Master", "Community Helper"],
    },
    stats: {
      totalEarned: 32000,
      completedBounties: 28,
      successRate: 92,
      avgRating: 4.7,
    },
    change: "+1",
    trend: "up" as const,
  },
  {
    rank: 4,
    user: {
      username: "emma_design",
      displayName: "Emma Wilson",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.6,
      badges: ["Design Guru", "Brand Expert"],
    },
    stats: {
      totalEarned: 28750,
      completedBounties: 15,
      successRate: 98,
      avgRating: 4.6,
    },
    change: "0",
    trend: "stable" as const,
  },
  {
    rank: 5,
    user: {
      username: "david_cairo",
      displayName: "David Park",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.5,
      badges: ["Cairo Expert", "Protocol Builder"],
    },
    stats: {
      totalEarned: 26200,
      completedBounties: 12,
      successRate: 95,
      avgRating: 4.5,
    },
    change: "+3",
    trend: "up" as const,
  },
]

const topRated = [
  {
    rank: 1,
    user: {
      username: "perfect_dev",
      displayName: "Perfect Dev",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 5.0,
      badges: ["Perfect Rating", "Quality Master"],
    },
    stats: {
      avgRating: 5.0,
      completedBounties: 8,
      totalEarned: 18000,
      successRate: 100,
    },
  },
  {
    rank: 2,
    user: {
      username: "alex_chen",
      displayName: "Alex Chen",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.9,
      badges: ["Top Performer", "DeFi Expert"],
    },
    stats: {
      avgRating: 4.9,
      completedBounties: 23,
      totalEarned: 45000,
      successRate: 96,
    },
  },
  // Add more entries...
]

const mostActive = [
  {
    rank: 1,
    user: {
      username: "busy_bee",
      displayName: "Busy Bee",
      avatar: "/placeholder.svg?height=60&width=60",
      reputation: 4.4,
      badges: ["Workaholic", "Community Champion"],
    },
    stats: {
      completedBounties: 45,
      totalEarned: 35000,
      avgRating: 4.4,
      successRate: 89,
    },
  },
  // Add more entries...
]

const communityStats = {
  totalContributors: 2847,
  totalBounties: 1247,
  totalRewards: 2400000,
  avgRating: 4.6,
  topCategories: [
    { name: "Development", count: 342, percentage: 68 },
    { name: "Design", count: 128, percentage: 26 },
    { name: "Content", count: 89, percentage: 18 },
  ],
}

const achievements = [
  {
    name: "First Bounty",
    description: "Complete your first bounty",
    icon: Target,
    rarity: "common",
    holders: 1247,
  },
  {
    name: "Top Performer",
    description: "Maintain 4.8+ rating with 20+ bounties",
    icon: Trophy,
    rarity: "rare",
    holders: 23,
  },
  {
    name: "DeFi Expert",
    description: "Complete 10+ DeFi-related bounties",
    icon: Award,
    rarity: "epic",
    holders: 45,
  },
  {
    name: "Perfect Rating",
    description: "Maintain 5.0 rating with 5+ bounties",
    icon: Crown,
    rarity: "legendary",
    holders: 3,
  },
]

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <Trophy className="inline-block mr-3 h-8 w-8 text-starknet-orange" />
            Community Leaderboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Celebrating the top contributors who are building the future of StarkNet. Compete, collaborate, and climb
            the ranks!
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-starknet-blue" />
              <div className="text-2xl font-bold">{communityStats.totalContributors.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-starknet-orange" />
              <div className="text-2xl font-bold">{communityStats.totalBounties.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Bounties Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-starknet-pink" />
              <div className="text-2xl font-bold">${(communityStats.totalRewards / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground">Total Rewards</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">{communityStats.avgRating}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Leaderboard */}
        <Tabs defaultValue="earnings" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="earnings">Top Earners</TabsTrigger>
              <TabsTrigger value="rated">Highest Rated</TabsTrigger>
              <TabsTrigger value="active">Most Active</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                This Month
              </Button>
              <select className="text-sm border rounded px-3 py-1">
                <option>All Categories</option>
                <option>Development</option>
                <option>Design</option>
                <option>Content</option>
              </select>
            </div>
          </div>

          {/* Top Earners */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid gap-4">
              {topEarners.map((entry, index) => (
                <LeaderboardCard key={entry.user.username} entry={entry} metric="earnings" showPodium={index < 3} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="bg-transparent">
                View Full Rankings
              </Button>
            </div>
          </TabsContent>

          {/* Highest Rated */}
          <TabsContent value="rated" className="space-y-6">
            <div className="grid gap-4">
              {topRated.map((entry, index) => (
                <LeaderboardCard key={entry.user.username} entry={entry} metric="rating" showPodium={index < 3} />
              ))}
            </div>
          </TabsContent>

          {/* Most Active */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-4">
              {mostActive.map((entry, index) => (
                <LeaderboardCard key={entry.user.username} entry={entry} metric="bounties" showPodium={index < 3} />
              ))}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-lg ${
                          achievement.rarity === "legendary"
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : achievement.rarity === "epic"
                              ? "bg-gradient-to-r from-purple-400 to-pink-500"
                              : achievement.rarity === "rare"
                                ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                                : "bg-gray-100"
                        }`}
                      >
                        <achievement.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          achievement.rarity === "legendary"
                            ? "bg-yellow-100 text-yellow-800"
                            : achievement.rarity === "epic"
                              ? "bg-purple-100 text-purple-800"
                              : achievement.rarity === "rare"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {achievement.rarity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {achievement.holders.toLocaleString()} holders
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Category Breakdown */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communityStats.topCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.count} bounties</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
