"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Share2, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  FileText,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

// Mock data
const meetings = [
  {
    id: 1,
    title: 'Q4 Planning Session',
    date: new Date('2024-01-15T10:00:00'),
    duration: 45,
    participants: 6,
    status: 'completed',
    actionItems: 5,
    sentiment: 'positive',
    summary: 'Discussed Q4 goals and priorities for product development.',
    tags: ['planning', 'product', 'goals']
  },
  {
    id: 2,
    title: 'Product Review Meeting',
    date: new Date('2024-01-15T14:00:00'),
    duration: 30,
    participants: 4,
    status: 'completed',
    actionItems: 3,
    sentiment: 'neutral',
    summary: 'Reviewed current product features and user feedback.',
    tags: ['review', 'product', 'feedback']
  },
  {
    id: 3,
    title: 'Client Demo Call',
    date: new Date('2024-01-14T09:00:00'),
    duration: 60,
    participants: 3,
    status: 'completed',
    actionItems: 2,
    sentiment: 'positive',
    summary: 'Demonstrated new features to potential client.',
    tags: ['demo', 'client', 'sales']
  },
  {
    id: 4,
    title: 'Team Standup',
    date: new Date('2024-01-14T09:30:00'),
    duration: 15,
    participants: 8,
    status: 'completed',
    actionItems: 4,
    sentiment: 'positive',
    summary: 'Daily standup with updates on current projects.',
    tags: ['standup', 'daily', 'updates']
  },
  {
    id: 5,
    title: 'Sprint Planning',
    date: new Date('2024-01-13T11:00:00'),
    duration: 90,
    participants: 7,
    status: 'completed',
    actionItems: 8,
    sentiment: 'neutral',
    summary: 'Planned upcoming sprint with detailed task breakdown.',
    tags: ['sprint', 'planning', 'agile']
  }
]

const filters = [
  { label: 'All Meetings', value: 'all', count: meetings.length },
  { label: 'This Week', value: 'week', count: 3 },
  { label: 'This Month', value: 'month', count: meetings.length },
  { label: 'Completed', value: 'completed', count: meetings.length },
  { label: 'With Task Assignments', value: 'actions', count: 4 }
]

export default function MeetingHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'week' && meeting.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                         (selectedFilter === 'month' && meeting.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                         (selectedFilter === 'completed' && meeting.status === 'completed') ||
                         (selectedFilter === 'actions' && meeting.actionItems > 0)
    
    return matchesSearch && matchesFilter
  })

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'negative': return 'text-red-600 bg-red-100 dark:bg-red-900'
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      default: return '😐'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meeting History</h1>
          <p className="text-muted-foreground">
            Review and manage your past meetings and insights.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="gradient">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search meetings, summaries, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.value)}
                >
                  {filter.label}
                  <span className="ml-1 text-xs opacity-75">({filter.count})</span>
                </Button>
              ))}
            </div>
            
            {/* Sort */}
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMeetings.map((meeting, index) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{meeting.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDate(meeting.date)}
                    </CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(meeting.sentiment)}`}>
                    {getSentimentIcon(meeting.sentiment)} {meeting.sentiment}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {meeting.summary}
                </p>
                
                {/* Meeting Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(meeting.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.participants}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.actionItems} actions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>Completed</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {meeting.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMeetings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No meetings found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button variant="gradient">
            Schedule New Meeting
          </Button>
        </motion.div>
      )}
    </div>
  )
}
