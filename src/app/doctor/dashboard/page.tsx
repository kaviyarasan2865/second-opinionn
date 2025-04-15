"use client"

import {  useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {

  Bell,
  ChevronRight,
  Activity,
  Users,
  CalendarIcon,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  AlertCircle,
  BarChart
} from "lucide-react"
import Image from 'next/image'



export default function DoctorDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
 

  // Redirect if not authenticated or not a doctor
  useEffect(() => {
    if (!session?.user) {
      router.push("/login")
    } else if (session.user.role !== "doctor") {
      router.push("/patient/dashboard")
    }
  }, [session, router])



  // Add background animations
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

 
  // Mock data for doctor dashboard
  const todayAppointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      age: 42,
      time: "10:30 AM",
      type: "Follow-up",
      status: "Checked In",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      patient: "Michael Chen",
      age: 65,
      time: "11:45 AM",
      type: "Consultation",
      status: "Scheduled",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      patient: "Emily Rodriguez",
      age: 28,
      time: "2:15 PM",
      type: "New Patient",
      status: "Scheduled",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      patient: "Robert Williams",
      age: 54,
      time: "3:30 PM",
      type: "Follow-up",
      status: "Scheduled",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const pendingReviews = [
    {
      id: 1,
      patient: "David Thompson",
      type: "Lab Results",
      date: "May 2, 2024",
      priority: "High",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      patient: "Jessica Lee",
      type: "MRI Report",
      date: "May 3, 2024",
      priority: "Medium",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      patient: "Thomas Brown",
      type: "Medication Review",
      date: "May 3, 2024",
      priority: "Low",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const recentPatients = [
    {
      id: 1,
      name: "Jennifer Adams",
      lastVisit: "April 28, 2024",
      condition: "Hypertension",
      status: "Stable",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Kevin Martinez",
      lastVisit: "April 30, 2024",
      condition: "Diabetes Type 2",
      status: "Improving",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Lisa Wilson",
      lastVisit: "May 1, 2024",
      condition: "Asthma",
      status: "Stable",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Mark Johnson",
      lastVisit: "May 2, 2024",
      condition: "Post-Surgery",
      status: "Recovering",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const performanceMetrics = [
    { id: 1, label: "Patients Seen", value: 28, target: 30, percentage: 93 },
    { id: 2, label: "Avg. Consultation", value: "18 min", target: "20 min", percentage: 90 },
    { id: 3, label: "Patient Satisfaction", value: "4.8/5", target: "4.5/5", percentage: 96 },
    { id: 4, label: "Reports Completed", value: 15, target: 15, percentage: 100 },
  ]

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(120deg, #0d9488, #0891b2, #0c4a6e)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          opacity: 0.05,
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${30 + Math.random() * 100}px`,
              height: `${30 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(13, 148, 136, 0.8)",
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">MedSecond</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2">
              {/* Custom Avatar */}
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <Image
                  width={20}
                  height= {20}
                    src={session.user.image || "/placeholder.svg"}
                    alt={session?.user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-teal-800 font-medium">{session?.user?.name?.charAt(0) || "D"}</span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                Dr. {session?.user?.name || session?.user?.email || "Smith"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4">
          <nav className="space-y-1">
            {/* Custom Buttons */}
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-teal-700 bg-teal-50 font-medium text-sm hover:bg-teal-100 transition-colors">
              <Activity className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <CalendarIcon className="h-5 w-5" />
              <span>Schedule</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <Users className="h-5 w-5" />
              <span>Patients</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <ClipboardList className="h-5 w-5" />
              <span>Medical Records</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <BarChart className="h-5 w-5" />
              <span>Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
            <hr className="my-4" />
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 font-medium text-sm hover:bg-red-50 hover:text-red-700 transition-colors"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Welcome Section */}
          <section className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome, Dr. {session?.user?.name?.split(" ")[0] || "Smith"}
                </h2>
                <p className="opacity-90">{currentDate}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90">Today&apos;s Appointments</p>
                  <p className="text-2xl font-bold">{todayAppointments.length}</p>
                </div>
                <div className="h-10 w-px bg-white/30"></div>
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90">Pending Reviews</p>
                  <p className="text-2xl font-bold">{pendingReviews.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  <p className="text-xs text-gray-500">Target: {metric.target}</p>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.percentage >= 90
                          ? "bg-green-500"
                          : metric.percentage >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500">{metric.percentage}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Appointments - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Today&apos;s Appointments</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View Schedule <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                          height={20}
                          width={20}
                            src={appointment.image || "/placeholder.svg"}
                            alt={appointment.patient}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                            <span className="text-sm text-gray-600">{appointment.time}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500">
                              {appointment.age} yrs • {appointment.type}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                appointment.status === "Checked In"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No appointments scheduled for today</p>
                )}
              </div>
            </div>

            {/* Pending Reviews - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Pending Reviews</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                {pendingReviews.length > 0 ? (
                  <div className="space-y-3">
                    {pendingReviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                          height={20}
                          width={20}
                            src={review.image || "/placeholder.svg"}
                            alt={review.patient}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{review.patient}</h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                review.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : review.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {review.priority}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500">{review.type}</p>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <button className="ml-2 px-3 py-1 text-sm border border-teal-200 text-teal-600 rounded-md hover:bg-teal-50">
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No pending reviews</p>
                )}
              </div>
            </div>

            {/* Recent Patients - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Recent Patients</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View All Patients <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                          height={20}
                          width={20}
                            src={patient.image || "/placeholder.svg"}
                            alt={patient.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Condition:</span> {patient.condition}
                        </p>
                        <p>
                          <span className="font-medium">Last Visit:</span> {patient.lastVisit}
                        </p>
                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                              patient.status === "Stable"
                                ? "bg-green-100 text-green-700"
                                : patient.status === "Improving"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {patient.status === "Stable" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : patient.status === "Improving" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {patient.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="flex-1 px-2 py-1 text-xs border border-teal-200 text-teal-600 rounded-md hover:bg-teal-50">
                          View Records
                        </button>
                        <button className="flex-1 px-2 py-1 text-xs bg-teal-600 text-white rounded-md hover:bg-teal-700">
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>



    </div>
  )
}
