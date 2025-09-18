'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Clock, 
  Heart, 
  CheckSquare, 
  Video, 
  Calendar, 
  FileText, 
  MoreHorizontal 
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  status: 'live' | 'scheduled' | 'completed';
  date: string;
  participants: number;
  duration: string;
  sentiment?: number;
  actionItems?: number;
}

interface RecentMeetingCardProps {
  meeting: Meeting;
}

const RecentMeetingCard: React.FC<RecentMeetingCardProps> = ({ meeting }) => {
  const getStatusColor = () => {
    switch (meeting?.status) {
      case 'live':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'completed':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getSentimentColor = () => {
    if (meeting?.sentiment && meeting.sentiment >= 0.7) return 'text-green-600 dark:text-green-400';
    if (meeting?.sentiment && meeting.sentiment >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-foreground">{meeting?.title}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
                {meeting?.status === 'live' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                )}
                {meeting?.status !== 'live' && (
                  <span className="capitalize">{meeting?.status}</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{formatDate(meeting?.date)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{meeting?.participants} participants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{meeting?.duration}</span>
          </div>
          {meeting?.sentiment && (
            <div className="flex items-center space-x-1">
              <Heart size={14} className={getSentimentColor()} />
              <span className={getSentimentColor()}>
                {Math.round(meeting?.sentiment * 100)}% positive
              </span>
            </div>
          )}
        </div>
        
        {meeting?.actionItems && meeting.actionItems > 0 && (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
            <CheckSquare size={14} />
            <span>{meeting?.actionItems} task assignments</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {meeting?.status === 'live' && (
            <Link href="/dashboard/meeting" className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                <Video className="w-4 h-4 mr-2" />
                Join Meeting
              </Button>
            </Link>
          )}
          {meeting?.status === 'scheduled' && (
            <Link href="/dashboard/meeting" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Start Meeting
              </Button>
            </Link>
          )}
          {meeting?.status === 'completed' && (
            <Link href="/dashboard/history" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMeetingCard;