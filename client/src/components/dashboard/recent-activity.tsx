import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  ChartGantt, 
  Users, 
  Calendar,
  Layers
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Activity type icons mapping
const activityTypeIcons = {
  "ai-agent": <Bot className="h-4 w-4" />,
  "workflow": <ChartGantt className="h-4 w-4" />,
  "contact": <Users className="h-4 w-4" />,
  "calendar": <Calendar className="h-4 w-4" />,
  "task": <Layers className="h-4 w-4" />
};

// Activity type background colors
const activityTypeBgColors = {
  "ai-agent": "bg-blue-100 text-primary",
  "workflow": "bg-green-100 text-accent",
  "contact": "bg-purple-100 text-purple-600",
  "calendar": "bg-yellow-100 text-yellow-600",
  "task": "bg-orange-100 text-orange-500"
};

// Filter options
type ActivityFilter = "all" | "workflows" | "contacts" | "tasks";

export function RecentActivity() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities'],
    staleTime: 60000, // 1 minute
  });

  // Apply filter to activities
  const filteredActivities = activities ? activities.filter((activity: any) => {
    if (filter === "all") return true;
    if (filter === "workflows") return activity.workflowId !== null;
    if (filter === "contacts") return activity.contactId !== null;
    if (filter === "tasks") return activity.taskId !== null;
    return true;
  }) : [];

  // Format relative time
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return "yesterday";
    
    return activityDate.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <div className="flex space-x-3">
            <button 
              type="button" 
              className={`px-3 py-2 text-sm font-medium ${filter === "all" ? "tab-active" : "tab-button"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button 
              type="button" 
              className={`px-3 py-2 text-sm font-medium ${filter === "workflows" ? "tab-active" : "tab-button"}`}
              onClick={() => setFilter("workflows")}
            >
              Workflows
            </button>
            <button 
              type="button" 
              className={`px-3 py-2 text-sm font-medium ${filter === "contacts" ? "tab-active" : "tab-button"}`}
              onClick={() => setFilter("contacts")}
            >
              Contacts
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading activities...</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {filteredActivities.length > 0 ? (
                filteredActivities.slice(0, 4).map((activity: any) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activityTypeBgColors[activity.activityType] || "bg-gray-100"}`}>
                          {activityTypeIcons[activity.activityType] || <Layers className="h-4 w-4" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground" dangerouslySetInnerHTML={{ __html: activity.description }}></p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">No activities found</p>
                </li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <a href="/activities" className="text-sm font-medium text-primary hover:text-primary/80">
                View all activity
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
