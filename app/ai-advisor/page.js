'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, Bot, RotateCw, Loader, AlertCircle } from 'lucide-react'

export default function AIAdvisor() {
  const router = useRouter()
  const [role, setRole] = useState('Student')
  const [context, setContext] = useState('')
  const [studentName, setStudentName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [messageSending, setMessageSending] = useState(false)
  const messagesEndRef = useRef(null)

  // Fetch student context on mount
  useEffect(() => {
    fetchContext()
  }, [])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchContext = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/ai/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: 'CSE2024001' }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch student context')
      }

      const data = await response.json()
      setContext(data.context)
      setStudentName(data.student_name)
      setLastUpdated(new Date(data.timestamp))

      // Initialize with welcome message
      if (messages.length === 0) {
        setMessages([{
          role: 'assistant',
          content: `Hello ${data.student_name}! I'm your AI Career Advisor. I have access to your complete profile and latest achievements. How can I help you today? I can discuss your:
• Current projects and learning goals
• Career path recommendations
• SPI improvement strategies
• Course guidance based on your weak areas
• Placement preparation`
        }])
      }
    } catch (err) {
      setError(err.message)
      console.error('Context fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || messageSending) return

    const userMessage = inputValue.trim()
    setInputValue('')

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessageSending(true)

    try {
      // Build system prompt with context
      const systemPrompt = `You are an AI Career Advisor for ${studentName} at KIET College.
You have access to their complete, up-to-date profile:

${context}

Rules:
- Always answer based on this student's actual data
- Be specific — mention their real project names, scores, subjects
- When suggesting improvements, reference their actual weak areas
- Keep responses concise, warm, and actionable
- If asked about SPI, explain which specific dimension to improve
- Never give generic advice — always personalize to their data
- Focus on actionable career guidance`

      // Call Ollama API
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
          ],
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Ollama API error - ensure Ollama is running on http://localhost:11434')
      }

      const data = await response.json()
      const aiResponse = data.message?.content || 'Unable to get response from AI'

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])

    } catch (err) {
      console.error('Ollama error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Cannot connect to AI advisor. Error: ${err.message}. Make sure Ollama is running: ollama serve`
      }])
    } finally {
      setMessageSending(false)
    }
  }

  const formatTimeAgo = (date) => {
    if (!date) return ''
    const minutes = Math.floor((Date.now() - date) / 60000)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans page-fade-in">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Bot size={18} />
            </div>
            <h1 className="text-xl font-bold text-navy">AI Advisor</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Viewing as:</span>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:border-blue-400"
          >
            <option>Student</option>
            <option>Faculty</option>
            <option>Dean</option>
          </select>
        </div>
      </header>

      {/* Context Banner */}
      {role === 'Student' && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Loading your profile...</span>
              </>
            ) : error ? (
              <>
                <AlertCircle size={16} />
                <span className="text-red-600">{error}</span>
              </>
            ) : (
              <>
                <span className="font-medium">Advising based on your latest profile</span>
                {lastUpdated && <span>— updated {formatTimeAgo(lastUpdated)}</span>}
              </>
            )}
          </div>
          <button
            onClick={fetchContext}
            disabled={loading}
            className="p-1.5 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
            title="Refresh context"
          >
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Bot size={32} />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">AI Career Advisor</h2>
            <p className="text-gray-600">Start a conversation to get personalized career guidance</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-navy text-white text-xs font-bold' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {msg.role === 'user' ? 'Y' : <Bot size={16} />}
                </div>
                <div className={`rounded-2xl px-5 py-4 max-w-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-gray-50 text-gray-700 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {messageSending && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-5 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto">
          {role !== 'Student' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mb-4 text-sm text-yellow-700">
              AI Advisor context is available for Students only. Switch role to Student above.
            </div>
          )}
          <div className="relative flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder={role === 'Student' ? "Ask your AI advisor..." : "Advisor is for students (switch role above)"} 
              disabled={role !== 'Student' || messageSending || loading}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              onClick={sendMessage}
              disabled={role !== 'Student' || messageSending || loading || !inputValue.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {messageSending ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
