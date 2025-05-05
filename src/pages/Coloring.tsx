
import React, { useState, useRef } from "react";
import { useContext } from "react";
import { GeminiContext } from "@/App";
import { Brush, Download, Eraser, RefreshCw, Square, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateColoringImage } from "@/lib/gemini";
import { toast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const defaultColors = [
  "#FF5733", "#33FF57", "#3357FF", "#F3FF33", 
  "#FF33F3", "#33FFF3", "#000000", "#FFFFFF"
];

const Coloring = () => {
  const { apiKey } = useContext(GeminiContext);
  const [activeColor, setActiveColor] = useState("#FF5733");
  const [brushSize, setBrushSize] = useState(10);
  const [isErasing, setIsErasing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState<"brush" | "eraser" | "fill">("brush");
  const [coloringImage, setColoringImage] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = activeColor;
    context.lineWidth = brushSize;
    
    contextRef.current = context;
  };
  
  React.useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, [coloringImage]);
  
  React.useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isErasing ? "#FFFFFF" : activeColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [activeColor, brushSize, isErasing]);
  
  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = nativeEvent as MouseEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };
  
  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = nativeEvent as MouseEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };
  
  const handleToolChange = (tool: "brush" | "eraser" | "fill") => {
    setCurrentTool(tool);
    setIsErasing(tool === "eraser");
  };
  
  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Re-draw the base image if it exists
      if (coloringImage) {
        const img = new Image();
        img.src = coloringImage;
        img.onload = () => {
          if (contextRef.current && canvasRef.current) {
            contextRef.current.drawImage(
              img, 
              0, 
              0, 
              canvasRef.current.width / 2, 
              canvasRef.current.height / 2
            );
          }
        };
      }
    }
  };
  
  const downloadImage = async () => {
    if (canvasRef.current) {
      try {
        const canvas = await html2canvas(canvasRef.current);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `حكايتي-تلوين-${new Date().toISOString()}.png`;
        link.click();
      } catch (error) {
        console.error("Error downloading image:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء محاولة تحميل الصورة",
          variant: "destructive",
        });
      }
    }
  };
  
  const generateNewImage = async () => {
    if (!topic) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال موضوع للصورة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const imageData = await generateColoringImage(topic, apiKey);
      setColoringImage(imageData);
      
      // Wait for the image to load then draw it on canvas
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        if (contextRef.current && canvasRef.current) {
          // Clear canvas first
          contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw the new image
          contextRef.current.drawImage(
            img, 
            0, 
            0, 
            canvasRef.current.width / 2, 
            canvasRef.current.height / 2
          );
        }
      };
      
      toast({
        title: "تم بنجاح",
        description: "تم إنشاء صورة التلوين الجديدة",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة إنشاء صورة التلوين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">صفحة التلوين</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tools Panel */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>أدوات التلوين</CardTitle>
                  <CardDescription>اختر أدواتك وألوانك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Drawing Tools */}
                  <div className="space-y-2">
                    <Label>الأدوات</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={currentTool === "brush" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleToolChange("brush")}
                        title="فرشاة"
                      >
                        <Brush size={18} />
                      </Button>
                      <Button 
                        variant={currentTool === "eraser" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleToolChange("eraser")}
                        title="ممحاة"
                      >
                        <Eraser size={18} />
                      </Button>
                      <Button 
                        variant={currentTool === "fill" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleToolChange("fill")}
                        title="تعبئة"
                      >
                        <Square size={18} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={clearCanvas}
                        title="مسح الكل"
                      >
                        <RefreshCw size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Brush Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>حجم الفرشاة</Label>
                      <span className="text-sm">{brushSize}px</span>
                    </div>
                    <Slider 
                      value={[brushSize]} 
                      min={1} 
                      max={30} 
                      step={1} 
                      onValueChange={(values) => setBrushSize(values[0])}
                    />
                  </div>
                  
                  {/* Color Picker */}
                  <div className="space-y-2">
                    <Label>اللون</Label>
                    <div className="flex flex-wrap gap-2">
                      {defaultColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 ${
                            activeColor === color ? "border-black dark:border-white" : "border-gray-200"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setActiveColor(color)}
                          title={`اللون ${index + 1}`}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={activeColor}
                      onChange={(e) => setActiveColor(e.target.value)}
                      className="w-full h-10 mt-2"
                    />
                  </div>
                  
                  {/* Generate New Image */}
                  <div className="space-y-2">
                    <Label htmlFor="topic">موضوع الصورة</Label>
                    <div className="flex gap-2">
                      <Input
                        id="topic"
                        placeholder="أدخل موضوع الصورة"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                      <Button
                        onClick={generateNewImage}
                        disabled={isLoading}
                      >
                        {isLoading ? "جاري التحميل..." : "إنشاء"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <Button onClick={downloadImage} className="w-full" disabled={!coloringImage}>
                    <Download className="mr-2" size={16} /> تحميل الصورة
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Canvas Area */}
            <div className="lg:col-span-9">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>منطقة الرسم</CardTitle>
                </CardHeader>
                <CardContent>
                  {coloringImage ? (
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-[500px] border rounded-md bg-white cursor-pointer"
                    />
                  ) : (
                    <div className="w-full h-[500px] border rounded-md bg-gray-50 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Palette className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-lg font-medium mb-2">لا توجد صورة للتلوين</p>
                        <p className="text-sm text-gray-500 mb-4">أدخل موضوعًا وانقر على زر "إنشاء" لبدء التلوين</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Coloring;
