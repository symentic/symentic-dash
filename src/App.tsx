import React, { useState, useEffect } from 'react'
import './App.css'
import EngramProfileDashboard from './components/EngramProfileDashboard'

function App() {
  const [activeAgents, setActiveAgents] = useState(12)
  const [totalEnrichments, setTotalEnrichments] = useState(47892)
  const [apiCalls, setApiCalls] = useState(1254)
  const [currentView, setCurrentView] = useState('dashboard')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEnrichments(prev => prev + Math.floor(Math.random() * 5))
      setApiCalls(prev => prev + Math.floor(Math.random() * 3))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const agents = [
    {
      id: 1,
      name: "Slack Intelligence Agent",
      type: "Message Enricher",
      status: "active",
      enrichments: 1247,
      conversations: 89
    },
    {
      id: 2,
      name: "Customer Support Inquirer",
      type: "Context Collector",
      status: "active",
      enrichments: 892,
      conversations: 156
    },
    {
      id: 3,
      name: "Profile Synthesizer",
      type: "Data Aggregator",
      status: "idle",
      enrichments: 645,
      conversations: 23
    },
    {
      id: 4,
      name: "Neural Symbiosis Agent",
      type: "Predictive Enricher",
      status: "active",
      enrichments: 2134,
      conversations: 312
    }
  ]

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-header">
                  <div className="stat-icon">AGT</div>
                </div>
                <div className="stat-value">{activeAgents}</div>
                <div className="stat-label">Active Agents</div>
                <div className="stat-change positive">
                  ↗ +3 this hour
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-header">
                  <div className="stat-icon">ENR</div>
                </div>
                <div className="stat-value">{totalEnrichments.toLocaleString()}</div>
                <div className="stat-label">Data Enrichments</div>
                <div className="stat-change positive">
                  ↗ +127 today
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-header">
                  <div className="stat-icon">API</div>
                </div>
                <div className="stat-value">{apiCalls.toLocaleString()}</div>
                <div className="stat-label">API Calls Today</div>
                <div className="stat-change positive">
                  ↗ +23% vs yesterday
                </div>
              </div>

              <div className="stat-card glass-card">
                <div className="stat-header">
                  <div className="stat-icon">INT</div>
                </div>
                <div className="stat-value">98.7%</div>
                <div className="stat-label">System Intelligence</div>
                <div className="stat-change positive">
                  ↗ +0.3% this week
                </div>
              </div>
            </div>

            {/* Data Flow Visualization */}
            <section className="content-section glass-card">
              <div className="section-header">
                <div>
                  <h2 className="section-title gradient-text">Neural Data Flow</h2>
                  <p className="section-subtitle">Real-time symbiotic intelligence processing</p>
                </div>
                <button className="btn-primary">View Details</button>
              </div>
              <div className="data-flow">
                <div className="flow-nodes"></div>
              </div>
            </section>

            {/* Active Agents */}
            <section className="content-section glass-card">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Deployed Agents</h2>
                  <p className="section-subtitle">Autonomous intelligence units enriching your enterprise data</p>
                </div>
                <button className="btn-secondary">Deploy New Agent</button>
              </div>
              
              <div className="agent-grid">
                {agents.map(agent => (
                  <div key={agent.id} className="agent-card glass-card">
                    <div className="agent-header">
                      <div>
                        <div className="agent-name">{agent.name}</div>
                        <div className="agent-type">{agent.type}</div>
                      </div>
                      <div className={`agent-status ${agent.status}`}>
                        {agent.status}
                      </div>
                    </div>
                    
                    <div className="agent-metrics">
                      <div className="agent-metric">
                        <div className="agent-metric-value">{agent.enrichments}</div>
                        <div className="agent-metric-label">Enrichments</div>
                      </div>
                      <div className="agent-metric">
                        <div className="agent-metric-value">{agent.conversations}</div>
                        <div className="agent-metric-label">Conversations</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="content-section glass-card">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Recent Intelligence Activity</h2>
                  <p className="section-subtitle">Latest enrichments and user profile updates</p>
                </div>
              </div>
              
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-time">2 min ago</div>
                  <div className="activity-content">
                    <strong>Slack Intelligence Agent</strong> enriched conversation thread with user context
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">5 min ago</div>
                  <div className="activity-content">
                    <strong>Profile Synthesizer</strong> updated user persona for increased relevance
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">8 min ago</div>
                  <div className="activity-content">
                    <strong>Customer Support Inquirer</strong> deployed to gather bug reproduction steps
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">12 min ago</div>
                  <div className="activity-content">
                    <strong>Neural Symbiosis Agent</strong> generated predictive insights for product team
                  </div>
                </div>
              </div>
            </section>
          </>
        )
      case 'profiles':
        return <EngramProfileDashboard />
      default:
        return <div className="content-section glass-card">
          <h2 className="section-title">Coming Soon</h2>
          <p className="section-subtitle">This section is under development</p>
        </div>
    }
  }

  return (
    <div className="dashboard">
      <div className="neural-bg"></div>
      
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header glass-card">
          <div className="logo-section">
            <img 
              src="https://res.cloudinary.com/do9m2khzs/image/upload/v1753043463/symentic_2_c1ptoy.png" 
              alt="Symentic Logo" 
              className="logo-image"
            />
            <div className="logo-text">
              <h1 className="logo">SYMENTIC</h1>
              <span className="tagline">Enterprise Memory Intelligence</span>
            </div>
          </div>
          <div className="header-controls">
            <div className="status-indicator active">
              <div className="status-dot"></div>
              System Active
            </div>
          </div>
        </header>

        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="glass-card nav-section">
            <div className="nav-title">Analytics</div>
            <div 
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <span className="nav-icon">DASH</span>
              Dashboard
            </div>
            <div className="nav-item">
              <span className="nav-icon">AGT</span>
              Agents
            </div>
            <div className="nav-item">
              <span className="nav-icon">DATA</span>
              Data Streams
            </div>
            <div 
              className={`nav-item ${currentView === 'profiles' ? 'active' : ''}`}
              onClick={() => setCurrentView('profiles')}
            >
              <span className="nav-icon">ENG</span>
              Engram Profiles
            </div>
          </nav>

          <nav className="glass-card nav-section">
            <div className="nav-title">Management</div>
            <div className="nav-item">
              <span className="nav-icon">CFG</span>
              Configuration
            </div>
            <div className="nav-item">
              <span className="nav-icon">API</span>
              API Integration
            </div>
            <div className="nav-item">
              <span className="nav-icon">PERF</span>
              Performance
            </div>
            <div className="nav-item">
              <span className="nav-icon">SEC</span>
              Security
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}

export default App
