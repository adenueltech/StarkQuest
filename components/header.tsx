"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  User,
  Menu,
  Moon,
  Sun,
  LogOut,
  X,
  Home,
  PlusCircle,
  Trophy,
  Users,
  ArrowLeftRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletConnect } from "@/components/wallet-connect";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navigationItems = [
    { href: "/bounties", label: "Browse Bounties", icon: Home },
    {
      href: "/post-bounty",
      label: "Create Bounty",
      icon: PlusCircle,
      authRequired: true,
    },
    { href: "/swap", label: "Swap", icon: ArrowLeftRight },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/community", label: "Community", icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="StarkEarn Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/bounties"
              className="text-sm font-medium hover:text-starknet-orange transition-colors"
            >
              Browse Bounties
            </Link>
            {isAuthenticated && (
              <Link
                href="/post-bounty"
                className="text-sm font-medium hover:text-starknet-orange transition-colors"
              >
                Create Bounty
              </Link>
            )}
            <Link
              href="/swap"
              className="text-sm font-medium hover:text-starknet-orange transition-colors"
            >
              Swap
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium hover:text-starknet-orange transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium hover:text-starknet-orange transition-colors"
            >
              Community
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bounties..." className="pl-8" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle - Always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications - Desktop only */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden md:flex"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-starknet-pink">
                    3
                  </Badge>
                </Button>

                {/* Wallet Connect - Desktop only */}
                <div className="hidden md:block">
                  <WalletConnect />
                </div>

                {/* User Menu - Desktop only */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user?.avatar ||
                              "/placeholder.svg?height=32&width=32"
                            }
                            alt="User"
                          />
                          <AvatarFallback>
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.username}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
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
                        <Link href="/dashboard">Dashboard</Link>
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
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              /* Sign In/Sign Up buttons - Desktop only */
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  className="bg-starknet-orange hover:bg-starknet-orange/90"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`
        fixed right-0 top-0 z-50 h-full w-[320px] bg-background border-l border-border
        transform transition-transform duration-300 ease-in-out md:hidden overflow-hidden
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            <div className="flex flex-col space-y-6">
              {/* User Profile Section */}
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        user?.avatar || "/placeholder.svg?height=48&width=48"
                      }
                      alt={user?.username}
                    />
                    <AvatarFallback className="text-lg">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Search */}
              <div className="lg:hidden">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search bounties..." className="pl-8" />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  // Skip auth-required items if not authenticated
                  if (item.authRequired && !isAuthenticated) return null;

                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 text-base font-medium hover:text-starknet-orange transition-colors py-3 px-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Theme Toggle for Mobile */}
              <div className="sm:hidden border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                    setIsOpen(false);
                  }}
                >
                  <Sun className="mr-3 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute mr-3 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="ml-6">Toggle Theme</span>
                </Button>
              </div>

              {isAuthenticated ? (
                <>
                  {/* User Actions */}
                  <div className="border-t pt-4 space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-base font-medium hover:text-starknet-orange transition-colors py-3 px-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 text-base font-medium hover:text-starknet-orange transition-colors py-3 px-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/my-bounties"
                      className="flex items-center space-x-3 text-base font-medium hover:text-starknet-orange transition-colors py-3 px-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <Trophy className="h-5 w-5" />
                      <span>My Bounties</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 text-base font-medium hover:text-starknet-orange transition-colors py-3 px-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>

                    {/* Notifications Mobile */}
                    <div className="flex items-center space-x-3 py-3 px-2">
                      <Bell className="h-5 w-5" />
                      <span className="text-base font-medium">
                        Notifications
                      </span>
                      <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs bg-starknet-pink">
                        3
                      </Badge>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-base font-medium hover:text-red-500 transition-colors py-3 px-2 rounded-md hover:bg-muted w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t pt-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="w-full bg-starknet-orange hover:bg-starknet-orange/90"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
