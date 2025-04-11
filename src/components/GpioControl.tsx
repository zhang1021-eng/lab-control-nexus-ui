
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { useGpioData } from "@/hooks/useMockData";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface PinConfig {
  pin: number;
  name: string;
  type: 'power' | 'ground' | 'gpio' | 'special';
  description?: string;
}

const GpioControl = () => {
  const { inputPinStates } = useGpioData();
  const [pinModes, setPinModes] = useState<Record<number, 'input' | 'output'>>({
    11: 'input',
    13: 'input',
    15: 'input',
    16: 'output',
    18: 'output',
    22: 'output',
  });
  
  const [outputStates, setOutputStates] = useState<Record<number, boolean>>({
    16: false,
    18: false,
    22: false,
  });
  
  // GPIO pins configuration
  const pins: PinConfig[] = [
    { pin: 1, name: '3.3V', type: 'power' },
    { pin: 2, name: '5V', type: 'power' },
    { pin: 3, name: 'GPIO 2', type: 'gpio' },
    { pin: 4, name: '5V', type: 'power' },
    { pin: 5, name: 'GPIO 3', type: 'gpio' },
    { pin: 6, name: 'GND', type: 'ground' },
    { pin: 7, name: 'GPIO 4', type: 'gpio' },
    { pin: 8, name: 'GPIO 14', type: 'gpio' },
    { pin: 9, name: 'GND', type: 'ground' },
    { pin: 10, name: 'GPIO 15', type: 'gpio' },
    { pin: 11, name: 'GPIO 17', type: 'gpio' },
    { pin: 12, name: 'GPIO 18', type: 'gpio' },
    { pin: 13, name: 'GPIO 27', type: 'gpio' },
    { pin: 14, name: 'GND', type: 'ground' },
    { pin: 15, name: 'GPIO 22', type: 'gpio' },
    { pin: 16, name: 'GPIO 23', type: 'gpio' },
    { pin: 17, name: '3.3V', type: 'power' },
    { pin: 18, name: 'GPIO 24', type: 'gpio' },
    { pin: 19, name: 'GPIO 10', type: 'gpio' },
    { pin: 20, name: 'GND', type: 'ground' },
    // Only showing 20 pins for brevity, could be expanded to all 40
  ];
  
  // Toggle pin mode
  const togglePinMode = (pin: number) => {
    if (
      // Check if pin is configurable
      pins.find(p => p.pin === pin)?.type === 'gpio'
    ) {
      setPinModes(prev => ({
        ...prev,
        [pin]: prev[pin] === 'input' ? 'output' : 'input'
      }));
    }
  };
  
  // Toggle output state
  const toggleOutputState = (pin: number) => {
    if (pinModes[pin] === 'output') {
      setOutputStates(prev => ({
        ...prev,
        [pin]: !prev[pin]
      }));
    }
  };
  
  return (
    <div id="gpio-control">
      <DashboardCard
        title="GPIO 引脚控制"
        description="控制和监控 GPIO 引脚状态"
      >
        <div className="bg-instrument-display p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              {/* Left row pins (odd numbers) */}
              {pins.filter(pin => pin.pin % 2 !== 0).map(pin => (
                <GpioPin
                  key={pin.pin}
                  pin={pin}
                  mode={pinModes[pin.pin]}
                  state={
                    pinModes[pin.pin] === 'input' 
                      ? !!inputPinStates[pin.pin]
                      : !!outputStates[pin.pin]
                  }
                  onToggleMode={() => togglePinMode(pin.pin)}
                  onToggleState={() => toggleOutputState(pin.pin)}
                  align="left"
                />
              ))}
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Right row pins (even numbers) */}
              {pins.filter(pin => pin.pin % 2 === 0).map(pin => (
                <GpioPin
                  key={pin.pin}
                  pin={pin}
                  mode={pinModes[pin.pin]}
                  state={
                    pinModes[pin.pin] === 'input' 
                      ? !!inputPinStates[pin.pin]
                      : !!outputStates[pin.pin]
                  }
                  onToggleMode={() => togglePinMode(pin.pin)}
                  onToggleState={() => toggleOutputState(pin.pin)}
                  align="right"
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-instrument-power rounded-sm mr-2"></span>
            <span className="text-xs">电源</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-black rounded-sm mr-2"></span>
            <span className="text-xs">接地</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-instrument-inactive rounded-sm mr-2"></span>
            <span className="text-xs">GPIO</span>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

interface GpioPinProps {
  pin: PinConfig;
  mode?: 'input' | 'output';
  state?: boolean;
  onToggleMode: () => void;
  onToggleState: () => void;
  align: 'left' | 'right';
}

const GpioPin = ({ pin, mode, state, onToggleMode, onToggleState, align }: GpioPinProps) => {
  // Get pin class based on type
  const getPinClass = () => {
    switch (pin.type) {
      case 'power':
        return 'gpio-pin-power';
      case 'ground':
        return 'gpio-pin-ground';
      case 'gpio':
        return state ? 'gpio-pin-active' : 'gpio-pin-inactive';
      default:
        return 'gpio-pin-inactive';
    }
  };
  
  // Get controls for pin based on type and mode
  const getPinControls = () => {
    if (pin.type !== 'gpio') return null;
    
    return (
      <div className="flex flex-col items-center gap-1">
        <Toggle
          size="sm"
          pressed={mode === 'output'}
          onPressedChange={onToggleMode}
          className="h-6 text-xs"
        >
          {mode === 'input' ? '输入' : '输出'}
        </Toggle>
        
        {mode === 'output' && (
          <Toggle
            size="sm"
            pressed={state}
            onPressedChange={onToggleState}
            className="h-6 text-xs"
            variant={state ? "default" : "outline"}
          >
            {state ? '高' : '低'}
          </Toggle>
        )}
      </div>
    );
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2", 
      align === 'right' ? 'flex-row' : 'flex-row-reverse'
    )}>
      <div
        className={cn("gpio-pin", getPinClass())}
      >
        {pin.pin}
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold">{pin.name}</div>
        {pin.type === 'gpio' && mode === 'input' && (
          <div className="flex items-center mt-1">
            <div className={cn(
              "h-2 w-2 rounded-full mr-1",
              state ? "bg-instrument-active" : "bg-instrument-inactive"
            )}></div>
            <span className="text-xs">{state ? '高' : '低'}</span>
          </div>
        )}
      </div>
      {getPinControls()}
    </div>
  );
};

export default GpioControl;
