import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle2,
  Users,
  Calendar,
  Building,
  CreditCard,
  Smartphone,
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [simulateFailure, setSimulateFailure] = useState(false);
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
    setTimeout(() => {
      if (simulateFailure) {
        setPaymentStatus('failed');
      } else {
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
          paymentMethod,
          bookingRef: ref,
          createdAt: new Date().toISOString(),
        };
        addBooking(booking);
        setConfirmedBooking(booking);
        setPaymentStatus('success');
      }
    }, 1500);
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
        <span className="badge-demo text-[10px]">{t('hotel.demoNotice')}</span>
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

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">{t('payment.selectMethod')}</span>
              <span className="badge-demo text-[10px]">DEMO MODE</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-kumbh-orange bg-orange-50 text-kumbh-deep'
                    : 'border-gray-200 bg-white'
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-kumbh-orange bg-orange-50 text-kumbh-deep'
                    : 'border-gray-200 bg-white'
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-kumbh-orange bg-orange-50 text-kumbh-deep'
                    : 'border-gray-200 bg-white'
                }`}
              >
                NetBanking
              </button>
            </div>

            {/* Simulate Failure Switch */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>{t('payment.simulateFailure')}</span>
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="rounded text-kumbh-orange focus:ring-kumbh-orange"
              />
            </div>

            {paymentStatus === 'failed' && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                Payment simulation failed. Uncheck the failure toggle and retry.
              </div>
            )}
          </div>

          <button
            onClick={handlePay}
            disabled={paymentStatus === 'processing'}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {paymentStatus === 'processing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('payment.processing')}</span>
              </>
            ) : (
              <span>
                {t('payment.pay')} ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            )}
          </button>
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
                ₹{confirmedBooking.totalFare.toLocaleString('en-IN')} (Paid)
              </span>
            </div>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <QRCodeSVG value={confirmedBooking.bookingRef} size={130} />
            </div>
            <p className="text-[11px] text-gray-500">Present this QR upon arrival at reception</p>
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

