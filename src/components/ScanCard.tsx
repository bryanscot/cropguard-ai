import { ScanResult } from "@/types/scan";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface ScanCardProps {
  scan: ScanResult;
  index?: number;
}

const ScanCard = ({ scan, index = 0 }: ScanCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isHealthy = scan.status === "healthy";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow border-border/60"
        onClick={() => navigate(`/result/${scan.id}`, { state: { scan } })}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${
              isHealthy ? "bg-success/10" : "bg-warning/10"
            }`}
          >
            {isHealthy ? (
              <CheckCircle className="h-7 w-7 text-success" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-warning" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {scan.plantName}
              </h3>
              <Badge
                variant={isHealthy ? "default" : "secondary"}
                className={`text-[10px] shrink-0 ${
                  isHealthy
                    ? "bg-success/15 text-success hover:bg-success/20 border-0"
                    : "bg-warning/15 text-warning hover:bg-warning/20 border-0"
                }`}
              >
                {isHealthy ? t("healthy") : t("action_required")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{scan.diseaseName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{scan.date}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-bold text-foreground">
              {scan.confidence}%
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScanCard;
