"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionHistory } from "@/components/transaction-history";
import {
  Wallet,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";

// Mock wallet data
const walletData = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  balances: [
    { token: "STRK", amount: 1250.75, usdValue: 2501.5, change: "+5.2%" },
    { token: "ETH", amount: 0.045, usdValue: 108.0, change: "-2.1%" },
    { token: "USDC", amount: 500.0, usdValue: 500.0, change: "0.0%" },
  ],
  totalValue: 3109.5,
  transactions: [
    {
      id: "1",
      type: "received",
      amount: 2500,
      token: "STRK",
      from: "StarkDeFi Protocol",
      description: "Bounty payment for DeFi Dashboard",
      timestamp: "2024-01-20T10:30:00Z",
      status: "completed",
      hash: "0xabc123...",
    },
    {
      id: "2",
      type: "sent",
      amount: 50,
      token: "STRK",
      to: "Platform Fee",
      description: "Platform fee for bounty posting",
      timestamp: "2024-01-19T15:45:00Z",
      status: "completed",
      hash: "0xdef456...",
    },
    {
      id: "3",
      type: "pending",
      amount: 1800,
      token: "STRK",
      from: "YieldStark",
      description: "Bounty payment for UI/UX Design",
      timestamp: "2024-01-18T09:15:00Z",
      status: "pending",
      hash: "0x789ghi...",
    },
  ],
  escrowBalances: [
    {
      bountyId: "1",
      title: "Mobile Wallet Integration",
      amount: 4000,
      token: "STRK",
      status: "in-progress",
      releaseDate: "2024-03-01",
    },
    {
      bountyId: "2",
      title: "Smart Contract Optimization",
      amount: 3000,
      token: "STRK",
      status: "in-progress",
      releaseDate: "2024-02-12",
    },
  ],
};

export default function WalletPage() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "received":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "sent":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <Wallet className="inline-block mr-3 h-8 w-8 text-starknet-orange" />
              Wallet
            </h1>
            <p className="text-muted-foreground">
              Manage your StarkNet assets and transactions
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
              <DialogTrigger asChild>
                <Button className="bg-starknet-orange hover:bg-starknet-orange/90">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Tokens</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="amount"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                      />
                      <select className="border rounded px-3 py-2">
                        <option>STRK</option>
                        <option>ETH</option>
                        <option>USDC</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSendModal(false)}
                      className="flex-1 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-starknet-blue hover:bg-starknet-blue/90">
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </div>
        </div>

        {/* Wallet Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Portfolio Balance</span>
                <Badge className="bg-green-100 text-green-800">
                  +3.2% (24h)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-starknet-orange mb-4">
                ${walletData.totalValue.toLocaleString()}
              </div>

              <div className="space-y-3">
                {walletData.balances.map((balance) => (
                  <div
                    key={balance.token}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-starknet-blue/10 flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {balance.token}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {balance.amount} {balance.token}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${balance.usdValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        balance.change.startsWith("+")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {balance.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wallet Info */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Address</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-xs bg-muted p-2 rounded flex-1 truncate">
                    {walletData.address}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Network</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">StarkNet Mainnet</span>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  Wallet Type
                </Label>
                <div className="text-sm mt-1">ArgentX</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-6">
            <TransactionHistory />
          </TabsContent>

          {/* Escrow */}
          <TabsContent value="escrow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Escrow Balances</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData.escrowBalances.map((escrow) => (
                    <div
                      key={escrow.bountyId}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{escrow.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Release date:{" "}
                          {new Date(escrow.releaseDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-starknet-orange">
                          {escrow.amount.toLocaleString()} {escrow.token}
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {escrow.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">About Escrow</div>
                      <div>
                        Funds are held in smart contract escrow until bounty
                        completion. This ensures secure payments for both
                        clients and contributors.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Notifications</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          Transaction Confirmations
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Get notified when transactions are confirmed
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Escrow Updates</div>
                        <div className="text-sm text-muted-foreground">
                          Notifications for escrow status changes
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Security</Label>
                  <div className="space-y-3 mt-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      View Recovery Phrase
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connected Apps
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Solo</Label>
                  <div className="space-y-3 mt-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Minus className="mr-2 h-4 w-4" />
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
