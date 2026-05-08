'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, Bot } from 'lucide-react'

export default function AIAdvisor() {
  const router = useRouter()
  const [role, setRole] = useState('Student')

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans page-fade-in">
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

      <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        <div className="flex-1 space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-5 py-4 max-w-2xl text-gray-700">
              {role === 'Student' && 'Hello Priyanshu. Based on your recent SPI increase and your strong performance in Kinesthetic intelligence, I recommend focusing your upcoming minor project on an IoT hardware implementation. How can I help you today?'}
              {role === 'Faculty' && 'Hello Professor. 4 students in your DBMS class have missed 3 consecutive lectures. I recommend sending an automated early intervention alert. Should I draft the message?'}
              {role === 'Dean' && 'Hello Dean. Based on cohort forecasting, the placement rate is currently projected at 61%. A targeted intervention in core Data Structures for Section B and C would likely increase this to 74%. Would you like to view the detailed simulation?'}
            </div>
          </div>
          
          <div className="flex gap-4 flex-row-reverse">
             <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
               {role.charAt(0)}
             </div>
             <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-5 py-4 max-w-2xl">
               {role === 'Student' && 'What should I study for my OS test tomorrow?'}
               {role === 'Faculty' && 'Yes, please draft the message to their parents.'}
               {role === 'Dean' && 'Which intervention will have the biggest impact on placement?'}
             </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-5 py-4 max-w-2xl text-gray-700">
              {role === 'Student' && 'Focus on Unit 5: Deadlocks and Memory Management. In your last two assignments, you scored lower on theoretical memory allocation concepts. I have prepared a 15-minute quick review of Bankers Algorithm for you.'}
              {role === 'Faculty' && 'Message drafted in Hindi and English. It focuses on the importance of attendance for the upcoming practical exams, maintaining a supportive tone. It is ready for your review in the Parent Communication tab.'}
              {role === 'Dean' && 'Based on your department history, replacing the generic aptitude training with intensive, hands-on mock technical interviews for the 209 "at-risk" students yields the highest ROI. This specific intervention has a 82% confidence of placing an additional 47 students.'}
            </div>
          </div>
        </div>

        <div className="mt-6 relative">
          <input 
            type="text" 
            placeholder="Ask your AI advisor..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Search size={16} />
          </button>
        </div>
      </main>
    </div>
  )
}
