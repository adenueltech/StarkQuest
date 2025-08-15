"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, PlusCircle, Trophy, User, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"

const BASE_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bounties", label: "Bounties", icon: Target },
  { href: "/post-bounty", label: "Post", icon: PlusCircle, emphasize: true },
  { href: "/leaderboard", label: "Leaders", icon: Trophy },
]

export default function MobileTabBar({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname()

  // Dynamic tabs based on login status
  const TABS = loggedIn 
    ? [
        ...BASE_TABS,
        { href: "/profile", label: "Profile", icon: User },
      ]
    : [
        ...BASE_TABS,
        { href: "/login", label: "Login", icon: LogIn },
      ]

  return (
    <nav className="fixed bottom-2 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto w-[95%] rounded-2xl border bg-background/80 backdrop-blur shadow-xl">
        <ul className="grid grid-cols-5 items-center text-xs">
          {TABS.map(({ href, label, icon: Icon, emphasize }) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href))
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className={cn(
                    "group flex flex-col items-center justify-center py-2 transition-all duration-300",
                    active ? "text-starknet-orange" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "rounded-full p-2 transition-all duration-300",
                      active ? "scale-110 bg-starknet-orange/10" : "group-hover:scale-105"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={cn("mt-1", active && "font-medium")}>{label}</span>
                </Link>
                {active && (
                  <span className="pointer-events-none absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-starknet-orange/40 animate-pulse" />
                )}
                {emphasize && (
                  <span className="pointer-events-none absolute -top-2 right-4 h-2 w-2 animate-bounce rounded-full bg-starknet-pink" />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}