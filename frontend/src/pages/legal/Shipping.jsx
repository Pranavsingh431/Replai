import React from 'react'
import { Package } from 'lucide-react'

function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {/* Not Applicable Notice */}
          <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-200 mb-8">
            <div className="flex-shrink-0">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Not Applicable - Digital Service
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>Replai is a digital AI service.</strong> No physical goods are shipped.
                All services are delivered digitally and instantly upon purchase.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Delivery</h2>
              <p className="text-gray-600 leading-relaxed">
                When you purchase credits on Replai:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
                <li>Credits are added to your account instantly after successful payment</li>
                <li>No physical items are shipped or delivered</li>
                <li>All features are accessible immediately through the web application</li>
                <li>No shipping address is required</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Product Nature</h2>
              <p className="text-gray-600 leading-relaxed">
                Replai provides:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
                <li>AI-powered conversation analysis</li>
                <li>Suggested reply generation</li>
                <li>Digital credits for service usage</li>
                <li>Online access to all features</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instant Activation</h2>
              <p className="text-gray-600 leading-relaxed">
                There is no waiting period or shipping time. Once your payment is confirmed by
                Razorpay, your credits are immediately available for use. You can start using
                Replai's features right away.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about service delivery or credit activation, contact us at:{' '}
                <a href="mailto:contact@evizenai.com" className="text-rose-600 hover:text-rose-700">
                  contact@evizenai.com
                </a>
              </p>
            </div>
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

export default Shipping
