import React from 'react'

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              We collect the following information to provide and improve our service:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Account information (email, display name)</li>
              <li>Conversation data you input for AI analysis</li>
              <li>Usage data (features used, credits consumed)</li>
              <li>Payment information (processed securely by Razorpay)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Your information is used to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide AI-powered reply suggestions</li>
              <li>Process payments and manage your account</li>
              <li>Improve our AI models and service quality</li>
              <li>Send important service updates</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Storage & Security</h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is stored securely using industry-standard encryption. We use Supabase for data
              storage and implement security best practices to protect your information. Conversation data
              is stored only to provide the service and is not shared with third parties except our AI
              provider (OpenRouter) for processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Razorpay:</strong> Payment processing (subject to their privacy policy)</li>
              <li><strong>OpenRouter:</strong> AI model access for generating replies</li>
              <li><strong>Supabase:</strong> Database and authentication services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your data for as long as your account is active. You can request account deletion
              at any time, which will remove your personal data from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies & Tracking</h2>
            <p className="text-gray-600 leading-relaxed">
              We use essential cookies for authentication and session management. We do not use tracking
              cookies or third-party analytics beyond what is necessary for service operation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai is not intended for users under 18 years of age. We do not knowingly collect
              information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant
              changes via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at:{' '}
              <a href="mailto:contact@evizenai.com" className="text-rose-600 hover:text-rose-700">
                contact@evizenai.com
              </a>
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default Privacy
