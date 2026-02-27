import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function GetStarted() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    medicine: '',
    time: '',
    language: 'English',
    repeatType: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/schedule', {
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        medicine: formData.medicine,
        time: formData.time,
        caregiverPhone: formData.phone,
        language: formData.language.toLowerCase() === 'hindi' ? 'hi' : 'en',
        repeatType: formData.repeatType
      });

      if (response.data.success) {
        alert('Reminder scheduled successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule reminder. Please try again.');
    } finally {
      setLoading(false);
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

          <div className="flex gap-6">
            <Link to="/dashboard" className="text-slate-600 hover:text-custom-teal font-medium text-sm transition-colors">
              Dashboard
            </Link>
            <Link to="/" className="text-slate-600 hover:text-custom-teal font-medium text-sm transition-colors">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 py-16 text-center">
        <div className="inline-block bg-custom-teal/10 px-6 py-2 rounded-full mb-6">
          <span className="text-custom-teal font-bold text-sm">✨ FREE FOREVER</span>
        </div>
        <h1 className="text-6xl font-black text-slate-900 font-heading mb-6 leading-tight">Schedule Your First<br/>Medicine Reminder</h1>
        <p className="text-xl text-slate-600 font-subheading max-w-2xl mx-auto">Set up automated voice calls in 2 minutes. No credit card required.</p>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-8 pb-20">

        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Caregiver Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-custom-teal rounded-full flex items-center justify-center text-white font-black">1</div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">Your Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 90000 00000"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Info */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-custom-teal rounded-full flex items-center justify-center text-white font-black">2</div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">Parent's Details</h3>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Parent's Name</label>
                    <input 
                      type="text" 
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent's name"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Parent's Phone</label>
                    <input 
                      type="tel" 
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="+91 90000 00000"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reminder Details */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-custom-teal rounded-full flex items-center justify-center text-white font-black">3</div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">Reminder Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Medicine Name</label>
                    <input 
                      type="text" 
                      name="medicine"
                      value={formData.medicine}
                      onChange={handleChange}
                      placeholder="e.g., Metformin, Amlodipine, Thyroxine"
                      required
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                    <input 
                      type="time" 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 bg-white font-semibold text-lg"
                      style={{
                        colorScheme: 'light',
                      }}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                    <select 
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 bg-white"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency</label>
                    <select 
                      name="repeatType"
                      value={formData.repeatType}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:border-custom-teal focus:outline-none transition-all text-slate-900 bg-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    Schedule Reminder
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="font-semibold">99.9% Uptime</span>
          </div>
        </div>
      </section>
    </div>
  );
}
