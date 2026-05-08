'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import MeetingCard from '@/components/dean/MeetingCard';

export default function MeetingsPage() {
  const { meetings, addMeeting, markMeetingComplete, deleteMeeting } = useDeanContext();
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Meeting',
    notes: '',
  });

  const today = new Date('2025-05-10');
  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
  const nextWeekEnd = new Date(today);
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 14);
  const thisMonthEnd = new Date(today);
  thisMonthEnd.setMonth(thisMonthEnd.getMonth() + 1);

  let filtered = meetings.filter(m => {
    const mDate = new Date(m.date);
    let passFilter = true;

    if (filter === 'thisWeek') passFilter = mDate >= today && mDate <= thisWeekEnd;
    if (filter === 'nextWeek') passFilter = mDate > thisWeekEnd && mDate <= nextWeekEnd;
    if (filter === 'thisMonth') passFilter = mDate >= today && mDate <= thisMonthEnd;

    if (typeFilter !== 'all') passFilter = passFilter && m.type === typeFilter;
    if (search) passFilter = passFilter && m.title.toLowerCase().includes(search.toLowerCase());

    return passFilter;
  });

  filtered = filtered.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.date) - new Date(b.date);
  });

  const handleAddMeeting = () => {
    if (formData.title && formData.date && formData.time) {
      addMeeting({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location || 'TBD',
        type: formData.type,
        attendees: 2,
        notes: formData.notes,
      });
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        type: 'Meeting',
        notes: '',
      });
      setShowForm(false);
    }
  };

  const meetingTypes = ['All', 'Director', 'Faculty', 'Senate', 'External', 'Academic'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Meetings</h1>
          <p className="text-gray-600 mt-1">Manage and track all your meetings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Add Meeting
        </button>
      </div>

      {/* Add Meeting Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Meeting title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Meeting</option>
              <option>Director</option>
              <option>Faculty</option>
              <option>Senate</option>
              <option>External</option>
              <option>Academic</option>
            </select>
          </div>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddMeeting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Add to Schedule
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="text-sm font-medium text-gray-700">When:</label>
            <div className="flex gap-2 mt-1">
              {['all', 'thisWeek', 'nextWeek', 'thisMonth'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'thisWeek' ? 'This Week' : f === 'nextWeek' ? 'Next Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <div className="flex gap-2 mt-1">
              {meetingTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type === 'All' ? 'all' : type)}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    (type === 'All' ? typeFilter === 'all' : typeFilter === type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search meeting title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No meetings found</p>
        ) : (
          filtered.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onMarkComplete={markMeetingComplete}
              onDelete={deleteMeeting}
              compact={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
