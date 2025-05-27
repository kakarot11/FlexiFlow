import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Task status badge mapping
const getTaskStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge className="status-badge-pending">Pending</Badge>;
    case 'in-progress':
      return <Badge className="status-badge-in-progress">In Progress</Badge>;
    case 'completed':
      return <Badge className="status-badge-completed">Completed</Badge>;
    case 'overdue':
      return <Badge className="status-badge-overdue">Overdue</Badge>;
    case 'scheduled':
      return <Badge className="status-badge-scheduled">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Format date for display
const formatTaskDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return {
      date: 'Today',
      time: format(date, 'h:mm a')
    };
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return {
      date: 'Tomorrow',
      time: format(date, 'h:mm a')
    };
  } else {
    return {
      date: format(date, 'MMM d'),
      time: format(date, 'h:mm a')
    };
  }
};

export function UpcomingTasks() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['/api/tasks'],
    staleTime: 60000, // 1 minute
  });

  // For fetching workflow names
  const { data: workflows } = useQuery({
    queryKey: ['/api/workflows'],
    staleTime: 60000, // 1 minute
  });

  // Get workflow name by ID
  const getWorkflowName = (workflowId: number) => {
    if (!workflows) return "";
    const workflow = workflows.find((w: any) => w.id === workflowId);
    return workflow ? workflow.name : "";
  };

  return (
    <Card className="h-full">
      <CardHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Upcoming Tasks</CardTitle>
          <Button size="sm" variant="outline">
            <Filter className="mr-1 h-4 w-4" /> Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading tasks...</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Workflow
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {tasks && tasks.length > 0 ? (
                    tasks.map((task: any) => {
                      const formattedDate = task.dueDate ? formatTaskDate(task.dueDate) : { date: 'No date', time: '' };
                      return (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{task.title}</div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{formattedDate.date}</div>
                            <div className="text-sm text-muted-foreground">{formattedDate.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTaskStatusBadge(task.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {getWorkflowName(task.workflowId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href={`/tasks/${task.id}`} className="text-primary hover:text-primary/80">View</a>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border text-center">
              <a href="/tasks" className="text-sm font-medium text-primary hover:text-primary/80">
                View all tasks
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
