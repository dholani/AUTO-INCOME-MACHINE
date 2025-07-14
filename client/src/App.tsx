import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Accounts from "@/pages/accounts";
import Campaigns from "@/pages/campaigns";
import Content from "@/pages/content";
import Scheduler from "@/pages/scheduler";
import Analytics from "@/pages/analytics";
import Links from "@/pages/links";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/accounts" component={Accounts} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/content" component={Content} />
      <Route path="/scheduler" component={Scheduler} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/links" component={Links} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen flex bg-slate-50">
          <Sidebar />
          <div className="flex-1 overflow-hidden">
            <Header />
            <main className="p-6 overflow-y-auto h-full">
              <Router />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
