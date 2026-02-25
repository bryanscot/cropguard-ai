import { useLocation, useNavigate } from "react-router-dom";
import { ScanResult } from "@/lib/storage"; // Updated to point to your new storage types
import {
  ArrowLeft,
  Leaf,
  FlaskConical,
  ShieldCheck,
  CheckCircle,
  Info,
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

  return (
    <div className="min-h-screen pb-24 px-5 pt-6 bg-background">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4 -ml-2 hover:bg-transparent"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Image Preview Card */}
        {scan.imageUrl && (
          <Card className="overflow-hidden mb-4 border-none shadow-md rounded-3xl">
            <img
              src={scan.imageUrl}
              alt={scan.plantName}
              className="w-full h-56 object-cover"
            />
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
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {scan.plantName}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                {scan.diseaseName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2 opacity-70">
                Scanned on {scan.date}
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
              Prevention & Long-term Care
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
