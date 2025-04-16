import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Chat from '@/models/Chat'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const doctorId = url.searchParams.get('doctorId')
    const patientId = url.searchParams.get('patientId')

    if (!doctorId || !patientId) {
      return NextResponse.json(
        { error: 'Missing doctorId or patientId' },
        { status: 400 }
      )
    }

    // Find or create chat
    let chat = await Chat.findOne({
      doctorId,
      patientId
    })

    if (!chat) {
      chat = await Chat.create({
        doctorId,
        patientId,
        messages: []
      })
    }

    return NextResponse.json(
      {
        message: 'Chat fetched successfully',
        data: chat
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch chat',
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { doctorId, patientId, message, sender } = await req.json()

    if (!doctorId || !patientId || !message || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find or create chat
    let chat = await Chat.findOne({
      doctorId,
      patientId
    })

    if (!chat) {
      chat = await Chat.create({
        doctorId,
        patientId,
        messages: []
      })
    }

    // Add new message
    const newMessage = {
      sender,
      text: message,
      timestamp: new Date()
    }

    chat.messages.push(newMessage)
    chat.lastUpdated = new Date()
    await chat.save()

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        data: newMessage
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    )
  }
} 