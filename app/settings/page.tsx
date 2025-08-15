import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Wallet, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-lg">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="john.stark" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Full-stack developer passionate about DeFi and StarkNet ecosystem. 5+ years experience in blockchain development."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Cairo", "Smart Contracts", "UI/UX"].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      + Add Skill
                    </Button>
                  </div>
                </div>

                <Button className="bg-starknet-blue hover:bg-starknet-blue/90">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "New Bounty Matches",
                    description: "Get notified when bounties match your skills",
                    enabled: true,
                  },
                  { title: "Application Updates", description: "Updates on your bounty applications", enabled: true },
                  {
                    title: "Payment Notifications",
                    description: "Notifications about payments and earnings",
                    enabled: true,
                  },
                  {
                    title: "Community Updates",
                    description: "News and updates from the StarkQuest community",
                    enabled: false,
                  },
                  { title: "Marketing Emails", description: "Product updates and promotional content", enabled: false },
                ].map((notification, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch defaultChecked={notification.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Settings
                </CardTitle>
                <CardDescription>Manage your connected wallets and payment preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-starknet-blue flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AX</span>
                      </div>
                      <div>
                        <p className="font-medium">ArgentX Wallet</p>
                        <p className="text-sm text-muted-foreground">0x1234...5678</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Connect Additional Wallet
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Payment Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Auto-accept payments</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email payment confirmations</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Preferences
                </CardTitle>
                <CardDescription>Customize your StarkQuest experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Light
                      </Button>
                      <Button variant="outline" size="sm">
                        Dark
                      </Button>
                      <Button variant="outline" size="sm">
                        System
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>UTC</option>
                      <option>EST</option>
                      <option>PST</option>
                      <option>GMT</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Show profile in public directory</span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Allow direct messages</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="bg-starknet-orange hover:bg-starknet-orange/90">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
