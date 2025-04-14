import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/models/User"

interface TimeSlot {
  start: string
  end: string
}

interface DoctorAvailability {
  day: string
  slots: TimeSlot[]
}

interface UserData {
  email: string
  password: string
  role: "patient" | "doctor"
  speciality?: string
  experience?: number
  availability?: DoctorAvailability[]
}

export async function POST(req: Request) {
  try {
    const { email, password, user, expertise, experience, availableDays, timeSlots } = await req.json()

    // Validate required fields
    if (!email || !password || !user) {
      return NextResponse.json(
        { error: "Email, password, and user type are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    await connectDB()
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare user data
    const userData: UserData = {
      email,
      password: hashedPassword,
      role: user as "patient" | "doctor",
    }

    // Add doctor-specific fields if user is a doctor
    if (user === "doctor") {
      if (!expertise || !experience || !availableDays || !timeSlots) {
        return NextResponse.json(
          { error: "All doctor fields are required" },
          { status: 400 }
        )
      }

      userData.speciality = expertise
      userData.experience = parseInt(experience)
      userData.availability = availableDays.map((day: string) => ({
        day,
        slots: timeSlots[day] || [],
      }))
    }

    // Create new user
    const newUser = await User.create(userData)

    return NextResponse.json(
      { message: "User created successfully", user: { email: newUser.email, role: newUser.role } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
} 