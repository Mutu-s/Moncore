"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MainScene } from "@/components/main-scene"
import { WalletConnect } from "@/components/wallet-connect"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin mb-4"></div>
        </div>
      ) : (
        <>
          <WalletConnect onAccountChange={setWalletAddress} />

          <div className="absolute inset-0 z-10">
            <MainScene walletAddress={walletAddress} />
          </div>
        </>
      )}
    </main>
  )
}
