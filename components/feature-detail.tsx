"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Mic, 
  Brain, 
  Users, 
  FileText, 
  Zap, 
  Lightbulb,
  TrendingUp,
  Shield,
  Clock,
  Target,
  BarChart3,
  MessageSquare
} from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Real-time Transcription',
    description: 'Get accurate, live transcriptions with speaker identification and timestamps.',
    benefits: [
      '99.2% accuracy rate',
      'Multiple language support',
      'Speaker identification',
      'Real-time processing'
    ],
    screenshot: 'transcription-preview'
  },
  {
    icon: Users,
    title: 'Speaker Tracking',
    description: 'Identify who said what and track participation levels across your team.',
    benefits: [
      'Automatic speaker detection',
      'Participation analytics',
      'Talk time distribution',
      'Speaking patterns'
    ],
    screenshot: 'speaker-tracking-preview'
  },
  {
    icon: Brain,
    title: 'Emotion & Sentiment Analysis',
    description: 'Understand team dynamics with AI-powered emotion and sentiment tracking.',
    benefits: [
      'Real-time sentiment scoring',
      'Emotion timeline',
      'Engagement metrics',
      'Mood insights'
    ],
    screenshot: 'emotion-analysis-preview'
  },
  {
    icon: Lightbulb,
    title: 'Jargon Assistant',
    description: 'Get instant explanations for technical terms and industry jargon.',
    benefits: [
      'Context-aware definitions',
      'Industry-specific glossaries',
      'Custom terminology',
      'Learning recommendations'
    ],
    screenshot: 'jargon-assistant-preview'
  },
  {
    icon: FileText,
    title: 'Smart Summaries',
    description: 'Automatically generated meeting summaries with key points and decisions.',
    benefits: [
      'AI-powered summarization',
      'Key decision tracking',
      'Action item extraction',
      'Customizable formats'
    ],
    screenshot: 'summaries-preview'
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    description: 'Automatically create tasks, schedule follow-ups, and sync with your tools.',
    benefits: [
      'Task creation',
      'Calendar integration',
      'CRM synchronization',
      'Follow-up automation'
    ],
    screenshot: 'automation-preview'
  }
]

const additionalFeatures = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA.'
  },
  {
    icon: Clock,
    title: 'Meeting Analytics',
    description: 'Track meeting effectiveness, duration trends, and productivity insights.'
  },
  {
    icon: Target,
    title: 'Custom Workflows',
    description: 'Create custom automation rules tailored to your team\'s processes.'
  },
  {
    icon: BarChart3,
    title: 'Team Insights',
    description: 'Understand team dynamics and collaboration patterns over time.'
  },
  {
    icon: MessageSquare,
    title: 'Multi-platform Support',
    description: 'Works with Zoom, Teams, Google Meet, and 20+ other platforms.'
  },
  {
    icon: TrendingUp,
    title: 'ROI Tracking',
    description: 'Measure the impact of your meetings on team productivity and outcomes.'
  }
]

export default function FeatureDetail() {
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
            Powerful Features for
            <span className="gradient-text block">Every Meeting</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how Infera's AI-powered features transform your meetings 
            into actionable insights and improved collaboration.
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="space-y-24 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={isEven ? '' : 'lg:col-start-2'}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 mb-6">
                    <Icon className="h-8 w-8 text-navy-600 dark:text-navy-400" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {feature.title}
                  </h2>
                  
                  <p className="text-xl text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>

                {/* Screenshot */}
                <div className={isEven ? '' : 'lg:col-start-1'}>
                  <div className="relative rounded-2xl bg-gradient-to-br from-navy-50 to-teal-50 dark:from-navy-900 dark:to-teal-900 p-8 border">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      {feature.screenshot === 'transcription-preview' && (
                        <img 
                          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80" 
                          alt="Real-time transcription interface"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {feature.screenshot === 'speaker-tracking-preview' && (
                        <img 
                          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                          alt="Team meeting with speaker tracking"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {feature.screenshot === 'emotion-analysis-preview' && (
                        <img 
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80" 
                          alt="AI emotion analysis dashboard"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {feature.screenshot === 'jargon-assistant-preview' && (
                        <img 
                          src="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
                          alt="Technical documentation and definitions"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {feature.screenshot === 'summaries-preview' && (
                        <img 
                          src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                          alt="Document summaries and insights"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {feature.screenshot === 'automation-preview' && (
                        <img 
                          src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
                          alt="Workflow automation interface"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-teal-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-navy-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            And Much More
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 mb-4">
                        <Icon className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-24 gradient-bg rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and see how Infera can transform your meetings.
          </p>
          <Button size="lg" variant="gradient">
            Start Free Trial
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
