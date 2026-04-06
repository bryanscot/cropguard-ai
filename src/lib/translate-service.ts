// src/lib/translate-service.ts
// Translates dynamic API content using MyMemory (free, no key needed)
// Supports: en, sw, fr, hi, ha

const CACHE = new Map<string, string>();

// Maps your app language codes to MyMemory language codes
const LANG_MAP: Record<string, string> = {
  en: "en",
  sw: "sw",
  fr: "fr",
  hi: "hi",
  ha: "ha",
};

export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  // Return as-is if English or empty
  if (!text?.trim() || targetLang === "en") return text;

  const target = LANG_MAP[targetLang] || "sw";
  const cacheKey = `${target}::${text}`;

  // Return cached result if available
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey)!;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data?.responseData?.translatedText || text;
    CACHE.set(cacheKey, translated);
    return translated;
  } catch {
    return text; // Fallback to English if translation fails
  }
}

export async function translateArray(
  items: string[],
  targetLang: string,
): Promise<string[]> {
  if (targetLang === "en") return items;
  return Promise.all(items.map((item) => translateText(item, targetLang)));
}
