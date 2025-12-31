"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { solanaClient } from "@/lib/solana-client"

export function WalletButton() {
  const { wallet, publicKey, connected, connecting, connect, disconnect, error } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  // Fetch balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        setLoadingBalance(true)
        try {
          const bal = await solanaClient.getBalance(publicKey)
          setBalance(bal)
        } catch (error) {
          console.error("[v0] Failed to fetch balance:", error)
        } finally {
          setLoadingBalance(false)
        }
      }
    }

    fetchBalance()
  }, [connected, publicKey])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (error) {
    return (
      <Button variant="destructive" size="sm" onClick={connect}>
        <Wallet className="w-4 h-4 mr-2" />
        Retry Connection
      </Button>
    )
  }

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">{formatAddress(publicKey.toString())}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2 space-y-1">
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-xs font-mono break-all">{publicKey.toString()}</p>
          </div>
          <div className="px-2 py-2 space-y-1">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm font-semibold">
              {loadingBalance ? (
                <Loader2 className="w-3 h-3 animate-spin inline" />
              ) : (
                `${balance?.toFixed(4) || "0"} SOL`
              )}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connect} disabled={connecting} size="sm" className="gap-2">
      {connecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </>
      )}
    </Button>
  )
}
