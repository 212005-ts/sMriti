import { Link } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="text-6xl font-black text-slate-900 mb-6 font-heading">Terms of Service</h1>
          <p className="text-lg text-slate-500 font-subheading">Last updated: January 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 border-2 border-slate-200">
          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">1. Acceptance of Terms</h2>
              <p className="text-lg font-subheading">By accessing and using sMriti, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">2. Service Description</h2>
              <p className="text-lg font-subheading mb-4">sMriti provides automated voice call reminders for medication adherence. The service includes:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2 text-lg">
                <li>Scheduled voice calls in Hindi or English</li>
                <li>SMS alerts to caregivers for missed doses</li>
                <li>Real-time dashboard for tracking medication status</li>
                <li>Flexible scheduling options (daily, weekly, monthly)</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">3. User Responsibilities</h2>
              <p className="text-lg font-subheading mb-4">You agree to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2 text-lg">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not interfere with or disrupt the service</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">4. Medical Disclaimer</h2>
              <div className="bg-custom-teal/10 border-2 border-custom-teal/30 rounded-2xl p-6 mb-4">
                <p className="text-lg font-black text-custom-teal-800 mb-2">⚠️ IMPORTANT: sMriti is a reminder service only and does not provide medical advice.</p>
                <p className="text-lg font-subheading text-slate-700">This service is not a substitute for professional medical care. Always consult with healthcare providers regarding medication schedules and dosages. We are not responsible for any health outcomes resulting from missed or taken medications.</p>
              </div>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">5. Service Availability</h2>
              <p className="text-lg font-subheading">While we strive for 99.9% uptime, we do not guarantee uninterrupted service. We are not liable for service interruptions due to technical issues, maintenance, or circumstances beyond our control.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">6. Limitation of Liability</h2>
              <p className="text-lg font-subheading">sMriti and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the service, including but not limited to health complications from missed medications.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">7. Termination</h2>
              <p className="text-lg font-subheading">We reserve the right to suspend or terminate your access to the service at any time for violation of these terms or for any other reason at our discretion.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">8. Changes to Terms</h2>
              <p className="text-lg font-subheading">We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">9. Governing Law</h2>
              <p className="text-lg font-subheading">These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
            </section>

            <section className="pt-6 border-t border-slate-200">
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-heading">10. Contact Information</h2>
              <p className="text-lg font-subheading mb-4">For questions about these Terms of Service, contact us at:</p>
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
