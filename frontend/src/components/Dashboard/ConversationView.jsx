import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { aiAPI } from '../../api'
import axios from 'axios'

function ConversationView({ updateCredits }) {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatLog, setChatLog] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [replies, setReplies] = useState(null)
  const [copiedReply, setCopiedReply] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [noReplyReason, setNoReplyReason] = useState(null)
  const [forceGenerate, setForceGenerate] = useState(false)
  const [showOutcomeTracker, setShowOutcomeTracker] = useState(false)
  const [selectedReplyType, setSelectedReplyType] = useState(null)

  useEffect(() => {
    loadData();
  }, [contactId]);

  const loadData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('User not authenticated')
        setLoading(false)
        return
      }

      // Fetch contact from Supabase
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .eq('user_id', user.id)
        .single()

      if (contactError) {
        console.error('Error fetching contact:', contactError)
        setContact(null)
        setLoading(false)
        return
      }

      setContact(contactData)

      // Fetch conversations for this contact
      const { data: conversationsData, error: convsError } = await supabase
        .from('conversations')
        .select(`
          id,
          contact_id,
          raw_chat_log,
          attraction_score,
          stage,
          dominant_tone,
          ghosting_risk,
          last_updated,
          messages(
            id,
            sender,
            content,
            timestamp
          )
        `)
        .eq('contact_id', contactId)
        .order('last_updated', { ascending: false })

      if (convsError) {
        console.error('Error fetching conversations:', convsError)
      } else if (conversationsData && conversationsData.length > 0) {
        const conv = conversationsData[0]
        setConversation(conv)
        setMessages(conv.messages || [])
        
        // Build chat log from messages
        if (conv.messages && conv.messages.length > 0) {
          const log = conv.messages.map((m) => 
            `${m.sender === 'user' ? 'You' : 'Them'}: ${m.content}`
          ).join('\n')
          setChatLog(log)
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setContact(null)
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConversation = async () => {
    if (!chatLog.trim()) {
      alert('Please enter a conversation');
      return;
    }

    setUpdating(true);
    try {
      // Get Supabase session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        alert('You must be logged in to update conversations')
        setUpdating(false)
        return
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${API_BASE_URL}/conversations/update`,
        {
          contact_id: parseInt(contactId),
          chat_log: chatLog
        },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );
      
      setConversation(response.data);
      setMessages(response.data.messages || []);
      
      // Reload contact to get updated scores
      const { data: contactData } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .single()
      
      if (contactData) {
        setContact(contactData)
      }
      
      setReplies(null); // Clear old replies
    } catch (error) {
      alert('Failed to update conversation: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateReplies = async (force = false) => {
    if (!conversation) {
      alert('Please update the conversation first');
      return;
    }

    setGenerating(true);
    setForceGenerate(force);
    
    try {
      const response = await aiAPI.generateReplies(conversation.id);
      const data = response.data;
      
      console.log('🎯 FRONTEND RECEIVED:', {
        recommendation: data.recommendation,
        no_reply_reason: data.no_reply_reason,
        has_safe: !!data.safe,
        has_flirty: !!data.flirty,
        has_bold: !!data.bold
      });
      
      setReplies(data);
      setRecommendation(data.recommendation);
      setNoReplyReason(data.no_reply_reason);
      updateCredits(data.credits_remaining);
      setShowOutcomeTracker(false);
      setSelectedReplyType(null);
    } catch (error) {
      if (error.response?.status === 402) {
        alert('Insufficient credits. Please purchase more credits.')
      } else {
        alert('Failed to generate replies: ' + (error.response?.data?.detail || error.message));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyReply = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedReply(type);
    setSelectedReplyType(type);
    setTimeout(() => {
      setCopiedReply(null);
      setShowOutcomeTracker(true);
    }, 1500);
  };

  const handleOutcomeSubmit = async (outcome) => {
    if (!selectedReplyType || !conversation) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(
        `${API_BASE_URL}/track-outcome`,
        {
          conversation_id: conversation.id,
          reply_type: selectedReplyType,
          outcome: outcome
        },
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        }
      );
    } catch (error) {
      console.error('Failed to track outcome:', error);
    }
    
    setShowOutcomeTracker(false);
    setSelectedReplyType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-300 border-t-rose-600"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Contact not found</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-lg font-medium transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-rose-600 transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {contact.name}
                </h1>
                <div className="flex items-center space-x-3 text-sm text-gray-500 mt-0.5">
                  <span>{contact.platform}</span>
                  <span>•</span>
                  <span className="capitalize">{contact.stage}</span>
                  <span>•</span>
                  <span className="text-rose-600 font-medium">Score: {contact.interest_score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="conversation-area space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-rose-600 mb-2">
                Conversation
              </label>
              <textarea
                value={chatLog}
                onChange={(e) => setChatLog(e.target.value)}
                placeholder="Paste your conversation here:&#10;&#10;You: Hey! How's it going?&#10;Them: Pretty good! Just got back from hiking&#10;You: Nice! Where did you go?"
                className="w-full h-96 px-4 py-3 border border-rose-200 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 font-mono text-sm resize-none shadow-lg hover:shadow-xl"
              />
              <p className="text-xs text-gray-500 mt-2">
                Format: "You: ..." and "Them: ..." on separate lines
              </p>
            </div>

            <button
              onClick={handleUpdateConversation}
              disabled={updating || !chatLog.trim()}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {updating ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing...</span>
                </span>
              ) : (
                'Update Conversation'
              )}
            </button>
          </div>

          {/* Right: Replies */}
          <div className="reply-section space-y-4 animate-fadeIn" style={{animationDelay: '100ms'}}>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-rose-600">
                AI Replies
              </label>
              {replies && (
                <span className="text-xs text-rose-600 font-medium">
                  {replies.credits_remaining} credits left
                </span>
              )}
            </div>
            
            {!replies ? (
              <div className="h-96 border-2 border-dashed border-rose-200 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm shadow-lg">
                <p className="text-gray-600 mb-4">
                  Update your conversation, then generate AI replies
                </p>
                <button
                  onClick={() => handleGenerateReplies(false)}
                  disabled={generating || !conversation}
                  className="py-2 px-6 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {generating ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Generating...</span>
                    </span>
                  ) : (
                    'Generate Replies'
                  )}
                </button>
              </div>
            ) : recommendation === 'no_reply' && !forceGenerate ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-full max-w-md border-2 border-amber-300 rounded-2xl p-10 bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No reply recommended</h3>
                      <p className="text-gray-700 text-base leading-relaxed">
                        Sending nothing preserves your position better than forcing a message right now.
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateReplies(true)}
                      disabled={generating}
                      className="py-3 px-8 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200"
                    >
                      Show replies anyway
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendation && recommendation !== 'no_reply' ? (
                  <>
                    {/* RECOMMENDED REPLY SECTION */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Recommended reply</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed ml-8">
                        {recommendation === 'safe' 
                          ? 'This reply is most likely to keep the conversation alive without risk.'
                          : recommendation === 'flirty'
                          ? 'This reply builds attraction while matching the current energy.'
                          : 'This reply moves things forward with confidence.'}
                      </p>
                      
                      {['safe', 'flirty', 'bold'].filter(type => type === recommendation).map((type) => (
                        <div
                          key={type}
                          className="relative bg-gradient-to-br from-white to-rose-50 border-2 border-rose-500 rounded-2xl p-6 shadow-2xl transform scale-105 animate-fadeIn"
                          style={{
                            boxShadow: '0 10px 40px -10px rgba(225, 29, 72, 0.3), 0 0 0 1px rgba(225, 29, 72, 0.1)'
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                              {type}
                            </span>
                            <button
                              onClick={() => handleCopyReply(replies[type], type)}
                              className="text-rose-600 hover:text-rose-700 transition-all duration-300 hover:scale-110"
                            >
                              {copiedReply === type ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          <p className="text-base text-gray-900 leading-relaxed font-medium">
                            {replies[type]}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* OTHER OPTIONS SECTION */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500">Other options</h3>
                      <div className="space-y-2">
                        {['safe', 'flirty', 'bold'].filter(type => type !== recommendation).map((type) => (
                          <details key={type} className="group">
                            <summary className="cursor-pointer list-none">
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    {type}
                                  </span>
                                  <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </summary>
                            <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 animate-fadeIn">
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                  {type}
                                </span>
                                <button
                                  onClick={() => handleCopyReply(replies[type], type)}
                                  className="text-gray-400 hover:text-rose-600 transition-all duration-300 hover:scale-110"
                                >
                                  {copiedReply === type ? (
                                    <Check className="w-4 h-4 text-rose-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {replies[type]}
                              </p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* NO RECOMMENDATION - SHOW ALL EQUALLY */
                  <div className="space-y-3">
                    {['safe', 'flirty', 'bold'].map((type, idx) => (
                      <div
                        key={type}
                        className="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md animate-fadeIn"
                        style={{animationDelay: `${idx * 100}ms`}}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                            {type}
                          </span>
                          <button
                            onClick={() => handleCopyReply(replies[type], type)}
                            className="text-gray-400 hover:text-rose-600 transition-all duration-300 hover:scale-110"
                          >
                            {copiedReply === type ? (
                              <Check className="w-4 h-4 text-rose-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {replies[type]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {showOutcomeTracker && (
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50/50 backdrop-blur-sm">
                    <p className="text-sm text-gray-700 mb-3">What happened next?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOutcomeSubmit('continued')}
                        className="py-2 px-3 border border-gray-300 hover:bg-white text-gray-700 rounded-lg text-xs font-medium transition-all"
                      >
                        Conversation continued
                      </button>
                      <button
                        onClick={() => handleOutcomeSubmit('revived')}
                        className="py-2 px-3 border border-gray-300 hover:bg-white text-gray-700 rounded-lg text-xs font-medium transition-all"
                      >
                        Conversation revived
                      </button>
                      <button
                        onClick={() => handleOutcomeSubmit('no_response')}
                        className="py-2 px-3 border border-gray-300 hover:bg-white text-gray-700 rounded-lg text-xs font-medium transition-all"
                      >
                        No response
                      </button>
                      <button
                        onClick={() => handleOutcomeSubmit('ended')}
                        className="py-2 px-3 border border-gray-300 hover:bg-white text-gray-700 rounded-lg text-xs font-medium transition-all"
                      >
                        Conversation ended
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleGenerateReplies(false)}
                  disabled={generating}
                  className="w-full py-2 px-4 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl font-medium transition-all duration-300 text-sm hover:shadow-md"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Preview */}
        {messages.length > 0 && (
          <div className="mt-8 animate-fadeIn" style={{animationDelay: '200ms'}}>
            <label className="block text-sm font-medium text-rose-600 mb-3">
              Message History ({messages.length})
            </label>
            <div className="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2 shadow-lg">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm ${
                    msg.sender === 'user'
                      ? 'text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  <span className="font-medium text-rose-600">
                    {msg.sender === 'user' ? 'You' : 'Them'}:
                  </span>{' '}
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationView;
