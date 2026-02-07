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
    // FIXED: Added fixed positioning and overflow handling to make scrolling independent
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-white">
      <div className="min-h-full">
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
                          <strong className="text-gray-900">Analytics Data:</strong> Flyer generation statistics, feature usage patterns
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
                  <p className="text-gray-600 leading-relaxed mb-4">We use the collected information for the following purposes:</p>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div><strong className="text-gray-900">Application Functionality:</strong> To provide core features including daily reflections, flyer generation, and personalized content</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div><strong className="text-gray-900">Security:</strong> To authenticate users and protect against unauthorized access</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div><strong className="text-gray-900">Improvement:</strong> To analyze usage patterns and enhance user experience</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div><strong className="text-gray-900">Communication:</strong> To send important updates about the application</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div><strong className="text-gray-900">Compliance:</strong> To maintain records for legal and regulatory requirements</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data Sharing</h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:</p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                    <p className="text-gray-600 text-sm">Third-party vendors who help us operate the application (e.g., cloud hosting, analytics)</p>
                  </div>
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                    <p className="text-gray-600 text-sm">When required by law or to protect our rights and safety</p>
                  </div>
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
                    <p className="text-gray-600 text-sm">In connection with a merger, acquisition, or sale of assets (users will be notified)</p>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section id="data-security" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data Security</h2>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Encryption</p>
                        <p className="text-sm text-gray-600">Data encrypted in transit and at rest</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Secure Storage</p>
                        <p className="text-sm text-gray-600">PIN and sensitive data securely hashed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Access Control</p>
                        <p className="text-sm text-gray-600">Limited employee access to data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Regular Audits</p>
                        <p className="text-sm text-gray-600">Ongoing security assessments</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-6">
                    Note: While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data Retention</h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <p>
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When you delete your account, we will delete your personal data within 30 days, except where we are legally required to retain certain information.
                  </p>
                  <p className="mt-4">
                    Generated flyers and reflections may be retained for operational purposes but are not linked to your identity after account deletion.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Your Rights</h2>
                <div className="bg-gray-50 rounded-2xl p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">You have the following rights regarding your personal information:</p>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Access</h3>
                        <p className="text-gray-600 text-sm">Request a copy of your personal data</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Correction</h3>
                        <p className="text-gray-600 text-sm">Update inaccurate or incomplete information</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Deletion</h3>
                        <p className="text-gray-600 text-sm">Request deletion of your data (subject to legal requirements)</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Portability</h3>
                        <p className="text-gray-600 text-sm">Receive your data in a structured, machine-readable format</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">5</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Objection</h3>
                        <p className="text-gray-600 text-sm">Object to certain processing activities</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-6">
                    To exercise these rights, please contact us using the information provided in the Contact Us section.
                  </p>
                </div>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Children's Privacy</h2>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8">
                  <p className="text-gray-600 leading-relaxed">
                    RamadanBot is designed for users of all ages, including children. We do not knowingly collect personal information from children under 13 without parental consent. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to delete such information from our servers.
                  </p>
                  <div className="mt-6 p-4 bg-white rounded-xl border border-purple-300">
                    <p className="text-sm font-medium text-purple-900">
                      Parents/Guardians: We encourage you to monitor your child's use of the application and discuss online privacy and safety.
                    </p>
                  </div>
                </div>
              </section>

              {/* Third-Party Services */}
              <section id="third-party" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Third-Party Services</h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <p>
                    Our application may use third-party services for functionality such as analytics, cloud storage, or payment processing. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these third parties.
                  </p>
                  <p className="mt-4">
                    Third-party services we may use include:
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900">Google Analytics</p>
                    <p className="text-sm text-gray-600">For usage analytics and insights</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900">Cloud Storage Providers</p>
                    <p className="text-sm text-gray-600">For secure data storage</p>
                  </div>
                </div>
              </section>

              {/* Policy Changes */}
              <section id="changes" className="scroll-mt-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Policy Changes</h2>
                <div className="prose prose-lg max-w-none">
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
    </div>
  );
}
