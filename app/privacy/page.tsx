'use client';

import { useState } from 'react';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collection', title: 'Information We Collect' },
    { id: 'information-use', title: 'How We Use Your Information' },
    { id: 'data-sharing', title: 'Data Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'children', title: "Children's Privacy" },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'changes', title: 'Policy Changes' },
    { id: 'contact', title: 'Contact Us' },
    { id: 'compliance', title: 'Compliance' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#fbfbfd] border-b border-gray-200">
        <div className="max-w-[980px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-6">Last updated: February 6, 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[980px] mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-8 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                On This Page
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="lg:col-span-9 space-y-16">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Introduction</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p>
                  Welcome to RamadanBot. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                </p>
                <p className="mt-4">
                  By using RamadanBot, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our application.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="information-collection" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Information We Collect</h2>
              
              <div className="space-y-8">
                {/* User-Provided Information */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Provided Information</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">PIN/Authentication:</strong> Your personal identification number (PIN) for accessing the application
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">User Name:</strong> Your display name used in generated flyers
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">Generated Content:</strong> Ramadan reflections, flyer images, and personal data embedded in flyers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automatically Collected Information */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Automatically Collected Information</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">Device Information:</strong> Device type, operating system, unique device identifiers
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">Usage Data:</strong> Application interaction logs, flyer generation events, download timestamps
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">IP Address:</strong> Your IP address for security and analytics purposes
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">Cookies & Similar Technologies:</strong> Local storage for session management and preferences
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third-Party Services */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">Google Gemini API:</strong> We send your flyer requests to Google's Gemini API to generate reflections
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">Analytics:</strong> We may use analytics services to understand usage patterns
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="information-use" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">How We Use Your Information</h2>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-3 text-gray-600">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To generate personalized Ramadan reflections and flyers</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To maintain your user account and track generation quotas</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To enforce rate limiting and prevent abuse</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To improve our application features and user experience</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To send you important updates about the application</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To troubleshoot technical issues and debug problems</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <p>To comply with legal obligations and protect our rights</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data Sharing and Disclosure</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-6">
                  <p className="text-blue-900 font-semibold text-lg">
                    We do not sell your personal data.
                  </p>
                </div>
                <p>However, we may share information in the following circumstances:</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8 mt-6">
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Third-Party Service Providers</h4>
                    <p>Google Gemini API, database providers, and hosting services that help us operate the application.</p>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                    <p>When required by law, court orders, or government authorities.</p>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Administrators</h4>
                    <p>An admin dashboard allows designated administrators to view user generation history (secure access only).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data Security</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-6">
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                  <p className="text-sm text-gray-600">Secure HTTPS/TLS encryption for all data in transit</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                  <p className="text-sm text-gray-600">PIN-based authentication for secure account access</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Storage</h4>
                  <p className="text-sm text-gray-600">Database encryption and secure storage practices</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Regular Updates</h4>
                  <p className="text-sm text-gray-600">Regular security reviews and system updates</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
                <p className="text-sm text-yellow-900">
                  <strong>Important:</strong> No method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data Retention</h2>
              <div className="bg-gray-50 rounded-2xl p-8">
                <p className="text-gray-600 leading-relaxed">
                  We retain your information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time. Generated flyers and history may be retained for administrative and analytics purposes but will be anonymized when possible.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Your Rights and Choices</h2>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">→</span> Access
                  </h4>
                  <p className="text-gray-600 text-sm">You can view your generation history through the History feature in the application</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">→</span> Modify
                  </h4>
                  <p className="text-gray-600 text-sm">You can update your display name and preferences in Settings</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">→</span> Delete
                  </h4>
                  <p className="text-gray-600 text-sm">You can request account deletion by contacting our support team</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">→</span> Opt-Out
                  </h4>
                  <p className="text-gray-600 text-sm">You can disable analytics or decline optional features</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">→</span> Consent Withdrawal
                  </h4>
                  <p className="text-gray-600 text-sm">You may withdraw consent for specific data uses</p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Children's Privacy</h2>
              <div className="bg-gray-50 rounded-2xl p-8">
                <p className="text-gray-600 leading-relaxed">
                  Our application is intended for general audiences but not specifically targeted at children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will promptly delete it. Parents or guardians who believe their child has provided information to us should contact us immediately.
                </p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Third-Party Links and Services</h2>
              <div className="bg-gray-50 rounded-2xl p-8">
                <p className="text-gray-600 leading-relaxed">
                  Our application integrates with Google Gemini API and other third-party services. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services you access through our application.
                </p>
              </div>
            </section>

            {/* Policy Changes */}
            <section id="changes" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
              <div className="bg-gray-50 rounded-2xl p-8">
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. When we do, we will notify you by updating the "Last updated" date at the top of this page. Your continued use of the application following any changes constitutes your acceptance of the new Privacy Policy. We encourage you to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Us</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-6">
                <p>
                  If you have questions about this Privacy Policy, your personal information, or our privacy practices, please contact us:
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Developer</p>
                    <p className="text-lg font-semibold text-gray-900">Abdullahi Adam Usman (Abdallah Nangere)</p>
                  </div>
                  <div className="h-px bg-blue-200"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900">Yobe State, Nigeria 🇳🇬</p>
                  </div>
                  <div className="h-px bg-blue-200"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Contact Information</p>
                    <div className="space-y-2">
                      <a href="mailto:abdallahnangere@gmail.com" className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">abdallahnangere@gmail.com</span>
                      </a>
                      <a href="https://wa.me/2348164135836" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span className="font-medium">+234 816 413 5836</span>
                      </a>
                      <a href="tel:+2348164135836" className="flex items-center gap-3 text-gray-600 hover:text-gray-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">Call: +234 816 413 5836</span>
                      </a>
                    </div>
                  </div>
                  <div className="h-px bg-blue-200"></div>
                  <p className="text-sm text-gray-600">
                    We will respond to your inquiry within 30 business days.
                  </p>
                </div>
              </div>
            </section>

            {/* Compliance */}
            <section id="compliance" className="scroll-mt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Compliance</h2>
              <div className="bg-gray-50 rounded-2xl p-8">
                <p className="text-gray-600 leading-relaxed mb-4">
                  This Privacy Policy complies with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Google Play Store Privacy Requirements</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>GDPR principles (where applicable)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>CCPA standards</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Industry best practices</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="scroll-mt-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Important Disclaimer</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      This application is provided for personal use during Ramadan. While we strive to provide accurate content, we do not guarantee the absolute correctness or completeness of generated reflections. Users should consult religious scholars for authentic Islamic guidance.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#fbfbfd]">
        <div className="max-w-[980px] mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2026 RamadanBot. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with ❤️ for the Ummah by Abdallah Nangere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
