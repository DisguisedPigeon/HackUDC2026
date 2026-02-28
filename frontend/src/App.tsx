import { useState } from 'react'
import ExtractView from './components/ExtractView'
import StoreView from './components/StoreView'
import QueryView from './components/QueryView'

type TabType = 'extract' | 'store' | 'query'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('extract')

  return (
    <div className="container">
      <header>
        <h1>📄 HackUDC Document Management</h1>
        <p>Extract, Store, and Query document metadata</p>
      </header>

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'extract' ? 'active' : ''}`}
            onClick={() => setActiveTab('extract')}
          >
            📥 Extract Metadata
          </button>
          <button
            className={`tab ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            💾 Store to Database
          </button>
          <button
            className={`tab ${activeTab === 'query' ? 'active' : ''}`}
            onClick={() => setActiveTab('query')}
          >
            🔍 Query Documents
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'extract' && <ExtractView />}
          {activeTab === 'store' && <StoreView />}
          {activeTab === 'query' && <QueryView />}
        </div>
      </div>
    </div>
  )
}

export default App
