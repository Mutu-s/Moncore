"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, Text3D } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { LoginBackground } from "@/components/login-background"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <color attach="background" args={["#050505"]} />
          <Environment preset="city" />
          <LoginBackground />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[0, 3, 0]}>
            <Text3D
              font="/fonts/Geist_Bold.json"
              size={1.2}
              height={0.2}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              {""}
              <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
            </Text3D>
          </Float>
        </Canvas>
      </div>

      <Button
        variant="ghost"
        className="absolute top-4 left-4 z-20 text-white hover:text-teal-400 hover:bg-transparent"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
      </Button>

      <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/80 border-teal-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center"></CardTitle>
            <CardDescription className="text-center text-gray-400"></CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/50"></TabsList>

              <TabsContent value="login" className="mt-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300"></label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-300"></label>
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold"
                    onClick={() => router.push("/studio")}
                  >
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300"></label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300"></label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300"></label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300"></label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-teal-500 hover:bg-teal-600 text-black font-bold"
                    onClick={() => router.push("/strategy")}
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-800 pt-4"></CardFooter>
        </Card>
      </div>
    </main>
  )
}
