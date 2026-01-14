import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import Modal from '../Common/Modal'
import { supabase } from '../../lib/supabase'

function CreateContactModal({ isOpen, onClose, onContactCreated }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('tinder')
  const [profileText, setProfileText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Insert contact into Supabase
      const { data: newContact, error: insertError } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          name: name,
          platform: platform,
          bio: profileText || null,
          interest_score: 50,
          stage: 'initial'
        })
        .select()
        .single()

      if (insertError) throw insertError

      onContactCreated(newContact)
      onClose()
      setName('')
      setPlatform('tinder')
      setProfileText('')
    } catch (err) {
      console.error('Error creating contact:', err)
      setError(err.message || 'Failed to create contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Sarah"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="input-field"
          >
            <option value="tinder">Tinder</option>
            <option value="bumble">Bumble</option>
            <option value="hinge">Hinge</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Their Profile (Optional)
          </label>
          <textarea
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className="input-field min-h-[100px]"
            placeholder="Adventure seeker, coffee enthusiast, loves hiking..."
          />
          <p className="text-xs text-gray-500 mt-1">
            AI will analyze their personality for better replies
          </p>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Contact</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateContactModal
