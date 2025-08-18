"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Trophy, User, LogOut, ArrowLeftRight } from "lucide-react";

export default function MobileBottomTab({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const tabs = loggedIn
    ? [
        { href: "/bounties", icon: <Home />, label: "Bounties" },
        { href: "/post-bounty", icon: <PlusCircle />, label: "Post" },
        { href: "/swap", icon: <ArrowLeftRight />, label: "Swap" },
        { href: "/leaderboard", icon: <Trophy />, label: "Leader" },
        { href: "/profile", icon: <User />, label: "Profile" },
      ]
    : [
        { href: "/bounties", icon: <Home />, label: "Bounties" },
        { href: "/post-bounty", icon: <PlusCircle />, label: "Post" },
        { href: "/swap", icon: <ArrowLeftRight />, label: "Swap" },
        { href: "/leaderboard", icon: <Trophy />, label: "Leader" },
        { href: "/signup", icon: <User />, label: "Login" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border md:hidden flex justify-around py-2 z-50">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={`flex flex-col items-center text-sm ${pathname === tab.href ? "text-primary" : "text-muted-foreground"}`}>
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}