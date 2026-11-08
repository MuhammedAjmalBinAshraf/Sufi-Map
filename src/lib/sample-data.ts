import { Database } from "@/types/database";

type Place = Database["public"]["Tables"]["places"]["Row"];
type Person = Database["public"]["Tables"]["persons"]["Row"];
type Gathering = Database["public"]["Tables"]["gatherings"]["Row"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];
type Badge = Database["public"]["Tables"]["badges"]["Row"];

export const SAMPLE_QUOTES: Quote[] = [
  {
    id: "q-1",
    created_at: new Date().toISOString(),
    created_by: null,
    arabic:
      "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ",
    english:
      "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best.",
    source: "Holy Quran, Surah An-Nahl (16:125)",
    active: true,
  },
  {
    id: "q-2",
    created_at: new Date().toISOString(),
    created_by: null,
    arabic: "يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا",
    english:
      "Make things easy, not hard; give glad tidings, and do not drive people away.",
    source: "Prophetic Hadith (Sahih al-Bukhari 69, Sahih Muslim 1734)",
    active: true,
  },
  {
    id: "q-3",
    created_at: new Date().toISOString(),
    created_by: null,
    arabic:
      "لَا تَصْحَبْ مَنْ لَا يُنْهِضُكَ حَالُهُ، وَلَا يَدُلُّكَ عَلَى اللَّهِ مَقَالُهُ",
    english:
      "Do not accompany anyone whose spiritual state does not elevate you, and whose words do not point you toward God.",
    source: "Ibn Ata'illah al-Iskandari (Al-Hikam al-Ata'iyyah, Aph. 26)",
    active: true,
  },
];

export const SAMPLE_BADGES: Badge[] = [
  {
    id: "musafir",
    name: "Musafir",
    description: "The Traveler: 1 approved entry with verified source",
    criteria_description: "1 approved entry with verified source",
    icon_name: "Compass",
  },
  {
    id: "misbah",
    name: "Misbah",
    description: "The Lantern: 5 approved entries with verified sources",
    criteria_description: "5 approved entries with verified sources",
    icon_name: "Lamp",
  },
  {
    id: "hadiyya",
    name: "Hadiyya",
    description: "The Gift: 10 approved entries with verified sources",
    criteria_description: "10 approved entries with verified sources",
    icon_name: "Gift",
  },
  {
    id: "rafeeq",
    name: "Rafeeq",
    description: "The Companion: helped verify 5 entries submitted by others",
    criteria_description: "Helped verify 5 entries by others",
    icon_name: "Users",
  },
  {
    id: "nazir",
    name: "Nazir",
    description: "The Custodian: granted by an administrator for regional stewardship",
    criteria_description: "Appointed by an administrator for regional stewardship",
    icon_name: "ShieldCheck",
  },
];

