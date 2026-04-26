/**
 * Chatbot utilities for managing conversations and interactions
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generate a unique ID for messages and conversations
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new conversation
 */
export function createConversation(userId: string, title?: string): Conversation {
  const id = generateId();
  const now = new Date();

  return {
    id,
    userId,
    title: title || 'New Chat',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Add a message to a conversation
 */
export function addMessage(
  conversation: Conversation,
  role: 'user' | 'assistant',
  content: string
): Conversation {
  const message: Message = {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  };

  return {
    ...conversation,
    messages: [...conversation.messages, message],
    updatedAt: new Date(),
  };
}

/**
 * Extract health topic from initial message for auto-titling
 */
export function extractTopicFromMessage(content: string): string {
  const trimmed = content.substring(0, 50).trim();
  return trimmed.length > 0 ? trimmed : 'New Chat';
}

/**
 * Format conversation history for API
 */
export function formatMessagesForAPI(messages: Message[]) {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Validate message content
 */
export function isValidMessage(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.length > 0 && trimmed.length <= 5000;
}

/**
 * Suggested health topics for quick access
 */
export const suggestedTopics = [
  {
    title: 'Nutrition & Diet',
    description: 'Get dietary guidance and nutrition tips',
    icon: 'Apple',
  },
  {
    title: 'Exercise & Fitness',
    description: 'Guidance on physical activity and fitness',
    icon: 'Activity',
  },
  {
    title: 'Sleep & Rest',
    description: 'Tips for better sleep and rest',
    icon: 'Moon',
  },
  {
    title: 'Stress Management',
    description: 'Techniques for managing stress and anxiety',
    icon: 'Brain',
  },
  {
    title: 'Medication Adherence',
    description: 'Tips for taking medications properly',
    icon: 'Pill',
  },
  {
    title: 'General Wellness',
    description: 'General health and wellness tips',
    icon: 'Heart',
  },
];

/**
 * Health disclaimer for the chatbot
 */
export const HEALTH_DISCLAIMER = `This chatbot is designed to provide general health information and support, not medical diagnosis or treatment. 
Always consult with your healthcare provider for:
- Medical diagnosis
- Specific treatment recommendations
- Prescription medication advice
- Emergency health concerns

If you experience a medical emergency, please call emergency services immediately.`;
