import { 
  LayoutDashboard, 
  GitBranch, 
  Bot, 
  Users, 
  Clock,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { WorkflowPerformance } from "@/components/dashboard/workflow-performance";
import { AiAgents } from "@/components/dashboard/ai-agents";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  // Fetch data for dashboard stats
  const { data: workflows } = useQuery({
    queryKey: ['/api/workflows'],
    staleTime: 60000, // 1 minute
  });
  
  const { data: agents } = useQuery({
    queryKey: ['/api/agents'],
    staleTime: 60000, // 1 minute
  });
  
  const { data: contacts } = useQuery({
    queryKey: ['/api/contacts'],
    staleTime: 60000, // 1 minute
  });
  
  const { data: tasks } = useQuery({
    queryKey: ['/api/tasks'],
    staleTime: 60000, // 1 minute
  });

  // Count active workflows
  const activeWorkflows = workflows ? workflows.filter((workflow: any) => workflow.status === "active").length : 0;
  
  // Calculate time saved (demo value)
  const timeSaved = "56 hrs";
  
  // Count active contacts
  const activeContacts = contacts ? contacts.filter((contact: any) => contact.status === "active").length : 0;
  
  // Count automated tasks
  const automatedTasks = 87; // Demo value
  
  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center">
            <span className="hidden md:block mr-3 text-sm text-muted-foreground">Domain: Real Estate</span>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Workflow
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Your CRM overview and performance metrics</p>
      </div>
      
      {/* Dashboard Content */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Workflows"
            value={activeWorkflows}
            icon={<GitBranch className="h-5 w-5 text-primary" />}
            iconBgColor="bg-blue-100"
            changePercentage={8}
            linkText="View all"
            linkHref="/workflows"
          />
          
          <StatCard
            title="Tasks Automated"
            value={automatedTasks}
            icon={<Bot className="h-5 w-5 text-accent" />}
            iconBgColor="bg-green-100"
            changePercentage={24}
            linkText="View all"
            linkHref="/tasks"
          />
          
          <StatCard
            title="Active Contacts"
            value={activeContacts}
            icon={<Users className="h-5 w-5 text-purple-600" />}
            iconBgColor="bg-purple-100"
            changePercentage={12}
            changeText="12% from last month"
            linkText="View all"
            linkHref="/contacts"
          />
          
          <StatCard
            title="Time Saved"
            value={timeSaved}
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            iconBgColor="bg-orange-100"
            changeText="This month"
            linkText="View details"
            linkHref="/reports"
          />
        </div>
        
        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          
          {/* Workflows Performance */}
          <div>
            <WorkflowPerformance />
          </div>
        </div>
        
        {/* AI Agents & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Agents */}
          <div>
            <AiAgents />
          </div>
          
          {/* Upcoming Tasks */}
          <div className="lg:col-span-2">
            <UpcomingTasks />
          </div>
        </div>
      </div>
    </div>
  );
}
