import React from 'react'
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns'
import { Clock } from 'lucide-react'

const WeekView = ({ selectedDate, timeEntries }) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getEntriesForDate = (date) => {
    return timeEntries.filter(entry => isSameDay(new Date(entry.date), date))
  }

  const getTotalHoursForDate = (date) => {
    return getEntriesForDate(date).reduce((total, entry) => total + entry.hours, 0)
  }

  const getWeekTotal = () => {
    return weekDays.reduce((total, day) => total + getTotalHoursForDate(day), 0)
  }

  const formatTime = (time) => {
    if (!time) return ''
    return time
  }

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="card">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Week of {format(weekStart, 'MMMM d')} - {format(weekEnd, 'd, yyyy')}
          </h2>
          <div className="flex items-center space-x-2 text-primary-600">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-semibold">{getWeekTotal().toFixed(1)}h total</span>
          </div>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weekDays.map(day => {
          const dayEntries = getEntriesForDate(day)
          const dayTotal = getTotalHoursForDate(day)
          const isToday = isSameDay(day, new Date())
          const isSelected = isSameDay(day, selectedDate)

          return (
            <div
              key={day.toISOString()}
              className={`card ${isToday ? 'ring-2 ring-primary-500' : ''} ${
                isSelected ? 'border-primary-300' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {format(day, 'EEEE')}
                    {isToday && <span className="text-primary-600 text-sm ml-2">(Today)</span>}
                  </h3>
                  <p className="text-gray-600">{format(day, 'MMMM d')}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{dayTotal.toFixed(1)}h</p>
                  {dayEntries.length > 0 && (
                    <p className="text-sm text-gray-500">{dayEntries.length} entries</p>
                  )}
                </div>
              </div>

              {dayEntries.length > 0 ? (
                <div className="space-y-3">
                  {dayEntries.map(entry => (
                    <div key={entry.id} className="border-l-4 border-primary-400 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{entry.project}</h4>
                          <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                          {(entry.startTime || entry.endTime) && (
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              {entry.startTime && (
                                <span>{formatTime(entry.startTime)}</span>
                              )}
                              {entry.startTime && entry.endTime && (
                                <span>-</span>
                              )}
                              {entry.endTime && (
                                <span>{formatTime(entry.endTime)}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <span className="font-semibold text-primary-600">{entry.hours}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No time logged</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Week Summary */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-semibold mb-4 text-primary-800">Week Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{getWeekTotal().toFixed(1)}</p>
            <p className="text-sm text-primary-700">Total Hours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {(getWeekTotal() / 7).toFixed(1)}
            </p>
            <p className="text-sm text-primary-700">Daily Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {weekDays.filter(day => getTotalHoursForDate(day) > 0).length}
            </p>
            <p className="text-sm text-primary-700">Days Worked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {timeEntries.filter(entry => {
                const entryDate = new Date(entry.date)
                return entryDate >= weekStart && entryDate <= weekEnd
              }).length}
            </p>
            <p className="text-sm text-primary-700">Total Entries</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekView 