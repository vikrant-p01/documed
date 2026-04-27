import { NextRequest, NextResponse } from 'next/server';

interface GoogleMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Google Gemini API key is not configured' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a compassionate and knowledgeable health assistant chatbot designed to support patients at a medical facility. Your role is to provide helpful guidance on:

1. **Dietary Guidance**: Offer general nutritional advice and healthy eating tips tailored to common health conditions. Recommend balanced diets, food groups, and hydration.

2. **General Self-Care Suggestions**: Provide practical wellness tips including exercise, stress management, sleep hygiene, and preventive health measures.

3. **Treatment Support Advice**: Offer emotional support and general information about managing symptoms, medication adherence, and lifestyle modifications for common conditions.

IMPORTANT GUIDELINES:
- Always emphasize that you are NOT a replacement for professional medical advice
- Encourage users to consult with their healthcare provider for specific diagnoses or treatment decisions
- Provide evidence-based information from reputable health sources
- Be empathetic and supportive in your tone
- Ask clarifying questions to better understand the patient's situation
- Avoid diagnosing medical conditions
- Never recommend specific medications without medical supervision
- If a question is outside your scope, politely redirect the user to consult their doctor
- Keep responses concise and easy to understand
- Use simple language and avoid complex medical jargon when possible

Remember: Your goal is to empower patients to make better day-to-day health decisions while respecting the scope of your role as a health assistant.`;

    // Convert messages to Google Gemini format
    const geminiMessages: GoogleMessage[] = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Add system prompt as first user message if not present
    if (geminiMessages.length === 0 || geminiMessages[0].role !== 'user') {
      geminiMessages.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }],
      });
    }

    const requestBody = {
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.OPENAI_API_KEY}`,
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
      console.error('Google Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API' },
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
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
