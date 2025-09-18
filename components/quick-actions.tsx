'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  Calendar, 
  Search, 
  UserPlus, 
  ArrowRight 
} from 'lucide-react';

interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  link?: string;
  action?: () => void;
}

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = "" }) => {
  const actions: QuickActionItem[] = [
    {
      title: "Start New Meeting",
      description: "Begin an instant meeting with transcription",
      icon: Video,
      color: "default",
      link: "/dashboard/meeting"
    },
    {
      title: "Schedule Meeting",
      description: "Plan and invite participants",
      icon: Calendar,
      color: "outline",
      action: () => console.log('Schedule meeting modal')
    },
    {
      title: "Search Transcripts",
      description: "Find specific discussions or decisions",
      icon: Search,
      color: "outline",
      action: () => console.log('Search modal')
    },
    {
      title: "Invite Team",
      description: "Add team members to your workspace",
      icon: UserPlus,
      color: "outline",
      action: () => console.log('Invite modal')
    }
  ];

  return (
    <Card className={`bg-white border border-gray-200 shadow-md ${className}`}>
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
          <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions?.map((action, index) => (
            <div key={index} className="group">
              {action?.link ? (
                <Link href={action?.link}>
                  <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer min-h-[100px] justify-center">
                    <div className="p-3 bg-gray-50 text-gray-700 rounded-lg group-hover:bg-gray-100 transition-colors duration-200 mb-2">
                      <action.icon size={24} />
                    </div>
                    <h4 className="font-medium text-gray-900 text-center text-sm">
                      {action?.title}
                    </h4>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={action?.action}
                  className="w-full flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 min-h-[100px] justify-center"
                >
                  <div className="p-3 bg-gray-50 text-gray-700 rounded-lg group-hover:bg-gray-100 transition-colors duration-200 mb-2">
                    <action.icon size={24} />
                  </div>
                  <h4 className="font-medium text-gray-900 text-center text-sm">
                    {action?.title}
                  </h4>
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;