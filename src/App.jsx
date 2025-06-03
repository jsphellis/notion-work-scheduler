import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { Clock, Plus, Calendar as CalendarIcon, Settings, BarChart3 } from 'lucide-react'
import TimeEntryForm from './components/TimeEntryForm'
import WeekView from './components/WeekView'
import Stats from './components/Stats'
import NotionSetup from './components/NotionSetup'
import 'react-calendar/dist/Calendar.css'

// API base URL - uses environment variable in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin

function App() {
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState([])
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [notionConfig, setNotionConfig] = useState(null)

  // Load saved data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries')
    const savedConfig = localStorage.getItem('notionConfig')
    
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries))
    }
    if (savedConfig) {
      setNotionConfig(JSON.parse(savedConfig))
    }
  }, [])

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries))
  }, [timeEntries])

  const addTimeEntry = async (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    setTimeEntries(prev => [...prev, newEntry])
    
    // Sync to Notion if configured
    if (notionConfig) {
      try {
        await fetch(`${API_BASE_URL}/api/notion/entries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entry: newEntry, config: notionConfig })
        })
      } catch (error) {
        console.error('Failed to sync to Notion:', error)
      }
    }
  }

  const getEntriesForDate = (date) => {
    return timeEntries.filter(entry => isSameDay(new Date(entry.date), date))
  }

  const getTotalHoursForDate = (date) => {
    return getEntriesForDate(date).reduce((total, entry) => total + entry.hours, 0)
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hours = getTotalHoursForDate(date)
      if (hours > 0) {
        return (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="bg-primary-600 text-white text-xs px-1 rounded">
              {hours}h
            </div>
          </div>
        )
      }
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Work Scheduler</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEntryForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Log Time</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'week', label: 'Week View', icon: BarChart3 },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'settings', label: 'Notion Setup', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="react-calendar"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                {getEntriesForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getEntriesForDate(selectedDate).map(entry => (
                      <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{entry.project}</p>
                            <p className="text-sm text-gray-600">{entry.description}</p>
                          </div>
                          <span className="text-sm font-medium text-primary-600">
                            {entry.hours}h
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium">
                        Total: {getTotalHoursForDate(selectedDate)} hours
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No time entries for this date</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'week' && (
          <WeekView 
            selectedDate={selectedDate}
            timeEntries={timeEntries}
          />
        )}

        {activeTab === 'stats' && (
          <Stats timeEntries={timeEntries} />
        )}

        {activeTab === 'settings' && (
          <NotionSetup 
            config={notionConfig}
            onConfigSave={setNotionConfig}
          />
        )}
      </main>

      {/* Time Entry Modal */}
      {showEntryForm && (
        <TimeEntryForm
          selectedDate={selectedDate}
          onSave={addTimeEntry}
          onClose={() => setShowEntryForm(false)}
        />
      )}
    </div>
  )
}

export default App 