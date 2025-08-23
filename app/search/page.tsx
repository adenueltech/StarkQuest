"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BountyCard } from "@/components/bounty-card";
import { SearchSuggestions } from "@/components/search-suggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Bookmark, TrendingUp, Clock } from "lucide-react";

// Mock search results data
const searchResults = [
  {
    id: "1",
    title: "Build React DeFi Dashboard",
    description:
      "Create a comprehensive dashboard for tracking DeFi protocols on StarkNet",
    reward: 2500,
    currency: "STRK",
    category: "Development",
    difficulty: "solod",
    deadline: "2024-02-15",
    applicants: 12,
    status: "open" as const,
    tags: ["React", "TypeScript", "DeFi", "StarkNet"],
    poster: {
      name: "StarkDeFi Protocol",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4.8,
    },
  },
  // Add more mock results...
];

const savedSearches = [
  { name: "React DeFi Projects", count: 23, lastUsed: "2 days ago" },
  { name: "High Reward Contracts", count: 15, lastUsed: "1 week ago" },
  { name: "UI/UX Design Tasks", count: 31, lastUsed: "3 days ago" },
];

const trendingSearches = [
  "Cairo Smart Contracts",
  "StarkNet Integration",
  "NFT Marketplace",
  "Yield Farming",
  "Mobile Wallet",
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearchSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Bounties</h1>

          {/* Main Search */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for bounties, skills, or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 h-12 text-base"
              />
            </div>

            <SearchSuggestions
              query={searchQuery}
              onSelect={handleSearchSelect}
              isVisible={showSuggestions}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Saved Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Saved Searches</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.name}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{search.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {search.count} results
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {search.lastUsed}
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-transparent"
                >
                  View All Saved
                </Button>
              </CardContent>
            </Card>

            {/* Trending Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trendingSearches.map((search) => (
                    <Button
                      key={search}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Quick Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                >
                  <Clock className="mr-2 h-3 w-3" />
                  Due This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                >
                  High Reward (2000+ STRK)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                >
                  Remote Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                >
                  Verified Clients
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="bg-starknet-blue/10 text-starknet-blue"
                  >
                    {filter}
                    <button className="ml-2 text-xs">×</button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "All Bounties"}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {searchResults.length} results
                  </span>
                  <select className="text-sm border rounded px-3 py-1">
                    <option>Best Match</option>
                    <option>Newest First</option>
                    <option>Highest Reward</option>
                    <option>Deadline</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {searchResults.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline" size="lg" className="bg-transparent">
                  Load More Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
