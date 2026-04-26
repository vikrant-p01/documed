'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import {
  Send,
  AlertCircle,
  MessageCircle,
  Loader2,
  Copy,
  Check,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Message,
  Conversation,
  addMessage,
  formatMessagesForAPI,
  isValidMessage,
  extractTopicFromMessage,
  HEALTH_DISCLAIMER,
} from '@/lib/chatbot';

interface ChatbotProps {
  userId?: string;
  className?: string;
  onSaveConversation?: (conversation: Conversation) => void;
}

export function Chatbot({
  userId,
  className,
  onSaveConversation,
}: ChatbotProps) {
  const [conversation, setConversation] = useState<Conversation>({
    id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: userId || 'guest',
    title: 'Health Assistant Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  // Auto-save conversation after each message (with 2-second debounce)
  useEffect(() => {
    if (conversation.messages.length === 0) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveConversation();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [conversation]);

  const saveConversation = async () => {
    if (conversation.messages.length === 0 || !userId) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/chatbot/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: conversation.id,
          userId: conversation.userId,
          title:
            conversation.messages.length === 1
              ? extractTopicFromMessage(conversation.messages[0].content)
              : conversation.title,
          messages: conversation.messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
          })),
        }),
      });

      if (response.ok) {
        setLastSaveTime(new Date());
        if (onSaveConversation) {
          onSaveConversation(conversation);
        }
      }
    } catch (err) {
      console.error('Failed to save conversation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidMessage(input)) {
      setError('Please enter a valid message (1-5000 characters)');
      return;
    }

    setError(null);

    try {
      // Add user message to conversation
      let updatedConversation = addMessage(conversation, 'user', input);

      // Update title if this is the first message
      if (updatedConversation.messages.length === 1) {
        updatedConversation = {
          ...updatedConversation,
          title: extractTopicFromMessage(input),
        };
      }

      setConversation(updatedConversation);
      setInput('');
      setLoading(true);

      // Call the chatbot API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formatMessagesForAPI(updatedConversation.messages),
          userId: userId || 'guest',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to get response`
        );
      }

      const data = await response.json();

      // Add assistant message to conversation
      updatedConversation = addMessage(
        updatedConversation,
        'assistant',
        data.message
      );
      setConversation(updatedConversation);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn('flex flex-col h-full gap-4', className)}>
      {/* Health Disclaimer */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <div className="text-sm text-blue-800">
          <strong>Important:</strong> This chatbot provides general health
          information. Always consult your healthcare provider for medical
          diagnosis, treatment, or emergencies.
        </div>
      </Alert>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col min-h-[400px]">
        <ScrollArea className="flex-1 p-4 space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Welcome to Your Health Assistant
              </h3>
              <p className="text-gray-500 max-w-md">
                Ask me about nutrition, exercise, sleep, stress management, and
                other wellness topics. I'm here to support your health journey.
              </p>
            </div>
          ) : (
            <>
              {conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2 mb-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-xs md:max-w-md px-4 py-2 rounded-lg',
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    )}
                  >
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        message.role === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(message.content, message.id)
                      }
                      className="h-8 w-8 p-0"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </>
          )}
        </ScrollArea>

        {/* Error Message */}
        {error && (
          <Alert className="mx-4 mt-2 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <div className="text-sm text-red-800">{error}</div>
          </Alert>
        )}

        {/* Loading and Save Status Indicators */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          {loading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Assistant is thinking...
            </div>
          )}
          {!loading && lastSaveTime && userId && (
            <div className="flex items-center gap-1 text-green-600">
              <Save className="h-3 w-3" />
              Saved
            </div>
          )}
          {isSaving && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </Card>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about nutrition, exercise, wellness..."
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="gap-2"
        >
          {loading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </Button>
      </form>
    </div>
  );
}
