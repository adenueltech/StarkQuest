"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PaymentModal } from "@/components/payment-modal";
import BackButton from "@/components/back-button";
import {
  Calendar,
  Users,
  Star,
  Clock,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { getBountyById } from "@/lib/services/bounty-service";
import { toast } from "sonner";

// Mock bounty detail data for fallback
const mockBountyDetail = {
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
  Asset: "STRK",
  category: "Development",
  difficulty: "Solo",
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
  const params = useParams();
  const id = params.id as string;
  const [bountyDetail, setBountyDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isQuickApplyModalOpen, setIsQuickApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchBountyDetails = async () => {
      try {
        setLoading(true);
        // Try to fetch real data from the smart contracts
        const bountyId = parseInt(id);
        if (isNaN(bountyId)) {
          throw new Error("Invalid bounty ID");
        }

        const result = await getBountyById(bountyId);

        // Transform the data to match our UI structure
        // Parsing the data returned from the smart contract
        // Based on the Cairo contract, get_bounty_details returns:
        // (title, description, reward_amount, deadline, token_address, status)
        const details = result.details;

        // Extract individual values from the tuple
        // Note: The exact parsing may need adjustment based on the actual return format
        const title = details[0]?.toString() || "Untitled Bounty";
        const description =
          details[1]?.toString() || "No description available";
        const rewardAmount = parseInt(details[2]?.toString() || "0");
        const deadlineTimestamp = parseInt(details[3]?.toString() || "0");
        const tokenAddress = details[4]?.toString() || "";
        const statusValue = details[5]?.toString() || "0";

        // Convert timestamp to readable date
        const deadline = new Date(
          deadlineTimestamp * 1000
        ).toLocaleDateString();

        // Convert status value to string
        let status = "open";
        switch (statusValue) {
          case "0":
            status = "open";
            break;
          case "1":
            status = "in-progress";
            break;
          case "2":
            status = "completed";
            break;
          case "3":
            status = "cancelled";
            break;
          default:
            status = "open";
        }

        // Determine category and difficulty based on tags or other heuristics
        const tags = ["Smart Contract", "Web3", "StarkNet"];
        const category = "Development";
        const difficulty = "Solo";

        const transformedData = {
          id: id,
          title: title,
          description: description,
          reward: rewardAmount,
          Asset: "STRK", // Assuming STRK token
          category: category,
          difficulty: difficulty,
          deadline: deadline,
          applicants: 5, // This would need to be fetched separately
          status: status,
          tags: tags,
          poster: {
            name: "Bounty Creator",
            avatar: "/placeholder.svg?height=40&width=40",
            reputation: 4.5,
            completedBounties: 10,
            totalRewardsGiven: rewardAmount * 2,
          },
          createdAt: "2024-01-01", // This would need to be fetched separately
          applications: [
            {
              id: "1",
              applicant: {
                name: "Applicant 1",
                avatar: "/placeholder.svg?height=32&width=32",
                reputation: 4.8,
                completedBounties: 15,
              },
              proposal: "Sample application proposal",
              appliedAt: "2024-01-10",
            },
          ],
        };

        setBountyDetail(transformedData);
      } catch (err) {
        console.error("Error fetching bounty details:", err);
        setError("Failed to load bounty details. Using mock data instead.");
        toast.error("Failed to load bounty details");
        // Use mock data as fallback
        setBountyDetail({
          ...mockBountyDetail,
          id: id,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBountyDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  if (!bountyDetail) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <BackButton fallback="/bounties" />
          </div>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Bounty Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The bounty you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare bounty data for PaymentModal
  const paymentBountyData = {
    title: bountyDetail.title,
    reward: bountyDetail.reward,
    Asset: bountyDetail.Asset,
    client: bountyDetail.poster.name,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton fallback="/bounties" />
        </div>

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
                  <span>Due {bountyDetail.deadline}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{bountyDetail.applicants} applicants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted {bountyDetail.createdAt}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {bountyDetail.tags.map((tag: string) => (
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
                  <span>
                    Applications ({bountyDetail.applications?.length || 0})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bountyDetail.applications &&
                bountyDetail.applications.length > 0 ? (
                  bountyDetail.applications.map(
                    (application: any, index: number) => (
                      <div key={application.id}>
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                application.applicant.avatar ||
                                "/placeholder.svg"
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
                                {application.applicant.completedBounties}{" "}
                                bounties completed
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
                    )
                  )
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No applications yet. Be the first to apply!
                  </p>
                )}
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
                  {bountyDetail.reward.toLocaleString()} {bountyDetail.Asset}
                </div>
                <Button
                  className="w-full bg-starknet-orange hover:bg-starknet-orange/90"
                  size="lg"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply for Bounty
                </Button>

                <PaymentModal
                  isOpen={isApplyModalOpen}
                  onClose={() => setIsApplyModalOpen(false)}
                  bounty={paymentBountyData}
                  type="apply"
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
                      {bountyDetail.poster.totalRewardsGiven?.toLocaleString() ||
                        "0"}{" "}
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
                  <Button
                    className="w-full bg-starknet-blue hover:bg-starknet-blue/90"
                    onClick={() => setIsQuickApplyModalOpen(true)}
                  >
                    Submit Application
                  </Button>

                  <PaymentModal
                    isOpen={isQuickApplyModalOpen}
                    onClose={() => setIsQuickApplyModalOpen(false)}
                    bounty={paymentBountyData}
                    type="apply"
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
