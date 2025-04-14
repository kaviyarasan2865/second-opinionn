import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const doctors = await User.find({ role: "doctor" });

    return NextResponse.json(
      { message: "Doctors fetched successfully", doctors },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch doctors",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
