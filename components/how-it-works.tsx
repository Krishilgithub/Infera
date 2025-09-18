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
    <section
      className="section-padding bg-gradient-to-br from-navy-50 via-white to-teal-50 dark:from-navy-950 dark:via-navy-900 dark:to-teal-950"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            id="how-it-works-heading"
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-navy-900 dark:text-white drop-shadow-sm"
          >
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-navy-700 dark:text-navy-200 max-w-2xl mx-auto font-medium">
            Transform your meetings in three simple steps. No complex setup, no learning curve—just powerful AI working in the background.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.18, duration: 0.7, type: 'spring', bounce: 0.25 }}
                viewport={{ once: true }}
                className="relative group focus-within:ring-4 focus-within:ring-primary/40 rounded-2xl"
                tabIndex={0}
                aria-label={`Step ${step.number}: ${step.title}`}
              >
                <Card className="h-full text-center bg-white/90 dark:bg-navy-900/80 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <CardContent className="p-8 flex flex-col items-center">
                    {/* Step Number */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.15, duration: 0.5, type: 'spring' }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal-500 text-white text-2xl font-extrabold mb-6 shadow-lg border-4 border-white dark:border-navy-900"
                      aria-hidden="true"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      initial={{ rotate: -10, scale: 0.7, opacity: 0 }}
                      whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.15, duration: 0.5, type: 'spring' }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-navy-100 to-teal-100 dark:from-navy-800 dark:to-teal-900 mb-4 shadow"
                      aria-hidden="true"
                    >
                      <Icon className="h-7 w-7 text-navy-700 dark:text-teal-300" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-2 text-navy-900 dark:text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-base md:text-lg text-navy-700 dark:text-navy-200 mb-3 font-medium">
                      {step.description}
                    </p>
                    <p className="text-sm text-navy-500 dark:text-navy-300">
                      {step.details}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-7 w-7 text-navy-300 dark:text-navy-700 opacity-70" />
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
          <p className="text-lg md:text-xl text-navy-700 dark:text-navy-200 mb-6 font-medium">
            Ready to transform your meetings?
          </p>
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center px-10 py-3 bg-gradient-to-r from-primary to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:from-primary/90 hover:to-teal-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 transition-all text-lg"
            aria-label="Get Started Now"
          >
            Get Started Now
            <ArrowRight className="ml-3 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
