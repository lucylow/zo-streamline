"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { PublicKey } from "@solana/web3.js"

interface PhantomWallet {
  publicKey: PublicKey
  signTransaction: (transaction: any) => Promise<any>
  signAllTransactions: (transactions: any[]) => Promise<any[]>
  connect: () => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
}

interface WalletContextType {
  wallet: PhantomWallet | null
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<PhantomWallet | null>(null)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if Phantom wallet is installed
  const getPhantomWallet = useCallback((): PhantomWallet | null => {
    if (typeof window !== "undefined") {
      const { solana } = window as any
      if (solana?.isPhantom) {
        return solana
      }
    }
    return null
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    setError(null)
    setConnecting(true)

    try {
      const phantomWallet = getPhantomWallet()

      if (!phantomWallet) {
        throw new Error("Phantom wallet not installed. Please install it from phantom.app")
      }

      const response = await phantomWallet.connect()
      setWallet(phantomWallet)
      setPublicKey(response.publicKey)
      setConnected(true)

      console.log("[v0] Connected to wallet:", response.publicKey.toString())
    } catch (err: any) {
      console.error("[v0] Failed to connect wallet:", err)
      setError(err.message || "Failed to connect wallet")
      setConnected(false)
    } finally {
      setConnecting(false)
    }
  }, [getPhantomWallet])

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      if (wallet) {
        await wallet.disconnect()
      }
      setWallet(null)
      setPublicKey(null)
      setConnected(false)
      setError(null)

      console.log("[v0] Disconnected from wallet")
    } catch (err: any) {
      console.error("[v0] Failed to disconnect wallet:", err)
      setError(err.message || "Failed to disconnect wallet")
    }
  }, [wallet])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const phantomWallet = getPhantomWallet()

    if (phantomWallet) {
      // Check if already connected
      phantomWallet.on("connect", (publicKey: PublicKey) => {
        console.log("[v0] Wallet connected:", publicKey.toString())
        setWallet(phantomWallet)
        setPublicKey(publicKey)
        setConnected(true)
      })

      phantomWallet.on("disconnect", () => {
        console.log("[v0] Wallet disconnected")
        setWallet(null)
        setPublicKey(null)
        setConnected(false)
      })

      // Try to eagerly connect
      if (phantomWallet.isConnected) {
        setWallet(phantomWallet)
        setPublicKey(phantomWallet.publicKey)
        setConnected(true)
      }
    }

    return () => {
      if (phantomWallet) {
        phantomWallet.removeAllListeners()
      }
    }
  }, [getPhantomWallet])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        publicKey,
        connected,
        connecting,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
