"use client";

import { Header } from "@/components/header";
import { BountyCard } from "@/components/bounty-card";
import { SoloSearch } from "@/components/advanced-search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllBounties } from "@/lib/services/bounty-service";
import { toast } from "sonner";

interface BountyData {
  id: string;
  title: string;
  description: string;
  reward: number;
  Asset: string;
  category: string;
  difficulty: string;
  deadline: string;
  applicants: number;
  status: "open" | "in-progress" | "completed";
  tags: string[];
  poster: {
    name: string;
    avatar: string;
    reputation: number;
  };
}

// Mock bounty data as fallback
const mockBounties: BountyData[] = [
  {
    id: "1",
    title: "Build StarkNet DeFi Dashboard",
    description:
      "Create a comprehensive dashboard for tracking DeFi protocols on StarkNet. Should include TVL, APY tracking, and portfolio management features.",
    reward: 2500,
    Asset: "STRK",
    category: "Development",
    difficulty: "Solo",
    deadline: "2024-02-15",
    applicants: 12,
    status: "open",
    tags: ["React", "TypeScript", "DeFi", "StarkNet"],
    poster: {
      name: "StarkDeFi Protocol",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.8,
    },
  },
  {
    id: "2",
    title: "Design Landing Page for NFT Marketplace",
    description:
      "Design a modern, engaging landing page for a new NFT marketplace on StarkNet. Should include hero section, featured collections, and artist spotlights.",
    reward: 800,
    Asset: "STRK",
    category: "Design",
    difficulty: "Solo",
    deadline: "2024-02-10",
    applicants: 8,
    status: "open",
    tags: ["UI/UX", "Figma", "NFT", "Web Design"],
    poster: {
      name: "StarkArt Collective",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.6,
    },
  },
  {
    id: "3",
    title: "Write StarkNet Smart Contract Tutorial",
    description:
      "Create a comprehensive tutorial series covering Cairo smart contract development from basics to Solo concepts. Include code examples and best practices.",
    reward: 1200,
    Asset: "STRK",
    category: "Content",
    difficulty: "Solo",
    deadline: "2024-02-20",
    applicants: 5,
    status: "open",
    tags: ["Cairo", "Tutorial", "Documentation", "Education"],
    poster: {
      name: "StarkNet Foundation",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 5.0,
    },
  },
  {
    id: "4",
    title: "Optimize Gas Usage in AMM Contract",
    description:
      "Review and optimize gas usage in our automated market maker smart contract. Looking for 20%+ gas reduction while maintaining functionality.",
    reward: 3000,
    Asset: "STRK",
    category: "Development",
    difficulty: "team",
    deadline: "2024-02-12",
    applicants: 15,
    status: "in-progress",
    tags: ["Cairo", "Gas Optimization", "AMM", "Smart Contracts"],
    poster: {
      name: "SwapStark",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.9,
    },
  },
  {
    id: "5",
    title: "Create Brand Identity for DeFi Protocol",
    description:
      "Develop complete brand identity including logo, color palette, typography, and brand guidelines for a new DeFi protocol launching on StarkNet.",
    reward: 1500,
    Asset: "STRK",
    category: "Design",
    difficulty: "Solo",
    deadline: "2024-02-18",
    applicants: 6,
    status: "open",
    tags: ["Branding", "Logo Design", "Brand Guidelines", "DeFi"],
    poster: {
      name: "YieldStark",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.7,
    },
  },
  {
    id: "6",
    title: "Build Mobile App for Wallet Integration",
    description:
      "Develop a React Native mobile app that integrates with StarkNet wallets. Should support transaction signing and account management.",
    reward: 4000,
    Asset: "STRK",
    category: "Development",
    difficulty: "team",
    deadline: "2024-03-01",
    applicants: 9,
    status: "open",
    tags: ["React Native", "Mobile", "Wallet", "StarkNet"],
    poster: {
      name: "MobileStark",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.5,
    },
  },
];

// fff

export default function BountiesPage() {
  const [bounties, setBounties] = useState<BountyData[]>(mockBounties);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const bountyData = await getAllBounties();
        // Transform the data to match the BountyData interface
        const transformedBounties = bountyData.map((bounty: any, index: number) => ({
          id: (index + 1).toString(),
          title: bounty.details?.title || "Untitled Bounty",
          description: bounty.details?.description || "No description provided",
          reward: parseInt(bounty.details?.reward_amount?.toString() || "0"),
          Asset: "STRK", // Default to STRK for now
          category: "Development", // Default category
          difficulty: "Solo", // Default difficulty
          deadline: new Date(parseInt(bounty.details?.deadline?.toString() || "0") * 1000).toISOString(),
          applicants: 0, // Default applicants count
          status: "open" as const, // Default status
          tags: ["StarkNet", "Smart Contract"], // Default tags
          poster: {
            name: "Anonymous", // Default poster name
            avatar: "/placeholder.svg?height=40&width=40",
            reputation: 0, // Default reputation
          },
        }));
        setBounties(transformedBounties);
      } catch (error) {
        console.error("Error fetching bounties:", error);
        toast.error("Failed to load bounties from blockchain, showing mock data instead");
        // Fallback to mock data if fetch fails
        setBounties(mockBounties);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading bounties...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bounty Marketplace</h1>
            <p className="text-muted-foreground">
              Discover opportunities to contribute to the StarkNet ecosystem
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-starknet-orange hover:bg-starknet-orange/90" asChild>
            <Link href="/post-bounty">
              <Plus className="mr-2 h-4 w-4" />
              Create Bounty
            </Link>
          </Button>
        </div>

        <SoloSearch />

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant="secondary"
            className="bg-starknet-blue/10 text-starknet-blue"
          >
            Development
            <button className="ml-2 text-xs">×</button>
          </Badge>
          <Badge
            variant="secondary"
            className="bg-starknet-orange/10 text-starknet-orange"
          >
            Solo
            <button className="ml-2 text-xs">×</button>
          </Badge>
          <Badge
            variant="secondary"
            className="bg-starknet-pink/10 text-starknet-pink"
          >
            2000+ STRK
            <button className="ml-2 text-xs">×</button>
          </Badge>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {bounties.length} bounties •{" "}
            <span className="text-starknet-blue">3 filters active</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Save Search
            </Button>
            <select className="text-sm border rounded px-3 py-1">
              <option>Newest First</option>
              <option>Highest Reward</option>
              <option>Lowest Reward</option>
              <option>Deadline</option>
              <option>Most Applicants</option>
              <option>Best Match</option>
            </select>
          </div>
        </div>

        {/* Bounty Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bounties.map((bounty) => (
            <BountyCard key={bounty.id} bounty={bounty} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Bounties
          </Button>
        </div>
      </div>
    </div>
  );
}