import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">

      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight underline decoration-custom-teal decoration-2 underline-offset-4 hover:text-custom-teal hover:scale-105 transition-all cursor-pointer" style={{fontFamily: 'Lato, sans-serif'}}>sMriti</span>
          </div>

          <div className="hidden md:flex gap-10 text-slate-600 font-medium text-sm">
            <a href="#home" className="hover:text-custom-teal cursor-pointer transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-custom-teal cursor-pointer transition-colors">How It Works</a>
            <a href="#features" className="hover:text-custom-teal cursor-pointer transition-colors">Features</a>
            <a href="#contact" className="hover:text-custom-teal cursor-pointer transition-colors">Contact</a>
            <Link to="/dashboard" className="hover:text-custom-teal cursor-pointer transition-colors">Dashboard</Link>
          </div>

          <Link to="/get-started">
            <button className="bg-slate-900 text-white px-7 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-8 py-28 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-custom-teal/10 text-custom-teal-700 px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-custom-teal/20">
            <div className="w-2 h-2 bg-custom-teal rounded-full animate-pulse"></div>
            Trusted by 500+ Families
          </div>
          
          <h1 className="text-7xl font-black leading-[1.1] text-slate-900 font-heading tracking-tight">
            Never Miss a
            <br />
            <span className="text-custom-teal">Dose Again</span>
          </h1>

          <p className="mt-8 text-2xl text-slate-600 leading-relaxed font-subheading">
            Voice-based medicine reminders for elderly parents with automated calls, confirmation tracking, and instant caregiver alerts.
          </p>

          <div className="mt-12">
            <Link to="/get-started">
              <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0">
                Schedule a Reminder
              </button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-custom-teal">98%</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-custom-teal">2 Min</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Setup Time</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-custom-teal">24/7</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Monitoring</p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview - Screenshot Style */}
        <div className="relative pointer-events-none select-none">
          {/* Browser Chrome */}
          <div className="bg-white/60 backdrop-blur-xl rounded-t-2xl p-3 border border-slate-200/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1 text-xs text-slate-400 ml-2">
                smriti.health/dashboard
              </div>
            </div>
          </div>
          
          {/* Screenshot Content */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-b-3xl shadow-2xl p-10 border-x border-b border-slate-200/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-custom-teal via-custom-teal-600 to-custom-teal"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900">Today's Status</h3>
              <div className="flex items-center gap-2 bg-custom-teal/10 backdrop-blur-sm text-custom-teal-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-custom-teal rounded-full"></div>
                <span className="text-xs font-bold">LIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-slate-200/50">
                <div>
                  <p className="font-bold text-slate-900 text-lg">BP Medicine</p>
                  <p className="text-sm text-slate-500 mt-1">09:00 AM • Daily</p>
                </div>
                <div className="bg-custom-teal text-white px-4 py-2 rounded-xl font-bold text-sm">
                  TAKEN
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-slate-200/50">
                <div>
                  <p className="font-bold text-slate-900 text-lg">Vitamin D</p>
                  <p className="text-sm text-slate-500 mt-1">01:00 PM • Daily</p>
                </div>
                <div className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm">
                  PENDING
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-5 rounded-2xl border-2 border-slate-200/50">
                <div>
                  <p className="font-bold text-slate-900 text-lg">Insulin</p>
                  <p className="text-sm text-slate-500 mt-1">08:00 PM • Daily</p>
                </div>
                <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-bold text-sm">
                  MISSED
                </div>
              </div>
            </div>
            
            {/* Demo Watermark */}
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
              Demo Data
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black text-slate-900 font-heading mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 font-subheading max-w-2xl mx-auto">Three simple steps to ensure your loved ones never miss their medication</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-custom-teal/20 via-custom-teal to-custom-teal/20"></div>
            
            <div className="grid md:grid-cols-3 gap-16 relative">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-48 h-48 bg-gradient-to-br from-custom-teal to-custom-teal-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-custom-teal">
                      <span className="text-3xl font-black text-custom-teal">1</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 font-heading">Schedule</h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-subheading">
                    Set up reminders with parent's details, medicine name, and preferred time in just 2 minutes
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-48 h-48 bg-gradient-to-br from-custom-teal to-custom-teal-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-custom-teal">
                      <span className="text-3xl font-black text-custom-teal">2</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 font-heading">Call</h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-subheading">
                    Automated voice call in Hindi or English reminds them to take medicine at the exact time
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="w-48 h-48 bg-gradient-to-br from-custom-teal to-custom-teal-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-custom-teal">
                      <span className="text-3xl font-black text-custom-teal">3</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 font-heading">Confirm</h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-subheading">
                    They press 1 to confirm. You get instant alerts if medicine is missed after 2 attempts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Workflow Section */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 font-heading">Real-Time Status Tracking</h2>
            <p className="mt-5 text-xl text-slate-600 font-subheading">Monitor medication compliance at a glance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* TAKEN Status */}
            <div className="bg-slate-50 rounded-3xl p-8 border-2 border-slate-200">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">BP Medicine</p>
                    <p className="text-sm text-slate-500 mt-1">09:00 AM</p>
                  </div>
                  <div className="bg-custom-teal text-white px-4 py-2 rounded-xl font-bold text-sm">
                    TAKEN
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 font-heading">Medicine Confirmed</h3>
              <p className="text-slate-600 leading-relaxed font-subheading">
                Patient pressed 1 to confirm. Caregiver notified of successful intake.
              </p>
            </div>

            {/* PENDING Status */}
            <div className="bg-slate-50 rounded-3xl p-8 border-2 border-slate-200">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Vitamin D</p>
                    <p className="text-sm text-slate-500 mt-1">01:00 PM</p>
                  </div>
                  <div className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm">
                    PENDING
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 font-heading">Awaiting Time</h3>
              <p className="text-slate-600 leading-relaxed font-subheading">
                Scheduled for later today. System will call at the designated time.
              </p>
            </div>

            {/* MISSED Status */}
            <div className="bg-slate-50 rounded-3xl p-8 border-2 border-slate-200">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Insulin</p>
                    <p className="text-sm text-slate-500 mt-1">08:00 PM</p>
                  </div>
                  <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-bold text-sm">
                    MISSED
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 font-heading">Alert Sent</h3>
              <p className="text-slate-600 leading-relaxed font-subheading">
                No response after 2 attempts. SMS alert sent to caregiver immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-slate-900 font-heading mb-6">Why sMriti Matters</h2>
            <p className="text-xl text-slate-600 font-subheading max-w-3xl mx-auto">
              Medication non-adherence is a silent crisis affecting millions of elderly patients worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-lg">
              <div className="text-5xl font-black text-custom-teal mb-4">50%</div>
              <p className="text-lg text-slate-700 font-semibold mb-2">Non-Adherence Rate</p>
              <p className="text-slate-600 font-subheading">Of elderly patients don't take medications as prescribed</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-lg">
              <div className="text-5xl font-black text-custom-teal mb-4">125K</div>
              <p className="text-lg text-slate-700 font-semibold mb-2">Annual Deaths</p>
              <p className="text-slate-600 font-subheading">Due to medication non-compliance in the US alone</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-lg">
              <div className="text-5xl font-black text-custom-teal mb-4">₹300B</div>
              <p className="text-lg text-slate-700 font-semibold mb-2">Healthcare Cost</p>
              <p className="text-slate-600 font-subheading">Wasted annually due to missed medications</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-custom-teal to-custom-teal-700 rounded-3xl p-12 text-white text-center shadow-2xl">
            <h3 className="text-3xl font-black mb-4 font-heading">Our Solution</h3>
            <p className="text-xl font-subheading leading-relaxed max-w-3xl mx-auto">
              sMriti bridges the gap with automated voice reminders, instant confirmation tracking, and real-time caregiver alerts — ensuring your loved ones never miss a dose.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-custom-teal to-custom-teal-600">
        <div className="max-w-4xl mx-auto px-8 text-center text-white">
          <h2 className="text-5xl font-black mb-6 font-heading">Ready to Get Started?</h2>
          <p className="text-2xl mb-12 opacity-95 font-subheading">
            Set up your first reminder in under 2 minutes. No credit card required.
          </p>
          <Link to="/get-started">
            <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0">
              Schedule Your First Reminder
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid md:grid-cols-4 gap-16">
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-black text-slate-900 underline decoration-custom-teal decoration-2 underline-offset-4" style={{fontFamily: 'Lato, sans-serif'}}>sMriti</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-subheading">
                Voice-based medicine reminder system ensuring medication compliance for elderly parents.
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-lg font-heading">Product</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#how-it-works" className="hover:text-custom-teal cursor-pointer transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-custom-teal cursor-pointer transition-colors">Features</a></li>
                <li className="hover:text-custom-teal cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-custom-teal cursor-pointer transition-colors">Demo</li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-lg font-heading">Company</h4>
              <ul className="space-y-4 text-slate-600">
                <li className="hover:text-custom-teal cursor-pointer transition-colors">About Us</li>
                <li><a href="#contact" className="hover:text-custom-teal cursor-pointer transition-colors">Contact</a></li>
                <li className="hover:text-custom-teal cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-custom-teal cursor-pointer transition-colors">Terms</li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6 text-lg font-heading">Contact</h4>
              <ul className="space-y-4 text-slate-600">
                <li>support@smriti.health</li>
                <li>+91 90000 00000</li>
                <li>India</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-300 text-center text-slate-500">
            © 2026 sMriti. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
