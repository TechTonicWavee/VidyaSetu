import React from 'react'

export const metadata = {
  title: 'Demo Script | Educator Analytics OS',
}

export default function DemoScriptPage() {
  return (
    <div className="bg-white min-h-screen text-gray-800 p-8 md:p-12 font-sans max-w-4xl mx-auto page-fade-in print:p-0">
      <div className="flex justify-between items-end border-b-2 border-navy pb-6 mb-8 print:border-b-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Dean Demo Script — Educator Analytics OS</h1>
          <p className="text-gray-500 text-lg">8-minute walkthrough · Print this before the meeting</p>
        </div>
        <PrintButton />
      </div>

      <div className="space-y-12">
        <ScriptSection 
          step="1"
          time="1 minute"
          title="Student Profile"
          show="/dashboard/student/profile"
          say="This is Priyanshu Raj. Every piece of data we have about him — marks, attendance, projects, skills, behavioral notes — lives on this one screen. When a parent visits or a placement officer asks, this is what opens. No more switching between 4 different portals."
          click="Hero card, then Academics tab, then Skills tab"
        />

        <ScriptSection 
          step="2"
          time="45 seconds"
          title="Skill Radar"
          show="/dashboard/student/skill-radar"
          say="This is the part that changes how you see students. Priyanshu's CGPA is 7.4 — average. But look at this. His Kinesthetic and Technical intelligence are in the top 15% of the batch. His practical scores average 81%. He is not an average student — he is a student whose strength is invisible in a marksheet."
          click="Hover over Kinesthetic bar showing 84"
        />

        <ScriptSection 
          step="3"
          time="45 seconds"
          title="SPI Score"
          show="/dashboard/student/spi"
          say="This is the Student Potential Index. One number, completely transparent. You can see exactly what contributes to it and exactly what improves it. Every student sees this. Every faculty sees this. Every parent sees this. And every student knows exactly what to do to improve it."
          click="The 5 contribution boxes at the bottom of the hero card"
        />

        <ScriptSection 
          step="4"
          time="1 minute"
          title="Potential Gap"
          show="/dashboard/student/potential-gap"
          say="This is the feature no other platform has. Priyanshu's SPI is 72 today. His potential SPI — based entirely on what he has already demonstrated he can do — is 87.4. That 15-point gap is not a judgment. It is a roadmap. Every student in your college gets this report every semester. Instead of telling a student they are weak, we show them how strong they could be."
          click="The two circles, then the radar chart showing current vs potential overlaid"
        />

        <ScriptSection 
          step="5"
          time="1 minute"
          title="Parent Visit Mode"
          show="/dashboard/faculty/parent-visit then click through to /dashboard/parent"
          say="A parent walks in today — unannounced. You open this. Generate a QR code. They scan it on their phone. In 10 seconds they see their child's attendance, academic health, their strongest skill — which is project work — and exactly what they can do to help. In Hindi if needed. No login account required. The session expires automatically."
          click="Go through the 3-step QR generation, then open parent view"
        />

        <ScriptSection 
          step="6"
          time="1 minute"
          title="Dean Dashboard"
          show="/dashboard/dean/department"
          say="Now let me show you your view. This is the department health score — 73 out of 100 — updated automatically. Below it, every branch, every year, every alert, every faculty effectiveness score. The curriculum gap analysis tells you that Normalization in DBMS has been failing 58% of students for 3 consecutive years across all branches. That is not a random observation — that is 3 years of data telling you exactly where to intervene."
          click="Branch tabs, then faculty performance table, then curriculum gap section"
        />

        <ScriptSection 
          step="7"
          time="45 seconds"
          title="Cohort Forecasting"
          show="/dashboard/dean/forecasting"
          say="This is the forecast for your final year batch right now. 61% placement rate at current trajectory. 74% if the intervention plan is followed. That is 47 more students placed — before the placement season even starts. These 209 students are predicted to need support. They are listed by name, by risk level, with their assigned faculty and an intervention recommendation."
          click="At-risk table, click Intervene Now on first row"
        />

        <ScriptSection 
          step="8"
          time="1 minute"
          title="AI Advisor"
          show="/ai-advisor"
          say="Every user has an AI advisor that knows their context. Watch — I am going to switch from the student view to your view.\n\n[Switch role to Dean in the toggle]\n\nThe same interface. But now when you ask a question — 'which intervention will have the biggest impact on placement?' — the AI answers with your data, your students, your department history. Not generic advice. Your specific situation."
          click="Switch role toggle, show dean's pre-loaded conversation"
        />

        <div className="bg-gray-50 border-l-4 border-navy p-6 mt-8 rounded-r-lg break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">CLOSE:</h3>
          <p className="text-lg text-gray-800 leading-relaxed italic whitespace-pre-wrap">
            "That was 8 minutes. What you saw was:
            <br/><br/>
            — A complete student intelligence system<br/>
            — Parent communication that works without any setup<br/>
            — A dean-level strategic AI tool<br/>
            — Forecasting that works 6 months ahead<br/>
            — And an AI advisor that speaks the language of each role
            <br/><br/>
            This is not a marks portal. This is the nervous system of an institution."
          </p>
        </div>
      </div>
    </div>
  )
}

function ScriptSection({ step, time, title, show, say, click }) {
  return (
    <div className="break-inside-avoid border border-gray-100 rounded-xl p-6 shadow-sm hover:border-blue-200 transition">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
          {step}
        </div>
        <h2 className="text-xl font-bold text-navy flex-1">STEP {step} — {title}</h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {time}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">What to show:</span>
          <code className="text-sm bg-gray-50 text-blue-600 px-2 py-1 rounded">{show}</code>
        </div>
        
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">What to say:</span>
          <p className="text-base text-gray-800 leading-relaxed font-serif whitespace-pre-wrap">"{say}"</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">What to click:</span>
          <p className="text-sm text-amber-900 font-medium">{click}</p>
        </div>
      </div>
    </div>
  )
}

import PrintButton from './PrintButton'
