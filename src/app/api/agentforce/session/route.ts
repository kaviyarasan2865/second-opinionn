import {  NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get access token first
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_SF_ORG_DOMAIN}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.NEXT_PUBLIC_SF_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SF_CLIENT_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();

    // Create AgentForce session
    const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SF_API_HOST}/einstein/ai-agent/v1/agents/${process.env.NEXT_PUBLIC_SF_AGENT_ID}/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          externalSessionKey: crypto.randomUUID(),
          instanceConfig: {
            endpoint: process.env.NEXT_PUBLIC_SF_ORG_DOMAIN,
          },
          tz: "America/Los_Angeles",
          variables: [
            {
              name: "$Context.EndUserLanguage",
              type: "Text",
              value: "en_US",
            },
          ],
          featureSupport: "Streaming",
          streamingCapabilities: {
            chunkTypes: ["Text"],
          },
          bypassUser: true,
        }),
      }
    );

    if (!sessionResponse.ok) {
      throw new Error('Failed to create AgentForce session');
    }

    const sessionData = await sessionResponse.json();

    return NextResponse.json({
      sessionId: sessionData.sessionId,
      externalSessionKey: sessionData.externalSessionKey,
      accessToken: access_token,
    });
  } catch (error) {
    console.error('Error in AgentForce session creation:', error);
    return NextResponse.json(
      { error: 'Failed to create AgentForce session' },
      { status: 500 }
    );
  }
} 