"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  Users, 
  Clock, 
  Calendar,
  CheckCircle,
  Share,
  Download,
  Edit,
  BarChart3,
  MessageSquare,
  Heart
} from 'lucide-react'

const meetingData = {
  title: "Q4 Product Strategy Review",
  subtitle: "Quarterly review of product roadmap and strategic initiatives for the upcoming quarter",
  date: "September 13, 2025",
  time: "2:00 PM - 3:30 PM EST",
  duration: "1h 30m",
  participants: 5,
  sentiment: "Positive",
  status: "Ended"
}

const participants = [
  { id: "SJ", name: "Sarah Johnson", role: "Product Manager", avatar: "👩‍💼" },
  { id: "MC", name: "Michael Chen", role: "Engineering Lead", avatar: "👨‍💻" },
  { id: "ER", name: "Emily Rodriguez", role: "UX Designer", avatar: "👩‍🎨" },
  { id: "DK", name: "David Kim", role: "Data Analyst", avatar: "👨‍📊" },
  { id: "LT", name: "Lisa Thompson", role: "Marketing Director", avatar: "👩‍💼" }
]

const actionItems = [
  {
    id: 1,
    task: "Investigate API scalability solutions for Q4 launch",
    assignee: "Michael Chen",
    priority: "High",
    status: "Pending",
    dueDate: "Sep 20, 2025"
  },
  {
    id: 2,
    task: "Follow up with client on project requirements",
    assignee: "Sarah Johnson",
    priority: "Medium", 
    status: "Done",
    dueDate: "Sep 18, 2025"
  },
  {
    id: 3,
    task: "Schedule mobile optimization workshop for next week",
    assignee: "Emily Rodriguez",
    priority: "High",
    status: "Overdue",
    dueDate: "Sep 15, 2025"
  }
]

const timelineMarkers = [
  { time: "19:32:30", type: "scalability", text: "Address API Scalability", color: "green" },
  { time: "19:35:45", type: "approval", text: "Approve Dashboard Design", color: "blue" },
  { time: "19:38:20", type: "analysis", text: "Analyze CRM Conversion Data", color: "green" },
  { time: "19:42:10", type: "morale", text: "High Team Morale", color: "orange" }
]

export default function MeetingDetails() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{meetingData.title}</h1>
            <p className="text-muted-foreground">{meetingData.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Meeting Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-xs text-muted-foreground">{meetingData.date}</p>
                <p className="text-xs text-muted-foreground">{meetingData.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-xs text-muted-foreground">{meetingData.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Participants</p>
                <p className="text-xs text-muted-foreground">{meetingData.participants} people</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Overall Sentiment</p>
                <p className="text-xs text-green-600">{meetingData.sentiment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{participant.avatar}</div>
                <div className="text-center">
                  <p className="font-medium text-sm">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">{participant.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Markers */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline Markers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineMarkers.map((marker, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    marker.color === 'green' ? 'bg-green-500' : 
                    marker.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{marker.text}</span>
                      <span className="text-xs text-muted-foreground">{marker.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Action Items</CardTitle>
              <Button size="sm" variant="outline">
                + Add
              </Button>
            </div>
            <div className="flex space-x-4 text-sm">
              <span>All (4)</span>
              <span>Pending (3)</span>
              <span>Done (1)</span>
              <span>Overdue (0)</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <CheckCircle className={`h-4 w-4 mt-1 ${
                    item.status === 'Done' ? 'text-green-500' : 
                    item.status === 'Overdue' ? 'text-red-500' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.task}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>Assigned to: {item.assignee}</span>
                      <span className={`px-2 py-1 rounded ${
                        item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.priority}
                      </span>
                      <span>{item.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}