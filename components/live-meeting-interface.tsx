'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MonitorSpeaker, 
  PhoneOff, 
  Users, 
  Clock, 
  Download, 
  Share, 
  Plus,
  CheckCircle,
  Search,
  Filter,
  Circle,
  Heart,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  MoreHorizontal,
  Square
} from 'lucide-react';

const LiveMeetingInterface: React.FC = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showJargonTooltips, setShowJargonTooltips] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState('live');
  const [meetingDuration, setMeetingDuration] = useState('00:15:32');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Update meeting duration every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 15 * 60 * 1000 - 32 * 1000);
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setMeetingDuration(
        hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0')
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleEndMeeting = () => {
    setMeetingStatus('ended');
    setShowSummaryModal(true);
    setTimeout(() => {
      router.push('/dashboard/meeting-details');
    }, 3000);
  };

  const handleExportTranscript = () => {
    console.log('Exporting transcript...');
  };

  const handleGenerateSummary = () => {
    setShowSummaryModal(true);
  };

  const handleShareMeeting = () => {
    navigator.clipboard?.writeText('https://meetingmonitor.com/join/123-456-789');
    console.log('Meeting link copied to clipboard');
  };

  const SummaryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Meeting Summary Generated
          </h3>
          <p className="text-muted-foreground mb-6">
            Your meeting summary and action items have been automatically generated and saved.
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSummaryModal(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={() => router.push('/dashboard/meeting-details')}
              className="flex-1"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const VideoGrid = () => (
    <Card className="h-full border-navy-200 bg-gradient-to-br from-navy-50/50 to-teal-50/50">
      <CardContent className="p-6 h-full">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 h-full">
          {[
            { name: "Sarah Johnson", role: "Product Manager", isHost: true, bgColor: "bg-navy-100", borderColor: "border-navy-200" },
            { name: "Michael Chen", role: "Engineering Lead", isHost: false, bgColor: "bg-teal-100", borderColor: "border-teal-200" },
            { name: "Emily Rodriguez", role: "UX Designer", isHost: false, bgColor: "bg-navy-50", borderColor: "border-navy-100" },
            { name: "David Kim", role: "Data Analyst", isHost: false, bgColor: "bg-teal-50", borderColor: "border-teal-100" },
            { name: "Lisa Thompson", role: "Marketing Director", isHost: false, bgColor: "bg-slate-100", borderColor: "border-slate-200" }
          ].map((participant, i) => (
            <div key={i} className="relative group">
              {/* Main video container with enhanced styling */}
              <div className={`relative h-full ${participant.bgColor} rounded-xl overflow-hidden shadow-lg border-2 ${participant.isHost ? 'border-yellow-300' : participant.borderColor} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}>
                
                {/* Host crown indicator */}
                {participant.isHost && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <span>👑</span>
                      <span>HOST</span>
                    </div>
                  </div>
                )}

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-red-500 rounded-full p-2 animate-pulse shadow-lg">
                      <Circle size={8} className="text-white fill-current" />
                    </div>
                  </div>
                )}

                {/* Avatar and content */}
                <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                  
                  {/* Profile avatar */}
                  <div className="relative z-10 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white shadow-lg mb-3">
                    <span className="text-navy-700 font-bold text-xl">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Participant info */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-navy-800 font-semibold text-sm mb-1">
                      {participant.name}
                    </h3>
                    <p className="text-navy-600 text-xs">
                      {participant.role}
                    </p>
                  </div>
                </div>

                {/* Audio status indicator */}
                <div className="absolute bottom-3 right-3 z-10">
                  {isMuted ? (
                    <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <MicOff size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-green-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Mic size={14} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Connection quality indicator */}
                <div className="absolute bottom-3 left-3 z-10">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-navy-400 rounded-full"></div>
                    <div className="w-1 h-3 bg-navy-500 rounded-full"></div>
                    <div className="w-1 h-2 bg-navy-600 rounded-full"></div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-navy-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const LiveTranscript = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            Live Transcript
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExportTranscript}>
              <Download size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto">
        <div className="space-y-4">
          {[
            { speaker: "Sarah Johnson", time: "14:02", text: "Let's start by reviewing our Q4 objectives and KPIs.", sentiment: "positive" },
            { speaker: "Michael Chen", time: "14:03", text: "The API performance metrics look great this quarter.", sentiment: "positive" },
            { speaker: "Emily Rodriguez", time: "14:04", text: "User feedback on the new interface has been overwhelmingly positive.", sentiment: "positive" },
            { speaker: "David Kim", time: "14:05", text: "I have some concerns about the conversion rates we need to address.", sentiment: "concerned" },
            { speaker: "Lisa Thompson", time: "14:06", text: "Marketing campaigns are exceeding our ROI expectations.", sentiment: "excited" }
          ].map((entry, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {entry.speaker.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{entry.speaker}</span>
                  <span className="text-xs text-muted-foreground">{entry.time}</span>
                  {entry.sentiment === 'positive' && <TrendingUp size={12} className="text-green-500" />}
                  {entry.sentiment === 'concerned' && <TrendingDown size={12} className="text-orange-500" />}
                  {entry.sentiment === 'excited' && <Heart size={12} className="text-pink-500" />}
                </div>
                <p className="text-sm text-foreground">{entry.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SentimentTimeline = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sentiment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">78%</div>
            <div className="text-sm text-muted-foreground">Overall Positive</div>
          </div>
          <div className="h-32 bg-muted/50 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end space-x-1 h-full w-full">
              {[65, 72, 80, 85, 78, 82, 75, 88, 92, 85, 78].map((value, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-green-500 to-blue-500 rounded-sm flex-1"
                  style={{ height: value + '%' }}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Last 10 minutes
          </div>
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
            <Plus size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { title: "Review API scalability", assignee: "Michael", priority: "high" },
            { title: "Update design documentation", assignee: "Emily", priority: "medium" },
            { title: "Analyze conversion metrics", assignee: "David", priority: "high" },
            { title: "Schedule follow-up meeting", assignee: "Sarah", priority: "low" }
          ].map((item, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={'text-xs px-2 py-1 rounded ' + (
                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                )}>
                  {item.priority}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={12} />
                </Button>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">Assigned to: {item.assignee}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">LIVE</span>
              </div>
              <div className="border-l border-border pl-4">
                <h1 className="text-xl font-semibold text-foreground">Weekly Team Standup</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>5 participants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{meetingDuration}</span>
                  </div>
                  {isRecording && (
                    <div className="flex items-center space-x-1 text-red-500">
                      <Circle size={8} className="fill-current" />
                      <span>Recording</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleShareMeeting}>
                <Share size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExportTranscript}>
                <Download size={16} />
              </Button>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={handleToggleRecording}
                className="flex items-center space-x-1"
              >
                {isRecording ? <Square size={14} /> : <Circle size={14} />}
                <span>{isRecording ? 'Stop' : 'Record'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          
          <div className="xl:col-span-3 space-y-6">
            
            <div className="h-1/2">
              <VideoGrid />
            </div>

            <div className="h-1/2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="h-full">
                <LiveTranscript />
              </div>

              <div className="h-full">
                <SentimentTimeline />
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <ActionItemsSidebar />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-30">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="lg"
            onClick={handleToggleMute}
            className="rounded-full w-12 h-12 p-0"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            variant={!isVideoOn ? "destructive" : "outline"}
            size="lg"
            onClick={handleToggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="lg"
            onClick={handleToggleScreenShare}
            className="rounded-full w-12 h-12 p-0"
          >
            <MonitorSpeaker className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndMeeting}
            className="rounded-full w-12 h-12 p-0"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleGenerateSummary}
            className="hidden lg:flex"
          >
            Generate Summary
          </Button>
        </div>
      </div>

      {showSummaryModal && <SummaryModal />}
    </div>
  );
};

export default LiveMeetingInterface;
