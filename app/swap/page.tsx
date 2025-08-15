"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ArrowUpDown, Settings, Info, Zap } from "lucide-react"

export default function SwapPage() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState("STRK")
  const [toToken, setToToken] = useState("USDC")

  const tokens = [
    { symbol: "STRK", name: "StarkNet Token", balance: "1,250.00" },
    { symbol: "USDC", name: "USD Coin", balance: "500.00" },
    { symbol: "ETH", name: "Ethereum", balance: "2.5" },
    { symbol: "USDT", name: "Tether USD", balance: "750.00" },
    { symbol: "DAI", name: "Dai Stablecoin", balance: "300.00" },
  ]

  const swapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-starknet-blue mb-2">Token Swap</h1>
            <p className="text-muted-foreground">Swap tokens instantly on StarkNet with the best rates</p>
            <p className="text-starknet-orange text-sm mt-2">Connect your wallet to start swapping</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Swap Interface */}
            <div className="lg:col-span-2">
              <Card className="border-starknet-pink/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-starknet-blue">Swap Tokens</CardTitle>
                    <Button variant="ghost" size="sm" className="text-starknet-pink hover:text-starknet-pink/80">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* From Token */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From</span>
                      <span className="text-muted-foreground">
                        Balance: {tokens.find((t) => t.symbol === fromToken)?.balance} {fromToken}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          placeholder="0.0"
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
                      className="text-starknet-orange hover:text-starknet-orange/80"
                      onClick={() => setFromAmount(tokens.find((t) => t.symbol === fromToken)?.balance || "")}
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
                        Balance: {tokens.find((t) => t.symbol === toToken)?.balance} {toToken}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={toAmount}
                          onChange={(e) => setToAmount(e.target.value)}
                          placeholder="0.0"
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

                  <Button className="w-full h-12 bg-starknet-orange hover:bg-starknet-orange/90">
                    <Zap className="w-4 h-4 mr-2" />
                    Swap Tokens
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-starknet-pink/20">
                <CardHeader>
                  <CardTitle className="text-lg text-starknet-blue">Your Balances</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <div className="font-medium text-starknet-orange">{token.balance}</div>
                        </div>
                      </div>
                    ))}
                  </div>
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
