import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  UserCircle, 
  Megaphone, 
  FileText, 
  Calendar, 
  BarChart, 
  Link as LinkIcon, 
  Settings, 
  Rocket 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Accounts", href: "/accounts", icon: UserCircle },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Content Library", href: "/content", icon: FileText },
  { name: "Scheduler", href: "/scheduler", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Link Manager", href: "/links", icon: LinkIcon },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 hidden lg:block">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
            <Rocket className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">AutoPost Pro</h1>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
