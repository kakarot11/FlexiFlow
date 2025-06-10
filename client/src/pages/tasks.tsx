import { useState } from "react";
import { 
  CheckSquare, 
  PlusCircle, 
  Search, 
  Filter, 
  SortAsc,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Circle,
  User,
  GitBranch,
  Loader2,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewType, setViewType] = useState("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    workflowId: "",
    contactId: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['/api/tasks'],
    staleTime: 30000, // 30 seconds
  });

  // Fetch workflows for task assignment
  const { data: workflows } = useQuery({
    queryKey: ['/api/workflows'],
    staleTime: 30000,
  });

  // Fetch contacts for task assignment
  const { data: contacts } = useQuery({
    queryKey: ['/api/contacts'],
    staleTime: 30000,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setCreateDialogOpen(false);
      setTaskForm({ title: "", description: "", priority: "medium", status: "pending", dueDate: "", workflowId: "", contactId: "" });
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive"
      });
    }
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "Task status has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a task title",
        variant: "destructive"
      });
      return;
    }
    
    await createTaskMutation.mutateAsync(taskForm);
  };

  // Handle task status toggle
  const handleStatusToggle = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    await updateTaskMutation.mutateAsync({ id: taskId, status: newStatus });
  };
  
  // Filter tasks based on search and status filter
  const filteredTasks = tasks ? tasks.filter((task: any) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) : [];
  
  // Get workflow name by ID
  const getWorkflowName = (workflowId: number) => {
    if (!workflows) return "";
    const workflow = workflows.find((w: any) => w.id === workflowId);
    return workflow ? workflow.name : "";
  };
  
  // Get contact name by ID
  const getContactName = (contactId: number) => {
    if (!contacts || !contactId) return "";
    const contact = contacts.find((c: any) => c.id === contactId);
    return contact ? contact.name : "";
  };
  
  // Get task status icon and color
  const getTaskStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { 
          icon: <CheckCircle2 className="h-4 w-4 text-green-600" />, 
          badge: <Badge className="status-badge-completed">Completed</Badge>
        };
      case 'in-progress':
        return { 
          icon: <Clock className="h-4 w-4 text-blue-600" />, 
          badge: <Badge className="status-badge-in-progress">In Progress</Badge>
        };
      case 'overdue':
        return { 
          icon: <AlertCircle className="h-4 w-4 text-red-600" />, 
          badge: <Badge className="status-badge-overdue">Overdue</Badge>
        };
      case 'scheduled':
        return { 
          icon: <Calendar className="h-4 w-4 text-purple-600" />, 
          badge: <Badge className="status-badge-scheduled">Scheduled</Badge>
        };
      case 'pending':
      default:
        return { 
          icon: <Circle className="h-4 w-4 text-yellow-600" />, 
          badge: <Badge className="status-badge-pending">Pending</Badge>
        };
    }
  };
  
  // Format due date for display
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    if (dateOnly.getTime() === today.getTime()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };
  
  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a new task and assign it to a workflow or contact.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-title" className="text-right">
                    Title
                  </Label>
                  <Input id="task-title" placeholder="Task title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-description" className="text-right">
                    Description
                  </Label>
                  <Textarea 
                    id="task-description" 
                    placeholder="Task description" 
                    className="col-span-3" 
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-status" className="text-right">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-due-date" className="text-right">
                    Due Date
                  </Label>
                  <Input 
                    id="task-due-date" 
                    type="datetime-local" 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-workflow" className="text-right">
                    Workflow
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows && workflows.map((workflow: any) => (
                        <SelectItem key={workflow.id} value={workflow.id.toString()}>
                          {workflow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-contact" className="text-right">
                    Contact
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts && contacts.map((contact: any) => (
                        <SelectItem key={contact.id} value={contact.id.toString()}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Manage your tasks and assignments</p>
      </div>
      
      {/* Tasks Content */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
            <Select 
              value={filterStatus} 
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* View Tabs */}
        <Tabs value={viewType} onValueChange={setViewType} className="mb-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Tasks List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tasks...</p>
          </div>
        ) : (
          <div>
            <TabsContent value="list" className="mt-0">
              <Card>
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
                          Assigned To
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
                      {filteredTasks.length > 0 ? (
                        filteredTasks.map((task: any) => {
                          const statusDisplay = getTaskStatusDisplay(task.status);
                          return (
                            <tr key={task.id}>
                              <td className="px-6 py-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {statusDisplay.icon}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-foreground">{task.title}</div>
                                    <div className="text-sm text-muted-foreground">{task.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-foreground">{formatDueDate(task.dueDate)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {statusDisplay.badge}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm text-foreground">
                                    {getContactName(task.contactId) || "Unassigned"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm text-foreground">
                                    {getWorkflowName(task.workflowId) || "None"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                    <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                            No tasks found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
            
            {/* Kanban View (Placeholder) */}
            <TabsContent value="kanban">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Pending</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-background rounded border border-border">
                      <p className="font-medium text-foreground">Follow up with John Smith</p>
                      <p className="text-sm text-muted-foreground">Regarding property viewing feedback</p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge className="status-badge-pending">Pending</Badge>
                        <span className="text-xs text-muted-foreground">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">In Progress</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-background rounded border border-border">
                      <p className="font-medium text-foreground">Send contract to Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Purchase agreement for 123 Main St</p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge className="status-badge-in-progress">In Progress</Badge>
                        <span className="text-xs text-muted-foreground">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Scheduled</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-background rounded border border-border">
                      <p className="font-medium text-foreground">Update property listing</p>
                      <p className="text-sm text-muted-foreground">789 Pine Street - Price reduction</p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge className="status-badge-scheduled">Scheduled</Badge>
                        <span className="text-xs text-muted-foreground">Tomorrow</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Completed</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-background rounded border border-border opacity-70">
                      <p className="font-medium text-foreground">Initial consultation with James Wilson</p>
                      <p className="text-sm text-muted-foreground">First-time homebuyer discussion</p>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge className="status-badge-completed">Completed</Badge>
                        <span className="text-xs text-muted-foreground">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Calendar View (Placeholder) */}
            <TabsContent value="calendar">
              <div className="bg-card p-8 rounded-lg border border-border text-center">
                <Calendar className="h-16 w-16 mx-auto text-primary" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Calendar View</h3>
                <p className="mt-2 text-muted-foreground">Calendar view will be available soon.</p>
              </div>
            </TabsContent>
          </div>
        )}
      </div>
    </div>
  );
}
