"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
  ArrowUpDown,
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

// Interface for Meeting data
interface Meeting {
  id: string;
  title: string;
  created_at: string;
  ended_at?: string;
  started_at?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  status: 'completed' | 'scheduled' | 'ongoing' | 'cancelled';
  meeting_code: string;
  participants?: any[];
  action_items?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  summary?: string;
  tags?: string[];
}

const filters = [
  { label: 'All Meetings', value: 'all' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Completed', value: 'completed' },
  { label: 'Scheduled', value: 'scheduled' }
]

export default function MeetingHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Load meetings data from API
  useEffect(() => {
    async function loadMeetings() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/meetings/dashboard')
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || res.statusText)
        }
        const data = await res.json()
        
        // Combine all meetings from different categories
        const allMeetings = [
          ...(data.completed || []).map((m: any) => ({ ...m, status: 'completed' as const })),
          ...(data.upcoming || []).map((m: any) => ({ ...m, status: 'scheduled' as const })),
          ...(data.ongoing || []).map((m: any) => ({ ...m, status: 'ongoing' as const }))
        ]
        
        setMeetings(allMeetings)
      } catch (e: any) {
        setError(e?.message || 'Failed to load meetings')
      } finally {
        setLoading(false)
      }
    }
    
    loadMeetings()
  }, [])

  // Delete meeting function
  async function deleteMeeting(meetingId: string) {
    try {
      setDeleteLoading(meetingId)
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Failed to delete meeting')
      }
      
      // Remove meeting from local state
      setMeetings(prev => prev.filter(m => m.id !== meetingId))
      setConfirmDelete(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to delete meeting')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Helper function to get meeting date
  function getMeetingDate(meeting: Meeting): Date {
    return new Date(meeting.ended_at || meeting.started_at || meeting.scheduled_at || meeting.created_at)
  }

  // Helper function to format meeting date
  function formatMeetingDate(meeting: Meeting): string {
    const date = getMeetingDate(meeting)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper function to get meeting duration
  function getMeetingDuration(meeting: Meeting): number {
    if (meeting.duration_minutes) {
      return meeting.duration_minutes
    }
    if (meeting.started_at && meeting.ended_at) {
      const start = new Date(meeting.started_at).getTime()
      const end = new Date(meeting.ended_at).getTime()
      return Math.round((end - start) / (1000 * 60))
    }
    return 0
  }

  // Filter and sort meetings
  const filteredMeetings = meetings
    .filter(meeting => {
      const searchMatch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (meeting.summary && meeting.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (meeting.tags && Array.isArray(meeting.tags) && meeting.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      
      const filterMatch = selectedFilter === 'all' ||
                         (selectedFilter === 'week' && getMeetingDate(meeting) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                         (selectedFilter === 'month' && getMeetingDate(meeting) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                         (selectedFilter === 'completed' && meeting.status === 'completed') ||
                         (selectedFilter === 'scheduled' && meeting.status === 'scheduled')
      
      return searchMatch && filterMatch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return getMeetingDate(b).getTime() - getMeetingDate(a).getTime()
        case 'duration':
          return getMeetingDuration(b) - getMeetingDuration(a)
        case 'participants':
          return (b.participants?.length || 0) - (a.participants?.length || 0)
        default:
          return 0
      }
    })

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊'
      case 'negative':
        return '😔'
      case 'neutral':
      default:
        return '😐'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meeting History</h1>
            <p className="text-muted-foreground">
              Review and manage your past meetings and insights.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading meetings...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meeting History</h1>
            <p className="text-muted-foreground">
              Review and manage your past meetings and insights.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading meetings: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <Button variant="default">
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
                      {formatMeetingDate(meeting)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </div>
                    {meeting.sentiment && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(meeting.sentiment)}`}>
                        {getSentimentIcon(meeting.sentiment)} {meeting.sentiment}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {meeting.summary || 'No summary available'}
                </p>
                
                {/* Meeting Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{getMeetingDuration(meeting)} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.participants?.length || 0} participants</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.action_items || 0} actions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.meeting_code}</span>
                  </div>
                </div>
                
                {/* Tags */}
                {meeting.tags && Array.isArray(meeting.tags) && meeting.tags.length > 0 && (
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
                )}
                
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setConfirmDelete(meeting.id)}
                      disabled={deleteLoading === meeting.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleteLoading === meeting.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
      {filteredMeetings.length === 0 && !loading && (
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
            {searchQuery || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'You haven\'t had any meetings yet. Start by scheduling your first meeting!'}
          </p>
          <Button variant="default">
            Schedule New Meeting
          </Button>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setConfirmDelete(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Delete Meeting</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this meeting? All associated data including recordings, transcripts, and insights will be permanently removed.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(null)}
                className="flex-1"
                disabled={deleteLoading === confirmDelete}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete && deleteMeeting(confirmDelete)}
                className="flex-1"
                disabled={deleteLoading === confirmDelete}
              >
                {deleteLoading === confirmDelete ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}