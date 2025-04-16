"use client"

import {  useEffect, useState, useCallback } from "react"
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
 
  LogOut,
  CheckCircle,
  AlertCircle,

} from "lucide-react"
import Image from 'next/image'

interface Patient {
  _id: string;
  name: string;
  email?: string;
  image: string;
  age: number;
  gender: string;
  medicalHistory: Array<{
    condition: string;
    date: string;
    notes?: string;
  }>;
  lastVisit: string | null;
  joinedDate: string | null;
}

interface ConnectionRequest {
  _id: string;
  status: string;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  patient: Patient;
}

interface ApiResponse {
  data: ConnectionRequest[];
}

interface PendingReview {
  id: string;
  patient: string;
  type: string;
  date: string;
  time: string;
  priority: string;
  image: string;
  patientId: string;
  status: string;
  lastVisit: string;
  medicalHistory: Array<{
    condition: string;
    date: string;
    notes?: string;
  }>;
}

interface TodayAppointment {
  id: string;
  patient: string;
  age: number;
  time: string;
  date: string;
  type: string;
  status: string;
  image: string;
  patientId: string;
  lastVisit: string;
  gender: string;
}

export default function DoctorDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch both pending and accepted patients
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true)
      // Fetch pending patients
      const pendingResponse = await fetch(`/api/doctor/requested-patient?doctorId=${session?.user?.id}&status=pending`)
      const pendingData = await pendingResponse.json() as ApiResponse
      
      // Fetch accepted patients
      const acceptedResponse = await fetch(`/api/doctor/requested-patient?doctorId=${session?.user?.id}&status=accepted`)
      const acceptedData = await acceptedResponse.json() as ApiResponse

      if (pendingData.data) {
        const pendingReviewsData = pendingData.data.map((request) => ({
          id: request._id,
          patient: request.patient.name,
          type: "Connection Request",
          date: request.date,
          time: request.time,
          priority: "High",
          image: request.patient.image,
          patientId: request.patient._id,
          status: request.status,
          lastVisit: request.patient.lastVisit ? new Date(request.patient.lastVisit).toLocaleDateString() : 'No previous visits',
          medicalHistory: request.patient.medicalHistory
        }))
        setPendingReviews(pendingReviewsData)
      }

      if (acceptedData.data) {
        const todayAppointmentsData = acceptedData.data.map((request) => ({
          id: request._id,
          patient: request.patient.name,
          age: request.patient.age,
          time: request.time,
          date: request.date,
          type: request.patient.medicalHistory.length > 0 ? "Follow-up" : "New Patient",
          status: "Scheduled",
          image: request.patient.image,
          patientId: request.patient._id,
          lastVisit: request.patient.lastVisit ? new Date(request.patient.lastVisit).toLocaleDateString() : 'No previous visits',
          gender: request.patient.gender
        }))
        setTodayAppointments(todayAppointmentsData)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Add this function after the fetchPatients function
  const handleConnectionRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/doctor/accept-connection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update connection request');
      }

      // Refresh the data after successful update
      fetchPatients();
    } catch (error) {
      console.error('Error updating connection request:', error);
    }
  };

  // Fetch patients on component mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchPatients()
    }
  }, [session, fetchPatients])

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
                    height={20}
                    src={session.user.image || "https://static.vecteezy.com/system/resources/previews/020/156/848/non_2x/patient-icon-design-free-vector.jpg"}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
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
            {/* Appointments - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Appointments</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View Schedule <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : todayAppointments.length > 0 ? (
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
                            src={appointment.image || "https://static.vecteezy.com/system/resources/previews/020/156/848/non_2x/patient-icon-design-free-vector.jpg"}
                            alt={appointment.patient}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{appointment.time} on {appointment.date}</span>
                              <button 
                                onClick={() => router.push(`/chat/${session?.user?.id}/${appointment.patientId}`)}
                                className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors"
                                title="Chat with patient"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500">
                              {appointment.age} yrs • {appointment.gender} • {appointment.type}
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
                          <p className="text-xs text-gray-500 mt-1">
                            Last Visit: {appointment.lastVisit}
                          </p>
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : pendingReviews.length > 0 ? (
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
                            src={review.image || "https://static.vecteezy.com/system/resources/previews/020/156/848/non_2x/patient-icon-design-free-vector.jpg"}
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
                            <span className="text-xs text-gray-500">{review.date} at {review.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Last Visit: {review.lastVisit}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button 
                            onClick={() => handleConnectionRequest(review.id, 'accepted')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accept
                          </button>
                          <button 
                            onClick={() => handleConnectionRequest(review.id, 'rejected')}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-1"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No pending reviews</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-cyan-600 border-t rounded-full border-gray-200 shadow-lg mx-auto max-w-4xl m-3">
        <div className="container mx-auto">
          <div className="flex justify-around items-center py-2">
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-teal-700 bg-teal-50">
              <Activity className="h-5 w-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <CalendarIcon className="h-5 w-5" />
              <span className="text-xs">Schedule</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <Users className="h-5 w-5" />
              <span className="text-xs">Patients</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Records</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Messages</span>
            </button>
            <button 
              onClick={() => signOut()}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}