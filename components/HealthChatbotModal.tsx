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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HealthChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientContext: {
    diagnoses: any[];
    prescriptions: any[];
    labReports: any[];
    patientName: string;
  };
}

export function HealthChatbotModal({
  isOpen,
  onClose,
  patientContext,
}: HealthChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize with context-aware greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Hello ${patientContext.patientName}! 👋 I'm your AI Health Assistant. Based on your medical records, I can provide personalized health guidance. What would you like to know about your health, nutrition, exercise, or wellness?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen, patientContext.patientName, messages.length]);

  const buildContextualPrompt = () => {
    let context = `You are a compassionate health assistant for a patient. Here's their medical context:\n\n`;

    if (patientContext.diagnoses.length > 0) {
      context += `Current Diagnoses:\n`;
      patientContext.diagnoses.forEach((d: any) => {
        context += `- ${d.diagnosis} (${d.severity}, diagnosed on ${d.date}): ${d.description}\n`;
      });
      context += '\n';
    }

    if (patientContext.prescriptions.length > 0) {
      context += `Current Medications:\n`;
      patientContext.prescriptions.forEach((p: any) => {
        context += `- ${p.medication}: ${p.dosage} ${p.frequency} (prescribed on ${p.date})\n`;
      });
      context += '\n';
    }

    if (patientContext.labReports.length > 0) {
      context += `Recent Lab Results:\n`;
      patientContext.labReports.slice(0, 3).forEach((r: any) => {
        context += `- ${r.test_name}: ${r.result} (${r.date})\n`;
      });
      context += '\n';
    }

    context += `Please provide personalized health guidance based on this patient's medical history. Focus on:
- Specific lifestyle recommendations for their conditions
- Dietary guidance tailored to their diagnoses
- Safe exercise recommendations
- Medication adherence support
- When to seek emergency care

Always emphasize consulting their doctor for medical decisions. Keep responses concise and practical.`;

    return context;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setError(null);

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/health-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: buildContextualPrompt(),
            },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: 'user',
              content: input,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to get response`
        );
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal - Centered Full Screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg text-gray-900">Your Health Assistant</h2>
                <p className="text-xs text-gray-600">Personalized recommendations based on your medical records</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Health Disclaimer */}
          <Alert className="m-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-800">
              <strong>Important:</strong> This AI provides guidance based on your medical records. Always consult your doctor for medical decisions or emergencies.
            </div>
          </Alert>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 mb-4 py-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-md px-4 py-3 rounded-lg text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="h-8 w-8 p-0 self-center"
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
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div className="text-sm text-red-800">{error}</div>
              </Alert>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-600 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is analyzing your health records and preparing recommendations...
              </div>
            )}
            <div ref={scrollRef} />
          </ScrollArea>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-6 border-t border-border bg-gray-50">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your health, medications, exercise, nutrition..."
                disabled={loading}
                className="text-base"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="gap-2 px-6"
              >
                {loading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
