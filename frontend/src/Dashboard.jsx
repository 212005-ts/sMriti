import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('/api/reminders');
      setReminders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TAKEN': return 'bg-custom-teal text-white';
      case 'CALLING': return 'bg-yellow-500 text-white';
      case 'MISSED': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/">
              <span className="text-3xl font-black text-slate-900 tracking-tight underline decoration-custom-teal decoration-2 underline-offset-4 hover:text-custom-teal hover:scale-105 transition-all cursor-pointer" style={{fontFamily: 'Lato, sans-serif'}}>sMriti</span>
            </Link>
          </div>

          <div className="flex gap-4">
            <Link to="/dashboard" className="text-custom-teal font-semibold text-sm border-b-2 border-custom-teal">
              Dashboard
            </Link>
            <Link to="/" className="text-slate-600 hover:text-custom-teal font-medium text-sm transition-colors">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 font-heading mb-2">My Reminders</h1>
            <p className="text-lg text-slate-600 font-subheading">Track your medication schedule in real-time</p>
          </div>
          <Link to="/get-started">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
              + Add Reminder
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-custom-teal border-t-transparent"></div>
            <p className="mt-6 text-lg text-slate-600 font-semibold">Loading your reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-20 text-center border-2 border-slate-200">
            <div className="w-32 h-32 bg-custom-teal/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 font-heading">No Reminders Yet</h3>
            <p className="text-lg text-slate-600 mb-10 font-subheading max-w-md mx-auto">Start by scheduling your first medicine reminder to keep your loved ones safe</p>
            <Link to="/get-started">
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0">
                Schedule First Reminder
              </button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-black text-custom-teal mb-2">{reminders.length}</p>
                <p className="text-sm text-slate-600 font-bold">Total Reminders</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-2 border-custom-teal/20 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-black text-custom-teal mb-2">
                  {reminders.filter(r => r.status === 'TAKEN').length}
                </p>
                <p className="text-sm text-slate-600 font-bold">Taken Today</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-black text-slate-400 mb-2">
                  {reminders.filter(r => r.status === 'PENDING').length}
                </p>
                <p className="text-sm text-slate-600 font-bold">Pending</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-black text-slate-400 mb-2">
                  {reminders.filter(r => r.status === 'MISSED').length}
                </p>
                <p className="text-sm text-slate-600 font-bold">Missed</p>
              </div>
            </div>

            {/* Reminders List */}
            <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-200 hover:border-custom-teal transition-all hover:shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-custom-teal/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 font-heading">{reminder.medicine}</h3>
                        <p className="text-sm text-slate-500">{reminder.parentName}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1">TIME</p>
                        <p className="text-base font-bold text-slate-900">{reminder.time}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1">SCHEDULE</p>
                        <p className="text-base font-bold text-slate-900 capitalize">{reminder.repeatType}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1">LANGUAGE</p>
                        <p className="text-base font-bold text-slate-900">{reminder.language === 'hi' ? 'Hindi' : 'English'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1">ATTEMPTS</p>
                        <p className="text-base font-bold text-slate-900">{reminder.attempts} / {reminder.maxAttempts}</p>
                      </div>
                    </div>

                    {reminder.lastCalledAt && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last called: {new Date(reminder.lastCalledAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </section>
    </div>
  );
}
