import React from 'react';
import { Metadata } from 'next';
import { Chatbot } from '@/components/Chatbot';
import { Card } from '@/components/ui/card';
import {
  Apple,
  Activity,
  Moon,
  Brain,
  Pill,
  Heart,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { suggestedTopics } from '@/lib/chatbot';

export const metadata: Metadata = {
  title: 'Health Assistant Chatbot',
  description:
    'AI-powered health assistant to help with nutrition, exercise, wellness, and self-care guidance.',
};

const iconMap: { [key: string]: React.ReactNode } = {
  Apple: <Apple className="h-6 w-6" />,
  Activity: <Activity className="h-6 w-6" />,
  Moon: <Moon className="h-6 w-6" />,
  Brain: <Brain className="h-6 w-6" />,
  Pill: <Pill className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
};

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Health Assistant Chatbot
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your personal AI-powered health companion. Get guidance on nutrition,
            exercise, wellness, and general self-care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <Chatbot userId="patient-user" className="h-full" />
            </Card>
          </div>

          {/* Sidebar with Info and Suggested Topics */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Ask about meal planning and nutrition</li>
                <li>✓ Get exercise and fitness recommendations</li>
                <li>✓ Learn about sleep and stress management</li>
                <li>✓ Get support for medication adherence</li>
                <li>✓ Receive wellness and prevention tips</li>
              </ul>
            </Card>

            {/* Suggested Topics */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Popular Topics
              </h3>
              <div className="space-y-3">
                {suggestedTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 cursor-help transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">
                        {iconMap[topic.icon]}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {topic.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Important Notice */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Not a Doctor
                  </h4>
                  <p className="text-sm text-gray-700">
                    This chatbot provides general health information, not medical
                    advice. Always consult your doctor for diagnosis, treatment, or
                    emergencies.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Apple className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Nutrition & Diet
            </h3>
            <p className="text-sm text-gray-600">
              Get personalized dietary guidance and nutritional advice for
              better health decisions.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Exercise & Wellness
            </h3>
            <p className="text-sm text-gray-600">
              Receive recommendations on physical activity and overall wellness
              practices.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Mental Health Support
            </h3>
            <p className="text-sm text-gray-600">
              Get guidance on stress management, sleep, and mental wellness
              techniques.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
