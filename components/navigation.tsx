"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-starknet-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SQ</span>
            </div>
            <span className="font-bold text-xl text-starknet-blue">
              StarkEarn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/bounties"
              className="text-foreground hover:text-starknet-blue transition-colors"
            >
              Browse Bounties
            </Link>
            <Link
              href="/create"
              className="text-foreground hover:text-starknet-blue transition-colors"
            >
              Post Bounty
            </Link>
            <Link
              href="/swap"
              className="text-foreground hover:text-starknet-blue transition-colors"
            >
              Swap
            </Link>
            <Link
              href="/leaderboard"
              className="text-foreground hover:text-starknet-blue transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/profile"
              className="text-foreground hover:text-starknet-blue transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <Link href="/get-started">
              <Button
                size="sm"
                className="bg-starknet-orange hover:bg-starknet-orange/90"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/bounties"
                className="text-foreground hover:text-starknet-blue transition-colors"
              >
                Browse Bounties
              </Link>
              <Link
                href="/create"
                className="text-foreground hover:text-starknet-blue transition-colors"
              >
                Post Bounty
              </Link>
              <Link
                href="/swap"
                className="text-foreground hover:text-starknet-blue transition-colors"
              >
                Swap
              </Link>
              <Link
                href="/leaderboard"
                className="text-foreground hover:text-starknet-blue transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/profile"
                className="text-foreground hover:text-starknet-blue transition-colors"
              >
                Profile
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
                <Link href="/get-started">
                  <Button
                    size="sm"
                    className="bg-starknet-orange hover:bg-starknet-orange/90"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
