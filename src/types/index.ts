// ===== Route & Vehicle Types =====
export type VehicleType = 'two-wheeler' | 'four-wheeler';
export type Language = 'en' | 'hi' | 'mr';
export type BookingType = 'ride' | 'hotel';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'netbanking';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Vehicle {
  id: string;
  type: VehicleType;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  capacity: number;
  pricePerPerson: number;
  descEn: string;
  descHi: string;
  descMr: string;
  icon: string; // lucide icon name
}

export interface Route {
  id: string;
  fromEn: string;
  fromHi: string;
  fromMr: string;
  toEn: string;
  toHi: string;
  toMr: string;
  distance: string;
  duration: string;
  vehicles: Vehicle[];
}

// ===== Hotel Types =====
export interface Amenity {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  icon: string;
}

export interface RoomType {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  available: number;
}

export interface Hotel {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  locationEn: string;
  locationHi: string;
  locationMr: string;
  descEn: string;
  descHi: string;
  descMr: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  startingPrice: number;
  amenities: Amenity[];
  rooms: RoomType[];
  distanceToGhat: string;
  tags: string[];
}

// ===== Booking Types =====
export interface RideBooking {
  id: string;
  type: 'ride';
  routeId: string;
  vehicleId: string;
  journeyDate: string;
  pickupTime: string;
  returnTime: string;
  passengers: number;
  vehiclesNeeded: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalFare: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  bookingRef: string;
  createdAt: string;
}

export interface HotelBooking {
  id: string;
  type: 'hotel';
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  nights: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalFare: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  bookingRef: string;
  createdAt: string;
}

export type Booking = RideBooking | HotelBooking;

// ===== Ride Booking Wizard State =====
export interface RideWizardState {
  step: number;
  routeId: string;
  vehicleId: string;
  journeyDate: string;
  pickupTime: string;
  returnTime: string;
  passengers: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

// ===== Hotel Booking Wizard State =====
export interface HotelWizardState {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

// ===== Translation =====
export type TranslationDict = Record<string, string>;

// ===== User Profile (Demo) =====
export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  language: Language;
}

