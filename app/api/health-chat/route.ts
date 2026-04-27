import { NextRequest, NextResponse } from 'next/server';

interface GoogleMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    console.log('🔧 Health Chat API called');
    console.log('Messages received:', messages.length);

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ API Key not found in environment variables');
      return NextResponse.json(
        { error: 'Google Gemini API key is not configured' },
        { status: 500 }
      );
    }

    console.log('✅ API Key found, length:', process.env.OPENAI_API_KEY.length);

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Convert messages to Google Gemini format
    const geminiMessages: GoogleMessage[] = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const requestBody = {
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.OPENAI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Google Gemini API error:');
      console.error('Status:', response.status);
      console.error('Error details:', JSON.stringify(errorData, null, 2));
      console.error('API Key set:', !!process.env.OPENAI_API_KEY);
      console.error('API Key length:', process.env.OPENAI_API_KEY?.length);
      return NextResponse.json(
        { 
          error: `Gemini API Error: ${errorData.error?.message || 'Unknown error'}`,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from Gemini response
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts
    ) {
      return NextResponse.json(
        { error: 'Unexpected response format from Gemini API' },
        { status: 500 }
      );
    }

    const assistantMessage = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      message: assistantMessage,
      role: 'assistant',
    });
  } catch (error) {
    console.error('Health chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
