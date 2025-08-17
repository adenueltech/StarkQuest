import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PaymentModal } from "@/components/payment-modal";
import {
  Calendar,
  Users,
  Star,
  Clock,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";

// Mock bounty detail data
const bountyDetail = {
  id: "1",
  title: "Build StarkNet DeFi Dashboard",
  description: `Create a comprehensive dashboard for tracking DeFi protocols on StarkNet. The dashboard should provide users with real-time insights into various DeFi protocols, including total value locked (TVL), annual percentage yields (APY), and portfolio management features.

## Requirements

### Core Features
- **Protocol Overview**: Display key metrics for major StarkNet DeFi protocols
- **TVL Tracking**: Real-time total value locked across protocols
- **APY Monitoring**: Track and compare yields across different protocols
- **Portfolio Management**: Allow users to connect wallets and track their positions
- **Historical Data**: Charts showing protocol performance over time

### Technical Requirements
- Built with React and TypeScript
- Responsive design that works on desktop and mobile
- Integration with StarkNet RPC endpoints
- Clean, modern UI following StarkNet design principles
- Proper error handling and loading states

### Deliverables
1. Complete source code with documentation
2. Deployment instructions
3. User guide/documentation
4. Test coverage report

## Timeline
- **Week 1**: Setup project structure and basic UI components
- **Week 2**: Implement data fetching and protocol integrations
- **Week 3**: Add portfolio management features
- **Week 4**: Testing, optimization, and documentation

## Evaluation Criteria
- Code quality and architecture
- User experience and design
- Performance and optimization
- Documentation quality
- Test coverage`,
  reward: 2500,
  currency: "STRK",
  category: "Development",
  difficulty: "Advanced",
  deadline: "2024-02-15",
  applicants: 12,
  status: "open" as const,
  tags: ["React", "TypeScript", "DeFi", "StarkNet", "Dashboard", "Web3"],
  poster: {
    name: "StarkDeFi Protocol",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 4.8,
    completedBounties: 23,
    totalRewardsGiven: 45000,
  },
  createdAt: "2024-01-15",
  applications: [
    {
      id: "1",
      applicant: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        reputation: 4.9,
        completedBounties: 15,
      },
      proposal:
        "I have extensive experience building DeFi dashboards and have worked with StarkNet protocols before. I can deliver this project within the timeline with high-quality code and comprehensive documentation.",
      appliedAt: "2024-01-16",
    },
    {
      id: "2",
      applicant: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        reputation: 4.7,
        completedBounties: 12,
      },
      proposal:
        "As a full-stack developer specializing in DeFi applications, I'm excited to work on this dashboard. I have experience with React, TypeScript, and StarkNet integration.",
      appliedAt: "2024-01-17",
    },
  ],
};

export default function BountyDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bounties
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      className="bg-starknet-blue/10 text-starknet-blue border-starknet-blue/20"
                      variant="outline"
                    >
                      {bountyDetail.category}
                    </Badge>
                    <Badge
                      className="bg-orange-100 text-orange-800"
                      variant="secondary"
                    >
                      {bountyDetail.difficulty}
                    </Badge>
                    <Badge
                      className="bg-green-100 text-green-800"
                      variant="secondary"
                    >
                      {bountyDetail.status}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">
                    {bountyDetail.title}
                  </h1>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due Feb 15, 2024</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{bountyDetail.applicants} applicants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted Jan 15, 2024</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {bountyDetail.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Bounty Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">
                    {bountyDetail.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Applications ({bountyDetail.applications.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bountyDetail.applications.map((application, index) => (
                  <div key={application.id}>
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            application.applicant.avatar || "/placeholder.svg"
                          }
                          alt={application.applicant.name}
                        />
                        <AvatarFallback>
                          {application.applicant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">
                            {application.applicant.name}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">
                              {application.applicant.reputation}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {application.applicant.completedBounties} bounties
                            completed
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {application.proposal}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Applied {application.appliedAt}
                        </span>
                      </div>
                    </div>
                    {index < bountyDetail.applications.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reward Card */}
            <Card>
              <CardHeader>
                <CardTitle>Reward</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-starknet-blue mb-4">
                  {bountyDetail.reward.toLocaleString()} {bountyDetail.currency}
                </div>
                <PaymentModal
                  trigger={
                    <Button
                      className="w-full bg-starknet-orange hover:bg-starknet-orange/90"
                      size="lg"
                    >
                      Apply for Bounty
                    </Button>
                  }
                  title="Apply for Bounty"
                  description="Submit your application and pay the application fee"
                  amount="0.1"
                  currency="STRK"
                  recipient="StarkEarn Platform"
                  onConfirm={() => console.log("Application submitted")}
                />
              </CardContent>
            </Card>

            {/* Poster Info */}
            <Card>
              <CardHeader>
                <CardTitle>Posted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={bountyDetail.poster.avatar || "/placeholder.svg"}
                      alt={bountyDetail.poster.name}
                    />
                    <AvatarFallback>
                      {bountyDetail.poster.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {bountyDetail.poster.name}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        {bountyDetail.poster.reputation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Bounties Posted:
                    </span>
                    <span>{bountyDetail.poster.completedBounties}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Rewards:
                    </span>
                    <span>
                      {bountyDetail.poster.totalRewardsGiven.toLocaleString()}{" "}
                      STRK
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Apply */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Application</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write a brief proposal explaining why you're the right person for this bounty..."
                    className="min-h-[100px]"
                  />
                  <PaymentModal
                    trigger={
                      <Button className="w-full bg-starknet-blue hover:bg-starknet-blue/90">
                        Submit Application
                      </Button>
                    }
                    title="Submit Application"
                    description="Pay application fee to submit your proposal"
                    amount="0.1"
                    currency="STRK"
                    recipient="StarkEarn Platform"
                    onConfirm={() => console.log("Quick application submitted")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
