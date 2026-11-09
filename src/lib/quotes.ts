import type { Localized } from "./sites";

export interface SacredQuote {
  id: string;
  arabic: string;
  translation: Omit<Localized, "ar">;
  source: Localized;
}

export const QUOTES: SacredQuote[] = [
  {
    id: "nahl-125",
    arabic: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
    translation: {
      en: "Invite to the way of your Lord with wisdom and beautiful counsel.",
      ml: "നിന്റെ നാഥന്റെ മാർഗത്തിലേക്ക് യുക്തിയോടും സദുപദേശത്തോടും കൂടി ക്ഷണിക്കുക.",
    },
    source: { en: "Qur'an 16:125", ml: "ഖുർആൻ 16:125", ar: "سورة النحل ١٢٥" },
  },
  {
    id: "hadith-rifq",
    arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ",
    translation: {
      en: "Indeed, God is gentle and loves gentleness.",
      ml: "തീർച്ചയായും അല്ലാഹു സൗമ്യനാണ്; അവൻ സൗമ്യത ഇഷ്ടപ്പെടുന്നു.",
    },
    source: { en: "Hadith · Sahih Muslim", ml: "ഹദീസ് · സ്വഹീഹ് മുസ്‌ലിം", ar: "حديث · صحيح مسلم" },
  },
  {
    id: "hikam-11",
    arabic: "ادْفِنْ وُجُودَكَ فِي أَرْضِ الْخُمُولِ، فَمَا نَبَتَ مِمَّا لَمْ يُدْفَنْ لَا يَتِمُّ نِتَاجُهُ",
    translation: {
      en: "Bury your existence in the earth of obscurity; what sprouts unburied never fully ripens.",
      ml: "നിന്റെ അസ്തിത്വത്തെ അപ്രശസ്തിയുടെ മണ്ണിൽ കുഴിച്ചിടുക; കുഴിച്ചിടാതെ മുളച്ചത് പൂർണമായി വിളയുകയില്ല.",
    },
    source: { en: "Ibn Ata'illah · al-Hikam", ml: "ഇബ്നു അത്വാഇല്ല · അൽ-ഹികം", ar: "ابن عطاء الله · الحِكَم" },
  },
  {
    id: "rad-28",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: {
      en: "Truly, in the remembrance of God do hearts find rest.",
      ml: "അറിയുക, അല്ലാഹുവിന്റെ സ്മരണ കൊണ്ടാണ് ഹൃദയങ്ങൾ ശാന്തമാകുന്നത്.",
    },
    source: { en: "Qur'an 13:28", ml: "ഖുർആൻ 13:28", ar: "سورة الرعد ٢٨" },
  },
];
