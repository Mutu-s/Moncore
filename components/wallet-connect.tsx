"use client"

import { useState, useEffect } from "react"
import { Wallet } from "lucide-react"

// Custom branding for wallet connection
const APP_NAME = "moncore-platform.net"
const APP_ICON = "/monad-logo.png"

// Monad Testnet configuration
const MONAD_TESTNET = {
  chainId: "0x279F", // 10143 in hex
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
}

export function WalletConnect({ onAccountChange }: { onAccountChange: (account: string | null) => void }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    checkConnection()
    document.title = APP_NAME
  }, [])

  useEffect(() => {
    onAccountChange(account)
  }, [account, onAccountChange])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask or another Web3 wallet!")
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      setAccount(accounts[0])

      // Try to switch to Monad network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: MONAD_TESTNET.chainId }],
        })
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [MONAD_TESTNET],
            })
          } catch (addError) {
            console.error("Error adding Monad network:", addError)
          }
        } else {
          console.error("Error switching to Monad network:", switchError)
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
  }

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-5 h-5" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white font-semibold">{shortenAddress(account)}</span>
          <button
            onClick={disconnectWallet}
            className="ml-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
