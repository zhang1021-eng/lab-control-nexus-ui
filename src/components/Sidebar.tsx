
import { useState } from "react";
import { 
  Activity, 
  Cpu, 
  Gauge, 
  Home, 
  Power, 
  Radio, 
  Thermometer, 
  Video, 
  Zap, 
  MenuIcon, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import StatusIndicator from "./StatusIndicator";
import { useConnectionStatus } from "@/hooks/useMockData";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const isConnected = useConnectionStatus();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md border"
      >
        {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-border",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">实验室控制中心</h2>
            <button onClick={toggleSidebar} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarItem icon={<Home />} label="仪表盘" href="#" />
            <SidebarItem icon={<Thermometer />} label="传感器监控" href="#sensor-monitor" />
            <SidebarItem icon={<Cpu />} label="GPIO 控制" href="#gpio-control" />
            <SidebarItem icon={<Power />} label="直流电源" href="#power-supply" />
            <SidebarItem icon={<Gauge />} label="万用表" href="#multimeter" />
            <SidebarItem icon={<Radio />} label="信号发生器" href="#signal-generator" />
            <SidebarItem icon={<Activity />} label="示波器" href="#oscilloscope" />
            <SidebarItem icon={<Video />} label="摄像头" href="#camera" />
          </nav>

          <div className="pt-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">服务器连接</span>
              <StatusIndicator 
                status={isConnected ? 'active' : 'warning'} 
                label={isConnected ? "在线" : "连接中..."}
              />
            </div>
            <div className="flex items-center mt-2">
              <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">系统状态: 正常</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </a>
  );
};

export default Sidebar;
