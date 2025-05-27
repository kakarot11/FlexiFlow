import { useState } from "react";
import { 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  SortAsc,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MoreHorizontal,
  MessageSquare,
  Calendar,
  GitBranch,
  FileText,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewType, setViewType] = useState("grid");
  
  // Fetch contacts
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['/api/contacts'],
    staleTime: 30000, // 30 seconds
  });
  
  // Filter contacts based on search and type filter
  const filteredContacts = contacts ? contacts.filter((contact: any) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.address && contact.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || contact.type === filterType;
    return matchesSearch && matchesType;
  }) : [];
  
  // Get contact initials for avatar
  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get background color for avatar based on contact type
  const getAvatarBgColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-primary text-primary-foreground';
      case 'lead':
        return 'bg-purple-500 text-white';
      case 'vendor':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };
  
  // Get badge for contact type
  const getContactTypeBadge = (type: string) => {
    switch (type) {
      case 'client':
        return <Badge variant="default">Client</Badge>;
      case 'lead':
        return <Badge variant="secondary">Lead</Badge>;
      case 'vendor':
        return <Badge variant="outline">Vendor</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact to your CRM system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-name" className="text-right">
                    Name
                  </Label>
                  <Input id="contact-name" placeholder="Full name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-email" className="text-right">
                    Email
                  </Label>
                  <Input id="contact-email" type="email" placeholder="Email address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="contact-phone" placeholder="Phone number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-address" className="text-right">
                    Address
                  </Label>
                  <Input id="contact-address" placeholder="Address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-type" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea 
                    id="contact-notes" 
                    placeholder="Additional notes" 
                    className="col-span-3" 
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Manage your clients, leads, and business contacts</p>
      </div>
      
      {/* Contacts Content */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search contacts..."
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
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="lead">Leads</SelectItem>
                <SelectItem value="vendor">Vendors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* View Tabs */}
        <Tabs value={viewType} onValueChange={setViewType} className="mb-6">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Contacts Display */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading contacts...</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <TabsContent value="grid" className="mt-0">
              {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContacts.map((contact: any) => (
                    <Card key={contact.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className={`h-12 w-12 ${getAvatarBgColor(contact.type)}`}>
                              <AvatarFallback>{getContactInitials(contact.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-foreground">{contact.name}</h3>
                              <div className="flex items-center mt-1">
                                {getContactTypeBadge(contact.type)}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {contact.status === "active" ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <GitBranch className="mr-2 h-4 w-4" /> Add to Workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Contact
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                          {contact.email && (
                            <div className="flex items-center text-sm">
                              <MailIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground">{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center text-sm">
                              <PhoneIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground">{contact.phone}</span>
                            </div>
                          )}
                          {contact.address && (
                            <div className="flex items-start text-sm">
                              <MapPinIcon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                              <span className="text-foreground">{contact.address}</span>
                            </div>
                          )}
                        </div>
                        
                        {contact.notes && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">{contact.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-border flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="mr-2 h-4 w-4" /> Message
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Calendar className="mr-2 h-4 w-4" /> Schedule
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">No contacts found</h3>
                  <p className="mt-1 text-muted-foreground">Add a new contact to get started</p>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* List View */}
            <TabsContent value="list" className="mt-0">
              <Card>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Notes
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact: any) => (
                          <tr key={contact.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className={`h-8 w-8 mr-3 ${getAvatarBgColor(contact.type)}`}>
                                  <AvatarFallback>{getContactInitials(contact.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium text-foreground">{contact.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {contact.status === "active" ? "Active" : "Inactive"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-foreground">
                                {contact.email && (
                                  <div className="flex items-center mb-1">
                                    <MailIcon className="h-3 w-3 text-muted-foreground mr-2" />
                                    {contact.email}
                                  </div>
                                )}
                                {contact.phone && (
                                  <div className="flex items-center">
                                    <PhoneIcon className="h-3 w-3 text-muted-foreground mr-2" />
                                    {contact.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getContactTypeBadge(contact.type)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {contact.notes || "No notes"}
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
                                  <DropdownMenuItem>
                                    <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <GitBranch className="mr-2 h-4 w-4" /> Add to Workflow
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" /> View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Contact
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                            No contacts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </>
        )}
      </div>
    </div>
  );
}
