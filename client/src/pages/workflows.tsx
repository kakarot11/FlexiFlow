import { useState } from "react";
import {
  GitBranch,
  PlusCircle,
  Search,
  Filter,
  SortAsc,
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  Pencil,
  Trash2,
  Wand2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Workflows() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [workflowForm, setWorkflowForm] = useState({
    name: "",
    domain: "real-estate",
    description: ""
  });
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch workflows
  const { data: workflows, isLoading } = useQuery({
    queryKey: ["/api/workflows"],
    staleTime: 30000, // 30 seconds
  });

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflowData: any) => {
      return apiRequest("/api/workflows", {
        method: "POST",
        body: JSON.stringify(workflowData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      setCreateDialogOpen(false);
      setWorkflowForm({ name: "", domain: "real-estate", description: "" });
      setAiSuggestion(null);
      toast({
        title: "Workflow created",
        description: "Your workflow has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create workflow",
        variant: "destructive"
      });
    }
  });

  // AI suggestion mutation
  const aiSuggestionMutation = useMutation({
    mutationFn: async (data: { domain: string; description: string }) => {
      return apiRequest("/api/ai/suggest-workflow", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setAiSuggestion(data.workflow);
      toast({
        title: "AI Suggestion Generated",
        description: "Review the suggested workflow structure below."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI suggestion",
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowForm.name.trim() || !workflowForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    await createWorkflowMutation.mutateAsync(workflowForm);
  };

  // Handle AI suggestion
  const handleAiSuggestion = async () => {
    if (!workflowForm.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a workflow description for AI suggestions",
        variant: "destructive"
      });
      return;
    }

    await aiSuggestionMutation.mutateAsync({
      domain: workflowForm.domain,
      description: workflowForm.description
    });
  };

  // Apply AI suggestion
  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      setWorkflowForm(prev => ({
        ...prev,
        name: aiSuggestion.name,
        description: aiSuggestion.description
      }));
    }
  };

  // Filter workflows based on search and domain filter
  const filteredWorkflows = workflows
    ? workflows.filter((workflow: any) => {
        const matchesSearch =
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesDomain =
          filterDomain === "all" || workflow.domain === filterDomain;
        return matchesSearch && matchesDomain;
      })
    : [];

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Workflows</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Create a new workflow to automate your business processes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Workflow name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    Domain
                  </Label>
                  <Input
                    id="domain"
                    defaultValue="real-estate"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Workflow description"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Workflow</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your automated workflows and processes
        </p>
      </div>

      {/* Workflows Content */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search workflows..."
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
            <select
              className="border border-input rounded-md h-10 px-3 py-2 text-sm bg-background"
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
            >
              <option value="all">All Domains</option>
              <option value="real-estate">Real Estate</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Workflows Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading workflows...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.length > 0 ? (
              filteredWorkflows.map((workflow: any) => (
                <Card key={workflow.id} className="overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <GitBranch className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {workflow.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {workflow.description}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <PlayCircle className="mr-2 h-4 w-4" /> Run Workflow
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PauseCircle className="mr-2 h-4 w-4" /> Pause
                            Workflow
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Workflow
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Workflow
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant={
                          workflow.status === "active" ? "success" : "outline"
                        }
                      >
                        {workflow.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Domain: {workflow.domain}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Steps:</span>
                        <span className="font-medium">0/0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Performance:
                        </span>
                        <span className="font-medium text-green-600">90%</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center">
                <GitBranch className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No workflows found
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Create a new workflow to get started
                </p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Workflow
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
