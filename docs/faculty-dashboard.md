# Educator Analytics OS — Faculty Dashboard

# Faculty Dashboard (Main)
- **Overview**: The central landing page providing a high-level view of the faculty's daily tasks, student metrics, and connected systems (Moodle/Cyber Vidya).
- **Top Stats Cards**:
  - **My Students**: Total students across all subjects (e.g. 243).
  - **Active Alerts**: Total active alerts with a breakdown of high-priority ones.
  - **Avg Class SPI**: Average performance index with trend indicators (+2 from last month).
  - **CO Attainment**: Current average CO attainment percentage against the target threshold.
- **Students Needing Attention**: 
  - Priority list showing students with severe issues (e.g., Score dropped 28%, 3 assignments missed).
  - Data points: Student name, roll number, subject, issue description, and severity (HIGH/MEDIUM).
  - Interactions: Hovering over a student row reveals a "View Profile" button. Includes a "View All Alerts" button at the bottom.
- **Subject Performance**:
  - Progress bars showing average scores for each tracked subject (e.g., DBMS, OS, TOC, DSA).
  - Data points: Subject name, average score percentage, CO Attainment percentage, and count of "Students at Risk".
  - Interactions: Clicking a subject navigates to the detailed Subject Analytics page.
- **Moodle & Cyber Vidya Sync**:
  - **Moodle LMS**: Displays sync status, assignments tracked, pending submissions flagged, and new grades posted. Links out to "Open Moodle LMS".
  - **Cyber Vidya**: Displays sync status, subjects tracked, students below 75% attendance, and today's class marking status. Links out to "Open Cyber Vidya".
- **Global Header (present on all pages)**:
  - Sidebar toggle, Global Search bar, Notifications Bell (with active count badge), Profile Dropdown showing initials and name.

# Student Alerts
- **Overview**: Dedicated interface to monitor, filter, and act on automated student risk indicators.
- **Filters**: Dropdowns to filter alerts by **Severity** (All, High, Medium, Low) and **Subject** (All Subjects, or specific ones).
- **Alert Cards**:
  - Data points: Severity badge, timestamp, student name, roll number, subject, issue description, and a distinct "Suggested action" block.
  - Interactions:
    - **View Profile**: Navigates to the individual student's detailed profile.
    - **Mark Resolved**: Clicking this button dynamically removes the alert from the active list.
- **Empty State**: Displays a friendly "No alerts match your filters" message when the filtered list is empty.

# Attendance Management
- **Overview**: Interface for Cyber Vidya attendance integration, focusing on a specific class section.
- **Header Actions**: "Export" button, "Mark Today's Attendance" button, and a "Sync Vidya" button in the top navbar which triggers a rotating loading animation for 2 seconds.
- **Top Stats Cards**:
  - **Avg Attendance**: Class average for the selected section.
  - **Shortage Warnings**: Count of students below the 75% threshold.
  - **Classes Held**: Total classes held this semester.
- **Student Attendance Roster Table**:
  - **Filters**: Filter and Search icon buttons.
  - **Columns**: Student Name & Roll, Current % (with visual progress bar turning red if below 75%), Status badge (Strong, Good, Watch, Critical), Last Activity (e.g. 'Today', 'Yesterday'), and Actions menu.

# CO Attainment
- **Overview**: Monitors Subject-wise Course Outcome (CO1-CO3) achievement against the NBA requirement threshold (75%).
- **Summary Table**:
  - Lists each subject alongside CO1, CO2, CO3 scores and Overall Attainment %.
  - Visuals include progress bars for each percentage, color-coded based on performance.
  - A Status column displays "GOOD" or "AT RISK" badges.
- **Hidden/Legacy Detailed View**:
  - Contains subject-specific tabs (DBMS, OS, TOC, DSA) showing highly detailed tables with Assessment 1-3 scores, Target, Attained, Gap, and Status.
  - Overall Attainment Box and an AI Recommendation Box identifying critical topics.
  - **Plan Re-teach Session Modal**: Form to select a date and duration (1 Hour / 2 Hours) for a critical topic. Submitting triggers a "Session scheduled" toast.
  - **Bar Chart**: Recharts bar chart showing CO attainment across subjects with an NBA Target (75%) reference line.

# My Classes
- **Overview**: Manages class sections, schedules, and aggregate attendance/risk performance.
- **Top Stats Cards**: Active Classes, Total Students, Avg Attendance (Rolling 2 weeks), and At-Risk count.
- **Filters**: Dropdown to filter by Semester (All, Sem III, Sem IV) and a search input for subject, code, or room.
- **Classes Table**:
  - Columns: Class details (Subject, Code, Section, Sem, Room), Schedule (days, time, next session date/time), Students Count, Attendance % (with color-coded progress bar), At Risk count (color-coded badges).
  - Interactions: "View Analytics" action link navigating to the specific subject's analytics page.

