"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import QuickActions from './quick-actions'
import NotificationPanel from './notification-panel'
import { 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Video, 
  Calendar,
  ArrowRight,
  Timer,
  Zap,
  AlertCircle,
  Heart,
  Target,
  Bell,
  FileText,
  BarChart3,
  CheckSquare,
  TrendingDown,
  Minus,
  Eye,
  Play,
  Trash
} from 'lucide-react'

// Interface for KPI Card props
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

// Interface for Meeting data
interface Meeting {
  id: string;
  title: string;
  status: 'live' | 'scheduled' | 'completed';
  date: string;
  participants: number;
  duration: string;
  sentiment?: number;
  actionItems?: number;
}

// Interface for Recent Meeting data
interface RecentMeeting {
  id: string
  title: string
  participants: number
  duration: string
  status: 'completed' | 'upcoming' | 'ongoing' | 'cancelled'
  date: Date
}

// Recent Meeting Card Component
interface RecentMeetingCardProps {
  meeting: RecentMeeting
}

const RecentMeetingCard: React.FC<RecentMeetingCardProps> = ({ meeting }) => {
  const statusColors = {
    completed: 'bg-green-50 text-green-700 border-green-200',
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    ongoing: 'bg-orange-50 text-orange-700 border-orange-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Video size={16} className="text-gray-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{meeting.title}</h4>
          <p className="text-sm text-gray-600">
            {meeting.participants} participants • {meeting.duration}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[meeting.status]}`}>
          {meeting.status}
        </span>
        <div className="flex space-x-1">
          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Eye size={14} className="mr-1" />
            View
          </Button>
          {meeting.status === 'upcoming' && (
            <Button size="sm" className="bg-gray-700 hover:bg-gray-800 text-white border-0">
              <Play size={14} className="mr-1" />
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// KPI Card Component with enhanced hover effects
const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "primary" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-50 text-green-600 border-green-200'
      case 'warning':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'error':
        return 'bg-red-50 text-red-600 border-red-200'
      default:
        return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp
    if (trend === 'down') return TrendingDown
    return Minus
  }

  const TrendIcon = getTrendIcon()

  return (
    <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
            <Icon size={20} />
          </div>
        </div>

        {trend && trendValue && (
          <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
            <TrendIcon size={16} className={getTrendColor()} />
            <span className={`text-sm font-medium ml-1 ${getTrendColor()}`}>
              {trendValue}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('recent-meetings')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<any | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/meetings/dashboard')
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || res.statusText)
        }
        const data = await res.json()
        setDashboardData(data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  async function startNewMeeting() {
    try {
      const title = prompt('Enter meeting title', 'Instant Meeting')
      if (title === null) return
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert('Failed to create meeting: ' + (err?.error || res.statusText))
        return
      }
      const meeting = await res.json()
      // Navigate directly to the meeting room so it starts immediately
      if (meeting?.meeting_code) {
        window.location.href = `/meeting/${encodeURIComponent(meeting.meeting_code)}`
      } else {
        alert('Meeting created but no code returned.')
      }
    } catch (e: any) {
      alert('Error: ' + e?.message)
    }
  }

  async function scheduleMeeting() {
    try {
      const title = prompt('Enter meeting title', 'Scheduled Meeting')
      if (title === null) return
      const when = prompt('Enter scheduled time (ISO, e.g. 2025-09-18T19:30:00Z)')
      if (!when) return
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, scheduled_at: when })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert('Failed to schedule meeting: ' + (err?.error || res.statusText))
        return
      }
      const meeting = await res.json()
      alert(`Meeting scheduled. Code: ${meeting.meeting_code}`)
      // refresh dashboard
      const refreshed = await fetch('/api/meetings/dashboard')
      if (refreshed.ok) setDashboardData(await refreshed.json())
    } catch (e: any) {
      alert('Error: ' + e?.message)
    }
  }

  async function deleteCompletedMeeting(id: string) {
    if (!confirm('Delete this completed meeting?')) return
    const res = await fetch(`/api/meetings/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      alert('Delete failed: ' + (body?.error || res.statusText))
      return
    }
    // refresh dashboard
    const refreshed = await fetch('/api/meetings/dashboard')
    if (refreshed.ok) setDashboardData(await refreshed.json())
  }

  // KPI data
  const kpiData: KPICardProps[] = [
    {
      title: "Total Meetings",
      value: "147",
      subtitle: "This month",
      icon: Video,
      trend: "up" as const,
      trendValue: "+12%",
      color: "primary" as const
    },
    {
      title: "Average Sentiment",
      value: "78%",
      subtitle: "Positive meetings",
      icon: Heart,
      trend: "up" as const,
      trendValue: "+5%",
      color: "success" as const
    },
    {
      title: "Task Assignments",
      value: "23",
      subtitle: "Completed this week",
      icon: CheckSquare,
      trend: "up" as const,
      trendValue: "+18%",
      color: "warning" as const
    },
    {
      title: "Time Saved",
      value: "32h",
      subtitle: "Through automation",
      icon: Clock,
      trend: "up" as const,
      trendValue: "+8h",
      color: "primary" as const
    }
  ]

  // Sample meeting data for the main grid
  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Weekly Team Standup",
      date: "2025-01-13T10:00:00",
      participants: 8,
      duration: "45 min",
      status: "live" as const,
      sentiment: 0.82,
      actionItems: 3
    },
    {
      id: "2",
      title: "Product Planning Session",
      date: "2025-01-13T14:30:00",
      participants: 5,
      duration: "90 min",
      status: "scheduled" as const,
      sentiment: undefined,
      actionItems: 0
    },
    {
      id: "3",
      title: "Client Feedback Review",
      date: "2025-01-12T16:00:00",
      participants: 4,
      duration: "60 min",
      status: "completed" as const,
      sentiment: 0.65,
      actionItems: 7
    },
    {
      id: "4",
      title: "Sprint Retrospective",
      date: "2025-01-12T11:00:00",
      participants: 6,
      duration: "75 min",
      status: "completed" as const,
      sentiment: 0.91,
      actionItems: 5
    }
  ]

  // Recent meetings data for the dashboard tab
  const recentMeetings: RecentMeeting[] = [
    {
      id: "1",
      title: "Weekly Team Standup",
      participants: 8,
      duration: "45 min",
      status: "ongoing",
      date: new Date("2025-01-13T10:00:00")
    },
    {
      id: "2",
      title: "Product Planning Session",
      participants: 5,
      duration: "90 min",
      status: "upcoming",
      date: new Date("2025-01-13T14:30:00")
    },
    {
      id: "3",
      title: "Client Feedback Review",
      participants: 4,
      duration: "60 min",
      status: "completed",
      date: new Date("2025-01-12T16:00:00")
    },
    {
      id: "4",
      title: "Sprint Retrospective",
      participants: 6,
      duration: "75 min",
      status: "completed",
      date: new Date("2025-01-12T11:00:00")
    }
  ]

  const formatTime = (date: Date | null): string => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) || ''
  }

  const formatDate = (date: Date | null): string => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) || ''
  }

  const tabs = [
    { id: 'recent-meetings', label: 'Recent Meetings', icon: Video },
    { id: 'quick-actions', label: 'Quick Actions', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'meeting-details', label: 'Meeting Analytics', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recent-meetings':
        return (
          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Meetings</CardTitle>
                  <p className="text-sm text-gray-600">Your latest meeting activity</p>
                </div>
                <Link href="/dashboard/history">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-sm text-gray-600">Loading...</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {!loading && !error && dashboardData && (
                <div className="space-y-6">
                  {/* Upcoming */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">Upcoming</h4>
                      <span className="text-xs text-gray-500">{dashboardData.upcoming.length} meetings</span>
                    </div>
                    {dashboardData.upcoming.length === 0 ? (
                      <p className="text-sm text-gray-500">No upcoming meetings</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboardData.upcoming.slice(0, 5).map((m: any) => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <div className="font-medium text-gray-900">{m.title}</div>
                              <div className="text-xs text-gray-600">{m.scheduled_at ? new Date(m.scheduled_at).toLocaleString() : ''}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">upcoming</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ongoing */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">Ongoing</h4>
                      <span className="text-xs text-gray-500">{dashboardData.ongoing.length} meetings</span>
                    </div>
                    {dashboardData.ongoing.length === 0 ? (
                      <p className="text-sm text-gray-500">No ongoing meetings</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboardData.ongoing.slice(0, 5).map((m: any) => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <div className="font-medium text-gray-900">{m.title}</div>
                              <div className="text-xs text-gray-600">Started {m.started_at ? new Date(m.started_at).toLocaleString() : ''}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={m.meeting_code ? `/meeting/${encodeURIComponent(m.meeting_code)}` : '#'}
                                className={`px-2 py-1 text-xs border rounded ${m.meeting_code ? 'border-gray-300 hover:bg-gray-50 text-gray-700' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                              >
                                Join
                              </a>
                              <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">ongoing</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Completed */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">Completed</h4>
                      <span className="text-xs text-gray-500">{dashboardData.completed.length} in last 30 days</span>
                    </div>
                    {dashboardData.completed.length === 0 ? (
                      <p className="text-sm text-gray-500">No completed meetings</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboardData.completed.slice(0, 5).map((m: any) => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <div className="font-medium text-gray-900">{m.title}</div>
                              <div className="text-xs text-gray-600">Ended {m.ended_at ? new Date(m.ended_at).toLocaleString() : ''} • {m.duration_minutes || 0} min</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button onClick={() => deleteCompletedMeeting(m.id)} className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700 flex items-center">
                                <Trash size={12} className="mr-1" /> Delete
                              </button>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">completed</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 'quick-actions':
        return <QuickActions />
      case 'notifications':
        return <NotificationPanel />
      case 'meeting-details':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Meeting Efficiency</h3>
                    <p className="text-sm text-gray-600">Average meeting rating</p>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-semibold text-gray-900">4.2</span>
                  <span className="text-sm text-gray-600 mb-1">/ 5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Team Participation</h3>
                    <p className="text-sm text-gray-600">Active team members</p>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-semibold text-gray-900">12</span>
                  <span className="text-sm text-gray-600 mb-1">/ 15 members</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Goal Completion</h3>
                    <p className="text-sm text-gray-600">Monthly objectives</p>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-semibold text-gray-900">67%</span>
                  <span className="text-sm text-green-600 mb-1">+12% this week</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={startNewMeeting} className="bg-gray-700 hover:bg-gray-800 text-white border-0">
              <Video className="mr-2 h-4 w-4" />
              Start Meeting
            </Button>
            <Button onClick={scheduleMeeting} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <KPICard
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                icon={kpi.icon}
                trend={kpi.trend}
                trendValue={kpi.trendValue}
                color={kpi.color}
              />
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-1">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
