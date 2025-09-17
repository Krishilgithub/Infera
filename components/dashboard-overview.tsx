"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import RecentMeetingCard from './recent-meeting-card'
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
  Minus
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

// KPI Card Component
const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "primary" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    }
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400'
    if (trend === 'down') return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp
    if (trend === 'down') return TrendingDown
    return Minus
  }

  const TrendIcon = getTrendIcon()

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
            <Icon size={20} />
          </div>
        </div>

        {trend && trendValue && (
          <div className="flex items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <TrendIcon size={16} className={getTrendColor()} />
            <span className={`text-sm font-medium ml-1 ${getTrendColor()}`}>
              {trendValue}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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
      title: "Action Items",
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

  // Sample meeting data
  const recentMeetings: Meeting[] = [
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            {formatDate(currentTime)} • {formatTime(currentTime)}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/dashboard/meeting">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Meetings */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Meetings</CardTitle>
                  <p className="text-sm text-muted-foreground">Your latest meeting activity</p>
                </div>
                <Link href="/dashboard/history">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetings.slice(0, 4).map((meeting) => (
                  <RecentMeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Notifications */}
          <NotificationPanel />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Meeting Efficiency</h3>
                <p className="text-sm text-muted-foreground">Average meeting rating</p>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-semibold text-foreground">4.2</span>
              <span className="text-sm text-muted-foreground mb-1">/ 5.0</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Team Participation</h3>
                <p className="text-sm text-muted-foreground">Active team members</p>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-semibold text-foreground">12</span>
              <span className="text-sm text-muted-foreground mb-1">/ 15 members</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Goal Completion</h3>
                <p className="text-sm text-muted-foreground">Monthly objectives</p>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-semibold text-foreground">67%</span>
              <span className="text-sm text-green-600 dark:text-green-400 mb-1">+12% this week</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
