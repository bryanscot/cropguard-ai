import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScanCard from "@/components/ScanCard";
import { getStoredScans, ScanResult } from "@/lib/storage";
import { mockScans } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const { t } = useLanguage();
 const [allScans, setAllScans] = useState<ScanResult[]>([]);

 useEffect(() => {
   getStoredScans().then((scans) => {
     setAllScans(scans.length > 0 ? scans : mockScans);
   });
 }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allScans;
    const q = query.toLowerCase();
    return allScans.filter(
      (s) =>
        s.plantName.toLowerCase().includes(q) ||
        s.diseaseName.toLowerCase().includes(q),
    );
  }, [query, allScans]);

  const diagnosisCount = allScans.length;
  const countLabel =
    diagnosisCount === 1 ? t("diagnosis_recorded") : t("diagnoses_recorded");

  return (
    <div className="min-h-screen pb-24 px-5 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {t("scan_history")}
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          {diagnosisCount} {countLabel}
        </p>
      </motion.div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {t("no_results")}
          </p>
        ) : (
          filtered.map((scan, i) => (
            <ScanCard key={scan.id} scan={scan} index={i} />
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
