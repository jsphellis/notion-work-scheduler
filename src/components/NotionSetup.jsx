import React, { useState, useEffect } from 'react'
import { Key, Database, CheckCircle, AlertCircle, ExternalLink, Info } from 'lucide-react'

// API base URL - uses environment variable in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin

const NotionSetup = ({ config, onConfigSave }) => {
  const [formData, setFormData] = useState({
    apiToken: '',
    databaseId: ''
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showToken, setShowToken] = useState(false)

  useEffect(() => {
    if (config) {
      setFormData({
        apiToken: config.apiToken || '',
        databaseId: config.databaseId || ''
      })
      setIsConnected(!!config.apiToken && !!config.databaseId)
    }
  }, [config])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const testConnection = async () => {
    if (!formData.apiToken || !formData.databaseId) {
      setError('Please provide both API token and database ID')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/notion/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Connection successful! Your Notion database is ready.')
        setIsConnected(true)
        
        // Save config
        const newConfig = { ...formData }
        localStorage.setItem('notionConfig', JSON.stringify(newConfig))
        onConfigSave(newConfig)
      } else {
        setError(data.error || 'Failed to connect to Notion')
        setIsConnected(false)
      }
    } catch (err) {
      setError('Failed to test connection. Please check your credentials.')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setFormData({ apiToken: '', databaseId: '' })
    setIsConnected(false)
    setError('')
    setSuccess('')
    localStorage.removeItem('notionConfig')
    onConfigSave(null)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Database className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Notion Integration</h2>
            <p className="text-gray-600">Connect your Notion workspace to sync time entries</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          isConnected 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className={`font-medium ${
              isConnected ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {isConnected ? 'Connected to Notion' : 'Not connected'}
            </span>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h3 className="font-medium text-blue-800 mb-2">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Create a new integration in your 
                  <a 
                    href="https://www.notion.so/my-integrations" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mx-1 text-blue-600 hover:text-blue-800"
                  >
                    Notion integrations page
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>Copy the "Internal Integration Token"</li>
                <li>Create a database in Notion with columns: Project (title), Description (text), Date (date), Hours (number)</li>
                <li>Share the database with your integration</li>
                <li>Copy the database ID from the URL</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="h-4 w-4 inline mr-1" />
              Notion API Token
            </label>
            <div className="flex space-x-2">
              <input
                type={showToken ? 'text' : 'password'}
                name="apiToken"
                value={formData.apiToken}
                onChange={handleChange}
                placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="btn-secondary px-3"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Database className="h-4 w-4 inline mr-1" />
              Database ID
            </label>
            <input
              type="text"
              name="databaseId"
              value={formData.databaseId}
              onChange={handleChange}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="input-field w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Find this in your Notion database URL: notion.so/username/DATABASE_ID?v=...
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={testConnection}
              disabled={isLoading || !formData.apiToken || !formData.databaseId}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            {isConnected && (
              <button
                onClick={disconnect}
                className="btn-secondary"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sample Database Structure */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Required Database Structure</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Column Name</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-3 font-medium">Project</td>
                <td className="py-2 px-3 text-gray-600">Title</td>
                <td className="py-2 px-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Description</td>
                <td className="py-2 px-3 text-gray-600">Text</td>
                <td className="py-2 px-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Date</td>
                <td className="py-2 px-3 text-gray-600">Date</td>
                <td className="py-2 px-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Hours</td>
                <td className="py-2 px-3 text-gray-600">Number</td>
                <td className="py-2 px-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Start Time</td>
                <td className="py-2 px-3 text-gray-600">Text</td>
                <td className="py-2 px-3 text-gray-400">Optional</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">End Time</td>
                <td className="py-2 px-3 text-gray-600">Text</td>
                <td className="py-2 px-3 text-gray-400">Optional</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NotionSetup 