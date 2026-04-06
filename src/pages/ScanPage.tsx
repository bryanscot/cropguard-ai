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
import { useLanguage } from "@/contexts/LanguageContext";

const ScanPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("upload_valid_image"));
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) {
      toast.error(t("select_image_first"));
      return;
    }
    setIsAnalyzing(true);
    try {
      const aiResponse = await analyzeWithPlantId(selectedFile);
      const result = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split("T")[0],
        imageUrl: preview,
        plantName: aiResponse.plantName || "Unknown Plant",
        scientificName: aiResponse.scientificName || "",
        diseaseName: aiResponse.diseaseName || "Healthy",
        status: (aiResponse.diseaseName === "Healthy" ||
        aiResponse.diseaseName === t("healthy")
          ? "healthy"
          : "action_required") as "healthy" | "action_required",
        confidence: aiResponse.confidence || 90,
        organicTreatment: aiResponse.organicTreatment || [],
        chemicalTreatment: aiResponse.chemicalTreatment || [],
        preventionTips: aiResponse.preventionTips || [],
      };
      // To:
      await saveScan(result);
      navigate(`/result/${result.id}`, { state: { scan: result } });
      toast.success(t("analysis_complete"));
    } catch (err) {
      console.error("Analysis failed:", err);
      toast.error(t("analysis_failed"));
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
          {t("analyzing")}
        </p>
        <p className="mt-2 text-muted-foreground text-xs animate-pulse">
          {t("translating")}
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
          {t("scan_your_crop")}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {t("scan_subtitle")}
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
                  {t("drop_image")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("tap_browse")}
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
              {t("take_picture")}
            </Button>
            <div className="flex items-center gap-2 px-2 text-[11px] text-muted-foreground italic">
              <AlertCircle className="h-3 w-3" />
              <span>{t("image_tip")}</span>
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
              {t("retake")}
            </Button>
            <Button
              size="lg"
              className="h-14 rounded-2xl font-bold shadow-lg bg-primary text-primary-foreground"
              onClick={handleAnalyze}
            >
              {t("analyze")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScanPage;
