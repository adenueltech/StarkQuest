"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Clock,
  DollarSign,
  MapPin,
  Star,
} from "lucide-react";

const popularSkills = [
  "React",
  "TypeScript",
  "Cairo",
  "Smart Contracts",
  "DeFi",
  "UI/UX",
  "Solidity",
  "Web3",
  "Node.js",
  "Python",
  "Rust",
  "GraphQL",
];

const locations = [
  "Remote",
  "North America",
  "Europe",
  "Asia",
  "Africa",
  "South America",
  "Oceania",
];

export function SoloSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rewardRange, setRewardRange] = useState([0, 10000]);
  const [isSoloOpen, setIsSoloOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([
    "React DeFi Projects",
    "High Reward Contracts",
    "UI/UX Design Tasks",
  ]);

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Main Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bounties by title, description, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setIsSoloOpen(!isSoloOpen)}
          className="h-12 px-6 bg-transparent"
        >
          <Filter className="mr-2 h-4 w-4" />
          Solo
          {isSoloOpen ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>

        <Button className="h-12 px-8 bg-starknet-orange hover:bg-starknet-orange/90">
          Search
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="bg-transparent">
          <Clock className="mr-2 h-3 w-3" />
          Due This Week
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent">
          <DollarSign className="mr-2 h-3 w-3" />
          High Reward (2000+ STRK)
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Star className="mr-2 h-3 w-3" />
          Top Rated Clients
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent">
          <MapPin className="mr-2 h-3 w-3" />
          Remote Only
        </Button>
      </div>

      {/* Solo Search Panel */}
      <Collapsible open={isSoloOpen} onOpenChange={setIsSoloOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Solo Search & Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSoloOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category & Type */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dev" />
                        <Label htmlFor="dev" className="text-sm">
                          Development (342)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="design" />
                        <Label htmlFor="design" className="text-sm">
                          Design (128)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="content" />
                        <Label htmlFor="content" className="text-sm">
                          Content (89)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="research" />
                        <Label htmlFor="research" className="text-sm">
                          Research (45)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Difficulty</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Solo">Solo</SelectItem>
                        <SelectItem value="team">team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reward & Timeline */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Reward Range (STRK)
                    </Label>
                    <div className="mt-4 px-2">
                      <Slider
                        value={rewardRange}
                        onValueChange={setRewardRange}
                        max={10000}
                        min={0}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{rewardRange[0].toLocaleString()}</span>
                        <span>{rewardRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Deadline</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Deadline</SelectItem>
                        <SelectItem value="today">Due Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem
                            key={location}
                            value={location.toLowerCase()}
                          >
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Skills & Client */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Required Skills
                    </Label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {popularSkills
                          .filter((skill) => !selectedSkills.includes(skill))
                          .slice(0, 8)
                          .map((skill) => (
                            <Button
                              key={skill}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-transparent"
                              onClick={() => addSkill(skill)}
                            >
                              {skill}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Client Rating</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Rating</SelectItem>
                        <SelectItem value="5">5 Stars Only</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <Label htmlFor="verified" className="text-sm">
                        Verified Clients Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="escrow" />
                      <Label htmlFor="escrow" className="text-sm">
                        Escrow Protected
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="featured" />
                      <Label htmlFor="featured" className="text-sm">
                        Featured Bounties
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    Clear All Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save Search
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsSoloOpen(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-starknet-orange hover:bg-starknet-orange/90">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Saved searches:</span>
          {savedSearches.map((search) => (
            <Button
              key={search}
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-transparent"
            >
              <Bookmark className="mr-1 h-3 w-3" />
              {search}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
