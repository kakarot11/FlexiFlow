import { useState } from "react";
import { 
  Bot, 
  PlusCircle, 
  Search, 
  Filter, 
  Settings,
  MoreHorizontal,
  PlayCircle,
  Trash2,
  Cog,
  Pencil,
  Loader2,
  Brain,
  MessageSquare,
  Zap,
  Sliders,
  Activity,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

export default function AiAgents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agentForm, setAgentForm] = useState({
    name: "",
    description: "",
    agentType: "communication",
    status: "active",
    config: {
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: "",
      autoRun: false,
      triggerEvents: []
    }
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch AI agents
  const { data: agents, isLoading } = useQuery({
    queryKey: ['/api/agents'],
    staleTime: 30000, // 30 seconds
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: async (agentData: any) => {
      return await apiRequest("POST", "/api/agents", agentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setCreateDialogOpen(false);
      resetForm();
      toast({
        title: "AI Agent created",
        description: "Your AI agent has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI agent",
        variant: "destructive"
      });
    }
  });

  // Update agent mutation
  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/agents/${id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setConfigDialogOpen(false);
      setSelectedAgent(null);
      toast({
        title: "Agent updated",
        description: "AI agent configuration has been saved."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update agent",
        variant: "destructive"
      });
    }
  });

  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/agents/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Agent deleted",
        description: "AI agent has been removed successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent",
        variant: "destructive"
      });
    }
  });

  // Reset form function
  const resetForm = () => {
    setAgentForm({
      name: "",
      description: "",
      agentType: "communication",
      status: "active",
      config: {
        model: "gpt-4o",
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: "",
        autoRun: false,
        triggerEvents: []
      }
    });
  };

  // Handle form submission
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name.trim() || !agentForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    await createAgentMutation.mutateAsync(agentForm);
  };

  // Handle configure agent
  const handleConfigureAgent = (agent: any) => {
    setSelectedAgent(agent);
    setAgentForm({
      name: agent.name,
      description: agent.description,
      agentType: agent.agentType,
      status: agent.status,
      config: {
        model: agent.config?.model || "gpt-4o",
        temperature: agent.config?.temperature || 0.7,
        maxTokens: agent.config?.maxTokens || 1000,
        systemPrompt: agent.config?.systemPrompt || "",
        autoRun: agent.config?.autoRun || false,
        triggerEvents: agent.config?.triggerEvents || []
      }
    });
    setConfigDialogOpen(true);
  };

  // Handle save configuration
  const handleSaveConfiguration = async () => {
    if (!selectedAgent) return;
    
    await updateAgentMutation.mutateAsync({
      id: selectedAgent.id,
      data: agentForm
    });
  };

  // Handle delete agent
  const handleDeleteAgent = async (agentId: number) => {
    if (confirm("Are you sure you want to delete this AI agent? This action cannot be undone.")) {
      await deleteAgentMutation.mutateAsync(agentId);
    }
  };
  
  // Filter agents based on search and type filter
  const filteredAgents = agents && Array.isArray(agents) ? agents.filter((agent: any) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || agent.agentType === filterType;
    return matchesSearch && matchesType;
  }) : [];

  // Agent type icon and background mapping
  const getAgentTypeDisplay = (type: string) => {
    switch (type) {
      case 'matching':
        return { bg: 'bg-blue-100', color: 'text-primary' };
      case 'communication':
        return { bg: 'bg-purple-100', color: 'text-purple-600' };
      case 'document':
        return { bg: 'bg-yellow-100', color: 'text-yellow-600' };
      case 'analysis':
        return { bg: 'bg-red-100', color: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  // Agent status display
  const getAgentStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'needs-config':
        return <Badge variant="destructive">Needs Config</Badge>;
      case 'inactive':
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };
  
  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">AI Agents</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New AI Agent</DialogTitle>
                <DialogDescription>
                  Configure a new AI agent to automate tasks in your workflow.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-name" className="text-right">
                    Name
                  </Label>
                  <Input id="agent-name" placeholder="Agent name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-type" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matching">Matching</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="document">Document Processing</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-description" className="text-right">
                    Description
                  </Label>
                  <Textarea 
                    id="agent-description" 
                    placeholder="What does this agent do?" 
                    className="col-span-3" 
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-model" className="text-right">
                    AI Model
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select AI model" defaultValue="gpt-4o" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Agent</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage AI agents to automate your business processes</p>
      </div>
      
      {/* AI Agents Content */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search agents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Select 
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="matching">Matching</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="document">Document Processing</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Agents Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading AI agents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent: any) => {
                const agentType = getAgentTypeDisplay(agent.agentType);
                return (
                  <Card key={agent.id} className="overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 ${agentType.bg} rounded-md flex items-center justify-center`}>
                            <Bot className={`h-5 w-5 ${agentType.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{agent.name}</h3>
                            <p className="text-sm text-muted-foreground">{agent.description}</p>
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
                              <PlayCircle className="mr-2 h-4 w-4" /> Run Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" /> Edit Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Cog className="mr-2 h-4 w-4" /> Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Agent
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        {getAgentStatusBadge(agent.status)}
                        <span className="text-xs text-muted-foreground">Type: {agent.agentType}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tasks Completed:</span>
                          <span className="font-medium">24</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Success Rate:</span>
                          <span className="font-medium text-green-600">93%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Model:</span>
                          <span className="font-medium">{agent.config?.model || "gpt-4o"}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="mr-2 h-4 w-4" /> Configure
                        </Button>
                        <Button size="sm" className="flex-1">
                          <PlayCircle className="mr-2 h-4 w-4" /> Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No AI agents found</h3>
                <p className="mt-1 text-muted-foreground">Create a new AI agent to start automating tasks</p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Agent
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
