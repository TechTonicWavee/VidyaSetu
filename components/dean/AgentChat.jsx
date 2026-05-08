'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeanContext } from '@/app/dashboard/dean/_context/DeanContext';

export default function AgentChat({ compact = true, showFullPage = false }) {
  const { addMeeting, meetings } = useDeanContext();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hi Dean! I'm your scheduling assistant. Tell me about a meeting you'd like to add, and I'll schedule it for you." },
  ]);

  const quickChips = [
    "Schedule director meeting next week",
    "Add faculty session on Friday",
    "Remind me about budget report",
    "What's on my schedule this week?",
  ];

  const parseAgentInput = (text) => {
    const today = new Date('2025-05-10');
    let date = today.toISOString().split('T')[0];
    let time = '2:00 PM';
    let title = 'Meeting';

    // Simple date parsing
    if (text.match(/next week|next friday|friday/i)) {
      const nextFriday = new Date(today);
      nextFriday.setDate(nextFriday.getDate() + (5 - today.getDay() + 7) % 7 || 7);
      date = nextFriday.toISOString().split('T')[0];
      time = '10:00 AM';
    } else if (text.match(/tomorrow|next day/i)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    }

    // Simple title parsing
    if (text.match(/director/i)) title = 'Board Meeting with Director';
    else if (text.match(/phd|thesis/i)) title = 'PhD Thesis Review';
    else if (text.match(/faculty|session/i)) title = 'Faculty Session';
    else if (text.match(/budget|report/i)) title = 'Budget Report Review';
    else if (text.match(/senate|board/i)) title = 'Senate Meeting';
    else title = 'Scheduled Meeting';

    return { title, date, time, location: 'TBD', type: 'Meeting', attendees: 2, notes: text };
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);

    // Parse and add meeting
    const meeting = parseAgentInput(text);
    addMeeting(meeting);

    // Add agent response
    const agentResponse = `Got it! I've scheduled "${meeting.title}" for ${meeting.date} at ${meeting.time}. This has been added to your meetings dashboard. Redirecting...`;
    setMessages(prev => [...prev, { role: 'agent', text: agentResponse }]);

    setInput('');

    // Redirect to meetings dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard/dean/meetings');
    }, 1500);
  };

  const handleQuickChip = (chip) => {
    setInput(chip);
    setTimeout(() => handleSend(chip), 0);
  };

  const recentMessages = messages.slice(-3);

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">🤖 AI Scheduling Agent</h3>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickChips.slice(0, 2).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Recent messages */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-32 overflow-y-auto space-y-2">
          {recentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm rounded-lg px-3 py-2 ${
                msg.role === 'agent'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-blue-600 text-white ml-6'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell me about a meeting..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Send
          </button>
        </div>

        <a
          href="/dashboard/dean/agent"
          className="text-xs text-blue-600 hover:underline mt-3 inline-block"
        >
          Open full agent →
        </a>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-screen">
      {/* Left: Chat */}
      <div className="flex-[0.6] flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 ${
                  msg.role === 'agent'
                    ? 'bg-gray-100 text-gray-700 rounded-tl-sm'
                    : 'bg-blue-600 text-white rounded-tr-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick chips */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe a meeting to schedule..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right: Schedule Preview */}
      <div className="flex-[0.4] border-l border-gray-200 p-6 overflow-y-auto bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Your schedule — updated live</h3>
        <div className="space-y-2">
          {meetings
            .filter(m => m.status !== 'completed')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 10)
            .map(meeting => (
              <div
                key={meeting.id}
                className={`p-3 rounded-lg border-l-4 ${
                  meeting.source === 'agent'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-white border-l-4 border-gray-300'
                }`}
              >
                <p className="font-medium text-sm text-gray-900">{meeting.title}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {meeting.date} at {meeting.time}
                </p>
                {meeting.source === 'agent' && (
                  <span className="text-xs text-green-700 font-semibold mt-1 inline-block">
                    ✓ Added by agent
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
