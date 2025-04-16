import { NextRequest, NextResponse } from "next/server"
import  connectDB  from "@/lib/db"
import ConnectionRequest from "@/models/ConnectionRequest"
import User from "@/models/User"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }

) {
  try {
    await connectDB()

    const {patientId} = await params
    // Find all connection requests for this patient
    const appointments = await ConnectionRequest.find({
      patientId: patientId
    }).sort({ date: 1, time: 1 })

    // Get doctor names for each appointment
    const appointmentsWithDoctorNames = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await User.findById(appointment.doctorId)
        return {
          ...appointment.toObject(),
          doctorName: doctor?.name || 'Doctor'
        }
      })
    )

    return NextResponse.json(appointmentsWithDoctorNames)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
} 