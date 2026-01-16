import React from 'react'

function Refunds() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellations & Refunds</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Refund Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai operates on a credit-based system. Once credits are purchased and activated,
              they are generally non-refundable. However, we understand that issues may arise, and
              we handle refund requests on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligible Refund Cases</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Refunds may be considered in the following situations:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Payment was charged but credits were not added to your account</li>
              <li>Duplicate payment was processed</li>
              <li>Technical issue prevented service usage after purchase</li>
              <li>Service was unavailable for an extended period after purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Refundable Cases</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Refunds will NOT be provided in the following cases:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Credits have been used or partially used</li>
              <li>User changed their mind after successful purchase</li>
              <li>User is dissatisfied with AI-generated reply quality</li>
              <li>Account was suspended due to terms violation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How to Request a Refund</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To request a refund, please contact us at:{' '}
              <a href="mailto:contact@evizenai.com" className="text-rose-600 hover:text-rose-700">
                contact@evizenai.com
              </a>
            </p>
            <p className="text-gray-600 leading-relaxed mb-2">
              Include the following information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Your account email</li>
              <li>Payment transaction ID or order ID</li>
              <li>Date and amount of purchase</li>
              <li>Reason for refund request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Processing Time</h2>
            <p className="text-gray-600 leading-relaxed">
              If your refund request is approved, it will be processed within 5-7 business days.
              The refund will be credited to the original payment method used for the purchase.
              Please allow additional time for your bank or payment provider to process the refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cancellation Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Replai does not have subscription plans. All purchases are one-time credit purchases.
              You can stop using the service at any time. Unused credits remain in your account and
              do not expire.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Disputes</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have a payment dispute, please contact us first at{' '}
              <a href="mailto:contact@evizenai.com" className="text-rose-600 hover:text-rose-700">
                contact@evizenai.com
              </a>{' '}
              before initiating a chargeback with your bank. We are committed to resolving issues
              fairly and quickly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For refund requests or questions about our cancellation policy, contact:{' '}
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

export default Refunds
