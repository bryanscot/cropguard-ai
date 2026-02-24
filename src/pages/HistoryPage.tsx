import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScanCard from "@/components/ScanCard";
import { getStoredScans } from "@/lib/storage";
import { mockScans } from "@/lib/mock-data";
import { motion } from "framer-motion";

const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const storedScans = getStoredScans();
  const allScans = storedScans.length > 0 ? storedScans : mockScans;

  const filtered = useMemo(() => {
    if (!query.trim()) return allScans;
    const q = query.toLowerCase();
    return allScans.filter(
      (s) =>
        s.plantName.toLowerCase().includes(q) ||
        s.diseaseName.toLowerCase().includes(q)
    );
  }, [query, allScans]);

  return (
    <div className="min-h-screen pb-24 px-5 pt-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Scan History</h1>
        <p className="text-muted-foreground text-sm mb-4">
          {allScans.length} diagnosis{allScans.length !== 1 ? "es" : ""} recorded
        </p>
      </motion.div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by plant or disease..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No results found</p>
        ) : (
          filtered.map((scan, i) => <ScanCard key={scan.id} scan={scan} index={i} />)
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
