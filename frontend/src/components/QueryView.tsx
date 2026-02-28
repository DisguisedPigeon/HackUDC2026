import { useState } from 'react'

interface QueryResult {
  name: string
  creation_date: string
  author: string
  type: string
}

function QueryView() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [usersMentioned, setUsersMentioned] = useState('')
  const [reunionResult, setReunionResult] = useState('')
  const [host, setHost] = useState('localhost')
  const [port, setPort] = useState('9090')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<QueryResult[]>([])
  const [error, setError] = useState('')

  const handleQuery = async () => {
    setIsLoading(true)
    setError('')
    setResults([])

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock query results
      const mockResults: QueryResult[] = [
        { name: 'acta_constitucion_novatech.pdf', creation_date: '2024-01-15', author: 'Admin', type: 'PDF' },
        { name: 'factura_GAL-2024-0892.pdf', creation_date: '2024-03-20', author: 'Finance', type: 'PDF' },
        { name: 'email_seguimiento_aurora.txt', creation_date: '2024-02-10', author: 'Aurora', type: 'TXT' },
      ]
      
      setResults(mockResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query documents')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Query Documents</h2>
      
      <div className="filter-section">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="users">Users Mentioned</label>
          <input
            id="users"
            type="text"
            value={usersMentioned}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsersMentioned(e.target.value)}
            placeholder="user1,user2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="result">Reunion Result</label>
          <select
            id="result"
            value={reunionResult}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReunionResult(e.target.value)}
          >
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      <div className="filter-section">
        <div className="form-group">
          <label htmlFor="queryHost">Host</label>
          <input
            id="queryHost"
            type="text"
            value={host}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
            placeholder="localhost"
          />
        </div>

        <div className="form-group">
          <label htmlFor="queryPort">Port</label>
          <input
            id="queryPort"
            type="text"
            value={port}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPort(e.target.value)}
            placeholder="9090"
          />
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleQuery}
        disabled={isLoading}
      >
        {isLoading ? 'Querying...' : 'Run Query'}
      </button>

      {error && <div className="error">{error}</div>}

      {results.length > 0 && (
        <div className="results">
          <h3 style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Query Results ({results.length})</h3>
          
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <div className="result-header">
                <span className="result-title">{result.name}</span>
                <span className={`badge badge-${result.type.toLowerCase()}`}>
                  {result.type}
                </span>
              </div>
              <div className="result-meta">
                <div>Created: {result.creation_date}</div>
                <div>Author: {result.author}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QueryView
