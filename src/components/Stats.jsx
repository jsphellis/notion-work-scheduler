import React, { useMemo } from 'react'
import { startOfMonth, endOfMonth, format, subMonths, isWithinInterval } from 'date-fns'
import { BarChart3, Clock, Calendar, TrendingUp, Building } from 'lucide-react'

const Stats = ({ timeEntries }) => {
  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = { start: startOfMonth(now), end: endOfMonth(now) }
    const lastMonth = { 
      start: startOfMonth(subMonths(now, 1)), 
      end: endOfMonth(subMonths(now, 1)) 
    }

    // Filter entries by time periods
    const currentMonthEntries = timeEntries.filter(entry =>
      isWithinInterval(new Date(entry.date), currentMonth)
    )
    const lastMonthEntries = timeEntries.filter(entry =>
      isWithinInterval(new Date(entry.date), lastMonth)
    )

    // Calculate totals
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const currentMonthHours = currentMonthEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const lastMonthHours = lastMonthEntries.reduce((sum, entry) => sum + entry.hours, 0)

    // Project breakdown
    const projectBreakdown = timeEntries.reduce((acc, entry) => {
      const project = entry.project
      if (!acc[project]) {
        acc[project] = { hours: 0, entries: 0 }
      }
      acc[project].hours += entry.hours
      acc[project].entries += 1
      return acc
    }, {})

    const topProjects = Object.entries(projectBreakdown)
      .sort(([,a], [,b]) => b.hours - a.hours)
      .slice(0, 5)

    // Daily averages
    const uniqueDays = new Set(timeEntries.map(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd')
    )).size

    const dailyAverage = uniqueDays > 0 ? totalHours / uniqueDays : 0

    // Monthly comparison
    const monthlyChange = lastMonthHours > 0 
      ? ((currentMonthHours - lastMonthHours) / lastMonthHours) * 100 
      : 0

    return {
      totalHours,
      currentMonthHours,
      lastMonthHours,
      projectBreakdown,
      topProjects,
      dailyAverage,
      monthlyChange,
      totalEntries: timeEntries.length,
      uniqueDays
    }
  }, [timeEntries])

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <Icon className="h-8 w-8 text-primary-600" />
          {trend !== undefined && (
            <div className={`flex items-center mt-2 ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (timeEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
        <p className="text-gray-500">Start logging your work hours to see statistics here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Hours"
            value={`${stats.totalHours.toFixed(1)}h`}
            subtitle={`Across ${stats.totalEntries} entries`}
            icon={Clock}
          />
          <StatCard
            title="This Month"
            value={`${stats.currentMonthHours.toFixed(1)}h`}
            subtitle={format(new Date(), 'MMMM yyyy')}
            icon={Calendar}
            trend={stats.monthlyChange}
          />
          <StatCard
            title="Daily Average"
            value={`${stats.dailyAverage.toFixed(1)}h`}
            subtitle={`Over ${stats.uniqueDays} days`}
            icon={TrendingUp}
          />
          <StatCard
            title="Active Days"
            value={stats.uniqueDays}
            subtitle="Days with logged hours"
            icon={BarChart3}
          />
        </div>
      </div>

      {/* Project Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Top Projects</h2>
        <div className="card">
          {stats.topProjects.length > 0 ? (
            <div className="space-y-4">
              {stats.topProjects.map(([project, data], index) => {
                const percentage = (data.hours / stats.totalHours) * 100
                return (
                  <div key={project} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium text-gray-900">{project}</h3>
                        <span className="text-sm text-gray-500">
                          {data.hours.toFixed(1)}h ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {data.entries} entries
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No projects yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Comparison */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monthly Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-3">This Month</h3>
            <p className="text-3xl font-bold text-primary-600 mb-2">
              {stats.currentMonthHours.toFixed(1)}h
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(), 'MMMM yyyy')}
            </p>
          </div>
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-3">Last Month</h3>
            <p className="text-3xl font-bold text-gray-600 mb-2">
              {stats.lastMonthHours.toFixed(1)}h
            </p>
            <p className="text-sm text-gray-500">
              {format(subMonths(new Date(), 1), 'MMMM yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats 