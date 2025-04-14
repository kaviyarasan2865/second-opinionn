import connectDB from "@/lib/db";
import ConnectionRequest from "@/models/ConnectionRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { doctorId, patientId, date, time } = await request.json();

    if (!doctorId || !patientId || !date || !time) {
      return NextResponse.json(
        { message: "doctorId, patientId, date, and time are required" },
        { status: 400 }
      );
    }

    const connection = await ConnectionRequest.create({ doctorId, patientId, date, time });

    return NextResponse.json(
      { message: "Request sent successfully", data: connection },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending request:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
