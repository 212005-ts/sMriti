import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link to="/">
            <span className="text-3xl font-black text-slate-900 tracking-tight underline decoration-custom-teal decoration-2 underline-offset-4 hover:text-custom-teal hover:scale-105 transition-all cursor-pointer" style={{fontFamily: 'Lato, sans-serif'}}>sMriti</span>
          </Link>
          <Link to="/">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
              ← Back to Home
            </button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-900 mb-6 font-heading">Privacy Policy</h1>
          <p className="text-lg text-slate-500 font-subheading">Last updated: January 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 border-2 border-slate-200">
          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">1. Information We Collect</h2>
              <p className="text-lg font-subheading mb-4">We collect information you provide directly to us when using sMriti, including:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2 text-lg">
                <li>Parent's name and phone number</li>
                <li>Caregiver's name, email, and phone number</li>
                <li>Medicine names and reminder schedules</li>
                <li>Call confirmation status and timestamps</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">2. How We Use Your Information</h2>
              <p className="text-lg font-subheading mb-4">We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2 text-lg">
                <li>Make automated voice calls for medicine reminders</li>
                <li>Send SMS alerts to caregivers when doses are missed</li>
                <li>Display reminder status on your dashboard</li>
                <li>Improve our service and user experience</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">3. Data Security</h2>
              <p className="text-lg font-subheading">We implement appropriate security measures to protect your personal information. All data transmission is encrypted using industry-standard SSL/TLS protocols. We store your data securely and limit access to authorized personnel only.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">4. Third-Party Services</h2>
              <p className="text-lg font-subheading">We use Twilio for voice calls and SMS services. Twilio's privacy policy applies to their handling of call and message data. We do not sell or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">5. Data Retention</h2>
              <p className="text-lg font-subheading">We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us at support@smriti.health.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">6. Your Rights</h2>
              <p className="text-lg font-subheading mb-4">You have the right to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2 text-lg">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of communications</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">7. Contact Us</h2>
              <p className="text-lg font-subheading mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="bg-custom-teal/10 rounded-2xl p-6 border-2 border-custom-teal/30">
                <p className="text-lg font-bold text-custom-teal-800">Email: support@smriti.health</p>
                <p className="text-lg font-bold text-custom-teal-800 mt-2">Phone: +91 90000 00000</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
