import React from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

function PaymentCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="card p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-gray-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary w-full py-3 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <p className="text-sm text-gray-500 mt-4">
            You can try again anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
