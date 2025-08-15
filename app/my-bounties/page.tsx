import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, CheckCircle, AlertCircle, Calendar } from "lucide-react"

export default function MyBountiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bounties</h1>
          <p className="text-muted-foreground">Manage your posted bounties and track applications</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active (3)</TabsTrigger>
            <TabsTrigger value="completed">Completed (12)</TabsTrigger>
            <TabsTrigger value="draft">Drafts (2)</TabsTrigger>
            <TabsTrigger value="applications">Applications (8)</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {[
              {
                title: "Build DeFi Dashboard UI",
                description: "Create a modern, responsive dashboard for DeFi protocol analytics",
                reward: "$2,500",
                applications: 12,
                deadline: "March 20, 2024",
                status: "active",
                category: "Design",
              },
              {
                title: "Smart Contract Audit",
                description: "Security audit for lending protocol smart contracts",
                reward: "$5,000",
                applications: 6,
                deadline: "March 25, 2024",
                status: "active",
                category: "Development",
              },
              {
                title: "Technical Documentation",
                description: "Comprehensive API documentation and integration guides",
                reward: "$1,200",
                applications: 8,
                deadline: "March 18, 2024",
                status: "active",
                category: "Content",
              },
            ].map((bounty, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{bounty.title}</CardTitle>
                      <CardDescription>{bounty.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {bounty.reward}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {bounty.applications} applications
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {bounty.deadline}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{bounty.category}</Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm">View Applications</Button>
                      <Button size="sm" variant="outline">
                        Edit Bounty
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      Close Bounty
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">12 Completed Bounties</h3>
              <p className="text-muted-foreground">Your successfully completed bounties will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">2 Draft Bounties</h3>
              <p className="text-muted-foreground">Complete and publish your draft bounties</p>
              <Button className="mt-4">Continue Editing</Button>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">8 Pending Applications</h3>
              <p className="text-muted-foreground">Review and manage applications to your bounties</p>
              <Button className="mt-4">Review Applications</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
