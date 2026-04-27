import { NextRequest, NextResponse } from 'next/server';

interface GroqMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    console.log('🔧 Health Chat API called');
    console.log('Messages received:', messages.length);

    if (!process.env.GROQ_API_KEY) {
      console.error('❌ API Key not found in environment variables');
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      );
    }

    console.log('✅ Groq API Key found, length:', process.env.GROQ_API_KEY.length);

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Convert messages to Groq format (OpenAI-compatible)
    const groqMessages: GroqMessage[] = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const requestBody = {
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      max_tokens: 1024,
      temperature: 0.7,
    };

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Groq API error:');
      console.error('Status:', response.status);
      console.error('Error details:', JSON.stringify(errorData, null, 2));
      console.error('API Key set:', !!process.env.GROQ_API_KEY);
      console.error('API Key length:', process.env.GROQ_API_KEY?.length);
      return NextResponse.json(
        { 
          error: `Groq API Error: ${errorData.error?.message || 'Unknown error'}`,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from Groq response
    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      return NextResponse.json(
        { error: 'Unexpected response format from Groq API' },
        { status: 500 }
      );
    }

    const assistantMessage = data.choices[0].message.content;

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
