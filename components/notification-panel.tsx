'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Clock, 
  FileText, 
  Zap, 
  Bell 
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'action_item' | 'meeting_reminder' | 'transcript_ready' | 'integration';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

interface NotificationPanelProps {
  className?: string;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ className = "" }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'action_item',
      title: "Action Item Due",
      message: "Follow up with client feedback from yesterday's meeting",
      time: "2 hours ago",
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'meeting_reminder',
      title: "Meeting Starting Soon",
      message: "Weekly team standup starts in 15 minutes",
      time: "15 minutes",
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'transcript_ready',
      title: "Transcript Available",
      message: "Meeting transcript for 'Product Planning' is ready for review",
      time: "1 hour ago",
      priority: 'low',
      read: true
    },
    {
      id: 4,
      type: 'integration',
      title: "Slack Integration",
      message: "Successfully synced 3 task assignments to your Slack workspace",
      time: "3 hours ago",
      priority: 'low',
      read: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'action_item':
        return CheckSquare;
      case 'meeting_reminder':
        return Clock;
      case 'transcript_ready':
        return FileText;
      case 'integration':
        return Zap;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev?.map(notif =>
        notif?.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <Card className={`bg-white border border-gray-200 shadow-md ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
            {unreadCount > 0 && (
              <div className="px-2 py-1 bg-gray-700 text-white text-xs font-medium rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications?.length === 0 ? (
            <div className="text-center py-8">
              <Bell size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications?.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification?.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors duration-200 cursor-pointer hover:bg-gray-50 hover:shadow-sm ${
                    notification?.read
                      ? 'border-gray-200 bg-transparent' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  onClick={() => markAsRead(notification?.id)}
                >
                  <div className={`p-2 rounded-lg border ${getPriorityColor(notification?.priority)}`}>
                    <IconComponent size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-medium text-sm ${
                        notification?.read ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification?.title}
                      </h4>
                      {!notification?.read && (
                        <div className="w-2 h-2 bg-gray-700 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification?.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification?.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {notifications?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Bell className="w-4 h-4 mr-2" />
              View All Notifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;