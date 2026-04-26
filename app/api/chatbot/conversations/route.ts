import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface ConversationPayload {
  id: string;
  userId: string;
  title: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

/**
 * GET: Retrieve conversations for a user
 * Query params:
 *   - userId: User ID to get conversations for
 *   - conversationId: Optional specific conversation ID
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const conversationId = req.nextUrl.searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation with messages
      const conversations = await query(
        'SELECT * FROM chatbot_conversations WHERE id = ? LIMIT 1',
        [conversationId]
      );

      if (!Array.isArray(conversations) || conversations.length === 0) {
        return NextResponse.json(null);
      }

      const messages = await query(
        'SELECT * FROM chatbot_messages WHERE conversation_id = ? ORDER BY timestamp ASC',
        [conversationId]
      );

      return NextResponse.json({
        ...conversations[0],
        messages: Array.isArray(messages) ? messages : [],
      });
    }

    if (userId) {
      // Get all conversations for user
      const conversations = await query(
        'SELECT * FROM chatbot_conversations WHERE user_id = ? ORDER BY updated_at DESC',
        [userId]
      );

      return NextResponse.json(Array.isArray(conversations) ? conversations : []);
    }

    return NextResponse.json(
      { error: 'userId or conversationId required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve conversations' },
      { status: 500 }
    );
  }
}

/**
 * POST: Save a new conversation or message
 */
export async function POST(req: NextRequest) {
  try {
    const payload: ConversationPayload = await req.json();
    const { id, userId, title, messages } = payload;

    // Save conversation
    await query(
      'INSERT INTO chatbot_conversations (id, user_id, title) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, updated_at = CURRENT_TIMESTAMP',
      [id, userId, title, title]
    );

    // Save messages
    for (const message of messages) {
      await query(
        'INSERT INTO chatbot_messages (id, conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?, content = ?',
        [
          message.id,
          id,
          message.role,
          message.content,
          message.timestamp,
          message.role,
          message.content,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      conversationId: id,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete a conversation
 */
export async function DELETE(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM chatbot_conversations WHERE id = ?',
      [conversationId]
    );

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
