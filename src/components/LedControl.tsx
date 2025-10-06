
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LedControlProps {
  ledCount?: number;
}

const LedControl = ({ ledCount = 9 }: LedControlProps) => {
  const [ledStates, setLedStates] = useState<boolean[]>(
    new Array(ledCount).fill(false)
  );

  const toggleLed = (index: number) => {
    setLedStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      console.log(`LED ${index + 1} ${newStates[index] ? '开启' : '关闭'}`);
      return newStates;
    });
  };

  const toggleAllLeds = () => {
    const allOn = ledStates.every(state => state);
    const newState = !allOn;
    setLedStates(new Array(ledCount).fill(newState));
    console.log(`所有LED ${newState ? '开启' : '关闭'}`);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">LED灯控制</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleAllLeds}
          className="text-xs"
        >
          {ledStates.every(state => state) ? '全部关闭' : '全部开启'}
        </Button>
      </div>
      
      <div className="grid grid-cols-9 gap-2">
        {ledStates.map((isOn, index) => (
          <div key={index} className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleLed(index)}
              className={`h-12 w-12 rounded-full border-2 transition-all ${
                isOn 
                  ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-lg shadow-yellow-400/50' 
                  : 'bg-gray-200 border-gray-300 text-gray-500 hover:bg-gray-300'
              }`}
            >
              <Lightbulb 
                size={20} 
                className={isOn ? 'fill-current' : ''} 
              />
            </Button>
            <span className="text-xs text-muted-foreground mt-1">
              LED{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LedControl;
