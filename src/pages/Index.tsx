import { useNavigate } from "react-router-dom";
import { Camera, Leaf, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScanCard from "@/components/ScanCard";
import { mockScans } from "@/lib/mock-data";
import { getStoredScans } from "@/lib/storage";
import { motion } from "framer-motion";
import heroCrop from "@/assets/hero-crop.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const storedScans = getStoredScans();
  const allScans = storedScans.length > 0 ? storedScans : mockScans;
  const recentScans = allScans.slice(0, 5);

  const stats = [
    { icon: Leaf, label: "Total Scans", value: allScans.length, color: "text-primary" },
    {
      icon: Shield,
      label: "Healthy",
      value: allScans.filter((s) => s.status === "healthy").length,
      color: "text-success",
    },
    {
      icon: TrendingUp,
      label: "Issues Found",
      value: allScans.filter((s) => s.status === "action_required").length,
      color: "text-warning",
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0">
          <img src={heroCrop} alt="Lush green crops" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative px-5 pb-8 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="h-5 w-5 text-primary-foreground/80" />
              <span className="text-sm font-medium text-primary-foreground/80">CropGuard AI</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground mb-1">
              Good morning, Farmer! 🌱
            </h1>
            <p className="text-primary-foreground/70 text-sm">
              Keep your crops healthy with AI-powered diagnostics
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6"
          >
            <Button
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => navigate("/scan")}
            >
              <Camera className="mr-2 h-5 w-5" />
              Scan New Plant
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="border-border/40">
                <CardContent className="flex flex-col items-center p-3">
                  <stat.icon className={`h-5 w-5 mb-1 ${stat.color}`} />
                  <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{stat.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Scans</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary text-sm"
            onClick={() => navigate("/history")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentScans.map((scan, index) => (
            <ScanCard key={scan.id} scan={scan} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
