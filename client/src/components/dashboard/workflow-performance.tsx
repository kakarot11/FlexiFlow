import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

// Performance gauge colors
const getPerformanceColor = (percentage: number) => {
  if (percentage >= 80) return "bg-accent";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-red-500";
};

// Performance text colors
const getPerformanceTextColor = (percentage: number) => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 70) return "text-yellow-600";
  return "text-red-600";
};

export function WorkflowPerformance() {
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['/api/workflows'],
    staleTime: 60000, // 1 minute
  });

  // Demo performance data (in a real app, this would come from the backend)
  const performanceData = [
    { id: 1, name: 'Lead Qualification', performance: 93 },
    { id: 2, name: 'Property Matching', performance: 87 },
    { id: 3, name: 'Closing Process', performance: 76 },
    { id: 4, name: 'After-Sale Follow Up', performance: 82 },
    { id: 5, name: 'Client Onboarding', performance: 64 }
  ];

  // Map performance data to workflows if available
  const workflowPerformance = workflows ? workflows.map((workflow: any, index: number) => ({
    id: workflow.id,
    name: workflow.name,
    performance: performanceData[index % performanceData.length].performance
  })) : performanceData;

  return (
    <Card className="h-full">
      <CardHeader className="px-6 py-5 border-b border-border">
        <CardTitle className="text-lg font-medium">Workflow Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading performance data...</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {workflowPerformance.map((workflow: any) => (
                <li key={workflow.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {workflow.name}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`text-sm font-semibold ${getPerformanceTextColor(workflow.performance)}`}>
                        {workflow.performance}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${getPerformanceColor(workflow.performance)} h-2 rounded-full`} 
                      style={{ width: `${workflow.performance}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <a href="/workflows" className="text-sm font-medium text-primary hover:text-primary/80">
                View workflow analytics
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
