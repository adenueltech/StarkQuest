import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Calendar,
  ExternalLink,
  Github,
  Twitter,
  MessageSquare,
} from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            StarkEarn Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with builders, creators, and innovators in the StarkNet
            ecosystem
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-starknet-blue mb-2">
                2,847
              </div>
              <div className="text-sm text-muted-foreground">
                Community Members
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-starknet-orange mb-2">
                156
              </div>
              <div className="text-sm text-muted-foreground">
                Active Projects
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-starknet-pink mb-2">
                1,234
              </div>
              <div className="text-sm text-muted-foreground">Discussions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-starknet-blue mb-2">
                89
              </div>
              <div className="text-sm text-muted-foreground">
                Events This Month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Community Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-starknet-orange" />
                  Recent Discussions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title:
                      "Best practices for Cairo smart contract optimization",
                    author: "alex.stark",
                    replies: 23,
                    time: "2 hours ago",
                    tags: ["Development", "Cairo"],
                  },
                  {
                    title: "UI/UX design patterns for DeFi applications",
                    author: "sarah.design",
                    replies: 15,
                    time: "4 hours ago",
                    tags: ["Design", "DeFi"],
                  },
                  {
                    title: "StarkNet ecosystem growth and opportunities",
                    author: "mike.builder",
                    replies: 31,
                    time: "6 hours ago",
                    tags: ["General", "Ecosystem"],
                  },
                ].map((discussion, i) => (
                  <div key={i} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-2 hover:text-starknet-orange cursor-pointer">
                      {discussion.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>by {discussion.author}</span>
                        <span>{discussion.replies} replies</span>
                        <span>{discussion.time}</span>
                      </div>
                      <div className="flex gap-2">
                        {discussion.tags.map((tag, j) => (
                          <Badge
                            key={j}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-starknet-pink" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "StarkNet Developer Workshop",
                    date: "March 15, 2024",
                    time: "2:00 PM UTC",
                    type: "Workshop",
                  },
                  {
                    title: "Community AMA with Core Team",
                    date: "March 20, 2024",
                    time: "6:00 PM UTC",
                    type: "AMA",
                  },
                  {
                    title: "Bounty Creator Meetup",
                    date: "March 25, 2024",
                    time: "4:00 PM UTC",
                    type: "Meetup",
                  },
                ].map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Join Our Community</CardTitle>
                <CardDescription>
                  Connect with us on various platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Discord Server
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                  <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Be respectful and constructive</p>
                <p>• Share knowledge and help others</p>
                <p>• No spam or self-promotion</p>
                <p>• Follow StarkNet community standards</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-starknet-orange"
                >
                  Read full guidelines →
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "alex.stark", contributions: 156, avatar: "AS" },
                  { name: "sarah.design", contributions: 142, avatar: "SD" },
                  { name: "mike.builder", contributions: 128, avatar: "MB" },
                ].map((contributor, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-starknet-blue text-white text-xs flex items-center justify-center">
                      {contributor.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.contributions} contributions
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
