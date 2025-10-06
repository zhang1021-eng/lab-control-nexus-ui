
import { useRef, useEffect } from "react";
import { Gauge, Thermometer, Cpu, Power, Radio, Activity, Video } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SensorMonitor from "@/components/SensorMonitor";
import GpioControl from "@/components/GpioControl";
import PowerSupply from "@/components/PowerSupply";
import Multimeter from "@/components/Multimeter";
import SignalGenerator from "@/components/SignalGenerator";
import Oscilloscope from "@/components/Oscilloscope";
import CameraViewer from "@/components/CameraViewer";

const Index = () => {
  // Refs for section scrolling
  const sensorRef = useRef<HTMLDivElement>(null);
  const gpioRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLDivElement>(null);
  const multimeterRef = useRef<HTMLDivElement>(null);
  const sigGenRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  // Set up hash change handling for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#sensor-monitor" && sensorRef.current) {
        sensorRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#gpio-control" && gpioRef.current) {
        gpioRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#power-supply" && powerRef.current) {
        powerRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#multimeter" && multimeterRef.current) {
        multimeterRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#signal-generator" && sigGenRef.current) {
        sigGenRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#oscilloscope" && scopeRef.current) {
        scopeRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#camera" && cameraRef.current) {
        cameraRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Handle initial hash
    handleHashChange();

    // Set up listener for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-6 lg:pl-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">实验室控制平台</h1>
          <p className="text-muted-foreground">集成实验测量与控制系统</p>
        </header>
        
        {/* Dashboard Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">仪表盘</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <ModuleCard
              title="传感器"
              icon={<Thermometer size={24} />}
              href="#sensor-monitor"
              color="bg-gradient-to-br from-red-500/20 to-orange-500/20"
            />
            <ModuleCard
              title="GPIO 控制"
              icon={<Cpu size={24} />}
              href="#gpio-control"
              color="bg-gradient-to-br from-blue-500/20 to-sky-500/20"
            />
            <ModuleCard
              title="直流电源"
              icon={<Power size={24} />}
              href="#power-supply"
              color="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
            />
            <ModuleCard
              title="万用表"
              icon={<Gauge size={24} />}
              href="#multimeter"
              color="bg-gradient-to-br from-yellow-500/20 to-amber-500/20"
            />
            <ModuleCard
              title="信号发生器"
              icon={<Radio size={24} />}
              href="#signal-generator"
              color="bg-gradient-to-br from-purple-500/20 to-violet-500/20"
            />
            <ModuleCard
              title="示波器"
              icon={<Activity size={24} />}
              href="#oscilloscope"
              color="bg-gradient-to-br from-pink-500/20 to-rose-500/20"
            />
          </div>
        </section>
        
        {/* Sensor Module */}
        <section className="mb-12" ref={sensorRef}>
          <SensorMonitor />
        </section>
        
        {/* GPIO Control */}
        <section className="mb-12" ref={gpioRef}>
          <GpioControl />
        </section>
        
        {/* Power Supply */}
        <section className="mb-12" ref={powerRef}>
          <PowerSupply />
        </section>
        
        {/* Multimeter */}
        <section className="mb-12" ref={multimeterRef}>
          <Multimeter />
        </section>
        
        {/* Signal Generator */}
        <section className="mb-12" ref={sigGenRef}>
          <SignalGenerator />
        </section>
        
        {/* Oscilloscope */}
        <section className="mb-12" ref={scopeRef}>
          <Oscilloscope />
        </section>
        
        {/* Camera Viewer */}
        <section className="mb-12" ref={cameraRef}>
          <CameraViewer />
        </section>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground py-6 border-t">
          <p>实验室控制系统界面 · 版本 1.0.0</p>
        </footer>
      </div>
    </div>
  );
};

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const ModuleCard = ({ title, icon, href, color }: ModuleCardProps) => {
  return (
    <a
      href={href}
      className={`p-6 rounded-lg border hover:shadow-md transition-all flex flex-col items-center justify-center text-center ${color}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-medium">{title}</h3>
    </a>
  );
};

export default Index;
