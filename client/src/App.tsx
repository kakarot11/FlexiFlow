import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppLayout from "@/components/layouts/app-layout";
import Dashboard from "@/pages/dashboard";
import Workflows from "@/pages/workflows";
import AiAgents from "@/pages/ai-agents";
import Tasks from "@/pages/tasks";
import Contacts from "@/pages/contacts";
import Settings from "@/pages/settings";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/workflows" component={Workflows} />
        <Route path="/ai-agents" component={AiAgents} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="flexcrm-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
