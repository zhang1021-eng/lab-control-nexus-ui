
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Video, Camera, Pause, Play, Upload } from "lucide-react";

const CameraViewer = () => {
  const [streaming, setStreaming] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiModel, setAiModel] = useState("face");
  const [cameraSource, setCameraSource] = useState("main");
  
  return (
    <div id="camera">
      <DashboardCard
        title="摄像头控制"
        description="视频流与图像处理"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-instrument-display rounded-lg aspect-video flex items-center justify-center">
              {streaming ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Placeholder for video stream - would be replaced with actual video */}
                  <div className="w-full h-full bg-gradient-to-br from-instrument-panel to-instrument-dark flex items-center justify-center">
                    <Camera size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  
                  {/* AI overlay visualization (placeholder) */}
                  {aiEnabled && (
                    <div className="absolute inset-0 pointer-events-none">
                      {aiModel === 'face' && (
                        <div className="absolute w-32 h-32 border-2 border-instrument-trace rounded-lg left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="text-xs text-instrument-trace absolute -top-6 left-0 font-mono">人脸检测</div>
                        </div>
                      )}
                      
                      {aiModel === 'object' && (
                        <>
                          <div className="absolute w-48 h-24 border-2 border-blue-500 rounded-lg left-1/3 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="text-xs text-blue-500 absolute -top-6 left-0 font-mono">书 (98%)</div>
                          </div>
                          <div className="absolute w-24 h-24 border-2 border-green-500 rounded-lg left-2/3 top-2/3 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="text-xs text-green-500 absolute -top-6 left-0 font-mono">杯子 (87%)</div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Video size={48} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">视频未启动</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <Button
                onClick={() => setStreaming(!streaming)}
                variant={streaming ? "destructive" : "default"}
              >
                {streaming ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {streaming ? "停止视频流" : "启动视频流"}
              </Button>
              
              <ToggleGroup type="single" value={cameraSource} onValueChange={(val) => val && setCameraSource(val)}>
                <ToggleGroupItem value="main">主摄像头</ToggleGroupItem>
                <ToggleGroupItem value="secondary">副摄像头</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <div className="instrument-panel rounded-lg p-4">
            <h3 className="text-sm font-medium mb-4">图像处理控制</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>启用AI分析</span>
                <Switch
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                  disabled={!streaming}
                />
              </div>
              
              <div>
                <label className="text-sm mb-1 block">选择AI模型</label>
                <Select
                  disabled={!aiEnabled || !streaming}
                  value={aiModel}
                  onValueChange={setAiModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="face">人脸检测</SelectItem>
                    <SelectItem value="object">物体识别</SelectItem>
                    <SelectItem value="motion">运动检测</SelectItem>
                    <SelectItem value="pose">姿态识别</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  disabled={!streaming}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  截图保存
                </Button>
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>未检测到 AI 加速硬件</p>
                <p className="mt-1">当前使用 CPU 推理，处理速度可能较慢</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default CameraViewer;
