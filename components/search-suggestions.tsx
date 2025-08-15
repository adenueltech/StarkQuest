"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Clock, Star } from "lucide-react"

interface SearchSuggestionsProps {
  query: string
  onSelect: (suggestion: string) => void
  isVisible: boolean
}

const trendingSearches = [
  "React DeFi Dashboard",
  "Cairo Smart Contracts",
  "UI/UX Design",
  "StarkNet Integration",
  "NFT Marketplace",
]

const recentSearches = ["Mobile Wallet", "Yield Farming", "Analytics Dashboard"]

const skillSuggestions = ["React", "TypeScript", "Cairo", "Smart Contracts", "DeFi", "UI/UX", "Web3", "Node.js"]

export function SearchSuggestions({ query, onSelect, isVisible }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (query.length > 0) {
      // Filter suggestions based on query
      const filtered = [
        ...skillSuggestions.filter((skill) => skill.toLowerCase().includes(query.toLowerCase())),
        ...trendingSearches.filter((search) => search.toLowerCase().includes(query.toLowerCase())),
      ].slice(0, 6)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query])

  if (!isVisible || (query.length === 0 && suggestions.length === 0)) {
    return null
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
      <CardContent className="p-0">
        {query.length === 0 ? (
          <div className="p-4 space-y-4">
            {/* Trending Searches */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-starknet-orange" />
                <span className="text-sm font-medium">Trending</span>
              </div>
              <div className="space-y-1">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => onSelect(search)}
                    className="flex items-center space-x-2 w-full p-2 text-left hover:bg-muted rounded text-sm"
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-starknet-blue" />
                  <span className="text-sm font-medium">Recent</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => onSelect(search)}
                      className="flex items-center space-x-2 w-full p-2 text-left hover:bg-muted rounded text-sm"
                    >
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Skills */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-starknet-pink" />
                <span className="text-sm font-medium">Popular Skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {skillSuggestions.slice(0, 6).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-starknet-blue/10 text-xs"
                    onClick={() => onSelect(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSelect(suggestion)}
                className="flex items-center space-x-2 w-full p-2 text-left hover:bg-muted rounded text-sm"
              >
                <Search className="h-3 w-3 text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
