import { useState, useEffect } from 'react';

// Generate random number within range
const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate random signal data for oscilloscope
export const useOscilloscopeData = (
  frequency: number = 1000, 
  amplitude: number = 1, 
  sampleCount: number = 100,
  noiseLevel: number = 0.05
) => {
  const [data, setData] = useState<number[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = Array.from({ length: sampleCount }, (_, i) => {
        const x = (i / sampleCount) * 2 * Math.PI;
        // Generate sine wave with some random noise
        const noise = randomRange(-noiseLevel, noiseLevel);
        return Math.sin(x * frequency / 100) * amplitude + noise;
      });
      setData(newData);
    }, 50); // Update at 20fps

    return () => clearInterval(interval);
  }, [frequency, amplitude, sampleCount, noiseLevel]);

  return data;
};

// Generate random temperature data
export const useTemperatureData = (initialTemp: number = 25) => {
  const [temperature, setTemperature] = useState(initialTemp);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Random walk with small changes
      setTemperature(prev => {
        const change = randomRange(-0.1, 0.1);
        // Keep temperature in reasonable bounds
        const newTemp = prev + change;
        return newTemp > 15 && newTemp < 35 ? newTemp : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return temperature;
};

// Generate random humidity data
export const useHumidityData = (initialHumidity: number = 50) => {
  const [humidity, setHumidity] = useState(initialHumidity);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Random walk with small changes
      setHumidity(prev => {
        const change = randomRange(-0.5, 0.5);
        // Keep humidity in reasonable bounds
        const newHumidity = prev + change;
        return newHumidity > 30 && newHumidity < 70 ? newHumidity : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return humidity;
};

// Generate random light data
export const useLightData = (initialLight: number = 500) => {
  const [light, setLight] = useState(initialLight);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Random walk with larger changes to simulate light fluctuation
      setLight(prev => {
        const change = randomRange(-10, 10);
        // Keep light in reasonable bounds
        const newLight = prev + change;
        return newLight > 100 && newLight < 1000 ? newLight : prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return light;
};

// Generate random distance data
export const useDistanceData = (initialDistance: number = 50) => {
  const [distance, setDistance] = useState(initialDistance);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Random walk with medium changes
      setDistance(prev => {
        const change = randomRange(-2, 2);
        // Keep distance in reasonable bounds
        const newDistance = prev + change;
        return newDistance > 10 && newDistance < 100 ? newDistance : prev;
      });
    }, 200); // Faster updates for distance sensor

    return () => clearInterval(interval);
  }, []);

  return distance;
};

// Generate random gestures
export const useGestureData = () => {
  const gestures = ["无", "左", "右", "上", "下", "前", "后"];
  const [gesture, setGesture] = useState(gestures[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // 80% chance of no gesture, 20% chance of some gesture
      if (Math.random() > 0.8) {
        const randomIndex = Math.floor(randomRange(1, gestures.length));
        setGesture(gestures[randomIndex]);
        
        // Reset to "无" after a short time
        setTimeout(() => {
          setGesture(gestures[0]);
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return gesture;
};

// Generate multimeter reading
export const useMultimeterData = (
  mode: 'DCV' | 'ACV' | 'DCA' | 'ACA' | 'OHM', 
  baseValue: number = 5
) => {
  const [reading, setReading] = useState(baseValue);
  
  useEffect(() => {
    // Reset the base reading when mode changes
    setReading(baseValue);
    
    const interval = setInterval(() => {
      // Create appropriate variation based on mode
      let variation = 0;
      
      switch (mode) {
        case 'DCV':
          variation = randomRange(-0.01, 0.01);
          break;
        case 'ACV':
          variation = randomRange(-0.05, 0.05);
          break;
        case 'DCA':
          variation = randomRange(-0.005, 0.005);
          break;
        case 'ACA':
          variation = randomRange(-0.01, 0.01);
          break;
        case 'OHM':
          variation = randomRange(-5, 5);
          break;
      }
      
      setReading(prev => prev + variation);
    }, 200);

    return () => clearInterval(interval);
  }, [mode, baseValue]);

  return reading;
};

// Generate power supply feedback
export const usePowerSupplyData = (
  targetVoltage: number = 5,
  outputEnabled: boolean = false
) => {
  const [actualVoltage, setActualVoltage] = useState(0);
  const [actualCurrent, setActualCurrent] = useState(0);
  
  useEffect(() => {
    // Reset readings if output is disabled
    if (!outputEnabled) {
      setActualVoltage(0);
      setActualCurrent(0);
      return;
    }
    
    setActualVoltage(targetVoltage);
    
    const interval = setInterval(() => {
      // Simulate slight voltage variation
      setActualVoltage(targetVoltage + randomRange(-0.02, 0.02));
      
      // Simulate current based on voltage and randomness (as if connected to a resistive load)
      const baselineCurrent = targetVoltage / 100; // Simulating a ~100 ohm load
      setActualCurrent(baselineCurrent + randomRange(-0.01, 0.01));
    }, 200);
    
    return () => clearInterval(interval);
  }, [targetVoltage, outputEnabled]);
  
  return { actualVoltage, actualCurrent };
};

// Simulate signal generator
export const useSignalGeneratorData = (
  waveform: 'sine' | 'square' | 'triangle',
  frequency: number,
  amplitude: number,
  outputEnabled: boolean
) => {
  // No actual data to return, just validated parameters
  return { waveform, frequency, amplitude, outputEnabled };
};

// Simulate GPIO pin states
export const useGpioData = () => {
  const [inputPinStates, setInputPinStates] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    // Simulate random changes on input pins
    const pins = [11, 13, 15, 19, 21];
    const interval = setInterval(() => {
      const randomPin = pins[Math.floor(Math.random() * pins.length)];
      setInputPinStates(prev => ({
        ...prev,
        [randomPin]: Math.random() > 0.5
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { inputPinStates };
};

// Simulate websocket connection status
export const useConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    // Simulate occasional connection drops
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsConnected(false);
        // Reconnect after short delay
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return isConnected;
};
