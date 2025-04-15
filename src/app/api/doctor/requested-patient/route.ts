import connectDB from "@/lib/db";
import ConnectionRequest from "@/models/ConnectionRequest";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


interface ConnectionRequest {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const doctorId = url.searchParams.get("doctorId");
    const status = url.searchParams.get("status") || "pending";

    if (!doctorId) {
      return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
    }

    // Get connection requests based on status
    const connectionRequests = await ConnectionRequest.find({ 
      doctorId, 
      status: status === "all" ? { $in: ["pending", "accepted"] } : status 
    }).sort({ createdAt: -1 });

    const patientIds = connectionRequests.map(req => req.patientId);

    // Get detailed patient information
    const patientDetails = await User.find({ _id: { $in: patientIds } })
      .select('name email image age gender medicalHistory lastVisit createdAt')
      .lean();

    // Format the response with detailed information
    const formattedResponse = connectionRequests.map(request => {
      const patient = patientDetails.find(p => p?._id?.toString() === request.patientId.toString());
      
      return {
        _id: request._id,
        status: request.status,
        date: request.date,
        time: request.time,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        patient: {
          _id: patient?._id,
          name: patient?.name || 'Unknown Patient',
          email: patient?.email,
          image: patient?.image || '/placeholder.svg',
          age: patient?.age || 0,
          gender: patient?.gender || 'Not specified',
          medicalHistory: patient?.medicalHistory || [],
          lastVisit: patient?.lastVisit ? new Date(patient.lastVisit).toISOString() : null,
          joinedDate: patient?.createdAt ? new Date(patient.createdAt).toISOString() : null
        }
      };
    });

    return NextResponse.json(
      {
        message: "Patients fetched successfully",
        data: formattedResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch patients",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
