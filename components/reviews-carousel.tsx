"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

// Example testimonials data
const testimonials = [
  {
    name: "Ava Chen",
    title: "Product Manager, TechNova",
    photo: "/participants/ava.jpg",
    rating: 5,
    review:
      "Infera transformed our meetings. The AI summaries and action items save us hours every week!",
  },
  {
    name: "Liam Patel",
    title: "CTO, HealthSync",
    photo: "/participants/liam.jpg",
    rating: 4,
    review:
      "The live transcription and analytics are game changers for remote teams. Highly recommended!",
  },
  {
    name: "Sophia Müller",
    title: "HR Lead, GlobalCorp",
    photo: "/participants/sophia.jpg",
    rating: 5,
    review:
      "Our onboarding and follow-ups are so much smoother. The accessibility features are top-notch.",
  },
  {
    name: "Noah Kim",
    title: "Founder, EduSpark",
    photo: "/participants/noah.jpg",
    rating: 5,
    review:
      "The best meeting tool we've used. The carousel is beautiful and works great on mobile!",
  },
];

export default function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section
      className="section-padding bg-gradient-to-br from-teal-50 via-white to-navy-50 dark:from-navy-950 dark:via-navy-900 dark:to-teal-950"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <h2
          id="reviews-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-navy-900 dark:text-white"
        >
          What Our Users Say
        </h2>
        <div
          className="relative max-w-2xl mx-auto"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials carousel"
          onKeyDown={handleKeyDown}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-white/90 dark:bg-navy-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center min-h-[340px]"
              aria-live="polite"
            >
              <img
                src={testimonials[current].photo}
                alt={`Photo of ${testimonials[current].name}`}
                className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow mb-4"
                loading="lazy"
              />
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonials[current].rating ? "text-yellow-400" : "text-gray-300 dark:text-navy-700"}`}
                    aria-hidden="true"
                  />
                ))}
                <span className="sr-only">{testimonials[current].rating} out of 5 stars</span>
              </div>
              <blockquote className="text-lg md:text-xl font-medium text-navy-800 dark:text-navy-100 mb-4">
                “{testimonials[current].review}”
              </blockquote>
              <div className="text-navy-700 dark:text-navy-200 font-semibold text-base mb-1">
                {testimonials[current].name}
              </div>
              <div className="text-sm text-navy-500 dark:text-navy-300 mb-2">{testimonials[current].title}</div>
            </motion.div>
          </AnimatePresence>
          {/* Navigation */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-navy-800/80 rounded-full p-2 shadow hover:bg-primary/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10"
            onClick={prev}
            aria-label="Previous testimonial"
            tabIndex={0}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-navy-800/80 rounded-full p-2 shadow hover:bg-primary/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10"
            onClick={next}
            aria-label="Next testimonial"
            tabIndex={0}
          >
            <ArrowRight className="h-6 w-6" />
          </button>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6" aria-label="Carousel navigation dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border-2 ${idx === current ? "bg-primary border-primary" : "bg-gray-200 dark:bg-navy-700 border-gray-300 dark:border-navy-800"}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                aria-current={idx === current}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
