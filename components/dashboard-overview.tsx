"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Video, 
  Calendar,
  Search,
  UserPlus,
  MoreHorizontal,
  Heart,
  Target,
  BarChart3,
  Bell,
  ArrowRight
} from 'lucide-react'

const stats = [
  {
    title: "Total Meetings",
    value: "147",
    change: "+12%",
    changeType: "positive" as const,
    icon: Video,
    subtitle: "This month"
  },
  {
    title: "Average Sentiment",
    value: "78%",
    change: "+5%",
    changeType: "positive" as const,
    icon: Heart,
    subtitle: "Positive meetings"
  },
  {
    title: "Action Items",
    value: "23",
    change: "+18%",
    changeType: "positive" as const,
    icon: CheckCircle,
    subtitle: "Completed this week"
  },
  {
    title: "Time Saved",
    value: "32h",
    change: "+8h",
    changeType: "positive" as const,
    icon: Clock,
    subtitle: "Through automation"
  }
]

const recentMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    date: "Jan 13, 10:00 AM",
    duration: "45 min",
    participants: 8,
    status: "live",
    sentiment: "82% positive",
    actionItems: 3
  },
  {
    id: 2,
    title: "Product Planning Session",
    date: "Jan 13, 02:30 PM",
    duration: "90 min",
    participants: 5,
    status: "scheduled",
    sentiment: null,
    actionItems: null
  },
  {
    id: 3,
    title: "Client Feedback Review",
    date: "Jan 12, 11:00 AM",
    duration: "75 min",
    participants: 6,
    status: "completed",
    sentiment: "91% positive",
    actionItems: 5
  }
]

const quickActions = [
  {
    title: "Start New Meeting",
    description: "Begin an instant meeting with transcription",
    icon: Video,
    href: "/dashboard/live"
  },
  {
    title: "Schedule Meeting",
    description: "Plan and invite participants",
    icon: Calendar,
    href: "/dashboard/schedule"
  },
  {
    title: "Search Transcripts",
    description: "Find specific discussions or decisions",
    icon: Search,
    href: "/dashboard/history"
  },
  {
    title: "Invite Team",
    description: "Add team members to your workspace",
    icon: UserPlus,
    href: "/dashboard/team"
  }
]

const notifications = [
  {
    id: 1,
    type: "action",
    title: "Action Item Due",
    description: "Follow up with client feedback from yesterday's meeting",
    time: "2 hours ago",
    icon: CheckCircle
  },
  {
    id: 2,
    type: "reminder",
    title: "Meeting Starting Soon",
    description: "Weekly team standup starts in 15 minutes",
    time: "15 minutes",
    icon: Clock
  },
  {
    id: 3,
    type: "info",
    title: "Transcript Available",
    description: "Meeting transcript for 'Product Planning' is ready for review",
    time: "1 hour ago",
    icon: BarChart3
  }
]

export default function DashboardOverview() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-600">{currentDate} • {currentTime}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/dashboard/live">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Video className="mr-2 h-4 w-4" />
                Start Meeting
              </Button>
            </Link>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">
                          {stat.subtitle}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Meetings */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Meetings</CardTitle>
                  <p className="text-sm text-gray-600">Your latest meeting activity</p>
                </div>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMeetings.map((meeting, index) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          meeting.status === 'live' ? 'bg-green-100' : 
                          meeting.status === 'scheduled' ? 'bg-orange-100' : 
                          'bg-gray-100'
                        }`}>
                          <Video className={`h-4 w-4 ${
                            meeting.status === 'live' ? 'text-green-600' : 
                            meeting.status === 'scheduled' ? 'text-orange-600' : 
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {meeting.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {meeting.duration}
                            </span>
                            <span className="flex items-center">
                              <Users className="mr-1 h-3 w-3" />
                              {meeting.participants} participants
                            </span>
                            {meeting.sentiment && (
                              <span className="flex items-center text-green-600">
                                <Heart className="mr-1 h-3 w-3" />
                                {meeting.sentiment}
                              </span>
                            )}
                            {meeting.actionItems && (
                              <span className="flex items-center">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                {meeting.actionItems} action items
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {meeting.status === 'live' ? (
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Video className="mr-1 h-4 w-4" />
                            Join Meeting
                          </Button>
                        ) : meeting.status === 'scheduled' ? (
                          <Button variant="outline">
                            <Calendar className="mr-1 h-4 w-4" />
                            Start Meeting
                          </Button>
                        ) : (
                          <Button variant="outline">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={action.href} className="block">
                          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-blue-50">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{action.title}</h4>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white border border-gray-200 shadow-sm mt-6">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Mark all read
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification, index) => {
                    const Icon = notification.icon
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-1 rounded-full bg-gray-100">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}