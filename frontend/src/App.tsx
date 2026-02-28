import { useState } from 'react'
import ExtractView from './components/ExtractView'
import QueryView from './components/QueryView'

type TabType = 'extract' | 'query'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('extract')

  return (
    <div className="container">
      <header>
        <h1> ⚙️🦆MAGIC NODE🧙‍♂️</h1>
        <p>Extract, Store, and Query document metadata</p>
      </header>

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'extract' ? 'active' : ''}`}
            onClick={() => setActiveTab('extract')}
          >
            📥 Extract & Store
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
          {activeTab === 'query' && <QueryView />}
        </div>
      </div>
    </div>
  )
}

export default App
