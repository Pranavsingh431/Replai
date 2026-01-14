import React, { useState } from 'react'
import { conversationAPI } from '../api'

function Dashboard({ token, onLogout }) {
  const [contactName, setContactName] = useState('')
  const [platform, setPlatform] = useState('tinder')
  const [chatText, setChatText] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [replies, setReplies] = useState(null)
  const [classification, setClassification] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedButton, setCopiedButton] = useState(null)

  const handlePasteConversation = async () => {
    if (!contactName.trim() || !chatText.trim()) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setLoading(true)
    setReplies(null)
    setClassification(null)

    try {
      const response = await conversationAPI.pasteConversation(
        contactName,
        platform,
        chatText
      )
      
      setConversationId(response.data.conversation_id)
      if (response.data.classification) {
        setClassification(response.data.classification)
      }
      
      // Auto-generate replies
      await handleGenerateReplies(response.data.conversation_id)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process conversation')
      setLoading(false)
    }
  }

  const handleGenerateReplies = async (convId = conversationId) => {
    if (!convId) {
      setError('No conversation to generate replies for')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await conversationAPI.generateReplies(convId)
      setReplies(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate replies')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, buttonId) => {
    navigator.clipboard.writeText(text)
    setCopiedButton(buttonId)
    setTimeout(() => setCopiedButton(null), 2000)
  }

  const exampleText = `You: Hey! How's your weekend going?
Them: Pretty good! Just got back from a hike
You: Nice! Where did you go?
Them: Up in the mountains, the view was amazing
You: That sounds incredible. I love hiking too`

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Conversation Copilot</h1>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="conversation-input">
          <h2>Paste Your Conversation</h2>
          
          <div className="info-box">
            <p>
              <strong>How to use:</strong> Paste your conversation below. Use "You:" or "Me:" for your messages, 
              and "Them:" or their name for their messages. The AI will analyze the conversation and generate 
              3 different reply options for you.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="input-row">
            <div className="form-group">
              <label>Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g., Sarah"
              />
            </div>

            <div className="form-group">
              <label>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="tinder">Tinder</option>
                <option value="bumble">Bumble</option>
                <option value="hinge">Hinge</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Conversation</label>
            <textarea
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder={exampleText}
            />
          </div>

          <button
            onClick={handlePasteConversation}
            className="btn-generate"
            disabled={loading}
          >
            {loading ? 'Analyzing & Generating Replies...' : 'Generate Replies'}
          </button>
        </div>

        {classification && (
          <div className="classification-info">
            <div className="classification-item">
              <div className="classification-label">Attraction Score</div>
              <div className="classification-value">
                {classification.attraction_score > 0 ? '+' : ''}
                {classification.attraction_score}
              </div>
            </div>
            <div className="classification-item">
              <div className="classification-label">Stage</div>
              <div className="classification-value">{classification.stage}</div>
            </div>
            <div className="classification-item">
              <div className="classification-label">Tone</div>
              <div className="classification-value">{classification.dominant_tone}</div>
            </div>
            <div className="classification-item">
              <div className="classification-label">Ghosting Risk</div>
              <div className="classification-value">{classification.ghosting_risk}</div>
            </div>
          </div>
        )}

        {loading && !replies && (
          <div className="loading">
            Analyzing conversation and generating personalized replies...
          </div>
        )}

        {replies && (
          <div className="replies-section">
            <h2>Your Reply Options</h2>
            
            <div className="replies-grid">
              <div className="reply-card safe">
                <div className="reply-header">
                  <span className="reply-label">Safe</span>
                </div>
                <div className="reply-text">{replies.safe}</div>
                <button
                  onClick={() => handleCopy(replies.safe, 'safe')}
                  className={`btn-copy ${copiedButton === 'safe' ? 'copied' : ''}`}
                >
                  {copiedButton === 'safe' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="reply-card flirty">
                <div className="reply-header">
                  <span className="reply-label">Flirty</span>
                </div>
                <div className="reply-text">{replies.flirty}</div>
                <button
                  onClick={() => handleCopy(replies.flirty, 'flirty')}
                  className={`btn-copy ${copiedButton === 'flirty' ? 'copied' : ''}`}
                >
                  {copiedButton === 'flirty' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="reply-card bold">
                <div className="reply-header">
                  <span className="reply-label">Bold</span>
                </div>
                <div className="reply-text">{replies.bold}</div>
                <button
                  onClick={() => handleCopy(replies.bold, 'bold')}
                  className={`btn-copy ${copiedButton === 'bold' ? 'copied' : ''}`}
                >
                  {copiedButton === 'bold' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
