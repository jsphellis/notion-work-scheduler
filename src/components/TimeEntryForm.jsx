import React, { useState } from 'react'
import { format } from 'date-fns'
import { X, Clock, Calendar, FileText, Building } from 'lucide-react'

const TimeEntryForm = ({ selectedDate, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    date: format(selectedDate, 'yyyy-MM-dd'),
    project: '',
    description: '',
    hours: '',
    startTime: '',
    endTime: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.project.trim()) {
      newErrors.project = 'Project name is required'
    }
    
    if (!formData.hours || parseFloat(formData.hours) <= 0) {
      newErrors.hours = 'Hours must be greater than 0'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const timeEntry = {
      ...formData,
      hours: parseFloat(formData.hours),
      date: new Date(formData.date).toISOString()
    }
    
    onSave(timeEntry)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Log Work Hours</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building className="h-4 w-4 inline mr-1" />
              Project
            </label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              placeholder="e.g., Website Redesign, Client Meeting"
              className={`input-field w-full ${errors.project ? 'border-red-500' : ''}`}
              required
            />
            {errors.project && (
              <p className="text-red-500 text-sm mt-1">{errors.project}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="h-4 w-4 inline mr-1" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What did you work on?"
              rows={3}
              className={`input-field w-full resize-none ${errors.description ? 'border-red-500' : ''}`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="h-4 w-4 inline mr-1" />
              Hours Worked
            </label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              placeholder="e.g., 2.5"
              step="0.25"
              min="0.25"
              max="24"
              className={`input-field w-full ${errors.hours ? 'border-red-500' : ''}`}
              required
            />
            {errors.hours && (
              <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
            )}
          </div>

          {/* Optional Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time (Optional)
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time (Optional)
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TimeEntryForm 