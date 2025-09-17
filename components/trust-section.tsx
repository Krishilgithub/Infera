"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'Infera has completely transformed how we run our team meetings. The AI insights help us understand team dynamics better.',
    rating: 5,
    avatar: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CEO',
    company: 'StartupXYZ',
    content: 'The automated summaries save us hours every week. Action items are never missed anymore.',
    rating: 5,
    avatar: 'MR'
  },
  {
    name: 'Emily Johnson',
    role: 'Team Lead',
    company: 'DesignStudio',
    content: 'The emotion tracking feature helps us create more inclusive and engaging meetings for our remote team.',
    rating: 5,
    avatar: 'EJ'
  }
]

const integrations = [
  { name: 'Google Calendar', logo: '📅' },
  { name: 'Slack', logo: '💬' },
  { name: 'Microsoft Teams', logo: '🔗' },
  { name: 'Zoom', logo: '📹' },
  { name: 'Salesforce', logo: '☁️' },
  { name: 'HubSpot', logo: '🎯' },
  { name: 'Jira', logo: '📋' },
  { name: 'Notion', logo: '📝' }
]

const metrics = [
  { label: 'Meeting Accuracy', value: '99.2%' },
  { label: 'Time Saved', value: '2.5hrs/week' },
  { label: 'User Satisfaction', value: '4.9/5' },
  { label: 'ROI', value: '340%' }
]

export default function TrustSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Loved by Teams Everywhere
          </h2>
          <p className="text-xl text-muted-foreground mb-12" aria-live='polite'>
            See what our users are saying about Infera
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-elevated hover:shadow-lg transition-shadow" tabIndex={0}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4" aria-label={`Rated ${testimonial.rating} out of 5`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-teal-500 mb-4" />
                    <p className="text-muted-foreground mb-6 italic" aria-live='polite'>
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white font-semibold mr-3">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2" aria-label={metric.value}>
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground" aria-label={metric.label}>
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4 gradient-text">
            Integrates with Your Favorite Tools
          </h3>
          <p className="text-muted-foreground mb-8" aria-live='polite'>
            Connect Infera with the tools you already use
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors"
                tabIndex={0}
                aria-label={integration.name}
              >
                <div className="text-2xl mb-2">{integration.logo}</div>
                <div className="text-xs text-center text-muted-foreground">
                  {integration.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
