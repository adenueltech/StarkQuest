"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Star } from "lucide-react"

interface Bounty {
  id: string
  title: string
  description: string
  reward: number
  currency: string
  category: string
  difficulty: string
  deadline: string
  applicants: number
  status: "open" | "in-progress" | "completed"
  tags: string[]
  poster: {
    name: string
    avatar: string
    reputation: number
  }
}

interface BountyCardProps {
  bounty: Bounty
}

export function BountyCard({ bounty }: BountyCardProps) {
  const [localStatus, setLocalStatus] = useState<string>(bounty.status)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-orange-100 text-orange-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "development":
        return "bg-starknet-blue/10 text-starknet-blue border-starknet-blue/20"
      case "design":
        return "bg-starknet-orange/10 text-starknet-orange border-starknet-orange/20"
      case "content":
        return "bg-starknet-pink/10 text-starknet-pink border-starknet-pink/20"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-starknet-orange/10 text-starknet-orange"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Expired"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  return (
    <div className="sq-gradient-wrapper rounded-2xl p-[1.5px] bg-gradient-to-r from-starknet-pink via-starknet-orange to-starknet-blue animate-[gradient_8s_linear_infinite] [background-size:200%_200%]">
      <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getCategoryColor(bounty.category)} variant="outline">
            {bounty.category}
          </Badge>
          <Badge className={getStatusColor(bounty.status)} variant="secondary">
            {bounty.status}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{bounty.title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{bounty.description}</p>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDeadline(bounty.deadline)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{bounty.applicants} applicants</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-starknet-orange">
            {bounty.reward.toLocaleString()} {bounty.currency}
          </div>
          <Badge className={getDifficultyColor(bounty.difficulty)} variant="secondary">
            {bounty.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {bounty.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {bounty.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{bounty.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={bounty.poster.avatar || "/placeholder.svg"} alt={bounty.poster.name} />
            <AvatarFallback>{bounty.poster.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{bounty.poster.name}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{bounty.poster.reputation}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full bg-starknet-orange hover:bg-starknet-orange/90" disabled={localStatus !== "open"} onClick={async () => {
            // Simulate claim/apply flow
            try {
              toast.loading("Submitting application...")
              setLocalStatus("in-progress")
              setTimeout(() => {
                toast.success("Application submitted — bounty in progress")
              }, 800)
            } catch (e) {
              toast.error("Failed to apply — try again")
            }
          }}>
          {localStatus === "open" ? "Apply Now" : localStatus === "in-progress" ? "In Progress" : "Completed"}
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