# Parent Communication
- **Overview**: A comprehensive messaging hub for direct parent communication, meeting scheduling, and WhatsApp digests.
- **Top Stats Cards**: Active Conversations, Unread messages, Meetings This Week, WhatsApp Digests Sent.
- **Conversation Interface**:
  - **Left Sidebar**: Searchable list of parent conversations with quick filters (All, Unread, Meetings, Alerts). Shows parent name, last active time, student details, and message snippet.
  - **Active Chat View**: 
    - Header with action icons: View Student Profile, Generate Visit QR, Schedule Meeting.
    - Quick Summary Strip: SPI, Attendance, Latest Score, Active Alerts.
    - Chat History: Timeline of message bubbles with timestamps and read receipts.
  - **Input Area**: 
    - Quick action templates (Attendance Warning, Score Update, Meeting Request, Positive Feedback) auto-populate the message box.
    - "Send" button triggers a "Message sent" toast and clears input.
  - **Bottom Action Buttons**: Send WhatsApp Digest Now, Schedule Parent-Teacher Meeting, Generate Student Summary PDF (all trigger specific toast notifications).
- **Upcoming Parent-Teacher Meetings**:
  - Collapsible accordion section showing meeting cards.
  - Data points: Status (Confirmed/Pending), Parent Name, Date, Time, Location/Mode (In-person, Online/Google Meet), and Agenda.
  - Actions: Reschedule, Cancel, Confirm, or Join Meet.

# Parent Visit Mode
- **Overview**: Interface dedicated to generating QR codes for in-person parent visits.
- **Interactions**:
  - Uses an `EmptyState` component displaying "Generate a QR code to start a parent visit session."
  - Clicking the "Generate QR Code" action button triggers a browser alert placeholder.

# Reports
- **Overview**: Interface to generate and download audit-ready reports for accreditation (NAAC/NBA) and internal review.
- **Top Stats Cards**: Total Reports, Ready to Download, Generating, Last Updated.
- **Quick Exports**: 
  - Buttons to "Download NAAC Pack" and "Download NBA Pack".
  - Interactions: Clicking these temporarily changes the button state to a green checkmark reading "Downloaded!" for 2.5 seconds.
- **Filters**: Tabs to filter reports by category: All, NAAC/NBA, Intervention, Compliance, Academic.
- **Report Cards**:
  - Data points: Type badge (color-coded), Report Name, Description, Last Updated Date, Page Count, File Size, and Status.
  - Interactions:
    - **Preview**: Opens a preview of the report.
    - **Configure**: Changes state to "Configuring..." for 3 seconds.
    - **Generate**: Available for pending reports, triggers a spinning loader and "Generating..." text for 3 seconds.
    - **Download**: Available for ready reports, triggers a temporary "Done!" success state.

# Subject Analytics (Analytics Dashboard)
- **Overview**: Deep dive into class-level performance, topic heatmaps, and course outcome (CO) attainment metrics.
- **Data Points & Visuals**:
  - Interactive charts (via Recharts) displaying student performance distributions.
  - Topic heatmaps indicating weak and strong areas for the cohort.
- **Interactions**: 
  - Student performance tables with direct links navigating to individual student profiles.

# Student Profile
- **Overview**: Comprehensive 360-degree view of an individual student's academic and behavioral history.
- **Header**: Basic student info, current SPI, overall attendance, and active alerts.
- **Tabs**:
  - **Academic**: Historical grades, current performance, and radar charts for skill profiling.
  - **Notes/Feedback**: Behavioral notes and faculty observations.
  - **Alert History**: Log of past risk triggers and actions taken.
- **Interactions**:
  - Modals to add new behavioral notes or manually generate custom alerts.
  - Toast notifications confirming actions like saving a note.

# Student Intelligence
- **Overview**: AI-driven insights interface predicting student cohorts and individual trajectories.
- **Interactions**:
  - Sidebar integration for consistent navigation.
  - Actionable insights powered by the mock data engine, surfacing hidden patterns.
  - Displays toast notifications for user interactions.

# Mock Data Source (`lib/faculty/mock-data.js`)
- **Overview**: The central structured data store simulating backend responses for the entire dashboard.
- **Components**:
  - `FACULTY_PROFILE`: The currently authenticated faculty user.
  - `SECTION_STUDENTS`: Array containing 80 detailed student objects, complete with `academicScore`, `dbmsScore`, `attendance`, and dynamically assigned `flags`.
  - Helper functions and generation algorithms used to seed the UI with consistent, realistic performance metrics and archetypes.
