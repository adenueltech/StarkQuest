"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, User, Menu, Moon, Sun, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletConnect } from "@/components/wallet-connect"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="StarkQuest Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
         
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/bounties" className="text-sm font-medium hover:text-starknet-orange transition-colors">
            Browse Bounties
          </Link>
          {isAuthenticated && (
            <Link href="/post-bounty" className="text-sm font-medium hover:text-starknet-orange transition-colors">
              Post Bounty
            </Link>
          )}
          <Link href="/leaderboard" className="text-sm font-medium hover:text-starknet-orange transition-colors">
            Leaderboard
          </Link>
          <Link href="/community" className="text-sm font-medium hover:text-starknet-orange transition-colors">
            Community
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bounties..." className="pl-8" />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <>
              {/* Notifications - Hidden on mobile */}
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-starknet-pink">3</Badge>
              </Button>

              <WalletConnect />

              {/* User Menu - Hidden on mobile */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt="User" />
                        <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-bounties">My Bounties</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet">Wallet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            /* Sign In/Sign Up buttons - Hidden on mobile */
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-starknet-orange hover:bg-starknet-orange/90" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}