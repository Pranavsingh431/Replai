import React from 'react'
import { Mail, MessageSquare } from 'lucide-react'

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We're here to help. Reach out to us anytime.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Email Support */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Email Support</h2>
            </div>
            <p className="text-gray-600 mb-4">
              For general inquiries, technical support, or account issues:
            </p>
            <a
              href="mailto:contact@evizenai.com"
              className="text-rose-600 hover:text-rose-700 font-medium text-lg"
            >
              contact@evizenai.com
            </a>
            <p className="text-sm text-gray-500 mt-4">
              We typically respond within 24-48 hours.
            </p>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Have suggestions or feature requests? We'd love to hear from you.
            </p>
            <a
              href="mailto:contact@evizenai.com"
              className="text-rose-600 hover:text-rose-700 font-medium text-lg"
            >
              contact@evizenai.com
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Your feedback helps us improve Replai.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Replai</h2>
          <p className="text-gray-600 mb-4">
            Replai is an AI-powered conversation assistant that helps you craft better replies
            in dating, networking, and professional conversations.
          </p>
          <p className="text-gray-600">
            <strong>Service Type:</strong> Digital AI Service<br />
            <strong>Payment Methods:</strong> Online payments via Razorpay (UPI, Cards, Wallets)<br />
            <strong>Support Email:</strong> <a href="mailto:contact@evizenai.com" className="text-rose-600 hover:text-rose-700">contact@evizenai.com</a>
          </p>
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

export default Contact
