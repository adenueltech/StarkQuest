import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code, Briefcase, Star } from "lucide-react";
import Link from "next/link";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-starknet-blue to-starknet-pink py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to StarkEarn
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Choose your path and start building on the StarkNet ecosystem today
          </p>
        </div>
      </div>

      {/* Path Selection */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Contributors */}
            <Card className="border-2 hover:border-starknet-blue/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-starknet-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">I'm a Contributor</CardTitle>
                <CardDescription className="text-base">
                  Find bounties, showcase your skills, and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-starknet-orange" />
                    <span>Browse 1,200+ active bounties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-starknet-orange" />
                    <span>Build your reputation and portfolio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-starknet-orange" />
                    <span>Get paid in STRK tokens</span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <Link href="/bounties">
                    <Button className="w-full bg-starknet-blue hover:bg-starknet-blue/90">
                      Browse Bounties
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="w-full bg-transparent">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* For Project Owners */}
            <Card className="border-2 hover:border-starknet-pink/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-starknet-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">I'm a Project Owner</CardTitle>
                <CardDescription className="text-base">
                  Post bounties and find talented contributors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-starknet-orange" />
                    <span>Access 5,000+ skilled contributors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-starknet-orange" />
                    <span>Secure escrow payments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-starknet-orange" />
                    <span>98% project success rate</span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <Link href="/create">
                    <Button className="w-full bg-starknet-pink hover:bg-starknet-pink/90">
                      Post a Bounty
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="w-full bg-transparent">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Join Our Growing Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-starknet-blue mb-2">
                5,000+
              </div>
              <div className="text-muted-foreground">Active Contributors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-starknet-pink mb-2">
                1,200+
              </div>
              <div className="text-muted-foreground">Open Bounties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-starknet-orange mb-2">
                $2.5M+
              </div>
              <div className="text-muted-foreground">Rewards Distributed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
