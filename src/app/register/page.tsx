"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { User, Shield, Plus, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const Register = () => {
  const [user, setUser] = useState<"patient" | "doctor">("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [expertise, setExpertise] = useState("")
  const [experience, setExperience] = useState("")
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<Record<string, { start: string; end: string }[]>>({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

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

  const toggleDay = (day: string) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const addTimeSlot = (day: string) => {
    const currentSlots = timeSlots[day] || []
    setTimeSlots({ ...timeSlots, [day]: [...currentSlots, { start: "", end: "" }] })
  }

  const updateTimeSlot = (day: string, index: number, field: "start" | "end", value: string) => {
    const updated = [...(timeSlots[day] || [])]
    updated[index][field] = value
    setTimeSlots({ ...timeSlots, [day]: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Basic validation
      if (email === "" || password === "" || confirmPassword === "") {
        setError("All fields are required")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (user === "doctor") {
        if (expertise === "" || experience === "" || availableDays.length === 0) {
          setError("All doctor fields are required")
          return
        }
      }

      // Register user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          user,
          expertise,
          experience,
          availableDays,
          timeSlots,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        user,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      // Redirect to appropriate dashboard
      router.push(user === "doctor" ? "/doctor/dashboard" : "/patient/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-cyan-100">Join our platform to get started</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-8 rounded-2xl gap-6 flex flex-col"
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
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none placeholder:text-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none placeholder:text-white/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none placeholder:text-white/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Doctor Extra Fields */}
            {user === "doctor" && (
              <div className="space-y-4 mt-2 pt-4 border-t border-white/20">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Professional Details
                </h3>

                {/* Expertise */}
                <div className="flex flex-col gap-2">
                  <label className="text-white font-medium">Expertise</label>
                  <select
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    required
                  >
                    <option value="" className="bg-teal-800 text-white">
                      Select specialization
                    </option>
                    <option value="Cardiology" className="bg-teal-800 text-white">
                      Cardiology
                    </option>
                    <option value="Neurology" className="bg-teal-800 text-white">
                      Neurology
                    </option>
                    <option value="General" className="bg-teal-800 text-white">
                      General Physician
                    </option>
                    <option value="Orthopedics" className="bg-teal-800 text-white">
                      Orthopedics
                    </option>
                  </select>
                </div>

                {/* Experience */}
                <div className="flex flex-col gap-2">
                  <label className="text-white font-medium">Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 focus:outline-none placeholder:text-white/50"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5"
                    required
                  />
                </div>

                {/* Available Days */}
                <div className="flex flex-col gap-2">
                  <label className="text-white font-medium">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded-full border transition-all ${
                          availableDays.includes(day)
                            ? "bg-white text-teal-800 border-white"
                            : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots for each selected day */}
                {availableDays.length > 0 && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-medium flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" /> Availability Schedule
                    </h4>
                    {availableDays.map((day) => (
                      <div key={day} className="mt-3 first:mt-0">
                        <label className="text-sm font-semibold text-cyan-100">{day}</label>
                        {(timeSlots[day] || []).map((slot, index) => (
                          <div key={index} className="flex gap-2 mt-2 items-center">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(day, index, "start", e.target.value)}
                              className="w-full px-2 py-2 bg-white/10 border border-white/30 text-white rounded-md shadow-sm focus:ring-1 focus:ring-cyan-300 focus:outline-none"
                              required
                            />
                            <span className="text-white/70">to</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(day, index, "end", e.target.value)}
                              className="w-full px-2 py-2 bg-white/10 border border-white/30 text-white rounded-md shadow-sm focus:ring-1 focus:ring-cyan-300 focus:outline-none"
                              required
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addTimeSlot(day)}
                          className="text-sm text-cyan-300 hover:text-white flex items-center gap-1 mt-2 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Time Slot
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-white hover:bg-cyan-50 text-teal-800 font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center text-white/80 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-300 hover:text-white transition-colors">
              Sign in
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

export default Register
