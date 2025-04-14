import ConnectionRequest from "@/models/ConnectionRequest";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { requestId, status } = await request.json();

    const updatedRequest = await ConnectionRequest.updateOne(
      { _id: requestId },
      { $set: { status } }
    );

    if (updatedRequest.modifiedCount === 0) {
      return NextResponse.json({ message: "No request updated" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Request ${status}`,
    });
  } catch (error) {
    console.error("Error updating connection request:", error);
    return NextResponse.json(
      { error: "Failed to update request"},
      { status: 500 }
    );
  }
}

