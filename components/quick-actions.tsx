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
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions?.map((action, index) => (
            <div key={index} className="group">
              {action?.link ? (
                <Link href={action?.link}>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <action.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                        {action?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action?.description}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                </Link>
              ) : (
                <button
                  onClick={action?.action}
                  className="w-full text-left flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    <action.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {action?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action?.description}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
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