import { useLocation, useNavigate } from "react-router-dom";
import { ScanResult } from "@/types/scan";
import { ArrowLeft, Leaf, FlaskConical, ShieldCheck, CheckCircle } from "lucide-react";
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
  const scan = location.state?.scan as ScanResult | undefined;

  useEffect(() => {
    if (scan?.status === "healthy" && scan.confidence >= 95) {
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
      <div className="min-h-screen flex items-center justify-center pb-24 px-5">
        <div className="text-center">
          <p className="text-muted-foreground">No scan data found</p>
          <Button className="mt-4" onClick={() => navigate("/scan")}>
            Start a Scan
          </Button>
        </div>
      </div>
    );
  }

  const isHealthy = scan.status === "healthy";

  return (
    <div className="min-h-screen pb-24 px-5 pt-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        {/* Image Preview */}
        {scan.imageUrl && (
          <Card className="overflow-hidden mb-4">
            <img src={scan.imageUrl} alt={scan.plantName} className="w-full h-48 object-cover" />
          </Card>
        )}

        {/* Diagnosis Card */}
        <Card className="mb-4">
          <CardContent className="flex items-center gap-5 p-5">
            <RadialProgress value={scan.confidence} size={100} strokeWidth={8} />
            <div className="flex-1">
              <Badge
                className={`mb-2 text-xs ${
                  isHealthy
                    ? "bg-success/15 text-success border-0"
                    : "bg-warning/15 text-warning border-0"
                }`}
              >
                {isHealthy ? "✅ Healthy" : "⚠️ Action Required"}
              </Badge>
              <h2 className="text-xl font-bold text-foreground">{scan.plantName}</h2>
              <p className="text-muted-foreground text-sm">{scan.diseaseName}</p>
              <p className="text-xs text-muted-foreground mt-1">{scan.date}</p>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Tabs */}
        {!isHealthy && (
          <Tabs defaultValue="organic" className="mb-4">
            <TabsList className="w-full">
              <TabsTrigger value="organic" className="flex-1 gap-1.5">
                <Leaf className="h-3.5 w-3.5" />
                Organic
              </TabsTrigger>
              <TabsTrigger value="chemical" className="flex-1 gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" />
                Chemical
              </TabsTrigger>
            </TabsList>
            <TabsContent value="organic">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Organic Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {scan.organicTreatment.map((tip, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Leaf className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="chemical">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Chemical Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {scan.chemicalTreatment.map((tip, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <FlaskConical className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Prevention Tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Prevention Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scan.preventionTips.map((tip, i) => (
              <div key={i} className="flex gap-2 items-start">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultPage;
