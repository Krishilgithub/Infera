"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  Share,
  MoreVertical,
  Volume2,
  VolumeX,
  Monitor,
  Hand,
  Sparkles,
  Download
} from 'lucide-react'

const participants = [
  { id: 1, name: "Sarah Johnson", role: "Host", video: true, audio: true, avatar: "👩‍💼" },
  { id: 2, name: "Michael Chen", role: "Member", video: true, audio: true, avatar: "👨‍💻" },
  { id: 3, name: "Emily Rodriguez", role: "Member", video: false, audio: true, avatar: "👩‍🎨" },
  { id: 4, name: "David Kim", role: "Member", video: true, audio: false, avatar: "👨‍📊" },
  { id: 5, name: "Lisa Thompson", role: "Member", video: true, audio: true, avatar: "👩‍💼" },
  { id: 6, name: "You", role: "Member", video: true, audio: true, avatar: "🧑‍💻", isCurrentUser: true }
]

const liveTranscript = [
  { time: "2:34 PM", speaker: "Sarah Johnson", text: "So for the Q4 roadmap, we need to prioritize the API scalability improvements." },
  { time: "2:34 PM", speaker: "Michael Chen", text: "I agree. The current infrastructure won't handle the projected load increase." },
  { time: "2:35 PM", speaker: "Emily Rodriguez", text: "What about the UX improvements? Should we push those to Q1?" },
  { time: "2:35 PM", speaker: "Sarah Johnson", text: "Let's discuss that after we finalize the backend work." }
]

const insights = [
  { type: "sentiment", text: "Meeting sentiment is positive", icon: "😊" },
  { type: "action", text: "2 action items identified", icon: "✅" },
  { type: "engagement", text: "High engagement detected", icon: "📈" }
]

export default function LiveMeetingInterface() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [showInsights, setShowInsights] = useState(true)

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Meeting</span>
          </div>
          <span className="text-sm text-gray-300">Q4 Product Strategy Review</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">42:15</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <Users className="h-4 w-4 mr-2" />
            {participants.length}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative bg-gray-800 rounded-lg overflow-hidden ${
                  participant.isCurrentUser ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {participant.video ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-6xl">{participant.avatar}</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-4xl">{participant.avatar}</span>
                    </div>
                  </div>
                )}
                
                {/* Participant Info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black bg-opacity-60 rounded px-2 py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{participant.name}</span>
                      <div className="flex items-center space-x-1">
                        {!participant.audio && <MicOff className="h-3 w-3 text-red-400" />}
                        {participant.role === 'Host' && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    {participant.isCurrentUser && (
                      <span className="text-xs text-blue-400">You</span>
                    )}
                  </div>
                </div>

                {/* Speaking Indicator */}
                {participant.audio && Math.random() > 0.7 && (
                  <div className="absolute top-2 right-2">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-green-400 rounded animate-pulse"
                          style={{
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${i * 100}ms`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowTranscript(true)}
              className={`flex-1 p-3 text-sm font-medium ${
                showTranscript ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setShowInsights(true)}
              className={`flex-1 p-3 text-sm font-medium ${
                showInsights ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Insights
            </button>
          </div>

          {showTranscript && (
            <div className="p-4 h-full overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Live Transcript</h3>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                {liveTranscript.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{entry.time}</span>
                      <span>•</span>
                      <span className="font-medium text-blue-400">{entry.speaker}</span>
                    </div>
                    <p className="text-sm text-gray-200">{entry.text}</p>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>2:36 PM</span>
                  <span>•</span>
                  <span className="font-medium text-blue-400">David Kim</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showInsights && (
            <div className="p-4">
              <h3 className="font-medium mb-4">AI Insights</h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                  >
                    <span className="text-lg">{insight.icon}</span>
                    <span className="text-sm">{insight.text}</span>
                  </motion.div>
                ))}
                
                <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">AI Suggestion</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Consider scheduling a follow-up meeting to discuss UX improvements in detail.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="lg"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className="rounded-full"
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
          
          <Button variant="secondary" size="lg" className="rounded-full">
            <Monitor className="h-5 w-5" />
          </Button>
          
          <Button variant="secondary" size="lg" className="rounded-full">
            <Hand className="h-5 w-5" />
          </Button>
          
          <Button variant="secondary" size="lg" className="rounded-full">
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <Button variant="destructive" size="lg" className="rounded-full">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}