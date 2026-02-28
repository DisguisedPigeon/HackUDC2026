import { useState } from 'react'

interface FileMetadata {
  name: string
  contents: string[]
  creation_date: string
  extras: string
}

interface UploadedFile {
  name: string
  path: string
  size: number
  status: string
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
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadStatus, setUploadStatus] = useState<{ uploaded: UploadedFile[], errors: any[] } | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files)
      setUploadStatus(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select files to upload')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      
      // Append all files to the form data
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i])
      }

      const response = await fetch('http://localhost:5000/files', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      setUploadStatus(data)
      
      // Show success message
      if (data.uploaded && data.uploaded.length > 0) {
        alert(`Successfully uploaded ${data.uploaded.length} file(s)!`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

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
      
      {/* File Upload Section */}
      <div className="upload-section" style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        border: '2px dashed #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Upload Files to Backend</h3>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Select multiple files to upload to the backend /files endpoint as a JSON list
        </p>
        
        <div className="form-group">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            accept=".pdf,.txt,.csv,.xlsx,.doc,.docx"
            style={{ padding: '0.5rem' }}
          />
        </div>

        {selectedFiles && selectedFiles.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Selected files ({selectedFiles.length}):</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              {Array.from(selectedFiles).map((file, index) => (
                <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
              ))}
            </ul>
          </div>
        )}

        <button 
          className="btn btn-primary" 
          onClick={handleUpload}
          disabled={isUploading || !selectedFiles}
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </button>

        {uploadStatus && (
          <div style={{ marginTop: '1rem' }}>
            <strong>Upload Results:</strong>
            <div style={{ marginTop: '0.5rem', color: 'green' }}>
              ✓ Uploaded: {uploadStatus.uploaded.length} file(s)
            </div>
            {uploadStatus.errors && uploadStatus.errors.length > 0 && (
              <div style={{ color: 'red' }}>
                ✗ Errors: {uploadStatus.errors.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Original Extract Section */}
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
