"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Users, Brain, FileText } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Users,
    title: 'Join Meeting',
    description: 'Connect to any meeting platform or start a new session with Infera.',
    details: 'Supports Zoom, Teams, Google Meet, and more'
  },
  {
    number: 2,
    icon: Brain,
    title: 'Get Insights',
    description: 'Watch as AI analyzes conversations, tracks emotions, and identifies key moments.',
    details: 'Real-time transcription and sentiment analysis'
  },
  {
    number: 3,
    icon: FileText,
    title: 'Receive Summary',
    description: 'Get automated summaries, action items, and insights delivered instantly.',
    details: 'Export to your favorite tools and platforms'
  }
]

export default function HowItWorks() {
  return (
    <section className="section-padding gradient-bg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your meetings in three simple steps. No complex setup, 
            no learning curve - just powerful AI working in the background.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-navy-600 to-teal-600 text-white text-xl font-bold mb-6">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-900 dark:to-teal-900 mb-4">
                      <Icon className="h-6 w-6 text-navy-600 dark:text-navy-400" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <p className="text-sm text-muted-foreground">{step.details}</p>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to transform your meetings?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-navy-600 to-teal-600 text-white rounded-lg font-medium hover:from-navy-700 hover:to-teal-700 transition-all"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
