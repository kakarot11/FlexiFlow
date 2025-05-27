import { useState } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ui/theme-provider";
import { useQuery } from "@tanstack/react-query";

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/session'],
    staleTime: 60000 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-card border-b border-border">
      <button
        type="button"
        className="px-4 md:hidden text-muted-foreground hover:text-foreground"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <form
            className="w-full flex md:ml-0"
            onSubmit={handleSearch}
          >
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-muted-foreground focus-within:text-foreground">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="search-field"
                className="block w-full h-full pl-10 pr-3 py-2 border-transparent bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Theme toggle button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Notification button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          {/* User dropdown */}
          <div className="ml-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center max-w-xs rounded-full focus:outline-none">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile picture" />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-foreground hidden md:block">
                    {user?.fullName || "User"}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
