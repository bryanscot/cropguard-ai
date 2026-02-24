import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

const ScanningAnimation = () => (
  <div className="flex flex-col items-center justify-center gap-6 py-12">
    <div className="relative">
      <motion.div
        className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="h-10 w-10 text-primary leaf-spin" />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/20"
        animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
    </div>
    <div className="text-center">
      <p className="text-lg font-semibold text-foreground">Pathologist scanning leaf...</p>
      <p className="text-sm text-muted-foreground mt-1">AI is analyzing your crop image</p>
    </div>
  </div>
);

export default ScanningAnimation;
