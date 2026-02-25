import { useLocation, useNavigate } from "react-router-dom";
import { ScanResult } from "@/lib/storage";
import { useLanguage } from "@/contexts/LanguageContext"; // Added for translation
import {
  ArrowLeft,
  Leaf,
  FlaskConical,
  ShieldCheck,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadialProgress from "@/components/RadialProgress";
import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage(); // Initialize translation hook

  // Retrieve scan data from navigation state
  const scan = location.state?.scan as ScanResult | undefined;

  useEffect(() => {
    // Trigger celebration for healthy plants with high confidence
    if (scan?.status === "healthy" && scan.confidence >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2D5A27", "#4CAF50", "#8BC34A", "#CDDC39"],
      });
    }
  }, [scan]);

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 px-5 bg-background">
        <div className="text-center max-w-xs">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="text-muted-foreground w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn't find any scan results. Please try scanning a leaf again.
          </p>
          <Button
            className="w-full rounded-xl"
            onClick={() => navigate("/scan")}
          >
            Start New Scan
          </Button>
        </div>
      </div>
    );
  }

  const isHealthy = scan.status === "healthy";
  const isLowConfidence = scan.confidence < 40; // Threshold for the warning badge

  return (
    <div className="min-h-screen pb-24 px-5 pt-6 bg-background">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4 -ml-2 hover:bg-transparent"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t("home")}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Image Preview Card */}
        {scan.imageUrl && (
          <Card className="overflow-hidden mb-4 border-none shadow-md rounded-3xl relative">
            <img
              src={scan.imageUrl}
              alt={scan.plantName}
              className="w-full h-56 object-cover"
            />
            {/* Low Confidence Warning Overlay */}
            {isLowConfidence && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">
                  Low Certainty
                </span>
              </div>
            )}
          </Card>
        )}

        {/* Diagnosis Result Card */}
        <Card className="mb-4 border-none shadow-md rounded-3xl">
          <CardContent className="flex items-center gap-5 p-5">
            <RadialProgress value={scan.confidence} size={90} strokeWidth={8} />
            <div className="flex-1">
              <Badge
                className={`mb-2 text-[10px] uppercase tracking-wider font-bold py-1 px-2 ${
                  isHealthy
                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-0"
                }`}
              >
                {isHealthy ? "✅ Healthy" : "⚠️ Issue Detected"}
              </Badge>

              {/* Primary: Common (Normal) Name */}
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {scan.plantName}
              </h2>

              {/* Secondary: Scientific Name (Italicized) */}
              {scan.scientificName && (
                <p className="text-[11px] text-muted-foreground italic font-medium">
                  {scan.scientificName}
                </p>
              )}

              {/* Disease Name */}
              <p className="text-muted-foreground text-sm font-medium mt-1">
                {scan.diseaseName}
              </p>

              <p className="text-[10px] text-muted-foreground mt-2 opacity-70">
                {scan.date}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Recommendation Section */}
        {!isHealthy && (
          <Tabs defaultValue="organic" className="mb-4">
            <TabsList className="w-full bg-muted/50 p-1 rounded-2xl h-12">
              <TabsTrigger
                value="organic"
                className="rounded-xl flex-1 gap-1.5 data-[state=active]:shadow-sm"
              >
                <Leaf className="h-3.5 w-3.5" />
                Organic
              </TabsTrigger>
              <TabsTrigger
                value="chemical"
                className="rounded-xl flex-1 gap-1.5 data-[state=active]:shadow-sm"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                Chemical
              </TabsTrigger>
            </TabsList>

            <TabsContent value="organic">
              <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-primary">
                    Biological Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scan.organicTreatment.map((tip, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start bg-green-50/50 p-3 rounded-xl border border-green-100/50"
                    >
                      <Leaf className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-foreground leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chemical">
              <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-orange-600">
                    Chemical Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scan.chemicalTreatment.map((tip, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start bg-orange-50/50 p-3 rounded-xl border border-orange-100/50"
                    >
                      <FlaskConical className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-foreground leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Prevention and Maintenance Card */}
        <Card className="border-none shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" />
              {t("prevention_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {scan.preventionTips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="bg-primary/10 p-1 rounded-full shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Confidence Re-scan Suggestion */}
        {isLowConfidence && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl">
            <p className="text-xs text-yellow-800 leading-relaxed font-medium">
              Note: The AI confidence is low. For a more accurate result, ensure
              your photo is clear, centered, and well-lit before trying again.
            </p>
            <Button
              variant="outline"
              className="w-full mt-3 border-yellow-300 text-yellow-800 hover:bg-yellow-100 rounded-xl h-10"
              onClick={() => navigate("/scan")}
            >
              Re-scan Image
            </Button>
          </div>
        )}

        <div className="mt-8 text-center px-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            Disclaimer: AI diagnoses are for informational purposes. Consult a
            local agricultural officer for severe infestations.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;
