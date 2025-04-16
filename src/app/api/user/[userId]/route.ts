import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB()
    
    // Await the params object
    const { userId } = await context.params
    const user = await User.findById(userId)
      .select('name email image role speciality experience')
      .lean()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'User fetched successfully',
        data: user
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    )
  }
} 