export const SAMPLE_PLACES: Place[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    status: "approved",
    reviewed_by: null,
    reviewed_at: null,
    review_notes: null,
    name_en: "Mampuram Maqam",
    name_ml: "മമ്പുറം മഖാം",
    name_ar: "مقام مമ്പുറം الشريف",
    kind: "maqam",
    area: "Tirurangadi, West Malappuram",
    latitude: 11.0489,
    longitude: 75.9234,
    short_history_en:
      "Historical 18th-century sanctuary associated with Sayyid Alawi Mouladdawilah, known across Malabar as a focal center of spiritual instruction, welfare, and peaceful coexistence.",
    short_history_ml:
      "പതിനെട്ടാം നൂറ്റാണ്ടിലെ ആത്മീയ കേന്ദ്രം. സയ്യിദ് അലവി തങ്ങളുടെ ആത്മീയ സേവനങ്ങളാൽ പ്രശസ്തമായ തീർത്ഥാടന കേന്ദ്രം.",
    short_history_ar:
      "مقام مبارك يعود للقرن الثامن عشر ارتبط بالداعية السيد علوي مولى الدويلة في مليبار.",
    visiting_etiquette_en:
      "Dress modestly, maintain quiet reflection, and remove footwear before ascending the courtyard steps.",
    visiting_etiquette_ml:
      "മാന്യമായ വസ്ത്രധാരണം പാലിക്കുക, നിശ്ശബ്ദത പുലർത്തുക, പാദരക്ഷകൾ താഴെ അഴിച്ചുവെക്കുക.",
    visiting_etiquette_ar:
      "الرجاء ارتداء اللباس المحتشم، والتزام السكينة، وخلع الأحذية قبل دخول الصحن.",
    recurring_events_en:
      "Weekly Thursday Majlis after Maghrib; Annual Commemorative Uroos in the lunar month of Muharram.",
    recurring_events_ml:
      "എല്ലാ വ്യാഴാഴ്ചയും മഗ്‌രിബിന് ശേഷം മജ്‌ലിസ്; വാർഷിക ആണ്ടുനേർച്ച.",
    recurring_events_ar:
      "مجلس الذكر الأسبوعي مساء كل خميس؛ وحولية المولد السنوية.",
    photos: ["/images/sample-mampuram.jpg"],
    sources: [
      {
        title: "[SAMPLE] Record of Malabar Shrines",
        author: "K. E. M. Kutty",
        is_verified: true,
      },
    ],
    metadata: {},
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    status: "approved",
    reviewed_by: null,
    reviewed_at: null,
    review_notes: null,
    name_en: "Ponnani Valiya Juma Masjid & Makhdum Zawiya",
    name_ml: "പൊന്നാനി വലിയ ജുമുഅ മസ്ജിദ് & മഖ്ദൂം സാവിയ",
    name_ar: "جامع بوناني الكبير وزاوية المخدوم",
    kind: "zawiya",
    area: "Ponnani, West Malappuram",
    latitude: 10.7712,
    longitude: 75.9237,
    short_history_en:
      "Classical 16th-century center of Islamic scholarship and Sufi retreat established under the guidance of the Makhdum scholars.",
    short_history_ml:
      "പതിനാറാം നൂറ്റാണ്ടിലെ വിജ്ഞാന കേന്ദ്രവും മഖ്ദൂമുമാരുടെ ആത്മീയ താവളവുമായ സാവിയ.",
    short_history_ar:
      "مركز تاريخي للعلم والتصوف شيده علماء آل مخدوم في القرن السادس عشر.",
    visiting_etiquette_en:
      "Sanctuary of learning; silence mobile phones and respect prayer times.",
    visiting_etiquette_ml:
      "പഠന സദസ്സുകളെ ബഹുമാനിക്കുക, ഫോണുകൾ നിശ്ശബ്ദമാക്കുക.",
    visiting_etiquette_ar: "احترام حلقات العلم والهدوء داخل أروقة الجامع.",
    recurring_events_en:
      "Daily study halqas after Fajr; monthly Khatmul Quran majlis.",
    recurring_events_ml:
      "സുബ്ഹിക്ക് ശേഷം ദിവസേനയുള്ള ദർസ്; മാസത്തിലൊരിക്കൽ ഖത്മുകൾ.",
    recurring_events_ar:
      "حلقات العلم اليومية بعد صلاة الفجر ومجلس الختم الشهري.",
    photos: ["/images/sample-ponnani.jpg"],
    sources: [
      {
        title: "[SAMPLE] Tuhfat al-Mujahidin Historical Notes",
        author: "Zayn al-Din Makhdum",
        is_verified: true,
      },
    ],
    metadata: {},
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    status: "approved",
    reviewed_by: null,
    reviewed_at: null,
    review_notes: null,
    name_en: "Kondotty Qubba Dargah",
    name_ml: "കൊണ്ടോട്ടി ഖുബ്ബ ദർഗ",
    name_ar: "قبة كونودوتي الشريفة",
    kind: "dargah",
    area: "Kondotty, Malappuram",
    latitude: 11.1465,
    longitude: 75.9621,
    short_history_en:
      "18th-century sanctuary with Persian and Malabar architectural motifs associated with Muhammad Shah Bukhari.",
    short_history_ml:
      "മുഹമ്മദ് ഷാ ബുഖാരിയുടെ സ്മരണകളുറങ്ങുന്ന ചരിത്രപ്രസിദ്ധമായ സാംസ്കാരിക കേന്ദ്രം.",
    short_history_ar:
      "مزار ومجمع صوفي تاريخي في كوندوتي بني على الطراز المعماري التقليدي.",
    visiting_etiquette_en:
      "Maintain respectful tranquility within the courtyard.",
    visiting_etiquette_ml: "അങ്കണത്തിൽ സമാധാനാന്തരീക്ഷം പാലിക്കുക.",
    visiting_etiquette_ar: "التزام الأدب والوقار في فناء الضريح.",
    recurring_events_en:
      "Annual Nercha and Friday spiritual dhikr circle.",
    recurring_events_ml:
      "വെള്ളിയാഴ്ചകളിലെ ദിക്ർ മജ്‌ലിസ്, വാർഷിക നേർച്ച.",
    recurring_events_ar: "حلقة الذكر الأسبوعية بعد صلاة الجمعة.",
    photos: ["/images/sample-kondotty.jpg"],
    sources: [
      {
        title: "[SAMPLE] Waqf Regional Heritage Catalog",
        author: "Malabar Waqf Board",
        is_verified: true,
      },
    ],
    metadata: {},
  },
];

