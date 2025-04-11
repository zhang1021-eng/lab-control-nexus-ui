
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WaveSine, Waves, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";

type WaveformType = 'sine' | 'square' | 'triangle';

const SignalGenerator = () => {
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [frequency, setFrequency] = useState(1000);
  const [amplitude, setAmplitude] = useState(1);
  const [dcOffset, setDcOffset] = useState(0);
  const [outputEnabled, setOutputEnabled] = useState(false);
  
  // Handle frequency input
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 10000000) {
      setFrequency(value);
    }
  };
  
  // Draw waveform preview
  const renderWaveformPreview = () => {
    const width = 200;
    const height = 80;
    const points: [number, number][] = [];
    
    // Generate points for the waveform
    for (let i = 0; i < width; i++) {
      const x = i;
      let y = 0;
      
      const t = (i / width) * Math.PI * 6; // 3 cycles
      
      switch (waveform) {
        case 'sine':
          y = Math.sin(t) * (height / 2 - 5) * (amplitude / 3) + (height / 2) + (dcOffset * height / 6);
          break;
        case 'square':
          y = Math.sin(t) > 0 ? (height / 2) - (height / 2 - 5) * (amplitude / 3) : (height / 2) + (height / 2 - 5) * (amplitude / 3);
          y += dcOffset * height / 6;
          break;
        case 'triangle':
          y = (Math.abs(((t / Math.PI) % 2) - 1) * 2 - 1) * (height / 2 - 5) * (amplitude / 3) + (height / 2) + (dcOffset * height / 6);
          break;
        default:
          y = height / 2;
      }
      
      points.push([x, y]);
    }
    
    // Create SVG path
    const d = `M ${points[0][0]},${points[0][1]} ${points.slice(1).map(point => `L ${point[0]},${point[1]}`).join(' ')}`;
    
    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Center line */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#444" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Waveform */}
        <path d={d} fill="none" stroke={outputEnabled ? "#f7df1e" : "#777"} strokeWidth="2" />
      </svg>
    );
  };
  
  return (
    <div id="signal-generator">
      <DashboardCard
        title="信号发生器"
        description="生成各种波形信号"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="instrument-panel">
            <div className="mb-6">
              <label className="text-sm font-medium">波形选择</label>
              <ToggleGroup type="single" value={waveform} onValueChange={(value) => value && setWaveform(value as WaveformType)} className="mt-2">
                <ToggleGroupItem value="sine" className="flex-1">
                  <WaveSine size={20} className={waveform === 'sine' ? "text-instrument-trace" : undefined} />
                  <span className="ml-2">正弦波</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="square" className="flex-1">
                  <Waves size={20} className={waveform === 'square' ? "text-instrument-trace" : undefined} />
                  <span className="ml-2">方波</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="triangle" className="flex-1">
                  <Triangle size={20} className={waveform === 'triangle' ? "text-instrument-trace" : undefined} />
                  <span className="ml-2">三角波</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <label>频率</label>
                <span className="text-muted-foreground">{frequency < 1000 ? frequency : (frequency / 1000).toFixed(1) + 'k'} Hz</span>
              </div>
              <div className="flex gap-2">
                <Slider
                  value={[frequency]}
                  min={1}
                  max={10000}
                  step={1}
                  onValueChange={(values) => setFrequency(values[0])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={frequency}
                  onChange={handleFrequencyChange}
                  className="w-24"
                  min={0}
                  max={10000000}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <label>幅度</label>
                <span className="text-muted-foreground">{amplitude.toFixed(2)} Vpp</span>
              </div>
              <Slider
                value={[amplitude]}
                min={0}
                max={5}
                step={0.01}
                onValueChange={(values) => setAmplitude(values[0])}
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <label>DC 偏置</label>
                <span className="text-muted-foreground">{dcOffset.toFixed(2)} V</span>
              </div>
              <Slider
                value={[dcOffset]}
                min={-2.5}
                max={2.5}
                step={0.01}
                onValueChange={(values) => setDcOffset(values[0])}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant={outputEnabled ? "destructive" : "default"}
                onClick={() => setOutputEnabled(!outputEnabled)}
              >
                {outputEnabled ? '停止输出' : '开始输出'}
              </Button>
              
              <div className="flex items-center gap-2">
                <span>输出</span>
                <Switch
                  checked={outputEnabled}
                  onCheckedChange={setOutputEnabled}
                />
              </div>
            </div>
          </div>
          
          <div className="instrument-display flex flex-col">
            <h3 className="text-sm font-medium mb-2">波形预览</h3>
            <div 
              className={cn(
                "h-40 border border-muted rounded-md flex items-center justify-center overflow-hidden",
                outputEnabled ? "bg-instrument-display" : "bg-instrument-dark"
              )}
            >
              {renderWaveformPreview()}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">波形类型</div>
                <div className="text-sm font-bold">
                  {waveform === 'sine' ? '正弦波' : waveform === 'square' ? '方波' : '三角波'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">频率</div>
                <div className="text-sm font-bold">
                  {frequency < 1000 ? 
                    `${frequency} Hz` : 
                    frequency < 1000000 ? 
                    `${(frequency / 1000).toFixed(3)} kHz` : 
                    `${(frequency / 1000000).toFixed(3)} MHz`
                  }
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">幅度</div>
                <div className="text-sm font-bold">{amplitude.toFixed(2)} Vpp</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">状态</div>
                <div className={cn(
                  "text-sm font-bold",
                  outputEnabled ? "text-instrument-active" : "text-instrument-inactive"
                )}>
                  {outputEnabled ? '运行中' : '已停止'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SignalGenerator;
