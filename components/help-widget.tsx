"use client";

import { useState } from "react";
import { Mail, MessageCircle, X } from "lucide-react";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", message: "", category: "General" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.message) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate async send
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-primary/20 p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-navy-900 dark:text-white">Help & Support</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close help widget" className="rounded-full p-1 hover:bg-primary/10">
              <X className="h-5 w-5 text-navy-500" />
            </button>
          </div>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-semibold mb-1">Thank you!</div>
              <div className="text-sm text-muted-foreground">Your message has been sent. We'll get back to you soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact support form">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-primary/20 bg-white dark:bg-navy-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option>General</option>
                  <option>Technical Issue</option>
                  <option>Billing</option>
                  <option>Accessibility</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-primary/20 bg-white dark:bg-navy-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-primary/20 bg-white dark:bg-navy-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-teal-500 text-white font-semibold py-2 rounded-lg shadow hover:from-primary/90 hover:to-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
              >
                Send Message
              </button>
              <div className="text-xs text-muted-foreground text-center mt-2">
                Or email us at <a href="mailto:hello@infera.ai" className="underline text-primary">hello@infera.ai</a>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-teal-500 text-white px-5 py-3 rounded-full shadow-lg hover:from-primary/90 hover:to-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 animate-fade-in"
          aria-label="Open help and support widget"
        >
          <Mail className="h-5 w-5" />
          <span className="font-semibold">Help & Support</span>
        </button>
      )}
    </div>
  );
}
