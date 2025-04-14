"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowRight, User, Shield } from "lucide-react"

interface CustomSession {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

const Page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<"patient" | "doctor">("patient")
  const router = useRouter()
  const { data: session } = useSession() as { data: CustomSession | null }

  useEffect(() => {
    if (session?.user?.role) {
      router.push(session.user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard")
    }
  }, [session, router])

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
        100% {
          transform: translateY(0px) rotate(0deg);
        }
      }
      
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        user,
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
      } else if (res?.ok) {
        router.push(user === "doctor" ? "/doctor/dashboard" : "/patient/dashboard")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(120deg, #0d9488, #0891b2, #0c4a6e)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${30 + Math.random() * 100}px`,
              height: `${30 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(255, 255, 255, 0.8)",
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-cyan-100">Sign in to access your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8 rounded-2xl gap-6 flex flex-col"
        >
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-300/30 rounded-full blur-xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-teal-500/30 rounded-full blur-xl -z-10"></div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-2 p-1 bg-white/20 rounded-xl">
            <button
              type="button"
              onClick={() => setUser("patient")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                user === "patient" ? "bg-white text-teal-800 shadow-md" : "bg-transparent text-white hover:bg-white/10"
              }`}
            >
              <User className="w-4 h-4" />
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUser("doctor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                user === "doctor" ? "bg-white text-teal-800 shadow-md" : "bg-transparent text-white hover:bg-white/10"
              }`}
            >
              <Shield className="w-4 h-4" />
              Doctor
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none placeholder:text-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none placeholder:text-white/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-teal-600 focus:ring-cyan-300"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-cyan-300 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex items-center justify-center gap-2 bg-white hover:bg-cyan-50 text-teal-800 font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="text-center text-white/80 text-sm mt-2">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-cyan-300 hover:text-white transition-colors">
              Create account
            </a>
          </div>
        </form>
      </div>

      {/* Fade-in animation styles */}
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Page
