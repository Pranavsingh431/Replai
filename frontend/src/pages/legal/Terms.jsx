import React from 'react'

function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using Replai, you accept and agree to be bound by these Terms & Conditions.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai is an AI-powered conversation assistant that provides suggested replies for dating,
              networking, and professional conversations. The service is provided as-is and uses AI technology
              to generate recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate information when creating an account</li>
              <li>Keep your account credentials secure</li>
              <li>Use the service in compliance with applicable laws</li>
              <li>Not misuse or abuse the service</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai operates on a credit-based system. Credits are purchased through our payment provider
              (Razorpay) and are non-refundable except as required by law. Prices are displayed in Indian
              Rupees (INR) and may change with notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. AI-Generated Content</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai uses AI to generate reply suggestions. While we strive for quality, we do not guarantee
              the accuracy, appropriateness, or effectiveness of AI-generated content. You are responsible
              for reviewing and deciding whether to use any suggested replies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai is provided "as is" without warranties of any kind. We are not liable for any damages
              arising from your use of the service, including but not limited to relationship outcomes,
              communication failures, or AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Account Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in
              abusive behavior. You may delete your account at any time through the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these terms from time to time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these terms, contact us at:{' '}
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

export default Terms
