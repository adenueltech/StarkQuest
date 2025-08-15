import { Header } from "@/components/header"
import { ReputationBadge } from "@/components/reputation-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"

// Mock reputation data
const reputationData = {
  currentRep: 4.7,
  totalReviews: 23,
  reputationHistory: [
    { month: "Jan", reputation: 4.2 },
    { month: "Feb", reputation: 4.4 },
    { month: "Mar", reputation: 4.5 },
    { month: "Apr", reputation: 4.6 },
    { month: "May", reputation: 4.7 },
  ],
  breakdown: {
    communication: 4.8,
    quality: 4.9,
    timeliness: 4.5,
    professionalism: 4.6,
  },
  milestones: [
    { reputation: 4.0, tier: "Skilled", achieved: true, date: "2023-08-15" },
    { reputation: 4.5, tier: "Professional", achieved: true, date: "2024-01-10" },
    { reputation: 4.7, tier: "Expert", achieved: true, date: "2024-01-20" },
    { reputation: 4.9, tier: "Legendary", achieved: false, date: null },
  ],
  recentReviews: [
    {
      id: "1",
      client: "StarkDeFi Protocol",
      rating: 5.0,
      comment: "Exceptional work on the DeFi dashboard. Great communication and delivered ahead of schedule.",
      bounty: "DeFi Analytics Dashboard",
      date: "2024-01-20",
      categories: { communication: 5, quality: 5, timeliness: 5, professionalism: 5 },
    },
    {
      id: "2",
      client: "StarkArt Collective",
      rating: 4.5,
      comment: "Solid smart contract work. Could improve on documentation but overall great results.",
      bounty: "NFT Marketplace Contract",
      date: "2024-01-15",
      categories: { communication: 4, quality: 5, timeliness: 4, professionalism: 5 },
    },
  ],
}

const reputationTiers = [
  { tier: "Newcomer", min: 0, max: 3.9, color: "bg-gray-100 text-gray-800", benefits: ["Basic platform access"] },
  {
    tier: "Skilled",
    min: 4.0,
    max: 4.4,
    color: "bg-gradient-to-r from-green-400 to-blue-500",
    benefits: ["Priority support", "Featured in search results"],
  },
  {
    tier: "Professional",
    min: 4.5,
    max: 4.6,
    color: "bg-gradient-to-r from-blue-400 to-cyan-500",
    benefits: ["Reduced platform fees", "Early access to premium bounties", "Verified badge"],
  },
  {
    tier: "Expert",
    min: 4.7,
    max: 4.8,
    color: "bg-gradient-to-r from-purple-400 to-pink-500",
    benefits: ["Custom profile themes", "Direct client messaging", "Bounty consultation opportunities"],
  },
  {
    tier: "Legendary",
    min: 4.9,
    max: 5.0,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    benefits: ["Exclusive high-value bounties", "Platform ambassador program", "Revenue sharing opportunities"],
  },
]

export default function ReputationPage() {
  const currentTier = reputationTiers.find(
    (tier) => reputationData.currentRep >= tier.min && reputationData.currentRep <= tier.max,
  )
  const nextTier = reputationTiers.find((tier) => tier.min > reputationData.currentRep)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <Star className="inline-block mr-3 h-8 w-8 text-yellow-400" />
            Reputation System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Build trust and unlock exclusive benefits by maintaining high-quality work and excellent client
            relationships.
          </p>
        </div>

        {/* Current Reputation Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Reputation</span>
              <ReputationBadge reputation={reputationData.currentRep} size="lg" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-starknet-blue mb-2">{reputationData.currentRep}</div>
                <div className="text-sm text-muted-foreground">Overall Rating</div>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(reputationData.currentRep)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-starknet-orange mb-2">{reputationData.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
                <div className="text-xs text-muted-foreground mt-2">From {reputationData.totalReviews} clients</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-starknet-pink mb-2">
                  {nextTier
                    ? `${(((reputationData.currentRep - currentTier!.min) / (nextTier.min - currentTier!.min)) * 100).toFixed(0)}%`
                    : "100%"}
                </div>
                <div className="text-sm text-muted-foreground">Progress to {nextTier?.tier || "Max Level"}</div>
                {nextTier && (
                  <Progress
                    value={((reputationData.currentRep - currentTier!.min) / (nextTier.min - currentTier!.min)) * 100}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Reputation Breakdown */}
          <TabsContent value="breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(reputationData.breakdown).map(([category, rating]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{category}</span>
                        <span className="text-sm text-muted-foreground">{rating}/5.0</span>
                      </div>
                      <Progress value={(rating / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-starknet-blue mt-2"></div>
                    <div>
                      <div className="font-medium">Improve Timeliness</div>
                      <div className="text-sm text-muted-foreground">
                        Your lowest score is in timeliness. Try to deliver work ahead of deadlines to boost this score.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-starknet-orange mt-2"></div>
                    <div>
                      <div className="font-medium">Maintain Communication</div>
                      <div className="text-sm text-muted-foreground">
                        Keep clients updated on progress and respond promptly to messages.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-starknet-pink mt-2"></div>
                    <div>
                      <div className="font-medium">Quality Consistency</div>
                      <div className="text-sm text-muted-foreground">
                        Maintain high-quality deliverables across all projects to reach the next tier.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Reviews */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid gap-6">
              {reputationData.recentReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-medium">{review.client}</div>
                        <div className="text-sm text-muted-foreground">{review.bounty}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{review.comment}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {Object.entries(review.categories).map(([category, rating]) => (
                        <div key={category} className="text-center">
                          <div className="text-sm font-medium">{rating}/5</div>
                          <div className="text-xs text-muted-foreground capitalize">{category}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reputation Tiers */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid gap-4">
              {reputationTiers.map((tier) => (
                <Card
                  key={tier.tier}
                  className={`${
                    currentTier?.tier === tier.tier ? "border-2 border-starknet-blue" : ""
                  } hover:shadow-lg transition-shadow`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge className={`${tier.color} text-white`}>{tier.tier}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {tier.min} - {tier.max} rating
                        </span>
                        {currentTier?.tier === tier.tier && (
                          <Badge variant="outline" className="text-starknet-blue border-starknet-blue">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Benefits:</div>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className="h-1 w-1 rounded-full bg-starknet-orange"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reputation History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reputation Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reputationData.milestones.map((milestone) => (
                    <div key={milestone.tier} className="flex items-center space-x-4">
                      <div
                        className={`h-4 w-4 rounded-full ${milestone.achieved ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium">{milestone.tier}</div>
                        <div className="text-sm text-muted-foreground">{milestone.reputation}+ rating</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {milestone.achieved ? new Date(milestone.date!).toLocaleDateString() : "Not achieved"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
