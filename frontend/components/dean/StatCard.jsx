'use client';

export default function StatCard({ icon, label, value, sublabel }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
