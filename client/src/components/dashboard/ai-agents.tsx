import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

// Agent status badge colors
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

// Agent icon background colors
const getAgentIconBgColor = (type: string) => {
  switch (type) {
    case 'matching':
      return 'bg-blue-100';
    case 'communication':
      return 'bg-purple-100';
    case 'document':
      return 'bg-yellow-100';
    case 'analysis':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
};

// Agent icon colors
const getAgentIconColor = (type: string) => {
  switch (type) {
    case 'matching':
      return 'text-primary';
    case 'communication':
      return 'text-purple-600';
    case 'document':
      return 'text-yellow-600';
    case 'analysis':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export function AiAgents() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ['/api/agents'],
    staleTime: 60000, // 1 minute
  });

  return (
    <Card className="h-full">
      <CardHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">AI Agents</CardTitle>
          <Button size="sm" variant="outline">
            <PlusCircle className="mr-1 h-4 w-4" /> Create
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading agents...</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {agents ? agents.map((agent: any) => (
                <li key={agent.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 ${getAgentIconBgColor(agent.agentType)} rounded-md flex items-center justify-center`}>
                        <Bot className={`h-5 w-5 ${getAgentIconColor(agent.agentType)}`} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-foreground">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getAgentStatusBadge(agent.status)}
                    </div>
                  </div>
                </li>
              )) : (
                <li className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">No agents found</p>
                </li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <a href="/ai-agents" className="text-sm font-medium text-primary hover:text-primary/80">
                Manage AI agents
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
