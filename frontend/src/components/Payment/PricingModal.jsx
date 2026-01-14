import React, { useState, useEffect } from 'react'
import { CreditCard, Check, Smartphone } from 'lucide-react'
import Modal from '../Common/Modal'
import { paymentsAPI } from '../../api'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

function PricingModal({ isOpen, onClose }) {
  const [razorpayProducts, setRazorpayProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('razorpay') // 'razorpay' or 'stripe'

  useEffect(() => {
    if (isOpen) {
      loadProducts()
      loadRazorpayScript()
    }
  }, [isOpen])

  const loadProducts = async () => {
    try {
      const response = await paymentsAPI.getProducts()
      setRazorpayProducts(response.data.razorpay_products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPurchase = async (productId) => {
    setLoading(true)
    setSelectedProduct(productId)

    try {
      // Get Supabase session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        alert('You must be logged in to purchase credits')
        setLoading(false)
        return
      }

      // Create Razorpay order
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${API_BASE_URL}/razorpay/create-order`,
        null,
        {
          params: { plan: productId },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      )

      const orderData = response.data

      // Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Replai',
        description: orderData.description,
        image: '', // Add your logo URL here
        handler: async function (razorpayResponse) {
          // Payment successful, verify on backend
          try {
            // Get fresh session token
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            await axios.post(
              `${API_BASE_URL}/razorpay/verify-payment`,
              null,
              {
                params: {
                  order_id: razorpayResponse.razorpay_order_id,
                  payment_id: razorpayResponse.razorpay_payment_id,
                  signature: razorpayResponse.razorpay_signature
                },
                headers: {
                  Authorization: `Bearer ${currentSession.access_token}`
                }
              }
            )

            // Success!
            alert('Payment successful! Credits have been added to your account.')
            window.location.reload()
          } catch (error) {
            alert('Payment verification failed: ' + (error.response?.data?.detail || error.message))
          }
        },
        prefill: {
          email: '', // Can add user email here
          contact: '' // Can add user phone here
        },
        theme: {
          color: '#E11D48' // Rose-600
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            setSelectedProduct(null)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      alert('Failed to create order: ' + (error.response?.data?.detail || error.message))
      setLoading(false)
      setSelectedProduct(null)
    }
  }

  const getProductBadge = (productId) => {
    if (productId === 'medium') return 'Best Value'
    if (productId === 'weekly') return 'Most Popular'
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Plan" size="lg">
      {/* Payment Method Selector */}
      <div className="flex items-center justify-center space-x-4 mb-6 p-4 bg-rose-50 rounded-lg">
        <button
          onClick={() => setPaymentMethod('razorpay')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            paymentMethod === 'razorpay'
              ? 'bg-rose-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span>UPI / Cards / Wallets</span>
        </button>
        <button
          onClick={() => setPaymentMethod('stripe')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            paymentMethod === 'stripe'
              ? 'bg-rose-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>International Cards</span>
        </button>
      </div>

      {/* Razorpay Products */}
      {paymentMethod === 'razorpay' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {razorpayProducts.map((product) => {
              const badge = getProductBadge(product.id)
              const isSelected = selectedProduct === product.id

              return (
                <div
                  key={product.id}
                  className={`border ${
                    badge
                      ? 'border-rose-600'
                      : 'border-rose-200'
                  } rounded-xl p-6 relative hover:border-rose-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white`}
                >
                  {badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-rose-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                        {badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-rose-600">
                        {product.price_display}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-rose-600" />
                        <span>{product.credits === -1 ? 'Unlimited' : product.credits} credits</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-rose-600" />
                        <span>UPI / Cards / Wallets</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-rose-600" />
                        <span>Instant activation</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRazorpayPurchase(product.id)}
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                        badge
                          ? 'bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white'
                          : 'border border-rose-200 hover:bg-rose-50 text-rose-600'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-5 h-5" />
                          <span>Pay with UPI/Card</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-sm text-gray-700 text-center">
              🇮🇳 Secure payment powered by Razorpay • UPI, Cards, Wallets, Netbanking • Credits added instantly
            </p>
          </div>
        </>
      )}

      {/* Stripe Products (Coming Soon) */}
      {paymentMethod === 'stripe' && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            International Payments Coming Soon
          </h3>
          <p className="text-gray-600">
            We're adding support for international credit cards via Stripe.
          </p>
        </div>
      )}
    </Modal>
  )
}

export default PricingModal
