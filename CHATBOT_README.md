# AI-Powered Health Assistant Chatbot

## Overview

The Health Assistant Chatbot is an AI-powered companion that helps patients make better day-to-day health decisions by providing:

- **Dietary Guidance**: Nutritional advice and meal planning tips
- **Self-Care Suggestions**: Wellness tips for exercise, sleep, and stress management
- **Treatment Support**: General information to support managing health conditions

## Features

### 1. **Intelligent Conversations**
- Uses Claude 3.5 Sonnet AI model for natural, empathetic responses
- Maintains conversation context across multiple messages
- Provides evidence-based health information

### 2. **User-Friendly Interface**
- Clean, intuitive chat interface
- Real-time message updates
- Suggested health topics for quick access
- Copy response functionality
- Message timestamps

### 3. **Persistent Storage**
- Store conversations in database
- Retrieve past conversations
- Track conversation history
- Support for multiple users

### 4. **Safety & Compliance**
- Health disclaimer prominently displayed
- Clear boundaries on what the chatbot can/cannot do
- Encourages consultation with healthcare providers
- No medical diagnosis or prescription recommendations

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL database
- OpenAI/Claude API key

### Installation

1. **Install Dependencies**
```bash
npm install
# or
pnpm install
```

2. **Set Environment Variables**
```env
# .env.local
OPENAI_API_KEY=your_claude_api_key_here
MYSQLHOST=your_database_host
MYSQLPORT=3306
MYSQLUSER=your_database_user
MYSQLPASSWORD=your_database_password
MYSQLDATABASE=your_database_name
```

3. **Initialize Database**
```bash
# Run the SQL schema script
mysql -u your_user -p your_database < scripts/init-chatbot-db.sql
```

4. **Start Development Server**
```bash
npm run dev
```

Access the chatbot at: `http://localhost:3000/chatbot`

## Architecture

### Components

#### 1. **API Endpoints**

**`/api/chat` (POST)**
- Handles chat message processing
- Sends messages to Claude AI
- Returns assistant responses
- Request format:
```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "userId": "user_id"
}
```

**`/api/chatbot/conversations` (GET/POST/DELETE)**
- Retrieve user conversations: `GET?userId=user_id`
- Get specific conversation: `GET?conversationId=conv_id`
- Save conversation: `POST` with full conversation object
- Delete conversation: `DELETE?conversationId=conv_id`

#### 2. **Components**

**`Chatbot.tsx`**
- Main chat interface component
- Handles message input and sending
- Displays conversation history
- Manages loading and error states
- Copy-to-clipboard functionality for responses

**`ChatbotPage.tsx`**
- Full page layout for chatbot
- Displays suggested topics
- Shows quick tips
- Important health notices
- Feature overview

#### 3. **Utilities**

**`lib/chatbot.ts`**
- Message and conversation type definitions
- Conversation management functions
- Message validation
- Suggested topics configuration
- Health disclaimer text

#### 4. **Database Schema**

**`chatbot_conversations` table**
- `id`: Unique conversation ID (VARCHAR 255)
- `user_id`: Reference to user (Foreign Key)
- `title`: Conversation title
- `created_at`: Timestamp
- `updated_at`: Timestamp

**`chatbot_messages` table**
- `id`: Unique message ID (VARCHAR 255)
- `conversation_id`: Reference to conversation (Foreign Key)
- `role`: 'user' or 'assistant'
- `content`: Message text (LONGTEXT)
- `timestamp`: Message timestamp

## Usage Guide

### For Patients

1. **Access the Chatbot**
   - Navigate to `/chatbot` in the application
   - Or click "Health Assistant" in the navigation menu

2. **Ask Questions**
   - Type your health-related question
   - Click Send or press Enter
   - Wait for the AI assistant to respond

3. **Suggested Topics**
   - Click on suggested topics for quick guidance
   - Explore nutrition, exercise, wellness topics

4. **Save Conversations**
   - Conversations are automatically saved to your profile
   - Access past conversations from your dashboard

### For Developers

#### Adding Custom System Prompts
Edit `/app/api/chat/route.ts` to customize the system prompt:
```typescript
const systemPrompt = `Your custom prompt here...`;
```

#### Extending Functionality
1. Add new suggested topics in `lib/chatbot.ts`
2. Create additional API endpoints for specific features
3. Extend the Chatbot component with new UI features

#### Database Queries
```typescript
// Get user's conversations
const conversations = await query(
  'SELECT * FROM chatbot_conversations WHERE user_id = ?',
  [userId]
);

// Get specific conversation with messages
const messages = await query(
  'SELECT * FROM chatbot_messages WHERE conversation_id = ? ORDER BY timestamp ASC',
  [conversationId]
);
```

## AI Model Configuration

The chatbot uses **Claude 3.5 Sonnet** for optimal balance of:
- Intelligence and reasoning
- Response quality
- Cost-effectiveness
- Safety and compliance

### Model Parameters
- **Model**: claude-3-5-sonnet-20241022
- **Max Tokens**: 1024
- **Temperature**: Default (0.7 - can be customized)

## Security & Privacy

1. **API Key Protection**
   - Store API keys in environment variables
   - Never commit sensitive keys
   - Use `.env.local` for development

2. **User Data**
   - Conversations linked to authenticated users
   - Database enforced foreign keys
   - No sensitive medical data stored in plain text

3. **Input Validation**
   - Message length limits (5000 characters)
   - Input sanitization
   - Rate limiting recommended for production

4. **Output Safety**
   - Health disclaimer always displayed
   - Clear boundaries on capabilities
   - No medical prescriptions provided
   - Encourages professional consultation

## Troubleshooting

### Issue: "OpenAI API key is not configured"
**Solution**: Verify `OPENAI_API_KEY` is set in `.env.local`

### Issue: Database connection errors
**Solution**: Check MySQL connection parameters in environment variables

### Issue: Slow responses
**Solution**: 
- Check API rate limits
- Optimize database queries
- Consider implementing caching

### Issue: Messages not saving
**Solution**: 
- Verify database schema is initialized
- Check user authentication
- Review database logs

## Performance Optimization

1. **Message Caching**
   - Cache frequently asked questions
   - Implement response caching

2. **Database Optimization**
   - Add indexes (already included in schema)
   - Archive old conversations periodically

3. **API Optimization**
   - Implement request batching
   - Use streaming responses for long messages

## Future Enhancements

1. **Multi-language Support**
   - Add language detection
   - Translate responses

2. **Personalization**
   - Track user health preferences
   - Provide condition-specific guidance

3. **Integration Features**
   - Link to patient medical records
   - Sync with doctor recommendations
   - Integration with wearable devices

4. **Analytics**
   - Track common health questions
   - Monitor user satisfaction
   - Identify knowledge gaps

5. **Advanced Features**
   - Voice input/output
   - Video integration
   - Appointment scheduling integration

## Support & Documentation

For more information:
- Check the main README.md
- Review database documentation in DATABASE_SETUP.md
- Consult API route files for implementation details

## Compliance & Disclaimers

⚠️ **Important Legal Notice**

This chatbot:
- Is NOT a replacement for professional medical advice
- Cannot diagnose medical conditions
- Cannot prescribe medications
- Should not be used for medical emergencies

Users are always encouraged to:
- Consult with licensed healthcare providers
- Seek immediate care for emergencies
- Verify any health advice with professionals
- Report serious health concerns to a doctor

## License & Attribution

- Built with Claude AI (Anthropic)
- Uses Next.js, React, and TypeScript
- Radix UI components for interface
