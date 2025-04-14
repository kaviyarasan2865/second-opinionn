"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowRight, Shield, Clock, Award } from "lucide-react"

export default function Home() {
  const router = useRouter()

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
      
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 201, 182, 0.7);
        }
        
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 15px rgba(0, 201, 182, 0);
        }
        
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 201, 182, 0);
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

  return (
    <div className="relative min-h-screen overflow-hidden">
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

      {/* Content container */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left column - Text content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-2 animate-fade-in">
              Trusted by 10,000+ patients worldwide
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in delay-100">
              Get Expert{" "}
              <span className="relative">
                <span className="relative z-10">Medical</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-cyan-300/30 -z-0 rounded-lg"></span>
              </span>{" "}
              Second Opinions
            </h1>

            <p className="text-xl text-cyan-50 max-w-xl animate-fade-in delay-200">
              Connect with world-class specialists and get trusted second opinions on your diagnosis within 48 hours.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
              <button
                onClick={() => router.push("/login")}
                className="group flex items-center gap-2 bg-white text-teal-800 hover:bg-cyan-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                style={{ animation: "pulse 2s infinite" }}
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/how-it-works")}
                className="flex items-center gap-2 bg-transparent border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                How It Works
              </button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 animate-fade-in delay-400">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-6 h-6 text-cyan-300" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-6 h-6 text-cyan-300" />
                <span>48hr Turnaround</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Award className="w-6 h-6 text-cyan-300" />
                <span>Board Certified</span>
              </div>
            </div>
          </div>

          {/* Right column - Video/Image */}
          <div className="w-full lg:w-1/2 animate-fade-in delay-300">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-300/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-teal-500/30 rounded-full blur-xl"></div>

              {/* Video container */}
              <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <video
                  className="w-full h-auto"
                  src="/video/second-opinion.mp4" 
                  autoPlay
                  muted
                  loop
                  playsInline
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with AgentForce branding */}
      <div className="absolute bottom-0 left-0 right-0 py-4 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-white/80">
            <span>Powered by</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-white">AgentForce</span>
              <svg
                className="w-5 h-5 text-cyan-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Fade-in animation styles */}
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
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
