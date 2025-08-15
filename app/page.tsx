import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Palette, FileText, Trophy, Users, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 gradient-bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Decentralized Bounties for the <span className="gradient-text">StarkNet Ecosystem</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect projects with skilled developers, designers, and creators. Complete tasks, earn rewards, and grow
              the StarkNet community together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-starknet-orange hover:bg-starknet-orange/90 w-full sm:w-auto min-w-[160px]" asChild>
                <Link href="/bounties">
                  Browse Bounties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-starknet-orange text-starknet-orange hover:bg-starknet-orange hover:text-white bg-transparent w-full sm:w-auto min-w-[160px]"
                asChild
              >
                <Link href="/post-bounty">Post a Bounty</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-starknet-orange mb-2">1,247</div>
              <div className="text-xs md:text-sm text-muted-foreground">Active Bounties</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-starknet-orange mb-2">892</div>
              <div className="text-xs md:text-sm text-muted-foreground">Contributors</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-starknet-pink mb-2">$2.4M</div>
              <div className="text-xs md:text-sm text-muted-foreground">Total Rewards</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-starknet-orange mb-2">156</div>
              <div className="text-xs md:text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bounty Categories</h2>
            <p className="text-muted-foreground leading-relaxed">
              Find opportunities that match your skills across different areas of the StarkNet ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-starknet-blue h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-6 w-6 text-starknet-blue flex-shrink-0" />
                  <CardTitle className="text-lg">Development</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Smart contracts, dApps, and protocol development
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">342 bounties</Badge>
                  <span className="text-sm text-muted-foreground">$50-$5000</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-starknet-orange h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Palette className="h-6 w-6 text-starknet-orange flex-shrink-0" />
                  <CardTitle className="text-lg">Design</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  UI/UX design, branding, and visual assets
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">128 bounties</Badge>
                  <span className="text-sm text-muted-foreground">$25-$2000</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-starknet-pink h-full md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-starknet-pink flex-shrink-0" />
                  <CardTitle className="text-lg">Content</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Documentation, tutorials, and educational content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">89 bounties</Badge>
                  <span className="text-sm text-muted-foreground">$10-$1000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose StarkQuest?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center p-4 flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-starknet-blue/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-starknet-blue" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Smart contract escrow ensures guaranteed payments for completed work
              </p>
            </div>

            <div className="text-center p-4 flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-starknet-orange/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-starknet-orange" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Build Reputation</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Showcase your skills and build a verified portfolio of contributions
              </p>
            </div>

            <div className="text-center p-4 flex flex-col items-center md:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-starknet-pink/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-starknet-pink" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Growing Community</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Join a thriving ecosystem of builders and innovators on StarkNet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Building?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join thousands of contributors earning rewards while building the future of StarkNet
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-starknet-orange hover:bg-starknet-orange/90 w-full sm:w-auto min-w-[200px]" asChild>
                <Link href="/signup">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                <Image
                  src="/logo.jpg"
                  alt="StarkQuest Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg md:text-xl font-bold text-starknet-orange">StarkQuest</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The decentralized bounty platform for the StarkNet ecosystem.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/bounties" className="hover:text-starknet-orange transition-colors">
                    Browse Bounties
                  </Link>
                </li>
                <li>
                  <Link href="/post-bounty" className="hover:text-starknet-orange transition-colors">
                    Post Bounty
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-starknet-orange transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://discord.gg/starknet" target="_blank" rel="noopener noreferrer" className="hover:text-starknet-orange transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/starknet" target="_blank" rel="noopener noreferrer" className="hover:text-starknet-orange transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://github.com/starknet" target="_blank" rel="noopener noreferrer" className="hover:text-starknet-orange transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-starknet-orange transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-starknet-orange transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-starknet-orange transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 StarkQuest. Built on StarkNet.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}