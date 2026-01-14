import React, { useState } from 'react'
import { Save, Play } from 'lucide-react'
import Modal from '../Common/Modal'
import { profileAPI } from '../../api'

function ProfileEditor({ isOpen, onClose, currentProfile, onProfileUpdated }) {
  const [profileText, setProfileText] = useState(currentProfile || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRestartTour = () => {
    localStorage.removeItem('replai_onboarding_complete')
    onClose()
    window.location.reload()
  }

  const handleSave = async () => {
    if (!profileText.trim()) {
      setError('Please enter your profile')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await profileAPI.updateProfile(profileText)
      setSuccess(true)
      onProfileUpdated(response.data)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Profile" size="lg">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-600">
              Profile updated and analyzed successfully
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About You
          </label>
          <textarea
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className="input-field min-h-[200px]"
            placeholder="Software engineer who loves hiking and photography. Looking to meet creative people who enjoy outdoor adventures..."
          />
          <p className="text-xs text-gray-500 mt-2">
            AI will analyze your personality and communication style to generate more personalized replies
          </p>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            We'll extract your personality traits, interests, and communication style to make replies sound more like you.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleRestartTour}
            className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Restart Onboarding Tour</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save & Analyze</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileEditor
