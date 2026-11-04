import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Booking, RideBooking, HotelBooking } from '../types';

const STORAGE_KEY = 'kumbh_bookings';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  getRideBookings: () => RideBooking[];
  getHotelBookings: () => HotelBooking[];
}

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  addBooking: () => {},
  cancelBooking: () => {},
  getBooking: () => undefined,
  getRideBookings: () => [],
  getHotelBookings: () => [],
});

function loadBookings(): Booking[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function generateBookingRef(type: 'ride' | 'hotel'): string {
  const prefix = type === 'ride' ? 'RD' : 'HT';
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `KMB-2028-${prefix}${num}${suffix}`;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  }, []);

  const getBooking = useCallback((id: string) => {
    return bookings.find(b => b.id === id);
  }, [bookings]);

  const getRideBookings = useCallback(() => {
    return bookings.filter((b): b is RideBooking => b.type === 'ride');
  }, [bookings]);

  const getHotelBookings = useCallback(() => {
    return bookings.filter((b): b is HotelBooking => b.type === 'hotel');
  }, [bookings]);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, getBooking, getRideBookings, getHotelBookings }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingContext);
}