export const SAMPLE_PERSONS: Person[] = [
  {
    id: "44444444-4444-4444-4444-444444444444",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    status: "approved",
    reviewed_by: null,
    reviewed_at: null,
    review_notes: null,
    name_en: "Sayyid Alawi Mouladdawilah",
    name_ml: "സയ്യിദ് അലവി മൗലദ്ദവീല",
    name_ar: "السيد علوي بن سهل مولى الدويلة",
    is_living: false,
    consent_status: "not_applicable",
    short_history_en:
      "Esteemed 18th-century spiritual luminary and social reformer of Mampuram.",
    short_history_ml:
      "മമ്പുറത്തെ പ്രമുഖ ആത്മീയ നേതാവും പണ്ഡിതനുമായിരുന്ന മഹദ് വ്യക്തിത്വം.",
    short_history_ar: "عالم ومصلح روحي كبير عاش في منطقة مம்பുറം بمليبار.",
    photos: [],
    sources: [
      {
        title: "[SAMPLE] Al-Diyau al-Lami biography",
        author: "Local Chronicler",
        is_verified: true,
      },
    ],
    metadata: {},
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    status: "approved",
    reviewed_by: null,
    reviewed_at: null,
    review_notes: null,
    name_en: "Ustadh Ahmad al-Malabari",
    name_ml: "ഉസ്താദ് അഹ്മദ് അൽ മലബാരി",
    name_ar: "الأستاذ أحمد المليباري",
    is_living: true,
    consent_status: "granted", // Approved living Sufi with verified consent
    short_history_en:
      "Teacher of traditional tasawwuf texts and leader of public majlis gatherings in Tirurangadi.",
    short_history_ml:
      "തിരൂരങ്ങാടിയിൽ തസവ്വുഫ് ദർസുകൾ നടത്തുന്ന ആത്മീയ അധ്യാപകൻ.",
    short_history_ar: "مدرس كتب التصوف وقائد مجالس الذكر العامة في تيرورانجادي.",
    photos: [],
    sources: [
      {
        title: "[SAMPLE] Written consent on file with admin",
        author: "Signed Registry",
        is_verified: true,
      },
    ],
    metadata: {},
  },
];

export const SAMPLE_GATHERINGS: Gathering[] = [
  {
    id: "66666666-6666-6666-6666-666666666666",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    status: "approved",
    reviewed_by: null,
    reviewed_at: null,
    review_notes: null,
    person_id: "55555555-5555-5555-5555-555555555555",
    place_id: "11111111-1111-1111-1111-111111111111",
    title_en: "Weekly Ihya' Uloom al-Din Study Circle",
    title_ml: "ഇഹ്‌യാ ഉലൂമുദ്ദീൻ വായനാ സദസ്സ്",
    title_ar: "مجلس إحياء علوم الدين الأسبوعي",
    venue_name_en: "Tirurangadi Community Juma Masjid Hall", // Public venue only
    venue_name_ml: "തിരൂരങ്ങാടി കമ്മ്യൂണിറ്റി മസ്ജിദ് ഹാൾ",
    venue_name_ar: "قاعة جامع تيرورانجادي العامة",
    schedule_en: "Every Sunday morning from 7:30 AM to 9:00 AM",
    schedule_ml: "എല്ലാ ഞായറാഴ്ചയും രാവിലെ 7:30 മുതൽ 9:00 വരെ",
    schedule_ar: "صباح كل أحد من الساعة 7:30 إلى 9:00 صباحاً",
    latitude: 11.045,
    longitude: 75.921,
    sources: [
      {
        title: "[SAMPLE] Public Mosque Notice Board",
        author: "Masjid Committee",
        is_verified: true,
      },
    ],
    metadata: {},
  },
];
