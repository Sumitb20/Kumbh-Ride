import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle2,
  Users,
  Calendar,
  CreditCard,
  ShieldCheck,
  Download,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings, generateBookingRef } from '../context/BookingContext';
import {
  hotels,
  getHotelName,
  getHotelLocation,
  getHotelDesc,
  getRoomName,
  getAmenityName,
} from '../data/hotelsData';
import { HotelBooking, PaymentMethod } from '../types';
import { openRazorpayCheckout } from '../services/razorpay';

export function HotelDetailPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { addBooking } = useBookings();

  const hotel = hotels.find((h) => h.id === hotelId);

  const [selectedRoomId, setSelectedRoomId] = useState(hotel?.rooms[0]?.id || '');
  const [checkIn, setCheckIn] = useState('2028-07-13');
  const [checkOut, setCheckOut] = useState('2028-07-15');
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [customerName, setCustomerName] = useState('Yatri Pilgrim');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState('yatri@kumbhride.in');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<HotelBooking | null>(null);

  if (!hotel) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-kumbh-text">Hotel Not Found</h2>
        <p className="text-xs text-gray-500">The requested accommodation listing does not exist.</p>
        <button onClick={() => navigate('/hotels')} className="btn-primary">
          Back to Hotels
        </button>
      </div>
    );
  }

  const selectedRoom = hotel.rooms.find((r) => r.id === selectedRoomId) || hotel.rooms[0];

  // Calculate nights
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const diffTime = Math.max(1, dOut.getTime() - dIn.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = selectedRoom.pricePerNight * roomsCount * nights;

  const handlePay = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your name and phone number');
      return;
    }

    setPaymentStatus('processing');
    setPaymentError(null);

    openRazorpayCheckout({
      amount: totalAmount,
      description: `Hotel Booking — ${getHotelName(hotel, lang)} (${getRoomName(selectedRoom, lang)})`,
      customerName,
      customerEmail,
      customerPhone,
      notes: {
        hotel: getHotelName(hotel, lang),
        room: getRoomName(selectedRoom, lang),
        checkIn,
        checkOut,
        guests: String(guests),
      },
      onSuccess: (paymentId: string) => {
        const ref = generateBookingRef('hotel');
        const booking: HotelBooking = {
          id: crypto.randomUUID(),
          type: 'hotel',
          hotelId: hotel.id,
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          guests,
          rooms: roomsCount,
          nights,
          customerName,
          customerPhone,
          customerEmail,
          totalFare: totalAmount,
          status: 'upcoming',
          paymentStatus: 'success',
          paymentMethod: 'card',
          bookingRef: ref,
          transactionId: paymentId,
          createdAt: new Date().toISOString(),
        };
        addBooking(booking);
        setConfirmedBooking(booking);
        setPaymentStatus('success');
      },
      onFailure: (error: string) => {
        setPaymentStatus('failed');
        setPaymentError(error);
      },
      onDismiss: () => {
        setPaymentStatus('idle');
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/hotels')}
          className="flex items-center gap-1.5 text-xs font-bold text-kumbh-deep hover:underline"
        >
          <ArrowLeft size={16} />
          <span>{t('ride.back')}</span>
        </button>
      </div>

      {/* Hero Image Gallery */}
      <div className="space-y-2">
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md">
          <img
            src={hotel.image}
            alt={getHotelName(hotel, lang)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-kumbh-text shadow-md">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span>{hotel.rating}</span>
            <span className="text-gray-400 font-normal">({hotel.reviewCount} reviews)</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
            {hotel.distanceToGhat} {t('hotel.fromGhat')}
          </div>
        </div>

        {hotel.images.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {hotel.images.map((img, i) => (
              <div key={i} className="h-24 rounded-xl overflow-hidden shadow-sm">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Title & Location */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-kumbh-text">
          {getHotelName(hotel, lang)}
        </h1>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <MapPin size={14} className="text-kumbh-orange flex-shrink-0" />
          <span>{getHotelLocation(hotel, lang)}</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2">
          {getHotelDesc(hotel, lang)}
        </p>
      </div>

      {/* Amenities Section */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-sm text-kumbh-text">{t('hotel.amenities')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {hotel.amenities.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 text-xs font-medium text-gray-700 p-2 rounded-xl bg-orange-50/50 border border-orange-100"
            >
              <CheckCircle2 size={14} className="text-kumbh-orange flex-shrink-0" />
              <span>{getAmenityName(a, lang)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Room Selection */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-kumbh-text">{t('hotel.selectRoom')}</h3>

        <div className="space-y-3">
          {hotel.rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`card p-4 cursor-pointer transition-all border-2 ${
                  isSelected ? 'border-kumbh-orange bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-kumbh-text">
                      {getRoomName(room, lang)}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Users size={13} />
                      <span>
                        Max {room.capacity} {t('hotel.guests')}
                      </span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">
                        {room.available} {t('hotel.available')}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-extrabold text-kumbh-orange">
                      ₹{room.pricePerNight.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-gray-400">{t('hotel.perNight')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form Card */}
      {!confirmedBooking && (
        <div className="card p-5 space-y-4 border-orange-200 bg-gradient-to-br from-white to-orange-50/30">
          <h3 className="font-bold text-base text-kumbh-text">{t('hotel.bookingSummary')}</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                {t('hotel.checkIn')}
              </label>
              <input
                type="date"
                value={checkIn}
                min="2028-01-01"
                max="2028-12-31"
                onChange={(e) => setCheckIn(e.target.value)}
                className="input-field text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                {t('hotel.checkOut')}
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                max="2028-12-31"
                onChange={(e) => setCheckOut(e.target.value)}
                className="input-field text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <span className="text-xs text-gray-600">{t('hotel.guests')}:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-bold text-sm w-4 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <span className="text-xs text-gray-600">{t('hotel.rooms')}:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-bold text-sm w-4 text-center">{roomsCount}</span>
                <button
                  type="button"
                  onClick={() => setRoomsCount(Math.min(selectedRoom.available, roomsCount + 1))}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-600 block">{t('hotel.guestDetails')}</span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Guest full name"
              className="input-field text-xs"
            />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Guest phone (+91)"
              className="input-field text-xs"
            />
          </div>

          {/* Price Calculation */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">
                {roomsCount} Room × {nights} {t('hotel.nightsStay')}
              </span>
              <p className="text-xs text-gray-500">₹{selectedRoom.pricePerNight} / night</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">{t('hotel.totalAmount')}</span>
              <p className="text-xl font-extrabold text-kumbh-orange">
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Razorpay Payment Section */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-950">Secure Payment via Razorpay</p>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Pay ₹{totalAmount.toLocaleString('en-IN')} securely via Razorpay payment gateway (Cards, Net Banking, Wallets).
                </p>
              </div>
            </div>

            {/* Payment Error */}
            {paymentStatus === 'failed' && paymentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs flex items-start gap-2 animate-slide-up">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800">Payment Failed</p>
                  <p className="text-red-700 mt-0.5">{paymentError}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={paymentStatus === 'processing'}
              className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {paymentStatus === 'processing' ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation State */}
      {confirmedBooking && (
        <div className="card p-6 border-2 border-green-200 bg-white space-y-5 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-kumbh-text">{t('confirm.title')}</h3>
            <p className="text-xs text-gray-500">Your stay has been confirmed for Kumbh 2028</p>
          </div>

          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">{t('confirm.bookingRef')}:</span>
              <span className="font-mono font-bold text-kumbh-deep">{confirmedBooking.bookingRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('confirm.hotel')}:</span>
              <span className="font-bold text-kumbh-text">{getHotelName(hotel, lang)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('hotel.roomType')}:</span>
              <span className="font-semibold text-kumbh-text">{getRoomName(selectedRoom, lang)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dates:</span>
              <span className="font-semibold text-kumbh-text">
                {confirmedBooking.checkIn} to {confirmedBooking.checkOut} ({confirmedBooking.nights} Nights)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guests & Rooms:</span>
              <span className="font-semibold text-kumbh-text">
                {confirmedBooking.guests} Guests • {confirmedBooking.rooms} Room(s)
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-orange-200 font-bold">
              <span>{t('confirm.fare')}:</span>
              <span className="text-kumbh-orange text-sm">
                ₹{confirmedBooking.totalFare.toLocaleString('en-IN')} (PAID ✓)
              </span>
            </div>
            <div className="p-2.5 bg-green-50/80 border border-green-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider block">
                  Payment Status
                </span>
                <p className="text-xs font-bold text-green-950 mt-0.5">
                  PAID & VERIFIED ✓ via Razorpay
                </p>
                {confirmedBooking.transactionId && (
                  <p className="text-[10px] text-green-700 font-mono mt-0.5">
                    Txn: {confirmedBooking.transactionId}
                  </p>
                )}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-extrabold uppercase tracking-wide">
                PAID
              </span>
            </div>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <QRCodeSVG value={confirmedBooking.bookingRef} size={130} />
            </div>
            <p className="text-[11px] text-gray-500">Present this QR upon arrival at reception</p>
            <div className="pt-1 flex items-center justify-center gap-1.5 opacity-75">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Hospitality Managed by</span>
              <img src="./buildtek-logo.png" alt="BuildTek Events" className="h-3.5 object-contain" />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-secondary flex-1 text-xs py-2.5">
              <Download size={14} className="inline mr-1" />
              {t('confirm.downloadTicket')}
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="btn-primary flex-1 text-xs py-2.5 text-center"
            >
              {t('confirm.viewBookings')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

