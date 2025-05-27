import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Lock,
  Bell, 
  Palette, 
  Globe, 
  Mail,
  CreditCard,
  Database,
  CheckIcon,
  AlarmClock,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ui/theme-provider";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  
  // Get user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/session'],
    staleTime: 60000 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  // Demo handler for form submit
  const handleSaveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
      duration: 3000,
    });
  };
  
  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and application settings</p>
      </div>
      
      {/* Settings Content */}
      <div className="px-4 sm:px-6 md:px-8">
        <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <TabsList className="flex flex-col items-start space-y-1 h-auto bg-transparent">
                    <TabsTrigger 
                      value="account" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="organization" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Organization
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appearance" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="domains" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Domains & Templates
                    </TabsTrigger>
                    <TabsTrigger 
                      value="integrations" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Integrations
                    </TabsTrigger>
                    <TabsTrigger 
                      value="billing" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai-settings" 
                      className="w-full justify-start px-2 py-1.5 h-9 font-normal"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      AI Settings
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Free Trial</p>
                    <Badge className="bg-primary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your trial ends in 14 days.
                  </p>
                  <Button className="w-full" variant="outline">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              {/* Account Settings */}
              <TabsContent value="account" className="mt-0">
                <Card>
                  <form onSubmit={handleSaveSettings}>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account information and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={user?.fullName || "Demo User"} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue={user?.username || "demo"} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" defaultValue={user?.email || "demo@example.com"} />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>Account Preferences</Label>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="timezone">Timezone</Label>
                              <p className="text-sm text-muted-foreground">
                                Set your local timezone for accurate scheduling
                              </p>
                            </div>
                            <Select defaultValue="America/New_York">
                              <SelectTrigger className="w-[240px]">
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive email notifications for important updates
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Appearance Settings */}
              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the application looks and feels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Theme</Label>
                          <p className="text-sm text-muted-foreground">
                            Select a theme for the application
                          </p>
                        </div>
                        <Select 
                          value={theme} 
                          onValueChange={setTheme}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sidebar Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Use smaller sidebar for more screen space
                          </p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>High Contrast Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Default Domain</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Set the default domain for new workflows and templates
                        </p>
                        <Select defaultValue="real-estate">
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* AI Settings */}
              <TabsContent value="ai-settings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Settings</CardTitle>
                    <CardDescription>
                      Configure AI settings and API keys for workflow automation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="openai-key">OpenAI API Key</Label>
                        <Input 
                          id="openai-key" 
                          type="password" 
                          placeholder="sk-..." 
                          defaultValue="••••••••••••••••••••••••••••••"
                        />
                        <p className="text-xs text-muted-foreground">
                          Required for AI agents and workflow automation
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Default AI Model</Label>
                          <p className="text-sm text-muted-foreground">
                            Select the default AI model for new agents
                          </p>
                        </div>
                        <Select defaultValue="gpt-4o">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <Label>AI Agent Settings</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Document Processing</span>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Email Drafting</span>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Market Analysis</span>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Client Matching</span>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>AI Usage Limit</Label>
                            <p className="text-sm text-muted-foreground">
                              Set a monthly usage limit for AI API calls
                            </p>
                          </div>
                          <Select defaultValue="unlimited">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select limit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low ($10/mo)</SelectItem>
                              <SelectItem value="medium">Medium ($25/mo)</SelectItem>
                              <SelectItem value="high">High ($50/mo)</SelectItem>
                              <SelectItem value="unlimited">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="space-y-0.5">
                            <Label>AI Usage Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive alerts when approaching usage limits
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Other Settings Tabs */}
              {["organization", "security", "notifications", "domains", "integrations", "billing"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <Card className="py-20">
                    <div className="text-center">
                      <SettingsIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium text-foreground capitalize">{tab} Settings</h3>
                      <p className="mt-2 text-muted-foreground">This section is under development.</p>
                      <Button className="mt-4" onClick={() => setActiveTab("account")}>
                        Back to Account Settings
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
