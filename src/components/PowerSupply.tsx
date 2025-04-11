
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePowerSupplyData } from "@/hooks/useMockData";
import { Power } from "lucide-react";

const PowerSupply = () => {
  const [voltage, setVoltage] = useState(5);
  const [currentLimit, setCurrentLimit] = useState(1);
  const [outputEnabled, setOutputEnabled] = useState(false);
  
  const { actualVoltage, actualCurrent } = usePowerSupplyData(voltage, outputEnabled);
  
  // Format number to fixed decimal places
  const formatValue = (value: number, decimals: number): string => {
    return value.toFixed(decimals);
  };
  
  return (
    <div id="power-supply">
      <DashboardCard
        title="直流电源"
        description="可调电压电源控制"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="instrument-panel rounded-lg">
            <h3 className="text-sm font-medium mb-4">输出控制</h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>输出电压</span>
                <span>{voltage.toFixed(1)} V</span>
              </div>
              <Slider
                value={[voltage]}
                min={0}
                max={12}
                step={0.1}
                onValueChange={(values) => setVoltage(values[0])}
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>电流限制</span>
                <span>{currentLimit.toFixed(2)} A</span>
              </div>
              <Slider
                value={[currentLimit]}
                min={0}
                max={3}
                step={0.01}
                onValueChange={(values) => setCurrentLimit(values[0])}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power size={20} className={outputEnabled ? "text-instrument-power" : "text-muted-foreground"} />
                <span>输出状态</span>
              </div>
              <Switch
                checked={outputEnabled}
                onCheckedChange={setOutputEnabled}
              />
            </div>
          </div>
          
          <div className="instrument-panel flex flex-col rounded-lg">
            <h3 className="text-sm font-medium mb-4">实时测量</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-instrument-display rounded-lg p-4 mb-4">
                <div className="text-xs mb-1 text-muted-foreground">输出电压</div>
                <div className="digital-readout text-instrument-power">
                  {formatValue(actualVoltage, 2)}
                  <span className="text-lg ml-1">V</span>
                </div>
              </div>
              
              <div className="bg-instrument-display rounded-lg p-4">
                <div className="text-xs mb-1 text-muted-foreground">输出电流</div>
                <div className="digital-readout text-foreground">
                  {formatValue(actualCurrent, 3)}
                  <span className="text-lg ml-1">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default PowerSupply;
