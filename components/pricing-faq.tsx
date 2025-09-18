"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data is stored securely for 30 days after cancellation. You can export all your meeting data during this period. After 30 days, data is permanently deleted.'
  },
  {
    question: 'Do you offer custom pricing for large teams?',
    answer: 'Absolutely! Our Enterprise plan includes custom pricing based on your team size and specific needs. Contact our sales team for a personalized quote.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial period.'
  },
  {
    question: 'What integrations do you support?',
    answer: 'We support 20+ integrations including Zoom, Microsoft Teams, Google Meet, Slack, Salesforce, HubSpot, Jira, and many more. Custom integrations are available for Enterprise customers.'
  },
  {
    question: 'How accurate is the transcription?',
    answer: 'Our AI-powered transcription achieves 99.2% accuracy on average. Accuracy may vary based on audio quality, accents, and technical terminology.'
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use bank-level encryption, are SOC 2 compliant, and follow GDPR guidelines. Your meeting data is never shared with third parties without your explicit consent.'
  },
  {
    question: 'Can I use Infera for client meetings?',
    answer: 'Yes! Infera is perfect for client meetings. You can easily share summaries and task assignments with clients while maintaining full control over data privacy settings.'
  }
]

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="border rounded-lg bg-background"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
