import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScanningAnimation from "@/components/ScanningAnimation";
import { simulateAnalysis } from "@/lib/mock-data";
import { saveScan } from "@/lib/storage";
import { motion } from "framer-motion";

const ScanPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    try {
      const result = await simulateAnalysis();
      result.imageUrl = preview;
      saveScan(result);
      navigate(`/result/${result.id}`, { state: { scan: result } });
    } catch (err) {
      console.error("Analysis failed:", err);
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
      <div className="min-h-screen flex items-center justify-center pb-24 px-5">
        <ScanningAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-5 pt-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Scan Your Crop</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Upload or take a photo for AI diagnosis
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
          transition={{ delay: 0.1 }}
        >
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Drop image here</p>
                <p className="text-sm text-muted-foreground mt-1">or tap to browse files</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Button
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-semibold"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Photo
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card className="overflow-hidden">
            <img
              src={preview}
              alt="Crop preview"
              className="w-full h-64 object-cover"
            />
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl"
              onClick={() => {
                setPreview(null);
                fileInputRef.current?.click();
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Change
            </Button>
            <Button
              size="lg"
              className="h-12 rounded-xl font-semibold"
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
