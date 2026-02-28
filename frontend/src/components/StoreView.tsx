import { useState } from 'react'

function StoreView() {
  const [inputFile, setInputFile] = useState('')
  const [host, setHost] = useState('localhost')
  const [port, setPort] = useState('9090')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleStore = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(`Successfully stored metadata to ${host}:${port}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store metadata')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Store Metadata to Database</h2>
      
      <div className="form-group">
        <label htmlFor="input">Input File (CSV)</label>
        <input
          id="input"
          type="text"
          value={inputFile}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputFile(e.target.value)}
          placeholder="data.csv"
        />
      </div>

      <div className="filter-section" style={{ marginTop: '1.5rem', borderTop: 'none', paddingTop: 0 }}>
        <div className="form-group">
          <label htmlFor="host">Host</label>
          <input
            id="host"
            type="text"
            value={host}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
            placeholder="localhost"
          />
        </div>

        <div className="form-group">
          <label htmlFor="port">Port</label>
          <input
            id="port"
            type="text"
            value={port}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPort(e.target.value)}
            placeholder="9090"
          />
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleStore}
        disabled={isLoading}
      >
        {isLoading ? 'Storing...' : 'Store to Database'}
      </button>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  )
}

export default StoreView
