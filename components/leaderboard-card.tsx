import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReputationBadge } from "@/components/reputation-badge"
import { Crown, Medal, Award, TrendingUp, TrendingDown, Minus, Star, Target, DollarSign } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  user: {
    username: string
    displayName: string
    avatar: string
    reputation: number
    badges: string[]
  }
  stats: {
    totalEarned?: number
    completedBounties: number
    successRate: number
    avgRating: number
  }
  change?: string
  trend?: "up" | "down" | "stable"
}

interface LeaderboardCardProps {
  entry: LeaderboardEntry
  metric: "earnings" | "rating" | "bounties"
  showPodium?: boolean
}

export function LeaderboardCard({ entry, metric, showPodium = false }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    if (!showPodium) return null

    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return null
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getMetricDisplay = () => {
    switch (metric) {
      case "earnings":
        return {
          value: entry.stats.totalEarned?.toLocaleString() || "0",
          unit: "STRK",
          icon: <DollarSign className="h-4 w-4" />,
          color: "text-starknet-blue",
        }
      case "rating":
        return {
          value: entry.stats.avgRating.toFixed(1),
          unit: "★",
          icon: <Star className="h-4 w-4" />,
          color: "text-yellow-500",
        }
      case "bounties":
        return {
          value: entry.stats.completedBounties.toString(),
          unit: "bounties",
          icon: <Target className="h-4 w-4" />,
          color: "text-starknet-orange",
        }
    }
  }

  const metricDisplay = getMetricDisplay()
  const rankIcon = getRankIcon(entry.rank)

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${showPodium && entry.rank <= 3 ? "border-2" : ""} ${
        entry.rank === 1
          ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50"
          : entry.rank === 2
            ? "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
            : entry.rank === 3
              ? "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50"
              : ""
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="flex items-center space-x-2 min-w-[60px]">
            {rankIcon || (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                {entry.rank}
              </div>
            )}
            {entry.change && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(entry.trend)}
                <span
                  className={`text-xs ${
                    entry.trend === "up" ? "text-green-600" : entry.trend === "down" ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {entry.change !== "0" && (entry.trend === "up" ? "+" : entry.trend === "down" ? "" : "")}
                  {entry.change}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.displayName} />
              <AvatarFallback>{entry.user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold">{entry.user.displayName}</h3>
                <ReputationBadge reputation={entry.user.reputation} />
              </div>
              <p className="text-sm text-muted-foreground">@{entry.user.username}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.user.badges.slice(0, 2).map((badge) => (
                  <Badge key={badge} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
                {entry.user.badges.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{entry.user.badges.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Primary Metric */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${metricDisplay.color} flex items-center space-x-1`}>
              {metricDisplay.icon}
              <span>{metricDisplay.value}</span>
            </div>
            <div className="text-sm text-muted-foreground">{metricDisplay.unit}</div>
          </div>

          {/* Secondary Stats */}
          <div className="hidden md:block text-right text-sm space-y-1 min-w-[120px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bounties:</span>
              <span>{entry.stats.completedBounties}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success:</span>
              <span>{entry.stats.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating:</span>
              <span className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{entry.stats.avgRating}</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
