import { Route } from '../types';

export const routes: Route[] = [
  {
    id: 'nashik-road-panchvati',
    fromEn: 'Nashik Road Station',
    fromHi: 'नाशिक रोड स्टेशन',
    fromMr: 'नाशिक रोड स्टेशन',
    toEn: 'Panchvati / Ramkund',
    toHi: 'पंचवटी / रामकुंड',
    toMr: 'पंचवटी / रामकुंड',
    distance: '8 km',
    duration: '25 min',
    vehicles: [
      {
        id: 'bike-nashik',
        type: 'two-wheeler',
        nameEn: 'Bike Taxi',
        nameHi: 'बाइक टैक्सी',
        nameMr: 'बाईक टॅक्सी',
        capacity: 1,
        pricePerPerson: 300,
        descEn: 'Quick two-wheeler ride, one passenger per bike. Helmets provided.',
        descHi: 'तेज़ दोपहिया सवारी, एक यात्री प्रति बाइक। हेलमेट उपलब्ध।',
        descMr: 'जलद दुचाकी सवारी, प्रत्येक बाईकवर एक प्रवासी. हेल्मेट दिले जाते.',
        icon: 'bike',
      },
      {
        id: 'car-nashik',
        type: 'four-wheeler',
        nameEn: 'AC Sedan / SUV',
        nameHi: 'AC सेडान / SUV',
        nameMr: 'AC सेडान / SUV',
        capacity: 4,
        pricePerPerson: 300,
        descEn: 'Comfortable AC car ride. Up to 4 passengers per vehicle.',
        descHi: 'आरामदायक AC कार सवारी। प्रति वाहन 4 यात्री तक।',
        descMr: 'आरामदायक AC कार सवारी. प्रत्येक गाडीत ४ प्रवासी.',
        icon: 'car',
      },
    ],
  },
  {
    id: 'manmad-nashik',
    fromEn: 'Manmad Junction',
    fromHi: 'मनमाड जंक्शन',
    fromMr: 'मनमाड जंक्शन',
    toEn: 'Nashik City',
    toHi: 'नाशिक शहर',
    toMr: 'नाशिक शहर',
    distance: '90 km',
    duration: '2 hr',
    vehicles: [
      {
        id: 'car-manmad',
        type: 'four-wheeler',
        nameEn: 'AC Sedan / SUV',
        nameHi: 'AC सेडान / SUV',
        nameMr: 'AC सेडान / SUV',
        capacity: 4,
        pricePerPerson: 600,
        descEn: 'Highway ride from Manmad to Nashik. AC comfort, up to 4 passengers.',
        descHi: 'मनमाड से नाशिक तक हाईवे सवारी। AC आराम, 4 यात्री तक।',
        descMr: 'मनमाड ते नाशिक हायवे सवारी. AC आराम, ४ प्रवासी.',
        icon: 'car',
      },
    ],
  },
];

export const pickupTimes = [
  '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM',
];

export const returnTimes = [
  'Same Day — 4 hrs later',
  'Same Day — 6 hrs later',
  'Same Day — 8 hrs later',
  'Next Day Morning',
  'Flexible (Open Return)',
];

export function getRouteName(route: Route, lang: 'en' | 'hi' | 'mr'): { from: string; to: string } {
  switch (lang) {
    case 'hi': return { from: route.fromHi, to: route.toHi };
    case 'mr': return { from: route.fromMr, to: route.toMr };
    default: return { from: route.fromEn, to: route.toEn };
  }
}

export function getVehicleName(vehicle: Route['vehicles'][0], lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return vehicle.nameHi;
    case 'mr': return vehicle.nameMr;
    default: return vehicle.nameEn;
  }
}

export function getVehicleDesc(vehicle: Route['vehicles'][0], lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return vehicle.descHi;
    case 'mr': return vehicle.descMr;
    default: return vehicle.descEn;
  }
}

export function calculateVehiclesNeeded(passengers: number, capacity: number): number {
  return Math.ceil(passengers / capacity);
}

export function calculateTotalFare(passengers: number, pricePerPerson: number): number {
  return passengers * pricePerPerson;
}

