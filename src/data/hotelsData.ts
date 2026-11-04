import { Hotel, Amenity } from '../types';

export const commonAmenities: Amenity[] = [
  { id: 'wifi', nameEn: 'Free Wi-Fi', nameHi: 'मुफ्त वाई-फाई', nameMr: 'मोफत वाय-फाय', icon: 'wifi' },
  { id: 'ac', nameEn: 'Air Conditioning', nameHi: 'एयर कंडीशनिंग', nameMr: 'वातानुकूलन', icon: 'snowflake' },
  { id: 'food', nameEn: 'Satvik Restaurant', nameHi: 'सात्विक भोजन', nameMr: 'सात्विक भोजन', icon: 'utensils' },
  { id: 'parking', nameEn: 'Free Parking', nameHi: 'मुफ्त पार्किंग', nameMr: 'मोफत पार्किंग', icon: 'car' },
  { id: 'hotwater', nameEn: '24/7 Hot Water', nameHi: '24/7 गर्म पानी', nameMr: '24/7 गरम पाणी', icon: 'droplets' },
  { id: 'temple-shuttle', nameEn: 'Temple Shuttle', nameHi: 'मंदिर शटल', nameMr: 'मंदिर शटल', icon: 'bus' },
  { id: 'laundry', nameEn: 'Laundry Service', nameHi: 'लॉन्ड्री सेवा', nameMr: 'लॉन्ड्री सेवा', icon: 'shirt' },
  { id: 'reception', nameEn: '24/7 Front Desk', nameHi: '24/7 फ्रंट डेस्क', nameMr: '24/7 फ्रंट डेस्क', icon: 'bell' },
  { id: 'lockers', nameEn: 'Safe Lockers', nameHi: 'सेफ लॉकर', nameMr: 'सेफ लॉकर', icon: 'lock' },
  { id: 'medical', nameEn: 'First Aid', nameHi: 'प्राथमिक चिकित्सा', nameMr: 'प्रथमोपचार', icon: 'heart-pulse' },
];

const getAmenity = (id: string): Amenity => commonAmenities.find(a => a.id === id)!;

