import React, { useState, useMemo } from 'react'
import './EngramProfileDashboard.css'

interface Enrichment {
  id: string
  title: string
  timestamp: string
  content: string
}

interface EngramProfile {
  id: string
  name: string
  role: string
  description: string
  tags: string[]
  enrichments: Enrichment[]
}

interface NewEngramForm {
  name: string
  role: string
  description: string
  tags: string[]
  newTag: string
  initialEnrichment: {
    title: string
    content: string
  }
}

interface EditEngramForm {
  name: string
  role: string
  description: string
  tags: string[]
  newTag: string
}

const EngramProfileDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<EngramProfile[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'AI Research Lead',
      description: 'Specializes in neural architecture optimization and distributed training systems.',
      tags: ['AI', 'Research', 'Deep Learning', 'Architecture'],
      enrichments: [
        {
          id: '1-1',
          title: 'Bug Discovery',
          timestamp: '2024-01-15T10:30:00Z',
          content: 'Identified critical memory leak in transformer attention mechanism. **Impact**: 40% performance improvement in inference speed.'
        },
        {
          id: '1-2',
          title: 'Conference Quote',
          timestamp: '2024-01-10T14:22:00Z',
          content: '"The future of AI lies not in larger models, but in smarter architectures that understand efficiency." - NeurIPS 2024'
        },
        {
          id: '1-3',
          title: 'Technical Insight',
          timestamp: '2024-01-08T09:15:00Z',
          content: 'Proposed novel attention pruning technique:\n\n```python\ndef adaptive_attention_prune(attention_weights, threshold=0.1):\n    # Dynamic pruning based on attention scores\n    return torch.where(attention_weights > threshold, attention_weights, 0)\n```'
        }
      ]
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      role: 'Hardware Engineer',
      description: 'Edge computing specialist with focus on neural processing units and optimization.',
      tags: ['Hardware', 'Edge Computing', 'NPU', 'Optimization'],
      enrichments: [
        {
          id: '2-1',
          title: 'Performance Breakthrough',
          timestamp: '2024-01-12T16:45:00Z',
          content: 'Achieved **3x speedup** in edge inference through custom silicon design. Reduced power consumption by 60%.'
        },
        {
          id: '2-2',
          title: 'Design Philosophy',
          timestamp: '2024-01-05T11:30:00Z',
          content: 'Believes in "hardware-software co-design" - optimizing algorithms specifically for target hardware constraints.'
        }
      ]
    },
    {
      id: '3',
      name: 'Dr. Amelia Foster',
      role: 'Data Scientist',
      description: 'Expert in large-scale data processing and real-time analytics systems.',
      tags: ['Data Science', 'Analytics', 'Real-time', 'Scale'],
      enrichments: [
        {
          id: '3-1',
          title: 'Customer Insight',
          timestamp: '2024-01-14T13:20:00Z',
          content: 'Discovered correlation between user engagement patterns and feature adoption. **Key insight**: Users who engage with collaborative features show 85% higher retention.'
        },
        {
          id: '3-2',
          title: 'Technical Challenge',
          timestamp: '2024-01-09T08:45:00Z',
          content: 'Solved real-time processing bottleneck using stream processing architecture with Apache Kafka and Flink.'
        }
      ]
    },
    {
      id: '4',
      name: 'Alex Kim',
      role: 'Full-Stack Builder',
      description: 'Rapid prototyping specialist who transforms ideas into functional systems.',
      tags: ['Builder', 'Prototype', 'Full-Stack', 'Innovation'],
      enrichments: [
        {
          id: '4-1',
          title: 'Rapid Deployment',
          timestamp: '2024-01-13T19:30:00Z',
          content: 'Built and deployed MVP in 48 hours using modern stack: **Next.js + Supabase + Vercel**. Achieved 99.9% uptime from day one.'
        },
        {
          id: '4-2',
          title: 'Problem Solving',
          timestamp: '2024-01-07T15:10:00Z',
          content: 'Prefers "build first, optimize later" approach. Quote: *"Perfect is the enemy of shipped."*'
        }
      ]
    },
    {
      id: '5',
      name: 'Elena Vasquez',
      role: 'UX Research Director',
      description: 'Human-centered design advocate with expertise in AI-human interaction patterns.',
      tags: ['UX', 'Research', 'AI-Human Interaction', 'Design'],
      enrichments: [
        {
          id: '5-1',
          title: 'User Behavior Study',
          timestamp: '2024-01-11T12:00:00Z',
          content: 'Conducted study on AI assistant interaction patterns. Found that users prefer **contextual suggestions** over explicit commands by 3:1 ratio.'
        },
        {
          id: '5-2',
          title: 'Design Principle',
          timestamp: '2024-01-06T14:30:00Z',
          content: 'Advocates for "invisible AI" - systems that enhance human capability without demanding attention or creating cognitive load.'
        }
      ]
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [expandedEnrichments, setExpandedEnrichments] = useState<{ [key: string]: boolean }>({})
  const [showNewEngramModal, setShowNewEngramModal] = useState(false)
  const [showEditEngramModal, setShowEditEngramModal] = useState(false)
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<EngramProfile | null>(null)
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false)
  const [selectedProfileForEnrichment, setSelectedProfileForEnrichment] = useState<string | null>(null)
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null)

  // Form state for new engram
  const [newEngramForm, setNewEngramForm] = useState<NewEngramForm>({
    name: '',
    role: '',
    description: '',
    tags: [],
    newTag: '',
    initialEnrichment: {
      title: '',
      content: ''
    }
  })

  // Form state for editing engram
  const [editEngramForm, setEditEngramForm] = useState<EditEngramForm>({
    name: '',
    role: '',
    description: '',
    tags: [],
    newTag: ''
  })

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    profiles.forEach(profile => {
      profile.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [profiles])

  // Filter profiles based on search and tags
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => profile.tags.includes(tag))
      
      return matchesSearch && matchesTags
    })
  }, [profiles, searchQuery, selectedTags])

  const toggleEnrichment = (enrichmentId: string) => {
    setExpandedEnrichments(prev => ({
      ...prev,
      [enrichmentId]: !prev[enrichmentId]
    }))
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for bold, italic, and code blocks
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
  }

  const addEnrichmentToProfile = (profileId: string, enrichment: Omit<Enrichment, 'id'>) => {
    const newEnrichment: Enrichment = {
      ...enrichment,
      id: `${profileId}-${Date.now()}`
    }
    
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId 
        ? { ...profile, enrichments: [newEnrichment, ...profile.enrichments] }
        : profile
    ))
    
    // Update selected profile if it's currently being viewed
    if (selectedProfile && selectedProfile.id === profileId) {
      setSelectedProfile(prev => prev ? {
        ...prev,
        enrichments: [newEnrichment, ...prev.enrichments]
      } : null)
    }
  }

  // Profile interaction functions
  const openProfileDetails = (profile: EngramProfile) => {
    setSelectedProfile(profile)
    setShowDetailedView(true)
  }

  const closeProfileDetails = () => {
    setSelectedProfile(null)
    setShowDetailedView(false)
    setExpandedEnrichments({}) // Reset expanded enrichments when closing
  }

  // New Engram Form Functions
  const handleFormChange = (field: keyof NewEngramForm, value: string) => {
    setNewEngramForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEnrichmentChange = (field: keyof NewEngramForm['initialEnrichment'], value: string) => {
    setNewEngramForm(prev => ({
      ...prev,
      initialEnrichment: {
        ...prev.initialEnrichment,
        [field]: value
      }
    }))
  }

  const addTagToForm = () => {
    const tag = newEngramForm.newTag.trim()
    if (tag && !newEngramForm.tags.includes(tag)) {
      setNewEngramForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTag: ''
      }))
    }
  }

  const removeTagFromForm = (tagToRemove: string) => {
    setNewEngramForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  const resetNewEngramForm = () => {
    setNewEngramForm({
      name: '',
      role: '',
      description: '',
      tags: [],
      newTag: '',
      initialEnrichment: {
        title: '',
        content: ''
      }
    })
  }

  const handleSubmitNewEngram = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!newEngramForm.name.trim() || !newEngramForm.role.trim() || !newEngramForm.description.trim()) {
      alert('Please fill in all required fields (Name, Role, Description)')
      return
    }

    // Create new profile
    const newProfile: EngramProfile = {
      id: `${Date.now()}`,
      name: newEngramForm.name.trim(),
      role: newEngramForm.role.trim(),
      description: newEngramForm.description.trim(),
      tags: newEngramForm.tags,
      enrichments: []
    }

    // Add initial enrichment if provided
    if (newEngramForm.initialEnrichment.title.trim() && newEngramForm.initialEnrichment.content.trim()) {
      const initialEnrichment: Enrichment = {
        id: `${newProfile.id}-1`,
        title: newEngramForm.initialEnrichment.title.trim(),
        timestamp: new Date().toISOString(),
        content: newEngramForm.initialEnrichment.content.trim()
      }
      newProfile.enrichments.push(initialEnrichment)
    }

    // Add to profiles
    setProfiles(prev => [newProfile, ...prev])
    
    // Reset form and close modal
    resetNewEngramForm()
    setShowNewEngramModal(false)
  }

  // Edit Engram Form Functions
  const handleEditFormChange = (field: keyof EditEngramForm, value: string) => {
    setEditEngramForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTagToEditForm = () => {
    const tag = editEngramForm.newTag.trim()
    if (tag && !editEngramForm.tags.includes(tag)) {
      setEditEngramForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTag: ''
      }))
    }
  }

  const removeTagFromEditForm = (tagToRemove: string) => {
    setEditEngramForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleEditKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  const openEditModal = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId)
    if (profile) {
      setEditEngramForm({
        name: profile.name,
        role: profile.role,
        description: profile.description,
        tags: [...profile.tags],
        newTag: ''
      })
      setEditingProfileId(profileId)
      setShowEditEngramModal(true)
    }
  }

  const resetEditEngramForm = () => {
    setEditEngramForm({
      name: '',
      role: '',
      description: '',
      tags: [],
      newTag: ''
    })
    setEditingProfileId(null)
  }

  const handleSubmitEditEngram = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!editEngramForm.name.trim() || !editEngramForm.role.trim() || !editEngramForm.description.trim()) {
      alert('Please fill in all required fields (Name, Role, Description)')
      return
    }

    if (!editingProfileId) {
      alert('No profile selected for editing')
      return
    }

    // Update the profile
    setProfiles(prev => prev.map(profile => 
      profile.id === editingProfileId 
        ? {
            ...profile,
            name: editEngramForm.name.trim(),
            role: editEngramForm.role.trim(),
            description: editEngramForm.description.trim(),
            tags: editEngramForm.tags
          }
        : profile
    ))
    
    // Update selected profile if it's currently being viewed
    if (selectedProfile && selectedProfile.id === editingProfileId) {
      setSelectedProfile(prev => prev ? {
        ...prev,
        name: editEngramForm.name.trim(),
        role: editEngramForm.role.trim(),
        description: editEngramForm.description.trim(),
        tags: editEngramForm.tags
      } : null)
    }
    
    // Reset form and close modal
    resetEditEngramForm()
    setShowEditEngramModal(false)
  }

  const handleDeleteProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId)
    if (profile && window.confirm(`Are you sure you want to delete ${profile.name}'s engram profile? This action cannot be undone.`)) {
      setProfiles(prev => prev.filter(p => p.id !== profileId))
      
      // Close detailed view if we're deleting the currently viewed profile
      if (selectedProfile && selectedProfile.id === profileId) {
        closeProfileDetails()
      }
    }
  }

  return (
    <div className="engram-dashboard">
      <div className="engram-header">
        <div className="engram-title-section">
          <h2 className="engram-title gradient-text">Engram Profiles</h2>
          <p className="engram-subtitle">Symbiotic intelligence memory archives</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowNewEngramModal(true)}
        >
          + New Engram
        </button>
      </div>

      <div className="engram-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input glass-card"
          />
        </div>
        
        <div className="tag-filters">
          <div className="tag-filter-label">Filter by tags:</div>
          <div className="tag-list">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="profiles-grid">
        {filteredProfiles.map(profile => (
          <div 
            key={profile.id} 
            className="profile-card glass-card clickable"
            onClick={() => openProfileDetails(profile)}
          >
            <div className="profile-header">
              <div className="profile-info">
                <h3 className="profile-name">{profile.name}</h3>
                <div className="profile-role">{profile.role}</div>
                <p className="profile-description">{profile.description}</p>
              </div>
            </div>

            <div className="profile-tags">
              {profile.tags.map(tag => (
                <span key={tag} className="profile-tag">{tag}</span>
              ))}
            </div>

            <div className="profile-enrichments-summary">
              <div className="enrichments-count">
                {profile.enrichments.length} enrichment{profile.enrichments.length !== 1 ? 's' : ''}
              </div>
              <div className="click-to-view">Click to see enrichments</div>
            </div>
          </div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">∅</div>
          <div className="no-results-text">No profiles match your search criteria</div>
        </div>
      )}

      {/* Detailed Profile View Modal */}
      {showDetailedView && selectedProfile && (
        <div className="modal-overlay" onClick={closeProfileDetails}>
          <div className="modal glass-card detailed-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="profile-header-detailed">
                <div className="profile-info-detailed">
                  <h2 className="profile-name-detailed gradient-text">{selectedProfile.name}</h2>
                  <div className="profile-role-detailed">{selectedProfile.role}</div>
                  <p className="profile-description-detailed">{selectedProfile.description}</p>
                  
                  <div className="profile-tags-detailed">
                    {selectedProfile.tags.map(tag => (
                      <span key={tag} className="profile-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="detailed-view-actions">
                <button 
                  className="edit-profile-btn"
                  onClick={() => openEditModal(selectedProfile.id)}
                  title="Edit profile"
                >
                  edit
                </button>
                <button
                  className="add-enrichment-btn"
                  onClick={() => {
                    setSelectedProfileForEnrichment(selectedProfile.id)
                    setShowEnrichmentModal(true)
                  }}
                  title="Add enrichment"
                >
                  + add memory
                </button>
                <button
                  className="delete-profile-btn"
                  onClick={() => handleDeleteProfile(selectedProfile.id)}
                  title="Delete profile"
                >
                  delete
                </button>
                <button 
                  className="modal-close-btn"
                  onClick={closeProfileDetails}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="detailed-enrichments">
              <h3 className="enrichments-title">
                Memory Archive ({selectedProfile.enrichments.length} enrichment{selectedProfile.enrichments.length !== 1 ? 's' : ''})
              </h3>
              
              {selectedProfile.enrichments.length === 0 ? (
                <div className="no-enrichments">
                  <div className="no-enrichments-icon">∅</div>
                  <div className="no-enrichments-text">No enrichments yet. Click "Add Memory" to create the first one.</div>
                </div>
              ) : (
                <div className="enrichments-list">
                  {selectedProfile.enrichments.map(enrichment => (
                    <div key={enrichment.id} className="enrichment-item">
                      <div 
                        className="enrichment-header"
                        onClick={() => toggleEnrichment(enrichment.id)}
                      >
                        <div className="enrichment-info">
                          <span className="enrichment-title">{enrichment.title}</span>
                          <span className="enrichment-timestamp">
                            {formatTimestamp(enrichment.timestamp)}
                          </span>
                        </div>
                        <span className={`expand-icon ${expandedEnrichments[enrichment.id] ? 'expanded' : ''}`}>
                          ↓
                        </span>
                      </div>
                      
                      {expandedEnrichments[enrichment.id] && (
                        <div 
                          className="enrichment-content"
                          dangerouslySetInnerHTML={{ 
                            __html: renderMarkdown(enrichment.content) 
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Engram Modal */}
      {showNewEngramModal && (
        <div className="modal-overlay" onClick={() => setShowNewEngramModal(false)}>
          <div className="modal glass-card new-engram-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="gradient-text">Create New Engram Profile</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowNewEngramModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitNewEngram} className="new-engram-form">
              <div className="form-section">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  value={newEngramForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="form-input glass-card"
                  required
                />
              </div>

              <div className="form-section">
                <label className="form-label">Role / Title *</label>
                <input
                  type="text"
                  value={newEngramForm.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                  placeholder="e.g., Senior AI Engineer, Product Manager"
                  className="form-input glass-card"
                  required
                />
              </div>

              <div className="form-section">
                <label className="form-label">Description *</label>
                <textarea
                  value={newEngramForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Brief description of expertise, background, or notable traits"
                  className="form-textarea glass-card"
                  rows={3}
                  required
                />
              </div>

              <div className="form-section">
                <label className="form-label">Tags</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={newEngramForm.newTag}
                    onChange={(e) => handleFormChange('newTag', e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addTagToForm)}
                    placeholder="Add a tag and press Enter"
                    className="form-input glass-card"
                  />
                  <button 
                    type="button" 
                    onClick={addTagToForm}
                    className="add-tag-btn"
                  >
                    Add
                  </button>
                </div>
                
                {newEngramForm.tags.length > 0 && (
                  <div className="form-tags">
                    {newEngramForm.tags.map(tag => (
                      <span key={tag} className="form-tag">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTagFromForm(tag)}
                          className="remove-tag-btn"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-section">
                <label className="form-label">Initial Enrichment (Optional)</label>
                <input
                  type="text"
                  value={newEngramForm.initialEnrichment.title}
                  onChange={(e) => handleEnrichmentChange('title', e.target.value)}
                  placeholder="Enrichment title (e.g., 'First Impression', 'Key Insight')"
                  className="form-input glass-card"
                />
                <textarea
                  value={newEngramForm.initialEnrichment.content}
                  onChange={(e) => handleEnrichmentChange('content', e.target.value)}
                  placeholder="Enrichment content (supports **bold**, *italic*, and `code`)"
                  className="form-textarea glass-card"
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowNewEngramModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Create Engram
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Engram Modal */}
      {showEditEngramModal && (
        <div className="modal-overlay" onClick={() => setShowEditEngramModal(false)}>
          <div className="modal glass-card new-engram-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="gradient-text">Edit Engram Profile</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowEditEngramModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitEditEngram} className="new-engram-form">
              <div className="form-section">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  value={editEngramForm.name}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="form-input glass-card"
                  required
                />
              </div>

              <div className="form-section">
                <label className="form-label">Role / Title *</label>
                <input
                  type="text"
                  value={editEngramForm.role}
                  onChange={(e) => handleEditFormChange('role', e.target.value)}
                  placeholder="e.g., Senior AI Engineer, Product Manager"
                  className="form-input glass-card"
                  required
                />
              </div>

              <div className="form-section">
                <label className="form-label">Description *</label>
                <textarea
                  value={editEngramForm.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  placeholder="Brief description of expertise, background, or notable traits"
                  className="form-textarea glass-card"
                  rows={3}
                  required
                />
              </div>

              <div className="form-section">
                <label className="form-label">Tags</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={editEngramForm.newTag}
                    onChange={(e) => handleEditFormChange('newTag', e.target.value)}
                    onKeyPress={(e) => handleEditKeyPress(e, addTagToEditForm)}
                    placeholder="Add a tag and press Enter"
                    className="form-input glass-card"
                  />
                  <button 
                    type="button" 
                    onClick={addTagToEditForm}
                    className="add-tag-btn"
                  >
                    Add
                  </button>
                </div>
                
                {editEngramForm.tags.length > 0 && (
                  <div className="form-tags">
                    {editEngramForm.tags.map(tag => (
                      <span key={tag} className="form-tag">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTagFromEditForm(tag)}
                          className="remove-tag-btn"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowEditEngramModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Update Engram
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEnrichmentModal && (
        <div className="modal-overlay" onClick={() => setShowEnrichmentModal(false)}>
          <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Enrichment</h3>
            <p>Enrichment modal implementation coming soon...</p>
            <button onClick={() => setShowEnrichmentModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EngramProfileDashboard 