import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { LogOut, CreditCard, User, MessageCircle, Plus, Settings } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ConversationView from './ConversationView'
import CreateContactModal from './CreateContactModal'
import PricingModal from '../Payment/PricingModal'
import ProfileEditor from '../Profile/ProfileEditor'
import OnboardingTour from '../Onboarding/OnboardingTour'

function Dashboard({ user, onLogout }) {
  const [credits, setCredits] = useState(0)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateContact, setShowCreateContact] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [runTour, setRunTour] = useState(false)
  const navigate = useNavigate()

  const handleProfileUpdated = (updatedProfile) => {
    setUserProfile(updatedProfile)
    // Optionally reload user data from Supabase if needed
  }

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  // Start tour only after loading is complete and user is on dashboard route
  useEffect(() => {
    if (!loading && user) {
      const hasSeenTour = localStorage.getItem('replai_onboarding_complete')
      if (!hasSeenTour) {
        // Delay tour to ensure DOM elements are fully rendered
        const tourTimer = setTimeout(() => {
          setRunTour(true)
        }, 1000)
        return () => clearTimeout(tourTimer)
      }
    }
  }, [loading, user])

  const loadData = async () => {
    try {
      // Fetch user profile from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (userError) {
        if (userError.code === 'PGRST116') {
          // User doesn't exist in users table yet
          // The database trigger should create it automatically
          console.log('User profile not found, waiting for trigger...')
          
          // Wait a moment for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Retry fetch
          const { data: retryData, error: retryError } = await supabase
            .from('users')
            .select('credits')
            .eq('id', user.id)
            .single()
          
          if (retryError) {
            console.error('User still not found after retry:', retryError)
            // Fallback: display 0 credits (should not normally happen)
            setCredits(0)
          } else {
            setCredits(retryData?.credits || 0)
          }
        } else {
          console.error('Error fetching user data:', userError)
          setCredits(0)
        }
      } else {
        setCredits(userData?.credits || 0)
      }

      // Fetch contacts from Supabase
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError)
      } else {
        setContacts(contactsData || [])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactCreated = (newContact) => {
    setContacts([newContact, ...contacts])
    navigate(`/dashboard/contact/${newContact.id}`)
  }

  const updateCredits = (newCredits) => {
    setCredits(newCredits)
  }

  const handleTourComplete = () => {
    localStorage.setItem('replai_onboarding_complete', 'true')
    setRunTour(false)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-300 border-t-rose-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/replai.png" 
                alt="Replai" 
                className="h-7 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => navigate('/dashboard')}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Buy Credits Button */}
              <button
                onClick={() => setShowPricing(true)}
                className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
              >
                Buy Credits
              </button>

              {/* Credits Display */}
              <div className="credits-display flex items-center space-x-2 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100 shadow-sm">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium text-gray-900">
                  {credits}
                </span>
              </div>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfile(true)}
                className="user-settings-button p-2 text-gray-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Routes>
        <Route path="/contact/:contactId" element={<ConversationView updateCredits={updateCredits} />} />
        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-6 py-8 animate-fadeIn">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Contacts
              </h1>
              <p className="text-gray-600">
                {credits} credits remaining
              </p>
            </div>

            {/* Contacts List */}
            <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">
                  All Contacts ({contacts.length})
                </h2>
                <button
                  onClick={() => setShowCreateContact(true)}
                  className="px-3 py-1.5 text-sm font-medium bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Contact</span>
                </button>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No contacts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first contact to start generating AI-powered replies
                  </p>
                  <button
                    onClick={() => setShowCreateContact(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-lg font-medium transition-all duration-300"
                  >
                    Create Contact
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-rose-100">
                  {contacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => navigate(`/dashboard/contact/${contact.id}`)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-rose-50/50 transition-all duration-300 text-left group hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center group-hover:bg-rose-100 transition-colors duration-300 shadow-sm">
                          <span className="text-sm font-medium text-rose-600">
                            {contact.name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {contact.platform} • {contact.stage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-rose-600">
                          {contact.interest_score}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Score
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </main>
        } />
      </Routes>

      {/* Modals */}
      <CreateContactModal
        isOpen={showCreateContact}
        onClose={() => setShowCreateContact(false)}
        onContactCreated={handleContactCreated}
      />
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
      <ProfileEditor
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        currentProfile={userProfile?.profile_text || user?.user_metadata?.profile_text}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Onboarding Tour */}
      <OnboardingTour 
        run={runTour} 
        onComplete={handleTourComplete} 
      />
    </div>
  )
}

export default Dashboard