export const hotels: Hotel[] = [
  {
    id: 'ramkund-heritage',
    nameEn: 'Ramkund Heritage Dharamshala',
    nameHi: 'रामकुंड हेरिटेज धर्मशाला',
    nameMr: 'रामकुंड हेरिटेज धर्मशाळा',
    locationEn: 'Panchvati, 200m from Ramkund Ghat',
    locationHi: 'पंचवटी, रामकुंड घाट से 200 मीटर',
    locationMr: 'पंचवटी, रामकुंड घाटापासून 200 मीटर',
    descEn: 'Traditional dharamshala steps from the sacred Ramkund ghat. Simple, clean rooms with a rooftop view of the Godavari river. Perfect for pilgrims seeking proximity to the holy ghats.',
    descHi: 'पवित्र रामकुंड घाट से कुछ ही कदम दूर पारंपरिक धर्मशाला। गोदावरी नदी की छत से दिखने वाले साफ-सुथरे कमरे। तीर्थयात्रियों के लिए आदर्श।',
    descMr: 'पवित्र रामकुंड घाटापासून काही पावलांवर पारंपरिक धर्मशाळा. गोदावरी नदीचे छतावरून दिसणारे स्वच्छ खोल्या. भाविकांसाठी उत्तम.',
    rating: 4.2,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
    ],
    startingPrice: 1000,
    amenities: [getAmenity('hotwater'), getAmenity('food'), getAmenity('lockers'), getAmenity('medical')],
    rooms: [
      {
        id: 'rh-dormitory',
        nameEn: 'Dormitory (6 Bed)',
        nameHi: 'डॉर्मिटरी (6 बेड)',
        nameMr: 'डॉर्मिटरी (6 बेड)',
        capacity: 1,
        pricePerNight: 1000,
        amenities: ['hotwater', 'lockers'],
        available: 12,
      },
      {
        id: 'rh-double',
        nameEn: 'Double Room',
        nameHi: 'डबल रूम',
        nameMr: 'डबल रूम',
        capacity: 2,
        pricePerNight: 2200,
        amenities: ['hotwater', 'lockers', 'wifi'],
        available: 8,
      },
      {
        id: 'rh-family',
        nameEn: 'Family Room (4 Bed)',
        nameHi: 'फैमिली रूम (4 बेड)',
        nameMr: 'फॅमिली रूम (4 बेड)',
        capacity: 4,
        pricePerNight: 3500,
        amenities: ['hotwater', 'lockers', 'wifi', 'ac'],
        available: 4,
      },
    ],
    distanceToGhat: '200m',
    tags: ['budget', 'panchvati', 'ghat-view'],
  },
  {
    id: 'trimbak-divine',
    nameEn: 'Trimbak Divine Yatri Niwas',
    nameHi: 'त्र्यंबक दिव्य यात्री निवास',
    nameMr: 'त्र्यंबक दिव्य यात्री निवास',
    locationEn: 'Trimbakeshwar Temple Road, 500m from Jyotirlinga',
    locationHi: 'त्र्यंबकेश्वर मंदिर रोड, ज्योतिर्लिंग से 500 मीटर',
    locationMr: 'त्र्यंबकेश्वर मंदिर रोड, ज्योतिर्लिंगापासून 500 मीटर',
    descEn: 'Peaceful stay near the sacred Trimbakeshwar Jyotirlinga. Ideal for devotees visiting the temple for darshan. Clean rooms with mountain views of the Brahmagiri hills.',
    descHi: 'पवित्र त्र्यंबकेश्वर ज्योतिर्लिंग के पास शांतिपूर्ण ठहराव। मंदिर दर्शन के लिए भक्तों के लिए आदर्श। ब्रह्मगिरी पर्वत के दृश्य वाले स्वच्छ कमरे।',
    descMr: 'पवित्र त्र्यंबकेश्वर ज्योतिर्लिंगाजवळ शांततापूर्ण वास्तव्य. दर्शनासाठी येणाऱ्या भक्तांसाठी उत्तम. ब्रह्मगिरी पर्वताचे दृश्य असलेल्या स्वच्छ खोल्या.',
    rating: 4.5,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    ],
    startingPrice: 1500,
    amenities: [getAmenity('hotwater'), getAmenity('food'), getAmenity('parking'), getAmenity('temple-shuttle'), getAmenity('medical')],
    rooms: [
      {
        id: 'td-standard',
        nameEn: 'Standard Room',
        nameHi: 'स्टैंडर्ड रूम',
        nameMr: 'स्टॅंडर्ड रूम',
        capacity: 2,
        pricePerNight: 1500,
        amenities: ['hotwater', 'parking'],
        available: 10,
      },
      {
        id: 'td-deluxe',
        nameEn: 'Deluxe Mountain View',
        nameHi: 'डीलक्स माउंटेन व्यू',
        nameMr: 'डिलक्स माउंटन व्ह्यू',
        capacity: 2,
        pricePerNight: 2800,
        amenities: ['hotwater', 'parking', 'ac', 'wifi'],
        available: 6,
      },
      {
        id: 'td-suite',
        nameEn: 'Temple View Suite',
        nameHi: 'टेम्पल व्यू सुइट',
        nameMr: 'टेम्पल व्ह्यू सूट',
        capacity: 4,
        pricePerNight: 4500,
        amenities: ['hotwater', 'parking', 'ac', 'wifi', 'food', 'laundry'],
        available: 3,
      },
    ],
    distanceToGhat: '500m',
    tags: ['temple', 'trimbakeshwar', 'mountain-view'],
  },
  {
    id: 'godavari-riverside',
    nameEn: 'Godavari Riverside Resort',
    nameHi: 'गोदावरी रिवरसाइड रिसॉर्ट',
    nameMr: 'गोदावरी रिव्हरसाइड रिसॉर्ट',
    locationEn: 'Gangapur Road, along the Godavari',
    locationHi: 'गंगापुर रोड, गोदावरी के किनारे',
    locationMr: 'गंगापुर रोड, गोदावरी किनारी',
    descEn: 'Premium riverside resort on the banks of the Godavari. Modern amenities with a traditional touch. Spacious rooms, pool, and sunset views over the river. Perfect blend of comfort and spirituality.',
    descHi: 'गोदावरी के तट पर प्रीमियम रिवरसाइड रिसॉर्ट। पारंपरिक स्पर्श के साथ आधुनिक सुविधाएं। विशाल कमरे, पूल और नदी पर सूर्यास्त दृश्य।',
    descMr: 'गोदावरीच्या तीरावरील प्रीमियम रिव्हरसाइड रिसॉर्ट. पारंपरिक स्पर्शासह आधुनिक सुविधा. विस्तीर्ण खोल्या, पूल आणि नदीवरील सूर्यास्ताचे दृश्य.',
    rating: 4.7,
    reviewCount: 520,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
    ],
    startingPrice: 3200,
    amenities: [getAmenity('ac'), getAmenity('wifi'), getAmenity('food'), getAmenity('parking'), getAmenity('hotwater'), getAmenity('laundry'), getAmenity('reception')],
    rooms: [
      {
        id: 'gr-superior',
        nameEn: 'Superior Room',
        nameHi: 'सुपीरियर रूम',
        nameMr: 'सुपीरियर रूम',
        capacity: 2,
        pricePerNight: 3200,
        amenities: ['ac', 'wifi', 'hotwater'],
        available: 15,
      },
      {
        id: 'gr-river-deluxe',
        nameEn: 'River View Deluxe',
        nameHi: 'रिवर व्यू डीलक्स',
        nameMr: 'रिव्हर व्ह्यू डिलक्स',
        capacity: 2,
        pricePerNight: 4200,
        amenities: ['ac', 'wifi', 'hotwater', 'laundry'],
        available: 8,
      },
      {
        id: 'gr-family-suite',
        nameEn: 'Family Suite',
        nameHi: 'फैमिली सुइट',
        nameMr: 'फॅमिली सूट',
        capacity: 5,
        pricePerNight: 6500,
        amenities: ['ac', 'wifi', 'hotwater', 'laundry', 'food'],
        available: 4,
      },
    ],
    distanceToGhat: '3 km',
    tags: ['premium', 'riverside', 'resort'],
  },
  {
    id: 'kumbh-yatri-bhawan',
    nameEn: 'Kumbh Yatri Bhawan',
    nameHi: 'कुंभ यात्री भवन',
    nameMr: 'कुंभ यात्री भवन',
    locationEn: 'Near Nashik Road Railway Station',
    locationHi: 'नाशिक रोड रेलवे स्टेशन के पास',
    locationMr: 'नाशिक रोड रेल्वे स्टेशनजवळ',
    descEn: 'Budget-friendly pilgrim accommodation right next to Nashik Road Railway Station. Ideal for overnight halts and early morning departures. Clean, safe, and well-connected.',
    descHi: 'नाशिक रोड रेलवे स्टेशन के बगल में बजट-अनुकूल तीर्थयात्री आवास। रात्रि ठहराव और सुबह की यात्रा के लिए आदर्श। स्वच्छ, सुरक्षित और अच्छी कनेक्टिविटी।',
    descMr: 'नाशिक रोड रेल्वे स्टेशनजवळ बजेट-अनुकूल भाविकांसाठी निवास. रात्री मुक्कामासाठी आणि सकाळी लवकर निघण्यासाठी उत्तम. स्वच्छ, सुरक्षित आणि चांगली कनेक्टिव्हिटी.',
    rating: 3.9,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d955e4f30?w=800&h=600&fit=crop',
    ],
    startingPrice: 1000,
    amenities: [getAmenity('hotwater'), getAmenity('lockers'), getAmenity('reception'), getAmenity('medical')],
    rooms: [
      {
        id: 'kb-dorm',
        nameEn: 'Dormitory (8 Bed)',
        nameHi: 'डॉर्मिटरी (8 बेड)',
        nameMr: 'डॉर्मिटरी (8 बेड)',
        capacity: 1,
        pricePerNight: 1000,
        amenities: ['hotwater', 'lockers'],
        available: 20,
      },
      {
        id: 'kb-twin',
        nameEn: 'Twin Sharing Room',
        nameHi: 'ट्विन शेयरिंग रूम',
        nameMr: 'ट्विन शेअरिंग रूम',
        capacity: 2,
        pricePerNight: 1800,
        amenities: ['hotwater', 'lockers', 'wifi'],
        available: 12,
      },
      {
        id: 'kb-private',
        nameEn: 'Private Room',
        nameHi: 'प्राइवेट रूम',
        nameMr: 'प्रायव्हेट रूम',
        capacity: 3,
        pricePerNight: 2500,
        amenities: ['hotwater', 'lockers', 'wifi', 'ac'],
        available: 6,
      },
    ],
    distanceToGhat: '8 km',
    tags: ['budget', 'station', 'convenient'],
  },
  {
    id: 'sarovar-premiere',
    nameEn: 'Sarovar Premiere Nashik',
    nameHi: 'सरोवर प्रीमियर नाशिक',
    nameMr: 'सरोवर प्रीमियर नाशिक',
    locationEn: 'Untwadi, Nashik — City Centre',
    locationHi: 'अनतवाड़ी, नाशिक — सिटी सेंटर',
    locationMr: 'उंटवाडी, नाशिक — सिटी सेंटर',
    descEn: 'Upscale city-centre hotel with conference facilities, rooftop dining, and easy access to Kumbh Mela zones. Business-class comfort with pilgrimage convenience.',
    descHi: 'सम्मेलन सुविधाओं, छत पर भोजन और कुंभ मेला क्षेत्रों तक आसान पहुंच के साथ अपस्केल सिटी-सेंटर होटल। तीर्थयात्रा सुविधा के साथ बिजनेस-क्लास आराम।',
    descMr: 'कॉन्फरन्स सुविधा, छतावरील जेवण आणि कुंभमेळा क्षेत्रात सहज प्रवेश असलेले अपस्केल सिटी-सेंटर हॉटेल. यात्रेच्या सुविधेसह बिझनेस-क्लास आराम.',
    rating: 4.4,
    reviewCount: 410,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    ],
    startingPrice: 4000,
    amenities: [getAmenity('ac'), getAmenity('wifi'), getAmenity('food'), getAmenity('parking'), getAmenity('hotwater'), getAmenity('laundry'), getAmenity('reception'), getAmenity('lockers')],
    rooms: [
      {
        id: 'sp-classic',
        nameEn: 'Classic Room',
        nameHi: 'क्लासिक रूम',
        nameMr: 'क्लासिक रूम',
        capacity: 2,
        pricePerNight: 4000,
        amenities: ['ac', 'wifi', 'hotwater'],
        available: 20,
      },
      {
        id: 'sp-executive',
        nameEn: 'Executive Suite',
        nameHi: 'एग्ज़ीक्यूटिव सुइट',
        nameMr: 'एक्झिक्युटिव्ह सूट',
        capacity: 2,
        pricePerNight: 5500,
        amenities: ['ac', 'wifi', 'hotwater', 'laundry', 'food'],
        available: 6,
      },
      {
        id: 'sp-presidential',
        nameEn: 'Presidential Suite',
        nameHi: 'प्रेसिडेंशियल सुइट',
        nameMr: 'प्रेसिडेन्शियल सूट',
        capacity: 4,
        pricePerNight: 9000,
        amenities: ['ac', 'wifi', 'hotwater', 'laundry', 'food', 'reception'],
        available: 2,
      },
    ],
    distanceToGhat: '5 km',
    tags: ['premium', 'city-centre', 'business'],
  },
];

export function getHotelName(hotel: Hotel, lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return hotel.nameHi;
    case 'mr': return hotel.nameMr;
    default: return hotel.nameEn;
  }
}

export function getHotelLocation(hotel: Hotel, lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return hotel.locationHi;
    case 'mr': return hotel.locationMr;
    default: return hotel.locationEn;
  }
}

export function getHotelDesc(hotel: Hotel, lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return hotel.descHi;
    case 'mr': return hotel.descMr;
    default: return hotel.descEn;
  }
}

export function getRoomName(room: Hotel['rooms'][0], lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return room.nameHi;
    case 'mr': return room.nameMr;
    default: return room.nameEn;
  }
}

export function getAmenityName(amenity: { nameEn: string; nameHi: string; nameMr: string }, lang: 'en' | 'hi' | 'mr'): string {
  switch (lang) {
    case 'hi': return amenity.nameHi;
    case 'mr': return amenity.nameMr;
    default: return amenity.nameEn;
  }
}

