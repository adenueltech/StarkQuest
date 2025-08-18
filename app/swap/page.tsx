"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Settings, Info, Zap, Wallet, RefreshCw, Loader2, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"

export default function SwapPage() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState("STRK")
  const [toToken, setToToken] = useState("USDC")
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Wallet state
  const [isConnected, setIsConnected] = useState(false)
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Token configurations with contract addresses
  const tokens = [
    { 
      symbol: "STRK", 
      name: "StarkNet Token", 
      address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      decimals: 18 
    },
    { 
      symbol: "USDC", 
      name: "USD Coin", 
      address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      decimals: 6 
    },
    { 
      symbol: "ETH", 
      name: "Ethereum", 
      address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      decimals: 18 
    },
    { 
      symbol: "USDT", 
      name: "Tether USD", 
      address: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      decimals: 6 
    },
    { 
      symbol: "DAI", 
      name: "Dai Stablecoin", 
      address: "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
      decimals: 18 
    },
  ]

  // Fetch token balance from wallet
  const fetchTokenBalance = async (walletAccount: any, tokenAddress: string, decimals: number = 18) => {
    try {
      const result = await walletAccount.callContract({
        contractAddress: tokenAddress,
        entrypoint: 'balanceOf',
        calldata: [walletAccount.address]
      })

      if (result && result.length > 0) {
        const balance = parseInt(result[0], 16)
        return balance / Math.pow(10, decimals)
      }
      return 0
    } catch (error) {
      console.error(`Error fetching balance for ${tokenAddress}:`, error)
      return 0
    }
  }

  // Fetch all token balances
  const fetchAllBalances = async (walletAccount: any) => {
    setIsLoadingBalances(true)
    const newBalances: Record<string, number> = {}
    
    try {
      // Fetch balances for all tokens in parallel
      const balancePromises = tokens.map(async (token) => {
        const balance = await fetchTokenBalance(walletAccount, token.address, token.decimals)
        return { symbol: token.symbol, balance }
      })

      const results = await Promise.all(balancePromises)
      results.forEach(({ symbol, balance }) => {
        newBalances[symbol] = balance
      })

      setBalances(newBalances)
    } catch (error) {
      console.error('Error fetching balances:', error)
      // Keep existing balances on error
    } finally {
      setIsLoadingBalances(false)
    }
  }

  // Check wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if ArgentX is connected
        const argentX = (window as any).starknet_argentX;
        if (argentX && argentX.isConnected && argentX.account) {
          setIsConnected(true)
          setAccountAddress(argentX.account.address)
          await fetchAllBalances(argentX.account)
          return
        }

        // Check if Braavos is connected
        const braavos = (window as any).starknet_braavos;
        if (braavos && braavos.isConnected && braavos.account) {
          setIsConnected(true)
          setAccountAddress(braavos.account.address)
          await fetchAllBalances(braavos.account)
          return
        }
      } catch (error) {
        console.log("No wallet connected")
      }
    }
    
    if (typeof window !== 'undefined') {
      checkConnection()
    }
  }, [])

  // Connect wallet function
  const connectWallet = async (walletName: string) => {
    setIsConnecting(true)
    setError(null)
    
    try {
      let walletObj;
      
      if (walletName.toLowerCase() === "argentx") {
        walletObj = (window as any).starknet_argentX;
      } else if (walletName.toLowerCase() === "braavos") {
        walletObj = (window as any).starknet_braavos;
      }
      
      if (!walletObj) {
        throw new Error(`${walletName} wallet is not installed. Please install the extension first.`);
      }

      if (typeof walletObj.enable !== 'function') {
        throw new Error(`${walletName} wallet is not properly initialized.`);
      }

      await walletObj.enable();
      
      if (!walletObj.isConnected) {
        throw new Error(`${walletName} wallet is not connected after enable`);
      }

      const account = walletObj.account;
      if (!account || !account.address) {
        throw new Error("Failed to get account from wallet");
      }

      setIsConnected(true);
      setAccountAddress(account.address);
      await fetchAllBalances(account);
      
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false)
    setAccountAddress(null)
    setBalances({})
    setError(null)
  }

  // Get active wallet account
  const getActiveWallet = () => {
    const argentX = (window as any).starknet_argentX;
    const braavos = (window as any).starknet_braavos;
    
    if (argentX?.isConnected && argentX?.account) return argentX;
    if (braavos?.isConnected && braavos?.account) return braavos;
    return null;
  }

  // Refresh balances
  const refreshBalances = async () => {
    const activeWallet = getActiveWallet();
    if (activeWallet?.account) {
      setIsRefreshing(true)
      await fetchAllBalances(activeWallet.account)
      setIsRefreshing(false)
    }
  }

  // Swap tokens
  const swapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  // Handle max click
  const handleMaxClick = () => {
    const balance = balances[fromToken] || 0
    setFromAmount(balance.toString())
  }

  // Format balance display
  const formatBalance = (balance: number) => {
    if (balance === 0) return "0.00"
    if (balance < 0.01) return "<0.01"
    return balance.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  // Shorten address for display
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-starknet-blue mb-2">Token Swap</h1>
            <p className="text-muted-foreground">Swap tokens instantly on StarkNet with the best rates</p>
            
            {!isConnected ? (
              <div className="mt-4 p-4 bg-starknet-orange/10 border border-starknet-orange/20 rounded-lg">
                <p className="text-starknet-orange text-sm mb-3">Connect your wallet to start swapping</p>
                {error && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
                    {error}
                  </div>
                )}
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => connectWallet("argentx")}
                    disabled={isConnecting}
                    variant="outline"
                    size="sm"
                    className="border-starknet-orange text-starknet-orange hover:bg-starknet-orange/10"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Wallet className="w-4 h-4 mr-2" />
                    )}
                    ArgentX
                  </Button>
                  <Button
                    onClick={() => connectWallet("braavos")}
                    disabled={isConnecting}
                    variant="outline"
                    size="sm"
                    className="border-starknet-orange text-starknet-orange hover:bg-starknet-orange/10"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Wallet className="w-4 h-4 mr-2" />
                    )}
                    Braavos
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">
                  Connected: {shortenAddress(accountAddress || "")}
                  <Button
                    onClick={disconnectWallet}
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    Disconnect
                  </Button>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Swap Interface */}
            <div className="lg:col-span-2">
              <Card className="border-starknet-pink/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-starknet-blue">Swap Tokens</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={refreshBalances}
                        disabled={!isConnected || isRefreshing || isLoadingBalances}
                        className="text-starknet-orange hover:text-starknet-orange/80"
                      >
                        <RefreshCw className={`w-4 h-4 ${(isRefreshing || isLoadingBalances) ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-starknet-pink hover:text-starknet-pink/80">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* From Token */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From</span>
                      <span className="text-muted-foreground">
                        Balance: {isConnected ? (
                          isLoadingBalances ? (
                            <span className="inline-block w-12 h-4 bg-gray-200 animate-pulse rounded"></span>
                          ) : (
                            `${formatBalance(balances[fromToken] || 0)} ${fromToken}`
                          )
                        ) : (
                          `-- ${fromToken}`
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          placeholder="0.0"
                          disabled={!isConnected}
                          className="text-lg h-12 border-starknet-pink/30 focus:border-starknet-orange"
                        />
                      </div>
                      <Select value={fromToken} onValueChange={setFromToken}>
                        <SelectTrigger className="w-32 h-12 border-starknet-pink/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-starknet-blue rounded-full flex items-center justify-center text-white text-xs">
                                  {token.symbol[0]}
                                </div>
                                {token.symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!isConnected || !balances[fromToken] || balances[fromToken] === 0}
                      className="text-starknet-orange hover:text-starknet-orange/80"
                      onClick={handleMaxClick}
                    >
                      Max
                    </Button>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={swapTokens}
                      className="rounded-full w-10 h-10 p-0 border-2 border-starknet-pink hover:border-starknet-orange bg-transparent"
                    >
                      <ArrowUpDown className="w-4 h-4 text-starknet-pink" />
                    </Button>
                  </div>

                  {/* To Token */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">To</span>
                      <span className="text-muted-foreground">
                        Balance: {isConnected ? (
                          isLoadingBalances ? (
                            <span className="inline-block w-12 h-4 bg-gray-200 animate-pulse rounded"></span>
                          ) : (
                            `${formatBalance(balances[toToken] || 0)} ${toToken}`
                          )
                        ) : (
                          `-- ${toToken}`
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={toAmount}
                          onChange={(e) => setToAmount(e.target.value)}
                          placeholder="0.0"
                          disabled={!isConnected}
                          className="text-lg h-12 border-starknet-pink/30 focus:border-starknet-orange"
                        />
                      </div>
                      <Select value={toToken} onValueChange={setToToken}>
                        <SelectTrigger className="w-32 h-12 border-starknet-pink/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-starknet-pink rounded-full flex items-center justify-center text-white text-xs">
                                  {token.symbol[0]}
                                </div>
                                {token.symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Swap Details */}
                  <div className="bg-starknet-blue/10 rounded-lg p-4 space-y-2 border border-starknet-pink/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Rate</span>
                      <span className="text-starknet-orange">
                        1 {fromToken} = 0.85 {toToken}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price Impact</span>
                      <span className="text-starknet-pink">0.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="text-starknet-orange">~0.001 ETH</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 bg-starknet-orange hover:bg-starknet-orange/90"
                    disabled={!isConnected || !fromAmount || parseFloat(fromAmount) === 0}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {!isConnected ? "Connect Wallet to Swap" : "Swap Tokens"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-starknet-pink/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-starknet-blue">Your Balances</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshBalances}
                      disabled={!isConnected || isRefreshing || isLoadingBalances}
                      className="text-starknet-orange hover:text-starknet-orange/80"
                    >
                      <RefreshCw className={`w-3 h-3 ${(isRefreshing || isLoadingBalances) ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!isConnected ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Connect your wallet to view balances</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tokens.map((token) => (
                        <div key={token.symbol} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-starknet-orange rounded-full flex items-center justify-center text-white text-sm">
                              {token.symbol[0]}
                            </div>
                            <div>
                              <div className="font-medium">{token.symbol}</div>
                              <div className="text-xs text-muted-foreground">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            {isLoadingBalances ? (
                              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                              <div className="font-medium text-starknet-orange">
                                {formatBalance(balances[token.symbol] || 0)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-starknet-pink/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-starknet-blue">
                    <Info className="w-4 h-4 mr-2" />
                    Swap Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>• Powered by StarkNet's native AMM</p>
                    <p>• Low fees and fast transactions</p>
                    <p>• Slippage tolerance: 0.5%</p>
                    <p>• MEV protection enabled</p>
                    <p>• Real-time balance updates</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}