import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScanningAnimation from "@/components/ScanningAnimation";
import { analyzeWithPlantId } from "@/lib/plantid-service";
import { saveScan } from "@/lib/storage";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ScanPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) {
      toast.error("Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      // 1. Call the real Gemini API
      const aiResponse = await analyzeWithPlantId(selectedFile);

      // 2. Map the AI response to the strict ScanResult type
      const result = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split("T")[0],
        imageUrl: preview,
        plantName: aiResponse.plantName || "Unknown Plant",
        diseaseName: aiResponse.diseaseName || "Healthy",

        // FIX: Explicitly cast to the allowed union type
        status: (aiResponse.diseaseName === "Healthy"
          ? "healthy"
          : "action_required") as "healthy" | "action_required",

        confidence: aiResponse.confidence || 90,
        organicTreatment: aiResponse.organicTreatment || [],
        chemicalTreatment: aiResponse.chemicalTreatment || [],
        preventionTips: aiResponse.preventionTips || [],
      };

      // 3. Save to local storage and navigate
      saveScan(result);
      navigate(`/result/${result.id}`, { state: { scan: result } });
      toast.success("Analysis complete!");
    } catch (err) {
      console.error("Analysis failed:", err);
      toast.error("AI Analysis failed. Please check your internet or API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-24 px-5 bg-background">
        <ScanningAnimation />
        <p className="mt-4 text-primary font-medium animate-pulse">
          CropGuard AI is examining your crop...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-5 pt-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Scan Your Crop
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Take a clear photo of the leaf for AI diagnosis
        </p>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card
            className={`border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border bg-card/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner">
                <ImageIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-foreground">
                  Drop leaf image here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or tap to browse files
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              size="lg"
              className="w-full h-16 rounded-2xl text-base font-bold shadow-lg bg-primary text-primary-foreground"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-3 h-6 w-6" />
              Take Picture
            </Button>

            <div className="flex items-center gap-2 px-2 text-[11px] text-muted-foreground italic">
              <AlertCircle className="h-3 w-3" />
              <span>Ensure the leaf is well-lit and clearly visible.</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="overflow-hidden rounded-3xl border-none shadow-2xl">
            <img
              src={preview}
              alt="Crop preview"
              className="w-full h-80 object-cover"
            />
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-2xl border-2 hover:bg-background"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
            >
              <Upload className="mr-2 h-5 w-5" />
              Retake
            </Button>
            <Button
              size="lg"
              className="h-14 rounded-2xl font-bold shadow-lg bg-primary text-primary-foreground"
              onClick={handleAnalyze}
            >
              Analyze Plant
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScanPage;
