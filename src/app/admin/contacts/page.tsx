'use client'
import { useEffect, useState } from 'react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all')

  useEffect(() => {
    loadMessages()
  }, [filter])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/contact?status=${filter}&page=1&limit=50`)
      const data = await response.json()
      
      if (data.messages) {
        setMessages(data.messages)
      } else {
        setError('Failed to load messages')
      }
    } catch (error) {
      setError('Error loading messages')
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        loadMessages()
      }
    } catch (error) {
      // Silent fail
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadMessages()
      }
    } catch (error) {
      // Silent fail
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            📧 Contact Messages
          </h1>
          <p style={{ color: '#6b7280' }}>
            {messages.length} total messages
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {(['all', 'unread', 'read', 'replied'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                background: filter === status ? '#3b82f6' : '#e5e7eb',
                color: filter === status ? 'white' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {/* Messages List */}
      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '60px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ color: '#6b7280', fontSize: '18px', marginBottom: '8px' }}>
              No messages found
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              {filter === 'all' ? 'No contact messages yet' : `No ${filter} messages`}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: message.status === 'unread' ? '2px solid #fef3c7' : '1px solid #e5e7eb'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {message.name}
                    </h3>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: message.status === 'unread' ? '#fef3c7' : 
                                message.status === 'read' ? '#e0e7ff' : '#d1fae5',
                      color: message.status === 'unread' ? '#92400e' : 
                             message.status === 'read' ? '#3730a3' : '#065f46'
                    }}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    margin: '0 0 8px 0'
                  }}>
                    📧 {message.email}
                  </p>
                  <p style={{
                    color: '#374151',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 16px 0'
                  }}>
                    Subject: {message.subject}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {message.status === 'unread' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'read')}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      👁️ Mark Read
                    </button>
                  )}
                  
                  {message.status !== 'replied' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'replied')}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Mark Replied
                    </button>
                  )}
                  
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject}&body=Hi ${message.name},%0D%0A%0D%0AThank you for contacting us.%0D%0A%0D%0ARegards,%0D%0ATestimonialPro Team`}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    📧 Reply
                  </a>
                  
                  <button
                    onClick={() => deleteMessage(message.id)}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {message.message}
                </p>
              </div>

              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                Received: {new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}