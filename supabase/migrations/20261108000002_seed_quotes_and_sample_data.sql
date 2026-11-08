-- 20261108000002_seed_quotes_and_sample_data.sql
-- Sufi Map: Seed Badges, Verified Quotes, and SAMPLE Seed Data for West Malappuram

-- 1. Seed Badges (Everyday names, no spiritual ranks)
insert into public.badges (id, name, description, criteria_description, icon_name)
values
  (
    'musafir',
    'Musafir (The Traveler)',
    'Awarded for your first approved and verified contribution.',
    '1 approved entry with verified source',
    'Compass'
  ),
  (
    'misbah',
    'Misbah (The Lantern)',
    'Awarded for illuminating the map with five carefully verified sacred places or gatherings.',
    '5 approved entries with verified sources',
    'Lamp'
  ),
  (
    'hadiyya',
    'Hadiyya (The Gift)',
    'Awarded for offering ten high-quality sanctuary records to the community.',
    '10 approved entries with verified sources',
    'Gift'
  ),
  (
    'rafeeq',
    'Rafeeq (The Companion)',
    'Awarded for helping review, verify, or improve entries submitted by fellow travelers.',
    'Helped verify 5 entries by others',
    'Users'
  ),
  (
    'nazir',
    'Nazir (The Custodian)',
    'Granted by a sanctuary administrator for dedicated stewardship of a specific regional area.',
    'Appointed by an administrator for regional stewardship',
    'ShieldCheck'
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  criteria_description = excluded.criteria_description,
  icon_name = excluded.icon_name;

-- 2. Seed Verified Quotations on Inviting with Wisdom & Kindness
insert into public.quotes (arabic, english, source, active)
values
  (
    'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ',
    'Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best.',
    'Holy Quran, Surah An-Nahl (16:125)',
    true
  ),
  (
    'يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا',
    'Make things easy, not hard; give glad tidings, and do not drive people away.',
    'Prophetic Hadith (Sahih al-Bukhari 69, Sahih Muslim 1734)',
    true
  ),
  (
    'لَا تَصْحَبْ مَنْ لَا يُنْهِضُكَ حَالُهُ، وَلَا يَدُلُّكَ عَلَى اللَّهِ مَقَالُهُ',
    'Do not accompany anyone whose spiritual state does not elevate you, and whose words do not point you toward God.',
    'Ibn Ata''illah al-Iskandari (Al-Hikam al-Ata''iyyah, Aph. 26)',
    true
  );

-- 3. Seed Sample Places (West Malappuram, Kerala)
-- ETHICAL RULE: Seed data is explicitly marked [SAMPLE] and makes no unverified historical claims.
insert into public.places (
  id,
  status,
  name_en,
  name_ml,
  name_ar,
  kind,
  area,
  latitude,
  longitude,
  short_history_en,
  short_history_ml,
  short_history_ar,
  visiting_etiquette_en,
  visiting_etiquette_ml,
  visiting_etiquette_ar,
  recurring_events_en,
  recurring_events_ml,
  recurring_events_ar,
  sources
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'approved',
    '[SAMPLE] Mampuram Maqam',
    '[SAMPLE] മമ്പുറം മഖാം',
    '[SAMPLE] مقام مம்பുറം الشريف',
    'maqam',
    'Tirurangadi, West Malappuram',
    11.0489,
    75.9234,
    '[SAMPLE] Historical 18th-century sanctuary associated with Sayyid Alawi Mouladdawilah, known across Malabar as a focal center of spiritual instruction and peaceful coexistence.',
    '[SAMPLE] പതിനെട്ടാം നൂറ്റാണ്ടിലെ ആത്മീയ കേന്ദ്രം. സയ്യിദ് അലവി തങ്ങളുടെ ആത്മീയ സേവനങ്ങളാൽ പ്രശസ്തമായ തീർത്ഥാടന കേന്ദ്രം.',
    '[SAMPLE] مقام مبارك يعود للقرن الثامن عشر ارتبط بالداعية السيد علوي مولى الدويلة في مليبار.',
    'Dress modestly, maintain quiet reflection, and remove footwear before ascending the courtyard steps.',
    'മാന്യമായ വസ്ത്രധാരണം പാലിക്കുക, നിശ്ശബ്ദത പുലർത്തുക, പാദരക്ഷകൾ താഴെ അഴിച്ചുവെക്കുക.',
    'الرجاء ارتداء اللباس المحتشم، والتزام السكينة، وخلع الأحذية قبل دخول الصحن.',
    'Weekly Thursday Majlis after Maghrib; Annual Commemorative Uroos in the lunar month of Muharram.',
    'എല്ലാ വ്യാഴാഴ്ചയും മഗ്‌രിബിന് ശേഷം മജ്‌ലിസ്; വാർഷിക ആണ്ടുനേർച്ച.',
    'مجلس الذكر الأسبوعي مساء كل خميس؛ وحولية المولد السنوية.',
    '[{"title": "[SAMPLE] Record of Malabar Shrines", "author": "K. E. M. Kutty", "is_verified": true}]'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'approved',
    '[SAMPLE] Ponnani Valiya Juma Masjid & Makhdum Zawiya',
    '[SAMPLE] പൊന്നാനി വലിയ ജുമുഅ മസ്ജിദ് & മഖ്ദൂം സാവിയ',
    '[SAMPLE] جامع بوناني الكبير وزاوية المخدوم',
    'zawiya',
    'Ponnani, West Malappuram',
    10.7712,
    75.9237,
    '[SAMPLE] Classical 16th-century center of Islamic scholarship and Sufi retreat established under the guidance of the Makhdum scholars.',
    '[SAMPLE] പതിനാറാം നൂറ്റാണ്ടിലെ വിജ്ഞാന കേന്ദ്രവും മഖ്ദൂമുമാരുടെ ആത്മീയ താവളവുമായ സാവിയ.',
    '[SAMPLE] مركز تاريخي للعلم والتصوف شيده علماء آل مخدوم في القرن السادس عشر.',
    'Sanctuary of learning; silence mobile phones and respect prayer times.',
    'പഠന സദസ്സുകളെ ബഹുമാനിക്കുക, ഫോണുകൾ നിശ്ശബ്ദമാക്കുക.',
    'احترام حلقات العلم والهدوء داخل أروقة الجامع.',
    'Daily study halqas after Fajr; monthly Khatmul Quran majlis.',
    'സുബ്ഹിക്ക് ശേഷം ദിവസേനയുള്ള ദർസ്; മാസത്തിലൊരിക്കൽ ഖത്മുകൾ.',
    'حلقات العلم اليومية بعد صلاة الفجر ومجلس الختم الشهري.',
    '[{"title": "[SAMPLE] Tuhfat al-Mujahidin Historical Notes", "author": "Zayn al-Din Makhdum", "is_verified": true}]'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'approved',
    '[SAMPLE] Kondotty Qubba Dargah',
    '[SAMPLE] കൊണ്ടോട്ടി ഖുബ്ബ ദർഗ',
    '[SAMPLE] قبة كونودوتي الشريفة',
    'dargah',
    'Kondotty, Malappuram',
    11.1465,
    75.9621,
    '[SAMPLE] 18th-century sanctuary with Persian and Malabar architectural motifs associated with Muhammad Shah Bukhari.',
    '[SAMPLE] മുഹമ്മദ് ഷാ ബുഖാരിയുടെ സ്മരണകളുറങ്ങുന്ന ചരിത്രപ്രസിദ്ധമായ സാംസ്കാരിക കേന്ദ്രം.',
    '[SAMPLE] مزار ومجمع صوفي تاريخي في كوندوتي بني على الطراز المعماري التقليدي.',
    'Maintain respectful tranquility within the courtyard.',
    'അങ്കണത്തിൽ സമാധാനാന്തരീക്ഷം പാലിക്കുക.',
    'التزام الأدب والوقار في فناء الضريح.',
    'Annual Nercha and Friday spiritual dhikr circle.',
    'വെള്ളിയാഴ്ചകളിലെ ദിക്ർ മജ്‌ലിസ്, വാർഷിക നേർച്ച.',
    'حلقة الذكر الأسبوعية بعد صلاة الجمعة.',
    '[{"title": "[SAMPLE] Waqf Regional Heritage Catalog", "author": "Malabar Waqf Board", "is_verified": true}]'::jsonb
  )
on conflict (id) do nothing;

-- 4. Seed Sample Person (Historical and Living sample)
insert into public.persons (
  id,
  status,
  name_en,
  name_ml,
  name_ar,
  is_living,
  consent_status,
  short_history_en,
  short_history_ml,
  short_history_ar,
  sources
)
values
  (
    '44444444-4444-4444-4444-444444444444',
    'approved',
    '[SAMPLE] Sayyid Alawi Mouladdawilah',
    '[SAMPLE] സയ്യിദ് അലവി മൗലദ്ദവീല',
    '[SAMPLE] السيد علوي بن سهل مولى الدويلة',
    false,
    'not_applicable',
    '[SAMPLE] Esteemed 18th-century spiritual luminary and social reformer of Mampuram.',
    '[SAMPLE] മമ്പുറത്തെ പ്രമുഖ ആത്മീയ നേതാവും പണ്ഡിതനുമായിരുന്ന മഹദ് വ്യക്തിത്വം.',
    '[SAMPLE] عالم ومصلح روحي كبير عاش في منطقة مம்பുറം بمليبار.',
    '[{"title": "[SAMPLE] Al-Diyau al-Lami biography", "author": "Local Chronicler", "is_verified": true}]'::jsonb
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'approved',
    '[SAMPLE] Ustadh Ahmad al-Malabari (Living)',
    '[SAMPLE] ഉസ്താദ് അഹ്മദ് അൽ മലബാരി (ജീവിച്ചിരിക്കുന്നവർ)',
    '[SAMPLE] الأستاذ أحمد المليباري (معاصر)',
    true,
    'granted', -- Living Sufi rule: approved only when consent_status is 'granted'
    '[SAMPLE] Teacher of traditional tasawwuf texts and leader of public majlis gatherings in Tirurangadi.',
    '[SAMPLE] തിരൂരങ്ങാടിയിൽ തസവ്വുഫ് ദർസുകൾ നടത്തുന്ന ആത്മീയ അധ്യാപകൻ.',
    '[SAMPLE] مدرس كتب التصوف وقائد مجالس الذكر العامة في تيرورانجادي.',
    '[{"title": "[SAMPLE] Written consent on file with admin", "author": "Signed Registry", "is_verified": true}]'::jsonb
  )
on conflict (id) do nothing;

-- 5. Seed Sample Public Gathering (tied to Ustadh Ahmad al-Malabari)
-- Living Sufi Rule: Venue is strictly a public masjid/hall, NEVER a private home address.
insert into public.gatherings (
  id,
  status,
  person_id,
  place_id,
  title_en,
  title_ml,
  title_ar,
  venue_name_en,
  venue_name_ml,
  venue_name_ar,
  schedule_en,
  schedule_ml,
  schedule_ar,
  latitude,
  longitude,
  sources
)
values
  (
    '66666666-6666-6666-6666-666666666666',
    'approved',
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '[SAMPLE] Weekly Ihya'' Uloom al-Din Study Circle',
    '[SAMPLE] ഇഹ്‌യാ ഉലൂമുദ്ദീൻ വായനാ സദസ്സ്',
    '[SAMPLE] مجلس إحياء علوم الدين الأسبوعي',
    'Tirurangadi Community Juma Masjid Hall',
    'തിരൂരങ്ങാടി കമ്മ്യൂണിറ്റി മസ്ജിദ് ഹാൾ',
    'قاعة جامع تيرورانجادي العامة',
    'Every Sunday morning from 7:30 AM to 9:00 AM',
    'എല്ലാ ഞായറാഴ്ചയും രാവിലെ 7:30 മുതൽ 9:00 വരെ',
    'صباح كل أحد من الساعة 7:30 إلى 9:00 صباحاً',
    11.0450,
    75.9210,
    '[{"title": "[SAMPLE] Public Mosque Notice Board", "author": "Masjid Committee", "is_verified": true}]'::jsonb
  )
on conflict (id) do nothing;
