import { useState } from 'react'

interface FileMetadata {
  name: string
  contents: string[]
  creation_date: string
  extras: string
}

interface ExtractViewProps {
  onDataExtracted?: (data: FileMetadata[]) => void
}

function ExtractView({ onDataExtracted }: ExtractViewProps) {
  const [directory, setDirectory] = useState('')
  const [output, setOutput] = useState('a.out')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<FileMetadata[] | null>(null)
  const [error, setError] = useState('')

  const handleExtract = async () => {
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      // Simulate API call - in production, this would call the Python CLI or API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock extracted data
      const mockData: FileMetadata[] = [
        {
          name: 'acta_constitucion_novatech.pdf',
          contents: ['Page 1 content...', 'Page 2 content...'],
          creation_date: '2024-01-15',
          extras: '{"author": "Admin", "creator": "PDF Editor"}'
        },
        {
          name: 'factura_GAL-2024-0892.pdf',
          contents: ['Invoice content...'],
          creation_date: '2024-03-20',
          extras: '{"author": "Finance Dept"}'
        },
        {
          name: 'email_seguimiento_aurora.txt',
          contents: ['Email body...'],
          creation_date: '2024-02-10',
          extras: '{}'
        }
      ]
      
      setResult(mockData)
      onDataExtracted?.(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract metadata')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Extract Metadata from Documents</h2>
      
      <div className="form-group">
        <label htmlFor="directory">Directory</label>
        <input
          id="directory"
          type="text"
          value={directory}
          onChange={(e) => setDirectory(e.target.value)}
          placeholder="Enter directory path (e.g., ./dataset)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="output">Output File</label>
        <input
          id="output"
          type="text"
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="a.out"
        />
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleExtract}
        disabled={isLoading}
      >
        {isLoading ? 'Extracting...' : 'Extract Metadata'}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <h3 style={{ marginBottom: '1rem' }}>Extracted Documents ({result.length})</h3>
          
          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">{result.length}</div>
              <div className="stat-label">Documents</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.filter(f => f.name.endsWith('.pdf')).length}</div>
              <div className="stat-label">PDFs</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.filter(f => f.name.endsWith('.txt')).length}</div>
              <div className="stat-label">Text Files</div>
            </div>
          </div>

          {result.map((file, index) => (
            <div key={index} className="result-item">
              <div className="result-header">
                <span className="result-title">{file.name}</span>
                <span className={`badge badge-${file.name.split('.').pop()}`}>
                  {file.name.split('.').pop()?.toUpperCase()}
                </span>
              </div>
              <div className="result-meta">
                <div>Created: {file.creation_date}</div>
                <div>Pages: {file.contents.length}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExtractView
