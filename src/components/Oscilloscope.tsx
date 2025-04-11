
import { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Play, Pause, ArrowUp, ArrowDown } from "lucide-react";
import { useOscilloscopeData } from "@/hooks/useMockData";
import { cn } from "@/lib/utils";

type TriggerMode = 'auto' | 'normal' | 'single';
type TriggerEdge = 'rising' | 'falling';

const Oscilloscope = () => {
  // Oscilloscope settings
  const [timePerDiv, setTimePerDiv] = useState(1);
  const [voltsPerDiv, setVoltsPerDiv] = useState(1);
  const [triggerMode, setTriggerMode] = useState<TriggerMode>('auto');
  const [triggerEdge, setTriggerEdge] = useState<TriggerEdge>('rising');
  const [triggerLevel, setTriggerLevel] = useState(0);
  const [running, setRunning] = useState(true);
  
  // Set frequency based on timePerDiv
  const frequency = 200 / timePerDiv;
  const data = useOscilloscopeData(frequency, voltsPerDiv, 200);

  // Display settings
  const timeOptions = [
    { label: '5μs', value: 0.005 },
    { label: '10μs', value: 0.01 },
    { label: '50μs', value: 0.05 },
    { label: '100μs', value: 0.1 },
    { label: '500μs', value: 0.5 },
    { label: '1ms', value: 1 },
    { label: '5ms', value: 5 },
    { label: '10ms', value: 10 },
    { label: '50ms', value: 50 },
    { label: '100ms', value: 100 },
  ];
  
  const voltOptions = [
    { label: '10mV', value: 0.01 },
    { label: '20mV', value: 0.02 },
    { label: '50mV', value: 0.05 },
    { label: '100mV', value: 0.1 },
    { label: '200mV', value: 0.2 },
    { label: '500mV', value: 0.5 },
    { label: '1V', value: 1 },
    { label: '2V', value: 2 },
    { label: '5V', value: 5 },
  ];
  
  // Calculate sine wave parameters
  const calculateParameters = () => {
    if (!data || data.length < 2) return null;
    
    // Calculate frequency from zero crossings
    let zeroCrossings = 0;
    let prevSample = data[0];
    for (let i = 1; i < data.length; i++) {
      if ((prevSample < 0 && data[i] >= 0) || (prevSample >= 0 && data[i] < 0)) {
        zeroCrossings++;
      }
      prevSample = data[i];
    }
    
    // Find min and max for peak-to-peak
    const min = Math.min(...data);
    const max = Math.max(...data);
    const peakToPeak = max - min;
    
    // Calculate RMS for sine wave
    const rms = peakToPeak / (2 * Math.sqrt(2));
    
    // Average
    const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    // Calculate frequency - zero crossings/2 for full cycles, divided by time period
    const calculatedFreq = (zeroCrossings / 2) / (data.length * timePerDiv / 1000);
    
    return {
      frequency: calculatedFreq,
      period: calculatedFreq ? 1000 / calculatedFreq : 0,
      peakToPeak: peakToPeak * voltsPerDiv,
      rms: rms * voltsPerDiv,
      average: avg * voltsPerDiv,
    };
  };
  
  const parameters = calculateParameters();
  
  return (
    <div id="oscilloscope">
      <DashboardCard
        title="示波器"
        description="电信号实时波形观察"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            {/* Oscilloscope display */}
            <div className="bg-instrument-display h-64 sm:h-80 rounded-lg p-2 relative oscilloscope-grid">
              {/* Trigger level indicator */}
              <div 
                className="absolute left-0 right-0 h-0.5 bg-red-500 pointer-events-none z-10"
                style={{ top: `${50 - triggerLevel * 10}%` }}
              />
              
              {/* Waveform */}
              <svg className="w-full h-full" preserveAspectRatio="none">
                {running && data && data.length > 0 && (
                  <path
                    d={`M 0,${(0.5 - data[0]/2) * 100}% ${data.map((val, i) => 
                      `L ${(i / (data.length - 1)) * 100}%,${(0.5 - val/2) * 100}%`
                    ).join(' ')}`}
                    stroke="#f7df1e"
                    strokeWidth="2"
                    fill="none"
                  />
                )}
              </svg>
              
              {/* Grid center markers */}
              <div className="absolute top-0 left-1/2 h-full w-px bg-gray-600 opacity-70"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-600 opacity-70"></div>
              
              {!running && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="text-white font-mono text-xl">已暂停</span>
                </div>
              )}
            </div>
            
            {/* Controls row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div>
                <label className="text-xs mb-1 block">时基</label>
                <Select 
                  value={String(timePerDiv)}
                  onValueChange={(val) => setTimePerDiv(parseFloat(val))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="时基" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(option => (
                      <SelectItem key={option.value} value={String(option.value)} className="text-xs">
                        {option.label}/div
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs mb-1 block">垂直灵敏度</label>
                <Select 
                  value={String(voltsPerDiv)}
                  onValueChange={(val) => setVoltsPerDiv(parseFloat(val))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="电压" />
                  </SelectTrigger>
                  <SelectContent>
                    {voltOptions.map(option => (
                      <SelectItem key={option.value} value={String(option.value)} className="text-xs">
                        {option.label}/div
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs mb-1 block">触发模式</label>
                <ToggleGroup 
                  type="single" 
                  value={triggerMode} 
                  onValueChange={(value) => value && setTriggerMode(value as TriggerMode)}
                  className="h-8"
                >
                  <ToggleGroupItem value="auto" className="text-xs flex-1">自动</ToggleGroupItem>
                  <ToggleGroupItem value="normal" className="text-xs flex-1">正常</ToggleGroupItem>
                  <ToggleGroupItem value="single" className="text-xs flex-1">单次</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <label className="text-xs mb-1 block">运行控制</label>
                <Button
                  onClick={() => setRunning(!running)}
                  className="w-full h-8 text-xs"
                  variant={running ? "default" : "secondary"}
                >
                  {running ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
                  {running ? "停止" : "运行"}
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            {/* Side controls */}
            <div className="bg-secondary p-3 rounded-lg h-full">
              <h3 className="text-sm font-medium mb-3">触发控制</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs">触发边沿</label>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    size="icon"
                    variant={triggerEdge === 'rising' ? "default" : "outline"}
                    className="h-8 w-12"
                    onClick={() => setTriggerEdge('rising')}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant={triggerEdge === 'falling' ? "default" : "outline"}
                    className="h-8 w-12"
                    onClick={() => setTriggerEdge('falling')}
                  >
                    <ArrowDown size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <label>触发电平</label>
                  <span>{triggerLevel.toFixed(1)} div</span>
                </div>
                <Slider
                  value={[triggerLevel]}
                  min={-4}
                  max={4}
                  step={0.1}
                  onValueChange={(values) => setTriggerLevel(values[0])}
                  orientation="vertical"
                  className="h-24"
                />
              </div>
              
              <div className="mt-6">
                <h3 className="text-xs font-medium mb-2">测量</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>频率:</span>
                    <span className="font-mono font-medium">
                      {parameters?.frequency ? parameters.frequency.toFixed(1) + ' Hz' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>周期:</span>
                    <span className="font-mono font-medium">
                      {parameters?.period ? parameters.period.toFixed(2) + ' ms' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>峰峰值:</span>
                    <span className="font-mono font-medium">
                      {parameters?.peakToPeak ? parameters.peakToPeak.toFixed(2) + ' V' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>有效值:</span>
                    <span className="font-mono font-medium">
                      {parameters?.rms ? parameters.rms.toFixed(2) + ' V' : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Oscilloscope;
