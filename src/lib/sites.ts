export const SITE_KINDS = ["maqam", "zawiya", "dargah", "gathering"] as const;
export type SiteKind = (typeof SITE_KINDS)[number];

export type Lang = "en" | "ml" | "ar";
export type Localized = Record<Lang, string>;

export const DISTRICTS = {
  thiruvananthapuram: { en: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം", ar: "ثيروفانانثابورام" },
  kollam: { en: "Kollam", ml: "കൊല്ലം", ar: "كولام" },
  pathanamthitta: { en: "Pathanamthitta", ml: "പത്തനംതിട്ട", ar: "باتانامثيتا" },
  alappuzha: { en: "Alappuzha", ml: "ആലപ്പുഴ", ar: "ألابوزا" },
  kottayam: { en: "Kottayam", ml: "കോട്ടയം", ar: "كوتايام" },
  idukki: { en: "Idukki", ml: "ഇടുക്കി", ar: "إدوكي" },
  ernakulam: { en: "Ernakulam", ml: "എറണാകുളം", ar: "إرناكولام" },
  thrissur: { en: "Thrissur", ml: "തൃശ്ശൂർ", ar: "تريشور" },
  palakkad: { en: "Palakkad", ml: "പാലക്കാട്", ar: "بالاكاد" },
  malappuram: { en: "Malappuram", ml: "മലപ്പുറം", ar: "مالابورام" },
  kozhikode: { en: "Kozhikode", ml: "കോഴിക്കോട്", ar: "كوزيكود" },
  wayanad: { en: "Wayanad", ml: "വയനാട്", ar: "وايناد" },
  kannur: { en: "Kannur", ml: "കണ്ണൂർ", ar: "كانور" },
  kasaragod: { en: "Kasaragod", ml: "കാസർഗോഡ്", ar: "كاسارجود" },
} satisfies Record<string, Localized>;

export type District = keyof typeof DISTRICTS;
export const DISTRICT_KEYS = Object.keys(DISTRICTS) as District[];

export interface Site {
  id: string;
  kind: SiteKind;
  district: District;
  lat: number;
  lng: number;
  name: Localized;
  summary: Localized;
  /** Only gatherings carry a recurring schedule. */
  schedule?: Localized;
}

/** Kerala's approximate bounding box — every listing must fall inside it. */
export const KERALA_BOUNDS = { minLat: 8.1, maxLat: 12.85, minLng: 74.8, maxLng: 77.45 } as const;
export const KERALA_CENTER = { lat: 10.45, lng: 76.2 } as const;

export function isInKerala(lat: number, lng: number) {
  return (
    lat >= KERALA_BOUNDS.minLat &&
    lat <= KERALA_BOUNDS.maxLat &&
    lng >= KERALA_BOUNDS.minLng &&
    lng <= KERALA_BOUNDS.maxLng
  );
}

/** Sample listings — coordinates are approximate and await steward verification. */
export const SITES: Site[] = [
  {
    id: "beemapally",
    kind: "dargah",
    district: "thiruvananthapuram",
    lat: 8.4646,
    lng: 76.9431,
    name: { en: "Beemapally Dargah Sharif", ml: "ബീമാപള്ളി ദർഗ ശരീഫ്", ar: "ضريح بيما بالي الشريف" },
    summary: {
      en: "Seaside resting place of Sayyidathunnisa Beema Beevi and her son, visited by seekers of every faith.",
      ml: "സയ്യിദത്തുന്നിസ ബീമാ ബീവിയുടെയും മകന്റെയും കടലോര അന്ത്യവിശ്രമ സ്ഥലം; എല്ലാ വിശ്വാസക്കാരും സന്ദർശിക്കുന്നു.",
      ar: "مرقد السيدة بيما بيفي وابنها على شاطئ البحر، يزوره الطالبون من كل الأديان.",
    },
  },
  {
    id: "kanjiramattom",
    kind: "dargah",
    district: "ernakulam",
    lat: 9.8826,
    lng: 76.4093,
    name: { en: "Kanjiramattom Dargah", ml: "കാഞ്ഞിരമറ്റം ദർഗ", ar: "ضريح كانجيراماتوم" },
    summary: {
      en: "Shrine associated with Sheikh Fariduddin, known for its gentle Kodikuthu flag-hoisting festival.",
      ml: "ശൈഖ് ഫരീദുദ്ദീനുമായി ബന്ധപ്പെട്ട ദർഗ; കൊടികുത്ത് ഉത്സവത്തിന് പ്രസിദ്ധം.",
      ar: "مقام مرتبط بالشيخ فريد الدين، يُعرف بمهرجان رفع الراية.",
    },
  },
  {
    id: "mamburam",
    kind: "maqam",
    district: "malappuram",
    lat: 11.0457,
    lng: 75.9262,
    name: { en: "Mamburam Maqam", ml: "മമ്പുറം മഖാം", ar: "مقام مامبورام" },
    summary: {
      en: "Maqam of Sayyid Alawi Thangal on the banks of the Kadalundi river, a place of quiet prayer.",
      ml: "കടലുണ്ടിപ്പുഴയോരത്തെ സയ്യിദ് അലവി തങ്ങളുടെ മഖാം; ശാന്തമായ പ്രാർത്ഥനയുടെ ഇടം.",
      ar: "مقام السيد علوي ثنغل على ضفاف نهر كادالوندي، موضع دعاء هادئ.",
    },
  },
  {
    id: "ponnani-dars",
    kind: "zawiya",
    district: "malappuram",
    lat: 10.7759,
    lng: 75.9238,
    name: { en: "Ponnani Valiya Palli Dars", ml: "പൊന്നാനി വലിയ പള്ളി ദർസ്", ar: "درس جامع بوناني الكبير" },
    summary: {
      en: "Historic seat of learning linked to the Makhdum scholars, long called the Makkah of Malabar.",
      ml: "മഖ്ദൂം പണ്ഡിതരുമായി ബന്ധപ്പെട്ട ചരിത്രപ്രസിദ്ധമായ വിജ്ഞാനകേന്ദ്രം; മലബാറിന്റെ മക്ക.",
      ar: "مجلس علم تاريخي مرتبط بعلماء المخدوم، لُقّبت بوناني بمكة مليبار.",
    },
  },
  {
    id: "malik-dinar",
    kind: "maqam",
    district: "kasaragod",
    lat: 12.4893,
    lng: 74.9917,
    name: { en: "Malik Dinar Maqam, Thalangara", ml: "മാലിക് ദീനാർ മഖാം, തളങ്കര", ar: "مقام مالك بن دينار، ثالانغارا" },
    summary: {
      en: "Among Kerala's earliest Muslim sites, honouring companions of the Malik Dinar mission.",
      ml: "കേരളത്തിലെ ആദ്യകാല മുസ്‌ലിം കേന്ദ്രങ്ങളിലൊന്ന്; മാലിക് ദീനാർ സംഘത്തിന്റെ സ്മരണ.",
      ar: "من أقدم المواقع الإسلامية في كيرالا، تخليدًا لأصحاب بعثة مالك بن دينار.",
    },
  },
  {
    id: "kondotty-jaram",
    kind: "dargah",
    district: "malappuram",
    lat: 11.1466,
    lng: 75.9612,
    name: { en: "Kondotty Valiya Jaram", ml: "കൊണ്ടോട്ടി വലിയ ജാറം", ar: "الضريح الكبير في كوندوتي" },
    summary: {
      en: "Resting place of Muhammad Shah Thangal, centre of a long-standing Sufi lineage in Malabar.",
      ml: "മുഹമ്മദ് ഷാ തങ്ങളുടെ അന്ത്യവിശ്രമ സ്ഥലം; മലബാറിലെ സൂഫി പാരമ്പര്യത്തിന്റെ കേന്ദ്രം.",
      ar: "مرقد محمد شاه ثنغل، مركز سلسلة صوفية عريقة في مليبار.",
    },
  },
  {
    id: "odungakkad",
    kind: "maqam",
    district: "kozhikode",
    lat: 11.4122,
    lng: 75.9358,
    name: { en: "Odungakkad Maqam", ml: "ഓടുങ്ങാക്കാട് മഖാം", ar: "مقام أودونغاكاد" },
    summary: {
      en: "Hillside maqam near Thamarassery where travellers pause before climbing to Wayanad.",
      ml: "താമരശ്ശേരിക്കടുത്ത കുന്നിൻചെരുവിലെ മഖാം; വയനാട്ടിലേക്കുള്ള യാത്രക്കാർ ഇവിടെ ഒരു നിമിഷം നിൽക്കുന്നു.",
      ar: "مقام على سفح التل قرب ثاماراسيري، يتوقف عنده المسافرون قبل الصعود إلى وايناد.",
    },
  },
  {
    id: "mamburam-nercha",
    kind: "gathering",
    district: "malappuram",
    lat: 11.0466,
    lng: 75.9281,
    name: { en: "Mamburam Aandu Nercha", ml: "മമ്പുറം ആണ്ട് നേർച്ച", ar: "ذكرى مامبورام السنوية" },
    summary: {
      en: "Annual remembrance of Sayyid Alawi Thangal with recitation, du'a and shared food.",
      ml: "സയ്യിദ് അലവി തങ്ങളുടെ വാർഷിക അനുസ്മരണം; പാരായണം, ദുആ, അന്നദാനം.",
      ar: "ذكرى سنوية للسيد علوي ثنغل بالتلاوة والدعاء والطعام المشترك.",
    },
    schedule: { en: "Annually, in Muharram", ml: "വർഷംതോറും, മുഹർറം മാസത്തിൽ", ar: "سنويًا في شهر محرم" },
  },
  {
    id: "kondotty-nercha",
    kind: "gathering",
    district: "malappuram",
    lat: 11.1479,
    lng: 75.9628,
    name: { en: "Kondotty Nercha", ml: "കൊണ്ടോട്ടി നേർച്ച", ar: "نيرتشا كوندوتي" },
    summary: {
      en: "A historic communal festival around the Valiya Jaram, with processions and song.",
      ml: "വലിയ ജാറം കേന്ദ്രീകരിച്ചുള്ള ചരിത്രപ്രസിദ്ധമായ നേർച്ച; ഘോഷയാത്രയും പാട്ടും.",
      ar: "احتفال جماعي تاريخي حول الضريح الكبير، بالمواكب والإنشاد.",
    },
    schedule: { en: "Annually", ml: "വർഷംതോറും", ar: "سنويًا" },
  },
  {
    id: "swalath-majlis",
    kind: "gathering",
    district: "malappuram",
    lat: 11.059,
    lng: 76.094,
    name: { en: "Swalath Majlis, Swalath Nagar", ml: "സ്വലാത്ത് മജ്‌ലിസ്, സ്വലാത്ത് നഗർ", ar: "مجلس الصلوات، صلوات نجر" },
    summary: {
      en: "A large gathering of salawat upon the Prophet ﷺ, held in an open courtyard.",
      ml: "പ്രവാചകരുടെ ﷺ മേൽ സ്വലാത്ത് ചൊല്ലുന്ന വലിയ സംഗമം; തുറന്ന മുറ്റത്ത്.",
      ar: "مجلس كبير للصلاة على النبي ﷺ يُقام في ساحة مفتوحة.",
    },
    schedule: { en: "Monthly", ml: "മാസംതോറും", ar: "شهريًا" },
  },
];

export function filterSites(sites: Site[], query: string, kind: SiteKind | "all") {
  const q = query.trim().toLowerCase();
  return sites.filter((s) => {
    if (kind !== "all" && s.kind !== kind) return false;
    if (!q) return true;
    const haystack = [...Object.values(s.name), ...Object.values(DISTRICTS[s.district])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
