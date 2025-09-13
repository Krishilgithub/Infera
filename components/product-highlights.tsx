"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mic, 
  Brain, 
  FileText, 
  Zap,
  Users,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Real-time Transcription',
    description: 'Get accurate, live transcriptions of your meetings with speaker identification.',
    benefits: ['99% accuracy', 'Multiple languages', 'Speaker recognition']
  },
  {
    icon: Brain,
    title: 'Emotion Tracking',
    description: 'Understand team sentiment and engagement levels throughout the meeting.',
    benefits: ['Sentiment analysis', 'Engagement metrics', 'Mood insights']
  },
  {
    icon: FileText,
    title: 'Smart Summaries',
    description: 'Automatically generated meeting summaries with key points and decisions.',
    benefits: ['AI-generated', 'Key highlights', 'Decision tracking']
  },
  {
    icon: Zap,
    title: 'Action Automation',
    description: 'Automatically create tasks, schedule follow-ups, and sync with your tools.',
    benefits: ['Task creation', 'Calendar sync', 'CRM integration']
  }
]

const stats = [
  { icon: Users, label: 'Active Users', value: '10K+' },
  { icon: TrendingUp, label: 'Meetings Analyzed', value: '1M+' },
  { icon: Clock, label: 'Time Saved', value: '2.5hrs/week' },
  { icon: CheckCircle, label: 'Accuracy Rate', value: '99.2%' }
]

export default function ProductHighlights() {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of teams already transforming their meetings
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 mb-4">
                    <Icon className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 mb-4">
                      <Icon className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
