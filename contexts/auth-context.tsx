"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { connectWallet, getAccount } from "@/lib/services/starknet"

export type UserRole = "creator" | "hunter"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  avatar?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  skills?: string[]
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  signup: (data: { username: string; email: string; password: string; role: UserRole }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithWallet: () => Promise<void>
  logout: () => void
  connectWallet: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if wallet is already connected
    const account = getAccount();
    if (account) {
      // Create a mock user based on wallet address
      const mockUser: User = {
        id: account.address,
        username: `user_${account.address.substring(0, 8)}`,
        email: `${account.address.substring(0, 8)}@starknet.wallet`,
        role: "hunter",
        walletAddress: account.address
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const signup: AuthContextType["signup"] = async ({ username, email, password, role }) => {
    // For email-based signup, create a user object
    const newUser: User = {
      id: `email_${email}`,
      username,
      email,
      role,
    };
    setUser(newUser);
    router.push("/dashboard");
  }

  const login: AuthContextType["login"] = async (email, password) => {
    // For email-based login, create a user object
    // In a real app, you would verify credentials with a backend
    const newUser: User = {
      id: `email_${email}`,
      username: email.split("@")[0],
      email,
      role: "hunter",
    };
    setUser(newUser);
    router.push("/dashboard");
  }

  const loginWithWallet: AuthContextType["loginWithWallet"] = async () => {
    try {
      const walletAddress = await connectWallet();
      // Create a mock user based on wallet address
      const mockUser: User = {
        id: walletAddress,
        username: `user_${walletAddress.substring(0, 8)}`,
        email: `${walletAddress.substring(0, 8)}@starknet.wallet`,
        role: "hunter",
        walletAddress
      };
      setUser(mockUser);
      router.push("/dashboard");
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${(error as Error).message}`);
    }
  }

  const connectWalletOnly: AuthContextType["connectWallet"] = async () => {
    try {
      const walletAddress = await connectWallet();
      // Update the current user with wallet address
      if (user) {
        setUser({
          ...user,
          walletAddress
        });
      }
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${(error as Error).message}`);
    }
  }

  const logout = () => {
    setUser(null);
    // Note: We don't disconnect the wallet here as it's managed by the wallet extension
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signup, login, loginWithWallet: loginWithWallet, logout, connectWallet: connectWalletOnly }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}