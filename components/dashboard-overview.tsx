"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  Clock, 
  Users, 
  TrendingUp,
  Calendar,
  Brain,
  FileText,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Mock data
const stats = [
  { title: 'Meetings Today', value: '3', change: '+1 from yesterday', icon: Calendar, trend: 'up' },
  { title: 'Minutes Transcribed', value: '127', change: '+23 from yesterday', icon: Clock, trend: 'up' },
  { title: 'Action Items Created', value: '12', change: '+4 from yesterday', icon: CheckCircle, trend: 'up' },
  { title: 'Team Members Active', value: '8', change: '+2 from yesterday', icon: Users, trend: 'up' }
]

const recentMeetings = [
  {
    id: 1,
    title: 'Q4 Planning Session',
    date: new Date('2024-01-15T10:00:00'),
    duration: 45,
    participants: 6,
    status: 'completed',
    actionItems: 5
  },
  {
    id: 2,
    title: 'Product Review Meeting',
    date: new Date('2024-01-15T14:00:00'),
    duration: 30,
    participants: 4,
    status: 'completed',
    actionItems: 3
  },
  {
    id: 3,
    title: 'Client Demo Call',
    date: new Date('2024-01-16T09:00:00'),
    duration: 60,
    participants: 3,
    status: 'upcoming',
    actionItems: 0
  }
]

const insights = [
  {
    title: 'Meeting Productivity',
    value: '87%',
    description: 'Your meetings are 12% more productive than last week',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    title: 'Action Item Completion',
    value: '94%',
    description: 'Team completed 94% of action items this week',
    icon: CheckCircle,
    color: 'text-blue-600'
  },
  {
    title: 'Team Engagement',
    value: 'High',
    description: 'Average sentiment score is positive across meetings',
    icon: Brain,
    color: 'text-purple-600'
  }
]

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your meetings today.
          </p>
        </div>
        <Button variant="gradient" size="lg">
          <Video className="mr-2 h-4 w-4" />
          Start New Meeting
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Meetings</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 flex items-center justify-center">
                        <Video className="h-5 w-5 text-navy-600 dark:text-navy-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(meeting.date)} • {meeting.duration}m • {meeting.participants} participants
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        meeting.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {meeting.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </div>
                      {meeting.actionItems > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {meeting.actionItems} action items
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Powered by advanced analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div key={insight.title} className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className={`h-4 w-4 ${insight.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{insight.title}</span>
                        <span className={`text-sm font-bold ${insight.color}`}>
                          {insight.value}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
