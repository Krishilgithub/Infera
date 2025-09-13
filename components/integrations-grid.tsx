"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Zap } from 'lucide-react'

const integrations = [
  {
    name: 'Google Calendar',
    description: 'Automatically schedule follow-up meetings and sync meeting summaries.',
    logo: '📅',
    category: 'Calendar',
    features: ['Auto-scheduling', 'Summary sync', 'Meeting reminders'],
    status: 'Available'
  },
  {
    name: 'Slack',
    description: 'Share meeting summaries and action items directly in your team channels.',
    logo: '💬',
    category: 'Communication',
    features: ['Summary sharing', 'Action notifications', 'Team updates'],
    status: 'Available'
  },
  {
    name: 'Microsoft Teams',
    description: 'Native integration with Teams for seamless meeting experiences.',
    logo: '🔗',
    category: 'Meeting Platform',
    features: ['Native integration', 'Live transcription', 'Real-time insights'],
    status: 'Available'
  },
  {
    name: 'Zoom',
    description: 'Enhanced Zoom meetings with AI-powered insights and automation.',
    logo: '📹',
    category: 'Meeting Platform',
    features: ['Live transcription', 'Breakout room insights', 'Recording analysis'],
    status: 'Available'
  },
  {
    name: 'Salesforce',
    description: 'Automatically create leads, opportunities, and tasks from meeting insights.',
    logo: '☁️',
    category: 'CRM',
    features: ['Lead creation', 'Opportunity tracking', 'Task automation'],
    status: 'Available'
  },
  {
    name: 'HubSpot',
    description: 'Sync meeting data with contacts and create automated workflows.',
    logo: '🎯',
    category: 'CRM',
    features: ['Contact sync', 'Deal tracking', 'Workflow automation'],
    status: 'Available'
  },
  {
    name: 'Jira',
    description: 'Create tickets and track project progress from meeting action items.',
    logo: '📋',
    category: 'Project Management',
    features: ['Ticket creation', 'Progress tracking', 'Sprint updates'],
    status: 'Available'
  },
  {
    name: 'Notion',
    description: 'Automatically update your workspace with meeting notes and decisions.',
    logo: '📝',
    category: 'Documentation',
    features: ['Page creation', 'Note sync', 'Database updates'],
    status: 'Available'
  },
  {
    name: 'Asana',
    description: 'Create tasks and projects directly from meeting action items.',
    logo: '✅',
    category: 'Project Management',
    features: ['Task creation', 'Project updates', 'Team assignments'],
    status: 'Coming Soon'
  },
  {
    name: 'Monday.com',
    description: 'Sync meeting insights with your Monday.com boards and workflows.',
    logo: '📊',
    category: 'Project Management',
    features: ['Board updates', 'Item creation', 'Automation rules'],
    status: 'Coming Soon'
  },
  {
    name: 'Trello',
    description: 'Create cards and update boards based on meeting outcomes.',
    logo: '🗂️',
    category: 'Project Management',
    features: ['Card creation', 'Board updates', 'Label automation'],
    status: 'Coming Soon'
  },
  {
    name: 'GitHub',
    description: 'Create issues and pull requests from technical meeting discussions.',
    logo: '🐙',
    category: 'Development',
    features: ['Issue creation', 'PR automation', 'Code review notes'],
    status: 'Coming Soon'
  }
]

const categories = ['All', 'Meeting Platform', 'CRM', 'Project Management', 'Communication', 'Calendar', 'Documentation', 'Development']

export default function IntegrationsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory)

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
            Connect with Your
            <span className="gradient-text block">Favorite Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate Infera with the tools you already use to create a seamless workflow 
            and maximize productivity across your entire tech stack.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredIntegrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{integration.logo}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === 'Available' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {integration.status}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-medium text-muted-foreground">
                      Key Features:
                    </div>
                    <ul className="space-y-1">
                      {integration.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-teal-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant={integration.status === 'Available' ? 'default' : 'outline'}
                    className="w-full"
                    disabled={integration.status !== 'Available'}
                  >
                    {integration.status === 'Available' ? 'Connect' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center gradient-bg rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't See Your Tool?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're constantly adding new integrations. Request one or build your own with our API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient">
              <Zap className="mr-2 h-4 w-4" />
              Request Integration
            </Button>
            <Button size="lg" variant="outline">
              View API Docs
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
