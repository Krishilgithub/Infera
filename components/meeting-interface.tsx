"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  Share,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

// Mock data
const participants = [
  { id: 1, name: 'Sarah Chen', role: 'Product Manager', isVideoOn: true, isAudioOn: true },
  { id: 2, name: 'Mike Rodriguez', role: 'Developer', isVideoOn: true, isAudioOn: false },
  { id: 3, name: 'Emily Johnson', role: 'Designer', isVideoOn: false, isAudioOn: true },
  { id: 4, name: 'David Kim', role: 'QA Engineer', isVideoOn: true, isAudioOn: true },
]

const liveTranscript = [
  { id: 1, speaker: 'Sarah Chen', text: 'Welcome everyone to our Q4 planning meeting. Let\'s start by reviewing our goals.', timestamp: '10:00', sentiment: 'positive' },
  { id: 2, speaker: 'Mike Rodriguez', text: 'I think we should prioritize the mobile app development based on user feedback.', timestamp: '10:05', sentiment: 'neutral' },
  { id: 3, speaker: 'Emily Johnson', text: 'That\'s a great point. The mobile app has been our top request from customers.', timestamp: '10:08', sentiment: 'positive' },
  { id: 4, speaker: 'David Kim', text: 'I agree, but we need to consider the timeline and resource allocation.', timestamp: '10:12', sentiment: 'neutral' },
  { id: 5, speaker: 'Sarah Chen', text: 'Let\'s break this down into actionable items. Emily, can you create a design mockup?', timestamp: '10:15', sentiment: 'positive' },
]

const actionItems = [
  { id: 1, text: 'Create mobile app design mockup', assignee: 'Emily Johnson', priority: 'high', completed: false },
  { id: 2, text: 'Research user feedback on mobile features', assignee: 'Mike Rodriguez', priority: 'medium', completed: false },
  { id: 3, text: 'Estimate development timeline', assignee: 'David Kim', priority: 'high', completed: false },
]

const sentimentData = [
  { time: '10:00', value: 0.8, label: 'Positive' },
  { time: '10:05', value: 0.6, label: 'Neutral' },
  { time: '10:08', value: 0.9, label: 'Positive' },
  { time: '10:12', value: 0.5, label: 'Neutral' },
  { time: '10:15', value: 0.8, label: 'Positive' },
]

export default function MeetingInterface() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isRecording, setIsRecording] = useState(true)
  const [meetingTime, setMeetingTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(true)
  const [showActions, setShowActions] = useState(true)

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setMeetingTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-yellow-600'
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
    <div className="h-screen flex flex-col bg-background">
      {/* Meeting Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{formatTime(meetingTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{participants.length} participants</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                {participant.isVideoOn ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-700 font-medium text-lg">
                      {participant.name}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{participant.name}</p>
                    </div>
                  </div>
                )}
                
                {/* Participant info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs opacity-75">{participant.role}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {participant.isAudioOn ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4 opacity-50" />
                      )}
                      {participant.isVideoOn ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <VideoOff className="h-4 w-4 opacity-50" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-muted/30 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setShowTranscript(true)}
              className={`flex-1 p-3 text-sm font-medium ${
                showTranscript ? 'bg-background border-b-2 border-navy-500' : 'text-muted-foreground'
              }`}
            >
              <MessageSquare className="h-4 w-4 mx-auto mb-1" />
              Transcript
            </button>
            <button
              onClick={() => setShowActions(true)}
              className={`flex-1 p-3 text-sm font-medium ${
                !showTranscript ? 'bg-background border-b-2 border-navy-500' : 'text-muted-foreground'
              }`}
            >
              <CheckCircle className="h-4 w-4 mx-auto mb-1" />
              Actions
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {showTranscript ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Live Transcript</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {liveTranscript.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 bg-background rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-navy-600">
                          {entry.speaker}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp}
                          </span>
                          <span className="text-sm">{getSentimentIcon(entry.sentiment)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Action Items</h3>
                  <span className="text-xs text-muted-foreground">
                    {actionItems.length} items
                  </span>
                </div>
                
                <div className="space-y-3">
                  {actionItems.map((item) => (
                    <div key={item.id} className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Assigned to {item.assignee}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sentiment Timeline */}
          <div className="p-4 border-t">
            <h3 className="font-semibold mb-3">Meeting Sentiment</h3>
            <div className="space-y-2">
              {sentimentData.map((data, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{data.time}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          data.value > 0.7 ? 'bg-green-500' : 
                          data.value > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data.value * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${
                      data.value > 0.7 ? 'text-green-600' : 
                      data.value > 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {data.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Controls */}
      <div className="flex items-center justify-center p-4 border-t bg-background">
        <div className="flex items-center space-x-4">
          <Button
            variant={isAudioOn ? 'default' : 'destructive'}
            size="icon"
            onClick={() => setIsAudioOn(!isAudioOn)}
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOn ? 'default' : 'destructive'}
            size="icon"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button variant="destructive" size="icon">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
