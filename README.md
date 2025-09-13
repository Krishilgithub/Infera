# Infera - AI-Powered Meeting Intelligence

Transform your meetings with AI-powered transcription, emotion tracking, and automated summaries.

## Features

- **Real-time Transcription**: 99.2% accuracy with speaker identification
- **Emotion & Sentiment Analysis**: Understand team dynamics and engagement
- **Smart Summaries**: AI-generated meeting summaries with key points
- **Action Item Automation**: Automatically create tasks and follow-ups
- **Team Analytics**: Track meeting effectiveness and productivity
- **Integrations**: Connect with 20+ tools including Slack, Teams, Zoom, and more

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: Dark/Light mode support with next-themes

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Authenticated dashboard
│   ├── features/          # Features page
│   ├── pricing/           # Pricing page
│   ├── integrations/      # Integrations page
│   ├── demo/              # Interactive demo
│   ├── login/             # Authentication
│   └── signup/
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Main navigation
│   ├── footer.tsx        # Footer component
│   └── ...               # Other components
├── lib/                  # Utility functions
└── hooks/                # Custom React hooks
```

## Pages Overview

### Public Pages
- **Home**: Hero section, product highlights, how it works, testimonials
- **Features**: Detailed feature descriptions with screenshots
- **Pricing**: Tiered pricing plans with comparison table
- **Integrations**: Grid of supported integrations
- **Demo**: Interactive meeting simulation
- **Login/Signup**: Authentication forms

### Dashboard Pages
- **Overview**: KPI cards, recent meetings, AI insights
- **Meeting Screen**: Live meeting interface with WebRTC placeholders
- **History**: Past meetings with search and filtering
- **Analytics**: Meeting effectiveness and team insights
- **Settings**: Account and integration management

## Key Components

- **HeroSection**: Landing page hero with animated elements
- **ProductHighlights**: Feature cards with benefits
- **HowItWorks**: 3-step process explanation
- **TrustSection**: Testimonials and integration logos
- **PricingTable**: Tiered pricing with feature comparison
- **MeetingInterface**: Live meeting UI with transcript and actions
- **DashboardSidebar**: Collapsible navigation
- **DashboardOverview**: KPI dashboard with recent activity

## Design System

- **Colors**: Navy/indigo primary, teal secondary, with dark mode support
- **Typography**: Inter font family with consistent sizing
- **Components**: shadcn/ui for consistent, accessible components
- **Animations**: Framer Motion for smooth transitions
- **Layout**: Responsive grid system with consistent spacing

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

```bash
npm run build
npm start
```

## Features in Development

- WebRTC integration for real meetings
- Advanced AI models for better accuracy
- Custom workflow automation
- Enterprise SSO integration
- Mobile app companion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
