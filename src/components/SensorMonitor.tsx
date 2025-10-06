import { Thermometer, Droplets, Sun, ArrowDownToLine, Hand, RefreshCw } from "lucide-react";
import { useTemperatureData, useHumidityData, useLightData, useDistanceData, useGestureData } from "@/hooks/useMockData";
import DashboardCard from "./DashboardCard";
import LedControl from "./LedControl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SensorCardProps {
  title: string;
  icon: React.ReactNode;
  value: number | string;
  unit?: string;
  color: string;
  onRefresh?: () => void;
}

const SensorCard = ({ title, icon, value, unit, color, onRefresh }: SensorCardProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      // Show refresh animation for a short time
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="bg-secondary p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <div 
          className="h-12 w-12 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
        >
          <div className="text-foreground">{icon}</div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-mono font-bold">
            {typeof value === 'number' ? value.toFixed(1) : value}
            {unit && <span className="text-muted-foreground text-sm ml-1">{unit}</span>}
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleRefresh}
        className="h-8 w-8 hover:bg-background/80"
      >
        <RefreshCw 
          size={16} 
          className={isRefreshing ? "animate-spin" : ""} 
        />
      </Button>
    </div>
  );
};

const SensorMonitor = () => {
  const temperature = useTemperatureData();
  const humidity = useHumidityData();
  const light = useLightData();
  const distance = useDistanceData();
  const gesture = useGestureData();
  
  // Line chart data for temperature
  const [chartData, setChartData] = useState<number[]>([]);
  
  useEffect(() => {
    setChartData(prev => {
      // Keep a rolling window of the last 60 data points
      const newData = [...prev, temperature];
      if (newData.length > 60) {
        return newData.slice(-60);
      }
      return newData;
    });
  }, [temperature]);

  // Refresh functions for each sensor
  const refreshTemperature = () => {
    console.log("刷新温度传感器数据");
    // The mock data hooks will automatically generate new values
  };

  const refreshHumidity = () => {
    console.log("刷新湿度传感器数据");
  };

  const refreshLight = () => {
    console.log("刷新光照度传感器数据");
  };

  const refreshDistance = () => {
    console.log("刷新测距传感器数据");
  };

  const refreshGesture = () => {
    console.log("刷新手势识别数据");
  };
  
  return (
    <div id="sensor-monitor">
      <DashboardCard 
        title="传感器监控"
        description="实时环境与物理传感器数据"
        className="bg-card"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <SensorCard 
            title="温度" 
            icon={<Thermometer className="text-sensor-temperature" />} 
            value={temperature} 
            unit="°C"
            color="#ff5252"
            onRefresh={refreshTemperature}
          />
          <SensorCard 
            title="湿度" 
            icon={<Droplets className="text-sensor-humidity" />} 
            value={humidity} 
            unit="%"
            color="#2196f3"
            onRefresh={refreshHumidity}
          />
          <SensorCard 
            title="光照度" 
            icon={<Sun className="text-sensor-light" />} 
            value={Math.round(light)} 
            unit="Lux"
            color="#ffc107"
            onRefresh={refreshLight}
          />
          <SensorCard 
            title="测距" 
            icon={<ArrowDownToLine className="text-sensor-distance" />} 
            value={Math.round(distance)} 
            unit="cm"
            color="#9c27b0"
            onRefresh={refreshDistance}
          />
          <SensorCard 
            title="手势识别" 
            icon={<Hand className="text-sensor-gesture" />} 
            value={gesture}
            color="#4caf50"
            onRefresh={refreshGesture}
          />
        </div>
        
        {/* Temperature history chart */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">温度历史趋势 (60秒)</h3>
          <div className="h-32 w-full bg-instrument-display rounded-md overflow-hidden">
            <div className="h-full w-full relative">
              {chartData.length > 1 && (
                <svg className="h-full w-full" viewBox={`0 0 ${chartData.length} 100`} preserveAspectRatio="none">
                  <path
                    d={`M0,${100 - (chartData[0] - 15) * 5} ${chartData.map((value, i) => `L${i},${100 - (value - 15) * 5}`).join(' ')}`}
                    fill="none"
                    stroke="#ff5252"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* LED Control */}
        <LedControl />
      </DashboardCard>
    </div>
  );
};

export default SensorMonitor;
