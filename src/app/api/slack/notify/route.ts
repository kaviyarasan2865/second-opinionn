import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { patientName, doctorName, appointmentTime } = await req.json();

    // Your Slack Webhook URL should be in your environment variables
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error('Slack webhook URL is not configured');
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🏥 New Second Opinion Appointment",
              emoji: true
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Patient:*\n${patientName || 'Not specified'}`
              },
              {
                type: "mrkdwn",
                text: `*Doctor:*\n${doctorName || 'Dr. Sarah Johnson'}`
              }
            ]
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: "*Status:*\nSuccessfully Scheduled"
              },
              {
                type: "mrkdwn",
                text: `*Time:*\n${appointmentTime || new Date().toLocaleString()}`
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Slack notification');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return NextResponse.json(
      { error: 'Failed to send Slack notification' },
      { status: 500 }
    );
  }
}