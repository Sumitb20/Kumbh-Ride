// Kumbh Mela 2028 Auspicious Bathing Dates (Shahi Snan)
// The Nashik–Trimbakeshwar Simhastha Kumbh typically occurs when Jupiter
// transits through Leo (Simha Rashi). These are estimated sacred dates.

export interface ShahiSnanDate {
  date: string; // ISO date string
  nameEn: string;
  nameHi: string;
  nameMr: string;
  type: 'shahi' | 'parv' | 'regular';
}

export const shahiSnanDates: ShahiSnanDate[] = [
  {
    date: '2028-07-14',
    nameEn: 'First Shahi Snan (Guru Purnima)',
    nameHi: 'प्रथम शाही स्नान (गुरु पूर्णिमा)',
    nameMr: 'प्रथम शाही स्नान (गुरु पौर्णिमा)',
    type: 'shahi',
  },
  {
    date: '2028-08-12',
    nameEn: 'Second Shahi Snan (Shravan Purnima)',
    nameHi: 'द्वितीय शाही स्नान (श्रावण पूर्णिमा)',
    nameMr: 'द्वितीय शाही स्नान (श्रावण पौर्णिमा)',
    type: 'shahi',
  },
  {
    date: '2028-08-27',
    nameEn: 'Third Shahi Snan (Krishna Ashtami)',
    nameHi: 'तृतीय शाही स्नान (कृष्ण अष्टमी)',
    nameMr: 'तृतीय शाही स्नान (कृष्ण अष्टमी)',
    type: 'shahi',
  },
  {
    date: '2028-09-10',
    nameEn: 'Parv Snan (Mahalaya Amavasya)',
    nameHi: 'पर्व स्नान (महालय अमावस्या)',
    nameMr: 'पर्व स्नान (महालय अमावस्या)',
    type: 'parv',
  },
  {
    date: '2028-09-25',
    nameEn: 'Final Shahi Snan (Sharad Purnima)',
    nameHi: 'अंतिम शाही स्नान (शरद पूर्णिमा)',
    nameMr: 'अंतिम शाही स्नान (शरद पौर्णिमा)',
    type: 'shahi',
  },
];

export function isShahiSnanDate(dateStr: string): ShahiSnanDate | undefined {
  return shahiSnanDates.find(d => d.date === dateStr);
}

export function getShahiSnanName(snan: ShahiSnanDate, lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return snan.nameHi;
    case 'mr': return snan.nameMr;
    default: return snan.nameEn;
  }
}

