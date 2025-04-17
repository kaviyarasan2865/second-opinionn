import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, accessToken } = await req.json();

    if (!sessionId || !message || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SF_API_HOST}/einstein/ai-agent/v1/sessions/${sessionId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            sequenceId: Date.now(),
            type: "Text",
            text: message,
          },
          variables: [],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message to AgentForce');
    }

    const data = await response.json();
    console.log('Salesforce API Response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending message to AgentForce:', error);
    return NextResponse.json(
      { error: 'Failed to send message to AgentForce' },
      { status: 500 }
    );
  }
} 