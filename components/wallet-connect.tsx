"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Wallet, ChevronDown, Copy, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { connectWallet, getAccount } from "@/lib/services/starknet"

const supportedWallets = [
  {
    name: "ArgentX",
    icon: "/placeholder.svg?height=40&width=40",
    description: "The most popular StarkNet wallet",
    installed: true,
  },
  {
    name: "Braavos",
    icon: "/placeholder.svg?height=40&width=40",
    description: "Smart wallet for StarkNet",
    installed: true,
  },
  {
    name: "StarkNet Wallet",
    icon: "/placeholder.svg?height=40&width=40",
    description: "Official StarkNet wallet",
    installed: false,
  },
]

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState({ STRK: 0, ETH: 0 })

  // Check if wallet is already connected
  useEffect(() => {
    const account = getAccount();
    if (account) {
      setIsConnected(true);
      setAccountAddress(account.address);
      // Mock balance for now
      setBalance({ STRK: 1250.75, ETH: 0.045 });
    }
  }, []);

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true)
    setSelectedWallet(walletName)
    try {
      const address = await connectWallet();
      setIsConnected(true);
      setAccountAddress(address);
      // Mock balance for now
      setBalance({ STRK: 1250.75, ETH: 0.045 });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert((error as Error).message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false)
      setShowWalletModal(false)
      setSelectedWallet(null)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAccountAddress(null)
    setBalance({ STRK: 0, ETH: 0 })
  }

  const copyAddress = () => {
    if (accountAddress) {
      navigator.clipboard.writeText(accountAddress)
    }
  }

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  if (isConnected && accountAddress) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-transparent">
            <Wallet className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{shortenAddress(accountAddress)}</span>
            <span className="sm:hidden">Wallet</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Wallet Details</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">Connected to StarkNet</span>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 p-2 bg-muted rounded text-sm">{shortenAddress(accountAddress)}</code>
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Balances */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Balances</label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">STRK</span>
                  <span>{balance.STRK.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">ETH</span>
                  <span>{balance.ETH}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                View Transactions
              </Button>
              <Button variant="outline" onClick={handleDisconnect} className="flex-1 bg-transparent">
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
      <DialogTrigger asChild>
        <Button className="bg-starknet-orange hover:bg-starknet-orange/90">
          <Wallet className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your StarkNet wallet to start earning rewards and participating in bounties.
          </p>

          <div className="space-y-3">
            {supportedWallets.map((wallet) => (
              <Card
                key={wallet.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !wallet.installed ? "opacity-50" : ""
                } ${selectedWallet === wallet.name ? "border-starknet-blue" : ""}`}
                onClick={() => wallet.installed && handleConnect(wallet.name)}
              >
                <CardContent className="flex items-center space-x-3 p-4">
                  <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="h-8 w-8 rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">{wallet.description}</div>
                  </div>
                  {!wallet.installed && <Badge variant="outline">Not Installed</Badge>}
                  {isConnecting && selectedWallet === wallet.name && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <div className="font-medium">New to StarkNet?</div>
              <div>
                Install a wallet extension to get started. We recommend ArgentX for beginners.{" "}
                <a href="#" className="underline">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
