"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Wallet, ChevronDown, Copy, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
// Import your starknet service functions
import { Contract, RpcProvider } from "starknet"

const supportedWallets = [
  {
    name: "ArgentX",
    icon: "/placeholder.svg?height=40&width=40",
    description: "The most popular StarkNet wallet",
    id: "argentX"
  },
  {
    name: "Braavos",
    icon: "/placeholder.svg?height=40&width=40", 
    description: "Smart wallet for StarkNet",
    id: "braavos"
  }
]

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState({ STRK: 0, ETH: 0 })
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // StarkNet token contract addresses (mainnet)
  const TOKEN_CONTRACTS = {
    STRK: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // STRK token
    ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'   // ETH token
  }

  // Fetch real token balance
  const fetchTokenBalance = async (walletAccount: any, tokenAddress: string, decimals: number = 18) => {
    try {
      const result = await walletAccount.callContract({
        contractAddress: tokenAddress,
        entrypoint: 'balanceOf',
        calldata: [walletAccount.address]
      })

      if (result && result.length > 0) {
        // Convert from wei/smallest unit to token units
        const balance = parseInt(result[0], 16)
        return balance / Math.pow(10, decimals)
      }
      return 0
    } catch (error) {
      console.error(`Error fetching balance for ${tokenAddress}:`, error)
      return 0
    }
  }

  // Fetch all balances
  const fetchBalances = async (walletAccount: any) => {
    setIsLoadingBalance(true)
    try {
      console.log('Fetching balances for:', walletAccount.address)
      
      // Fetch both STRK and ETH balances in parallel
      const [strkBalance, ethBalance] = await Promise.all([
        fetchTokenBalance(walletAccount, TOKEN_CONTRACTS.STRK, 18),
        fetchTokenBalance(walletAccount, TOKEN_CONTRACTS.ETH, 18)
      ])

      console.log('Fetched balances:', { STRK: strkBalance, ETH: ethBalance })
      
      setBalance({
        STRK: strkBalance,
        ETH: ethBalance
      })
    } catch (error) {
      console.error('Error fetching balances:', error)
      // Keep existing balance or set to 0
      setBalance({ STRK: 0, ETH: 0 })
    } finally {
      setIsLoadingBalance(false)
    }
  }
  const checkWalletInstallation = () => {
    const isArgentXInstalled = typeof window !== 'undefined' && 
      (window as any).starknet_argentX && 
      typeof (window as any).starknet_argentX.enable === 'function'
    
    const isBraavosInstalled = typeof window !== 'undefined' && 
      (window as any).starknet_braavos && 
      typeof (window as any).starknet_braavos.enable === 'function'

    return supportedWallets.map(wallet => ({
      ...wallet,
      installed: wallet.id === "argentX" ? isArgentXInstalled : isBraavosInstalled
    }))
  }

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if ArgentX is connected
        const argentX = (window as any).starknet_argentX;
        if (argentX && argentX.isConnected && argentX.account) {
          setIsConnected(true);
          setAccountAddress(argentX.account.address);
          await fetchBalances(argentX.account);
          return;
        }

        // Check if Braavos is connected
        const braavos = (window as any).starknet_braavos;
        if (braavos && braavos.isConnected && braavos.account) {
          setIsConnected(true);
          setAccountAddress(braavos.account.address);
          await fetchBalances(braavos.account);
          return;
        }

        // Replace this with your actual getAccount function if you have one
        // const account = getAccount();
        // if (account) {
        //   setIsConnected(true);
        //   setAccountAddress(account.address);
        //   await fetchBalances(account);
        // }
      } catch (error) {
        console.log("No wallet connected yet");
      }
    }
    
    if (typeof window !== 'undefined') {
      checkConnection();
    }
  }, []);

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true)
    setSelectedWallet(walletName)
    setError(null)
    
    try {
      console.log(`Attempting to connect to ${walletName}...`);
      
      let walletObj;
      
      // Get the correct wallet object
      if (walletName.toLowerCase() === "argentx") {
        walletObj = (window as any).starknet_argentX;
      } else if (walletName.toLowerCase() === "braavos") {
        walletObj = (window as any).starknet_braavos;
      }
      
      if (!walletObj) {
        throw new Error(`${walletName} wallet is not installed. Please install the extension first.`);
      }

      console.log(`Found ${walletName} wallet object:`, walletObj);

      // Check if wallet is available and has enable method
      if (typeof walletObj.enable !== 'function') {
        throw new Error(`${walletName} wallet is not properly initialized.`);
      }

      // Enable the wallet connection
      console.log(`Enabling ${walletName}...`);
      
      // Try enabling with a timeout
      const enablePromise = walletObj.enable();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout - please check your wallet')), 30000)
      );
      
      await Promise.race([enablePromise, timeoutPromise]);
      
      console.log(`${walletName} enabled successfully`);

      // Check if wallet is connected
      if (!walletObj.isConnected) {
        throw new Error(`${walletName} wallet is not connected after enable`);
      }

      // Get the account
      const account = walletObj.account;
      if (!account || !account.address) {
        throw new Error("Failed to get account from wallet");
      }

      console.log(`Connected to address: ${account.address}`);

      setIsConnected(true);
      setAccountAddress(account.address);
      
      // Fetch real balances instead of mock data
      await fetchBalances(walletObj.account);
      
      setShowWalletModal(false);
      
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      
      if (error.message?.includes("timeout") || error.message?.includes("Timeout")) {
        userMessage = "Connection timed out. Please check your wallet extension and try again. Make sure to approve the connection prompt.";
      } else if (error.message?.includes("User rejected") || error.message?.includes("cancelled") || error.message?.includes("denied")) {
        userMessage = "Connection was cancelled. Please try again and approve the connection in your wallet.";
      } else if (error.message?.includes("not installed") || error.message?.includes("not found")) {
        userMessage = `${walletName} wallet extension not found. Please make sure it's installed and enabled.`;
      } else if (error.message?.includes("not initialized")) {
        userMessage = `${walletName} wallet is not ready. Please refresh the page and try again.`;
      }
      
      setError(userMessage);
    } finally {
      setIsConnecting(false)
      setSelectedWallet(null)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAccountAddress(null)
    setBalance({ STRK: 0, ETH: 0 })
    setError(null)
  }

  const copyAddress = async () => {
    if (accountAddress) {
      try {
        await navigator.clipboard.writeText(accountAddress)
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy address:", error)
      }
    }
  }

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // Get wallets with installation status
  const walletsWithInstallation = checkWalletInstallation();

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
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{shortenAddress(accountAddress)}</code>
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => window.open(`https://starkscan.co/contract/${accountAddress}`, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Balances */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Balances</label>
              {isLoadingBalance ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading balances...</span>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">STRK</span>
                    <span>{balance.STRK.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">ETH</span>
                    <span>{balance.ETH.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent"
                onClick={() => window.open(`https://starkscan.co/contract/${accountAddress}`, '_blank')}
              >
                View Transactions
              </Button>
              <Button variant="outline" onClick={handleDisconnect} className="flex-1 bg-transparent">
                Disconnect
              </Button>
            </div>

            {/* Refresh Balance Button */}
            <Button 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={() => {
                const argentX = (window as any).starknet_argentX;
                const braavos = (window as any).starknet_braavos;
                const activeWallet = argentX?.isConnected ? argentX : braavos?.isConnected ? braavos : null;
                if (activeWallet?.account) {
                  fetchBalances(activeWallet.account);
                }
              }}
              disabled={isLoadingBalance}
            >
              {isLoadingBalance ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Refreshing...
                </>
              ) : (
                'Refresh Balance'
              )}
            </Button>
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

          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <div className="font-medium">Connection Error</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {walletsWithInstallation.map((wallet) => (
              <Card
                key={wallet.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !wallet.installed ? "opacity-50 cursor-not-allowed" : ""
                } ${selectedWallet === wallet.name ? "border-starknet-blue" : ""}`}
                onClick={() => wallet.installed && handleConnect(wallet.name)}
              >
                <CardContent className="flex items-center space-x-3 p-4">
                  <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="h-8 w-8 rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">{wallet.description}</div>
                    {isConnecting && selectedWallet === wallet.name && (
                      <div className="text-xs text-starknet-orange mt-1">
                        Check your wallet for connection prompt...
                      </div>
                    )}
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
                <a href="https://www.argent.xyz/argent-x/" target="_blank" rel="noopener noreferrer" className="underline">
                  Install ArgentX
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}