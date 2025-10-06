
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { useMultimeterData } from "@/hooks/useMockData";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type MultimeterMode = 'DCV' | 'ACV' | 'DCA' | 'ACA' | 'OHM';

const Multimeter = () => {
  const [mode, setMode] = useState<MultimeterMode>('DCV');
  const reading = useMultimeterData(mode);
  
  // Get unit and formatting based on mode
  const getUnitAndFormat = () => {
    switch (mode) {
      case 'DCV':
      case 'ACV':
        return { unit: 'V', format: (v: number) => v.toFixed(3) };
      case 'DCA':
      case 'ACA':
        return { unit: 'A', format: (v: number) => v.toFixed(3) };
      case 'OHM':
        return { unit: 'Ω', format: (v: number) => {
          // Format with appropriate units (Ω, kΩ, MΩ)
          if (v >= 1000000) {
            return (v / 1000000).toFixed(2) + ' MΩ';
          } else if (v >= 1000) {
            return (v / 1000).toFixed(2) + ' kΩ';
          } else {
            return v.toFixed(1) + ' Ω';
          }
        }};
      default:
        return { unit: '', format: (v: number) => v.toString() };
    }
  };
  
  const { unit, format } = getUnitAndFormat();
  
  // Get display color based on mode
  const getDisplayColor = () => {
    switch (mode) {
      case 'DCV':
      case 'DCA':
        return 'text-blue-500';
      case 'ACV':
      case 'ACA':
        return 'text-yellow-500';
      case 'OHM':
        return 'text-green-500';
      default:
        return 'text-foreground';
    }
  };
  
  return (
    <div id="multimeter">
      <DashboardCard
        title="数字万用表"
        description="多功能电子测量仪表"
      >
        <div className="bg-instrument-display rounded-lg p-6">
          <div className={cn("text-center digital-readout text-5xl mb-6", getDisplayColor())}>
            {format(reading)}
            {unit && !mode.includes('OHM') && <span className="text-xl ml-1">{unit}</span>}
          </div>
          
          <ToggleGroup type="single" value={mode} onValueChange={(value) => value && setMode(value as MultimeterMode)}>
            <ToggleGroupItem value="DCV" className="flex-1">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">DCV</span>
                <span className="text-xs">直流电压</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value="ACV" className="flex-1">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">ACV</span>
                <span className="text-xs">交流电压</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value="DCA" className="flex-1">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">DCA</span>
                <span className="text-xs">直流电流</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value="ACA" className="flex-1">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">ACA</span>
                <span className="text-xs">交流电流</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value="OHM" className="flex-1">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">Ω</span>
                <span className="text-xs">电阻</span>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Multimeter;
