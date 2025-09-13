"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Calendar, 
  Users, 
  Mic, 
  Brain, 
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export default function DemoInterface() {
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const startDemo = () => {
    setIsDemoActive(true)
    // Simulate demo time progression
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= 300) { // 5 minutes
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const mockTranscript = [
    { speaker: 'Sarah', text: 'Welcome everyone to our Q4 planning meeting. Let\'s start by reviewing our goals.', time: '0:15', sentiment: 'positive' },
    { speaker: 'Mike', text: 'I think we should prioritize the mobile app development based on user feedback.', time: '0:45', sentiment: 'neutral' },
    { speaker: 'Emily', text: 'That\'s a great point. The mobile app has been our top request from customers.', time: '1:20', sentiment: 'positive' },
    { speaker: 'David', text: 'I agree, but we need to consider the timeline and resource allocation.', time: '2:00', sentiment: 'neutral' },
  ]

  const mockActionItems = [
    { text: 'Finalize mobile app design by Friday', assignee: 'Emily', priority: 'high' },
    { text: 'Schedule user testing sessions', assignee: 'Mike', priority: 'medium' },
    { text: 'Review resource allocation for Q4', assignee: 'David', priority: 'high' }
  ]

  const mockSentimentData = [
    { time: '0:00', value: 0.2 },
    { time: '1:00', value: 0.4 },
    { time: '2:00', value: 0.3 },
    { time: '3:00', value: 0.6 },
    { time: '4:00', value: 0.5 }
  ]

  return (
    <div className="section-padding">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Experience Infera
            <span className="gradient-text block">In Action</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Try our interactive demo to see how Infera transforms your meetings 
            with AI-powered insights and automation.
          </p>
        </motion.div>

        {!isDemoActive ? (
          /* Demo Start Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Demo Options */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="mr-2 h-5 w-5" />
                      Interactive Demo
                    </CardTitle>
                    <CardDescription>
                      Experience a live simulation of Infera's meeting intelligence features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                        Real-time transcription simulation
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                        Emotion and sentiment tracking
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                        Action item generation
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-3" />
                        Meeting summary creation
                      </li>
                    </ul>
                    <Button onClick={startDemo} size="lg" className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Start Demo Meeting
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Schedule Demo
                    </CardTitle>
                    <CardDescription>
                      Book a personalized demo with our team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      Get a custom walkthrough tailored to your team's needs and use cases.
                    </p>
                    <Button variant="outline" size="lg" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Demo
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Demo Preview */}
              <div className="relative">
                <div className="rounded-2xl bg-gradient-to-br from-navy-50 to-teal-50 dark:from-navy-900 dark:to-teal-900 p-8 border">
                  <div className="space-y-6">
                    {/* Video Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-video bg-gradient-to-br from-navy-400 to-teal-400 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium">Demo User {i}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Live Features */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Live Demo Active</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mic className="h-4 w-4 text-teal-500" />
                          <span>Transcription</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-teal-500" />
                          <span>AI Analysis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-teal-500" />
                          <span>Speaker ID</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-teal-500" />
                          <span>Summaries</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Active Demo Interface */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* Demo Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Q4 Planning Meeting</h2>
                <p className="text-muted-foreground">Demo Meeting • {formatTime(currentTime)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Meeting Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Grid */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-video bg-gradient-to-br from-navy-400 to-teal-400 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium">Demo User {i}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Live Transcript */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mic className="mr-2 h-5 w-5" />
                      Live Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {mockTranscript.map((entry, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              entry.sentiment === 'positive' ? 'bg-green-500' :
                              entry.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-teal-600">{entry.speaker}:</span>
                              <span className="text-xs text-muted-foreground">{entry.time}</span>
                            </div>
                            <p className="text-sm mt-1">{entry.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Sentiment Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Sentiment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gradient-to-t from-red-100 via-yellow-100 to-green-100 dark:from-red-900 dark:via-yellow-900 dark:to-green-900 rounded-lg flex items-end justify-center p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">Positive</div>
                        <div className="text-xs text-muted-foreground">Team is engaged</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Action Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockActionItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm">{item.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Assigned to {item.assignee}
                              </p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              item.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {item.priority}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Meeting Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-sm font-medium">{formatTime(currentTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Participants</span>
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Action Items</span>
                        <span className="text-sm font-medium">{mockActionItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Sentiment</span>
                        <span className="text-sm font-medium text-green-600">Positive</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Demo Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mt-12"
            >
              <div className="inline-flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <Button onClick={() => setIsDemoActive(false)} variant="outline">
                  End Demo
                </Button>
                <Button variant="gradient">
                  Try Real Meeting
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-24 gradient-bg rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Meetings?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and experience the power of AI-driven meeting intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo Call
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
