import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  GitBranch, 
  Bot, 
  CheckSquare, 
  Users, 
  Calendar, 
  BarChartBig, 
  Settings, 
  HelpCircle,
  X
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and when window is resized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // Close sidebar when navigating on mobile
  const handleNavigation = () => {
    if (isMobile) {
      onClose();
    }
  };
  
  // Navigation items
  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="sidebar-icon" /> 
    },
    { 
      path: "/workflows", 
      label: "Workflows", 
      icon: <GitBranch className="sidebar-icon" /> 
    },
    { 
      path: "/ai-agents", 
      label: "AI Agents", 
      icon: <Bot className="sidebar-icon" /> 
    },
    { 
      path: "/tasks", 
      label: "Tasks", 
      icon: <CheckSquare className="sidebar-icon" /> 
    },
    { 
      path: "/contacts", 
      label: "Contacts", 
      icon: <Users className="sidebar-icon" /> 
    },
    { 
      path: "/calendar", 
      label: "Calendar", 
      icon: <Calendar className="sidebar-icon" /> 
    },
    { 
      path: "/reports", 
      label: "Reports", 
      icon: <BarChartBig className="sidebar-icon" /> 
    }
  ];
  
  // Settings and help
  const bottomNavItems = [
    { 
      path: "/settings", 
      label: "Settings", 
      icon: <Settings className="sidebar-icon" /> 
    },
    { 
      path: "/help", 
      label: "Help & Support", 
      icon: <HelpCircle className="sidebar-icon" /> 
    }
  ];

  const sidebarContainerClasses = `
    h-full
    ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out shadow-xl' : 'hidden md:flex md:flex-shrink-0 relative'}
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
  `;

  return (
    <div className={sidebarContainerClasses}>
      <div className="flex flex-col w-64 border-r border-border bg-sidebar">
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-border">
          <div className="text-xl font-display font-bold text-primary">FlexCRM</div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                onClick={handleNavigation}
              >
                <a className={`sidebar-item ${location === item.path ? 'active' : ''}`}>
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="px-2 space-y-1">
            <Separator className="my-4" />
            {bottomNavItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                onClick={handleNavigation}
              >
                <a className={`sidebar-item ${location === item.path ? 'active' : ''}`}>
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            ))}
            
            {/* Theme toggle */}
            <div className="px-2 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Dark Mode</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? "Turn Off" : "Turn On"}
                </Button>
              </div>
            </div>
            
            {/* Domain indicator */}
            <div className="px-2 pt-2 pb-4">
              <span className="text-xs text-muted-foreground block">Domain: Real Estate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
