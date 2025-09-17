'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share, 
  Edit, 
  FileText, 
  Mail, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  CheckCircle, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  MessageSquare,
  Bug,
  Building,
  RefreshCw,
  Settings,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface Participant {
  name: string;
  role: string;
  email: string;
}

interface TranscriptEntry {
  speaker: string;
  timestamp: string;
  content: string;
  sentiment: number;
  emotion: string;
}

interface TimelineMarker {
  id: number;
  type: string;
  title: string;
  timestamp: string;
  description: string;
}

interface ActionItem {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  priority: string;
  status: string;
  description: string;
  createdAt: string;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: string;
  lastSync: string | null;
  description: string;
}

const MeetingDetailsInterface: React.FC = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('transcript');

  const [meetingData] = useState({
    id: 'meeting-001',
    title: "Q4 Product Strategy Review",
    description: "Quarterly review of product roadmap and strategic initiatives for the upcoming quarter",
    date: "September 13, 2025",
    time: "2:00 PM - 3:30 PM EST",
    duration: 90,
    status: 'ended',
    overallSentiment: 0.72,
    participants: [
      { name: "Sarah Johnson", role: "Product Manager", email: "sarah.johnson@company.com" },
      { name: "Michael Chen", role: "Engineering Lead", email: "michael.chen@company.com" },
      { name: "Emily Rodriguez", role: "UX Designer", email: "emily.rodriguez@company.com" },
      { name: "David Kim", role: "Data Analyst", email: "david.kim@company.com" },
      { name: "Lisa Thompson", role: "Marketing Director", email: "lisa.thompson@company.com" }
    ] as Participant[]
  });

  const [transcript] = useState([
    {
      speaker: "Sarah Johnson",
      timestamp: "2025-09-13T14:00:15Z",
      content: "Good afternoon everyone, thank you for joining our Q4 product strategy review. Let's start by discussing our current KPI performance and how it aligns with our MVP goals.",
      sentiment: 0.8,
      emotion: "positive"
    },
    {
      speaker: "Michael Chen",
      timestamp: "2025-09-13T14:02:30Z",
      content: "The API integration has been performing well, with 99.5% uptime this quarter. However, we need to address some scalability concerns before the next release.",
      sentiment: 0.6,
      emotion: "neutral"
    },
    {
      speaker: "Emily Rodriguez",
      timestamp: "2025-09-13T14:05:45Z",
      content: "From a UI/UX perspective, user feedback has been overwhelmingly positive. The new dashboard design has improved user engagement by 35%.",
      sentiment: 0.9,
      emotion: "excited"
    },
    {
      speaker: "David Kim",
      timestamp: "2025-09-13T14:08:20Z",
      content: "Our ROI metrics show strong performance, but I'm concerned about the B2B conversion rates. We need to analyze the CRM data more thoroughly.",
      sentiment: 0.4,
      emotion: "concerned"
    },
    {
      speaker: "Lisa Thompson",
      timestamp: "2025-09-13T14:12:10Z",
      content: "The marketing campaign has exceeded expectations. Our SLA with the advertising partners has been maintained, and we're seeing great results.",
      sentiment: 0.85,
      emotion: "positive"
    },
    {
      speaker: "Sarah Johnson",
      timestamp: "2025-09-13T14:15:30Z",
      content: "Excellent work everyone. Let's make sure we document these action items and schedule follow-up meetings to address the scalability concerns Michael mentioned.",
      sentiment: 0.75,
      emotion: "positive"
    }
  ] as TranscriptEntry[]);

  const [timelineMarkers] = useState([
    {
      id: 1,
      type: 'action',
      title: 'Address API Scalability',
      timestamp: "2025-09-13T14:02:30Z",
      description: 'Michael to investigate scalability solutions'
    },
    {
      id: 2,
      type: 'decision',
      title: 'Approve Dashboard Design',
      timestamp: "2025-09-13T14:05:45Z",
      description: 'Team approved new dashboard design for production'
    },
    {
      id: 3,
      type: 'action',
      title: 'Analyze CRM Conversion Data',
      timestamp: "2025-09-13T14:08:20Z",
      description: 'David to deep-dive into B2B conversion metrics'
    },
    {
      id: 4,
      type: 'emotion',
      title: 'High Team Morale',
      timestamp: "2025-09-13T14:12:10Z",
      description: 'Team expressing positive sentiment about results'
    }
  ] as TimelineMarker[]);

  const [actionItems, setActionItems] = useState([
    {
      id: 1,
      title: "Investigate API scalability solutions for Q4 launch",
      assignee: "Michael Chen",
      dueDate: "2025-09-20",
      priority: "high",
      status: "pending",
      description: "Research and propose solutions for handling increased load during Q4 product launch",
      createdAt: "2025-09-13T14:02:30Z"
    },
    {
      id: 2,
      title: "Conduct deep-dive analysis of B2B conversion rates",
      assignee: "David Kim",
      dueDate: "2025-09-18",
      priority: "medium",
      status: "pending",
      description: "Analyze CRM data to identify bottlenecks in B2B conversion funnel",
      createdAt: "2025-09-13T14:08:20Z"
    },
    {
      id: 3,
      title: "Prepare dashboard design documentation for development",
      assignee: "Emily Rodriguez",
      dueDate: "2025-09-16",
      priority: "medium",
      status: "completed",
      description: "Create comprehensive design specs and user flow documentation",
      createdAt: "2025-09-13T14:05:45Z"
    },
    {
      id: 4,
      title: "Schedule follow-up meeting with engineering team",
      assignee: "Sarah Johnson",
      dueDate: "2025-09-15",
      priority: "low",
      status: "pending",
      description: "Coordinate with Michael's team to discuss scalability roadmap",
      createdAt: "2025-09-13T14:15:30Z"
    }
  ] as ActionItem[]);

  const [integrations] = useState([
    {
      id: 'slack-001',
      name: 'Slack',
      icon: 'MessageSquare',
      status: 'connected',
      lastSync: "2025-09-13T14:30:00Z",
      description: 'Meeting summary posted to #product-team channel'
    },
    {
      id: 'jira-001',
      name: 'Jira',
      icon: 'Bug',
      status: 'connected',
      lastSync: "2025-09-13T14:25:00Z",
      description: 'Action items synced as Jira tickets'
    },
    {
      id: 'salesforce-001',
      name: 'Salesforce',
      icon: 'Building',
      status: 'error',
      lastSync: "2025-09-12T10:15:00Z",
      description: 'Authentication expired - needs reconnection'
    },
    {
      id: 'hubspot-001',
      name: 'HubSpot',
      icon: 'Users',
      status: 'disconnected',
      lastSync: null,
      description: 'Not configured'
    }
  ] as Integration[]);

  const sentimentData = transcript?.map(item => ({
    ...item,
    timestamp: new Date(item.timestamp)?.getTime()
  }));

  const handleExportPDF = () => {
    console.log('Exporting meeting as PDF...');
    setTimeout(() => {
      alert('Meeting transcript exported as PDF successfully!');
    }, 1000);
  };

  const handleExportEmail = () => {
    console.log('Sending meeting summary via email...');
    setTimeout(() => {
      alert('Meeting summary sent to all participants!');
    }, 1000);
  };

  const handleEditMeeting = () => {
    console.log('Opening meeting editor...');
  };

  const handleShareMeeting = () => {
    console.log('Sharing meeting...');
    navigator.clipboard?.writeText(window.location?.href || '');
    alert('Meeting link copied to clipboard!');
  };

  const handleJumpToMarker = (marker: TimelineMarker) => {
    console.log('Jumping to marker:', marker);
  };

  const handleUpdateActionItem = (itemId: number, updates: Partial<ActionItem>) => {
    setActionItems(prev => 
      prev?.map(item => 
        item?.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const handleAddActionItem = (newItem: ActionItem) => {
    setActionItems(prev => [...prev, newItem]);
  };

  const handleSyncIntegration = (integrationId: string) => {
    console.log('Syncing integration:', integrationId);
  };

  const handleConfigureIntegration = (integrationId: string) => {
    console.log('Configuring integration:', integrationId);
  };

  const handleToggleRecording = () => {
    console.log('Toggle recording');
  };

  const handleEndMeeting = () => {
    console.log('End meeting');
  };

  const MeetingHeader = () => (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {meetingData?.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {meetingData?.title}
            </h1>
            
            <p className="text-muted-foreground mb-4 max-w-2xl">
              {meetingData?.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{meetingData?.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{meetingData?.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{meetingData?.participants?.length} participants</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleEditMeeting}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareMeeting}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="default" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const TranscriptPanel = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transcript & Timeline</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto">
        <div className="space-y-4">
          {transcript?.map((entry, i) => (
            <div key={i} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {entry.speaker.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-foreground">{entry.speaker}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  {entry.emotion === 'positive' && <TrendingUp size={14} className="text-green-500" />}
                  {entry.emotion === 'concerned' && <TrendingDown size={14} className="text-orange-500" />}
                  {entry.emotion === 'excited' && <Heart size={14} className="text-pink-500" />}
                </div>
                <p className="text-foreground leading-relaxed">{entry.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SentimentAnalysis = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {Math.round((meetingData?.overallSentiment || 0) * 100)}%
            </div>
            <div className="text-muted-foreground">Overall Positive Sentiment</div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Participant Sentiment</h3>
            {meetingData?.participants?.map((participant, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{participant.name}</div>
                    <div className="text-sm text-muted-foreground">{participant.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {Math.round(Math.random() * 30 + 70)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Positive</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const IntegrationStatus = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Integration Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations?.map((integration, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {integration.icon === 'MessageSquare' && <MessageSquare className="h-5 w-5 text-primary" />}
                  {integration.icon === 'Bug' && <Bug className="h-5 w-5 text-primary" />}
                  {integration.icon === 'Building' && <Building className="h-5 w-5 text-primary" />}
                  {integration.icon === 'Users' && <Users className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <div className="font-medium text-foreground">{integration.name}</div>
                  <div className="text-sm text-muted-foreground">{integration.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={'w-2 h-2 rounded-full ' + (
                  integration.status === 'connected' ? 'bg-green-500' :
                  integration.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                )}></div>
                <span className={'text-sm font-medium ' + (
                  integration.status === 'connected' ? 'text-green-600' :
                  integration.status === 'error' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {integration.status === 'connected' ? 'Connected' :
                   integration.status === 'error' ? 'Error' : 'Disconnected'}
                </span>
                {integration.status === 'connected' && (
                  <Button variant="ghost" size="sm" onClick={() => handleSyncIntegration(integration.id)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                {integration.status !== 'connected' && (
                  <Button variant="outline" size="sm" onClick={() => handleConfigureIntegration(integration.id)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ActionItemsSidebar = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Action Items</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actionItems?.map((item, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className={'text-xs px-2 py-1 rounded ' + (
                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                )}>
                  {item.priority}
                </span>
                <div className="flex items-center space-x-1">
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
              <div className="text-sm text-muted-foreground mb-2">
                Assigned to: {item.assignee}
              </div>
              <div className="text-xs text-muted-foreground">
                Due: {new Date(item.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-16 lg:pb-0">
        <MeetingHeader />

        <div className="max-w-7xl mx-auto p-6">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 mb-6 shadow-sm">
            <button
              onClick={() => setSelectedTab('transcript')}
              className={'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ' + (
                selectedTab === 'transcript' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              Transcript & Timeline
            </button>
            <button
              onClick={() => setSelectedTab('sentiment')}
              className={'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ' + (
                selectedTab === 'sentiment' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              Sentiment Analysis
            </button>
            <button
              onClick={() => setSelectedTab('actionItems')}
              className={'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ' + (
                selectedTab === 'actionItems' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              Action Items
            </button>
          </div>

          <div className="space-y-6">
            {selectedTab === 'transcript' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <TranscriptPanel />
              </div>
            )}
            {selectedTab === 'sentiment' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <SentimentAnalysis />
              </div>
            )}
            {selectedTab === 'actionItems' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <ActionItemsSidebar />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsInterface;
