import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  MapPin,
  Calendar,
  Github,
  Twitter,
  Globe,
  MessageSquare,
  Heart,
} from "lucide-react";

// Mock user profile data
const userProfile = {
  username: "alex_chen",
  displayName: "Alex Chen",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Full-stack developer specializing in DeFi applications and StarkNet ecosystem. Passionate about building decentralized solutions that make finance more accessible.",
  location: "San Francisco, CA",
  joinedDate: "2023-06-15",
  website: "https://alexchen.dev",
  github: "alexchen",
  twitter: "alexchen_dev",
  reputation: 4.9,
  totalEarned: 45000,
  completedBounties: 23,
  successRate: 96,
  responseTime: "2 hours",
  skills: [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "StarkNet", level: 85 },
    { name: "Cairo", level: 80 },
    { name: "DeFi", level: 88 },
    { name: "Smart Contracts", level: 82 },
  ],
  stats: {
    totalBounties: 23,
    activeBounties: 2,
    avgRating: 4.9,
    totalEarnings: 45000,
    completionRate: 96,
    responseTime: 2,
  },
  recentWork: [
    {
      id: "1",
      title: "DeFi Analytics Dashboard",
      description:
        "Built a comprehensive analytics dashboard for tracking DeFi protocols on StarkNet",
      reward: 2500,
      Asset: "STRK",
      completedAt: "2024-01-10",
      rating: 5.0,
      client: "StarkDeFi Protocol",
      tags: ["React", "TypeScript", "DeFi"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "NFT Marketplace Smart Contract",
      description:
        "Developed and deployed a gas-optimized NFT marketplace contract",
      reward: 3200,
      Asset: "STRK",
      completedAt: "2023-12-20",
      rating: 4.8,
      client: "StarkArt Collective",
      tags: ["Cairo", "Smart Contracts", "NFT"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Yield Farming Protocol UI",
      description:
        "Created responsive frontend for a yield farming protocol with real-time APY tracking",
      reward: 1800,
      Asset: "STRK",
      completedAt: "2023-11-15",
      rating: 4.9,
      client: "YieldStark",
      tags: ["React", "Web3", "DeFi"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  reviews: [
    {
      id: "1",
      client: "StarkDeFi Protocol",
      clientAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      comment:
        "Exceptional work! Alex delivered a high-quality dashboard that exceeded our expectations. Great communication throughout the project.",
      bountyTitle: "DeFi Analytics Dashboard",
      date: "2024-01-10",
    },
    {
      id: "2",
      client: "StarkArt Collective",
      clientAvatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      comment:
        "Solid smart contract development skills. The NFT marketplace contract was well-optimized and thoroughly tested.",
      bountyTitle: "NFT Marketplace Smart Contract",
      date: "2023-12-20",
    },
  ],
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage
                      src={userProfile.avatar || "/placeholder.svg"}
                      alt={userProfile.displayName}
                    />
                    <AvatarFallback className="text-2xl">
                      {userProfile.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {userProfile.reputation}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({userProfile.completedBounties} reviews)
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined{" "}
                        {new Date(userProfile.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {userProfile.displayName}
                      </h1>
                      <p className="text-lg text-muted-foreground mb-4">
                        @{userProfile.username}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button className="bg-starknet-orange hover:bg-starknet-orange/90">
                        Hire Me
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    {userProfile.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center space-x-4 mb-6">
                    {userProfile.website && (
                      <a
                        href={userProfile.website}
                        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-starknet-orange"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {userProfile.github && (
                      <a
                        href={`https://github.com/${userProfile.github}`}
                        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-starknet-orange"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {userProfile.twitter && (
                      <a
                        href={`https://twitter.com/${userProfile.twitter}`}
                        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-starknet-orange"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-starknet-blue">
                        {userProfile.stats.totalBounties}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-starknet-orange">
                        {userProfile.stats.totalEarnings.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        STRK Earned
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-starknet-pink">
                        {userProfile.stats.completionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Success Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-starknet-blue">
                        {userProfile.stats.responseTime}h
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Response Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userProfile.recentWork.map((work) => (
                <Card
                  key={work.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={work.image || "/placeholder.svg"}
                      alt={work.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-1">
                        {work.title}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {work.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {work.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold text-starknet-blue">
                        {work.reward.toLocaleString()} {work.Asset}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {work.client}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {work.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Completed{" "}
                      {new Date(work.completedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {userProfile.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-starknet-blue/10 text-starknet-blue">
                    DeFi Development
                  </Badge>
                  <Badge className="bg-starknet-orange/10 text-starknet-orange">
                    Smart Contracts
                  </Badge>
                  <Badge className="bg-starknet-pink/10 text-starknet-pink">
                    Frontend Development
                  </Badge>
                  <Badge variant="outline">Cairo Programming</Badge>
                  <Badge variant="outline">Web3 Integration</Badge>
                  <Badge variant="outline">Protocol Design</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid gap-6">
              {userProfile.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={review.clientAvatar || "/placeholder.svg"}
                          alt={review.client}
                        />
                        <AvatarFallback>
                          {review.client.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">{review.client}</div>
                            <div className="text-sm text-muted-foreground">
                              {review.bountyTitle}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-2">
                          {review.comment}
                        </p>

                        <div className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="text-sm">
                        Completed bounty "DeFi Analytics Dashboard"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2 days ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <div className="text-sm">
                        Applied to "Mobile Wallet Integration"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        5 days ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <div className="text-sm">
                        Updated portfolio with new project
                      </div>
                      <div className="text-xs text-muted-foreground">
                        1 week ago
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
  );
}
