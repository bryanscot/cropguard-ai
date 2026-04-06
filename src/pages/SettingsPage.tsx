import { useLanguage } from "@/contexts/LanguageContext";
import { getStoredScans, clearScans, getScanCount } from "@/lib/storage";
import { Globe, Info, Database, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { language, setLanguage, t, tWithCount } = useLanguage();
  const [scanCount, setScanCount] = useState(0);

  // Load the current number of scans on mount
  useEffect(() => {
    // Replace:
    // const scans = getStoredScans();
    // setScanCount(scans.length);

    // With:
    getScanCount().then(setScanCount);
  }, []);

 const handleClearHistory = async () => {
  if (window.confirm(t("clear_confirm"))) {
    await clearScans();
    setScanCount(0);
    toast.success(t("history_cleared"));
  }
};

  return (
    <div className="min-h-screen pb-24 px-5 pt-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {t("settings")}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">{t("customize")}</p>
      </motion.div>

      <div className="space-y-4">
        {/* Language Card */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {t("language")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={language}
              onValueChange={(val: any) => setLanguage(val)}
            >
              <SelectTrigger className="rounded-xl border-muted bg-muted/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Kiswahili</SelectItem>
                <SelectItem value="ha">Hausa</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Storage Management Section */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Storage Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center bg-muted/20 p-3 rounded-xl">
              {/* <div>
                <p className="text-xs font-medium text-foreground">
                  Saved Scans
                </p>
                
                <p className="text-[10px] text-muted-foreground">
                  {tWithCount("scans_used", scanCount)}
                </p>
              </div> */}
              
            <div className="flex justify-between items-center bg-muted/20 p-3 rounded-xl">
              <div>
                <p className="text-xs font-medium text-foreground">{t("saved_scans")}</p>
                <p className="text-[10px] text-muted-foreground">
                  {tWithCount("scans_saved_count", scanCount)}
                </p>
              </div>
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-primary">{scanCount}</span>
              </div>
            </div>
            </div>

            <Button
              variant="destructive"
              className="w-full rounded-xl gap-2 h-11 text-xs font-bold"
              onClick={handleClearHistory}
              disabled={scanCount === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear All History
            </Button>
          </CardContent>
        </Card>

        {/* About Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              {t("about")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center text-[10px] font-bold text-primary">
              <span>VERSION</span>
              <span>1.0.4 (PRO)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
