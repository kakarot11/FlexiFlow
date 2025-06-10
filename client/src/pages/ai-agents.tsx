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
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { apiRequest, queryClient } from "@/lib/queryClient";

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
      triggerEvents: [] as string[]
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
      return await apiRequest("PATCH", `/api/agents/${id}`, data);
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
      return await apiRequest("DELETE", `/api/agents/${id}`);
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
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
              <form onSubmit={handleCreateAgent}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent-name" className="text-right">
                      Name
                    </Label>
                    <Input 
                      id="agent-name" 
                      placeholder="Agent name" 
                      className="col-span-3"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent-type" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={agentForm.agentType}
                      onValueChange={(value) => setAgentForm(prev => ({ ...prev, agentType: value }))}
                    >
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
                      value={agentForm.description}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent-model" className="text-right">
                      AI Model
                    </Label>
                    <Select 
                      value={agentForm.config.model}
                      onValueChange={(value) => setAgentForm(prev => ({ 
                        ...prev, 
                        config: { ...prev.config, model: value }
                      }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAgentMutation.isPending}
                  >
                    {createAgentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Agent'
                    )}
                  </Button>
                </DialogFooter>
              </form>
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
                            <DropdownMenuItem onClick={() => handleConfigureAgent(agent)}>
                              <Cog className="mr-2 h-4 w-4" /> Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <PlayCircle className="mr-2 h-4 w-4" /> Run Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConfigureAgent(agent)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteAgent(agent.id)}
                            >
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleConfigureAgent(agent)}
                        >
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
                <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Agent
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Configuration Dialog */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure AI Agent</DialogTitle>
              <DialogDescription>
                Advanced settings for {selectedAgent?.name}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ai-config">AI Settings</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="config-name" className="text-right">Name</Label>
                    <Input 
                      id="config-name"
                      className="col-span-3"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="config-description" className="text-right">Description</Label>
                    <Textarea 
                      id="config-description"
                      className="col-span-3"
                      rows={3}
                      value={agentForm.description}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="config-type" className="text-right">Type</Label>
                    <Select 
                      value={agentForm.agentType}
                      onValueChange={(value) => setAgentForm(prev => ({ ...prev, agentType: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
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
                    <Label htmlFor="config-status" className="text-right">Status</Label>
                    <Select 
                      value={agentForm.status}
                      onValueChange={(value) => setAgentForm(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="needs-config">Needs Configuration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-config" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="config-model" className="text-right">AI Model</Label>
                    <Select 
                      value={agentForm.config.model}
                      onValueChange={(value) => setAgentForm(prev => ({ 
                        ...prev, 
                        config: { ...prev.config, model: value }
                      }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="config-temperature" className="text-right">
                      Temperature ({agentForm.config.temperature})
                    </Label>
                    <div className="col-span-3">
                      <Slider
                        value={[agentForm.config.temperature]}
                        onValueChange={([value]) => setAgentForm(prev => ({ 
                          ...prev, 
                          config: { ...prev.config, temperature: value }
                        }))}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Creative</span>
                        <span>Focused</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="config-max-tokens" className="text-right">Max Tokens</Label>
                    <Input 
                      id="config-max-tokens"
                      type="number"
                      className="col-span-3"
                      value={agentForm.config.maxTokens}
                      onChange={(e) => setAgentForm(prev => ({ 
                        ...prev, 
                        config: { ...prev.config, maxTokens: parseInt(e.target.value) || 1000 }
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="config-system-prompt" className="text-right pt-2">
                      System Prompt
                    </Label>
                    <Textarea 
                      id="config-system-prompt"
                      className="col-span-3"
                      rows={5}
                      placeholder="Define the agent's role, behavior, and instructions..."
                      value={agentForm.config.systemPrompt}
                      onChange={(e) => setAgentForm(prev => ({ 
                        ...prev, 
                        config: { ...prev.config, systemPrompt: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automation" className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-run Agent</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically execute this agent when triggered
                      </p>
                    </div>
                    <Switch
                      checked={agentForm.config.autoRun}
                      onCheckedChange={(checked) => setAgentForm(prev => ({ 
                        ...prev, 
                        config: { ...prev.config, autoRun: checked }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger Events</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'workflow_started',
                        'task_created',
                        'contact_added',
                        'email_received'
                      ].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={event}
                            checked={agentForm.config.triggerEvents.includes(event)}
                            onChange={(e) => {
                              const events = agentForm.config.triggerEvents;
                              const newEvents = e.target.checked 
                                ? [...events, event]
                                : events.filter(e => e !== event);
                              setAgentForm(prev => ({ 
                                ...prev, 
                                config: { ...prev.config, triggerEvents: newEvents }
                              }));
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={event} className="text-sm font-normal">
                            {event.replace('_', ' ').toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfigDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveConfiguration}
                disabled={updateAgentMutation.isPending}
              >
                {updateAgentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
