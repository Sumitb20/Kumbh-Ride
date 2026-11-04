import React, { useState, useMemo } from 'react';
import { useBookings } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { routes, getRouteName } from '../data/routesData';
import { hotels, getHotelName } from '../data/hotelsData';
import { Booking, RideBooking, HotelBooking } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Hotel,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Download,
  Bus,
  BedDouble,
} from 'lucide-react';

type StatusFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';
type TypeFilter = 'all' | 'ride' | 'hotel';

const MyBookingsPage: React.FC = () => {
  const { bookings, cancelBooking } = useBookings();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Count bookings per status
  const counts = useMemo(() => {
    const c = { all: 0, upcoming: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      c.all++;
      if (b.status === 'upcoming') c.upcoming++;
      else if (b.status === 'completed') c.completed++;
      else if (b.status === 'cancelled') c.cancelled++;
    });
    return c;
  }, [bookings]);

  // Filter bookings
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const statusOk = statusFilter === 'all' || b.status === statusFilter;
      const typeOk = typeFilter === 'all' || b.type === typeFilter;
      return statusOk && typeOk;
    });
  }, [bookings, statusFilter, typeFilter]);

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: t('bookings.all') },
    { key: 'upcoming', label: t('bookings.upcoming') },
    { key: 'completed', label: t('bookings.completed') },
    { key: 'cancelled', label: t('bookings.cancelled') },
  ];

  const typeTabs: { key: TypeFilter; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t('bookings.allTypes'), icon: null },
    { key: 'ride', label: t('bookings.rides'), icon: <Bus size={14} /> },
    { key: 'hotel', label: t('bookings.hotels'), icon: <BedDouble size={14} /> },
  ];

  const statusColors: Record<string, string> = {
    upcoming: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusDot: Record<string, string> = {
    upcoming: 'bg-green-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
  };

  const handleToggleTicket = (id: string) => {
    setExpandedTicket((prev) => (prev === id ? null : id));
  };

  const handleCancelConfirm = (id: string) => {
    cancelBooking(id);
    setCancellingId(null);
  };

  const isRideBooking = (b: Booking): b is RideBooking => b.type === 'ride';
  const isHotelBooking = (b: Booking): b is HotelBooking => b.type === 'hotel';

  // Empty state
  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-kumbh-text mb-6">{t('bookings.title')}</h1>
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Ticket size={40} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-kumbh-text mb-2">
            {t('bookings.empty')}
          </h2>
          <p className="text-gray-500 mb-8 max-w-xs">{t('bookings.emptyDesc')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/rides')}
              className="btn-primary flex items-center gap-2"
            >
              <Bus size={18} />
              {t('bookings.exploreRides')}
            </button>
            <button
              onClick={() => navigate('/hotels')}
              className="btn-secondary flex items-center gap-2"
            >
              <Hotel size={18} />
              {t('bookings.exploreHotels')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-kumbh-text mb-6">{t('bookings.title')}</h1>

      {/* Status Tab Bar */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
              statusFilter === tab.key
                ? 'text-kumbh-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                statusFilter === tab.key
                  ? 'bg-kumbh-orange text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {counts[tab.key]}
            </span>
            {statusFilter === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-kumbh-orange rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-6">
        {typeTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTypeFilter(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] ${
              typeFilter === tab.key
                ? 'bg-kumbh-orange text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <Ticket size={32} className="text-gray-300 mb-3" />
          <p className="text-gray-500">{t('bookings.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, index) => (
            <div
              key={booking.id}
              className="card animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      booking.type === 'ride'
                        ? 'bg-orange-50 text-kumbh-orange'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {booking.type === 'ride' ? <Bus size={16} /> : <BedDouble size={16} />}
                  </div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {booking.type === 'ride' ? t('bookings.ride') : t('bookings.hotel')}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    statusColors[booking.status]
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[booking.status]}`} />
                  {t(`bookings.status.${booking.status}`)}
                </span>
              </div>

              {/* Ride Booking Details */}
              {isRideBooking(booking) && (
                <div className="space-y-3">
                  {/* Route */}
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-kumbh-orange flex-shrink-0" />
                    <span className="text-sm font-semibold text-kumbh-text">
                      {(() => {
                        const route = routes.find((r) => r.id === booking.routeId);
                        if (!route) return booking.routeId;
                        const rName = getRouteName(route, lang);
                        return `${rName.from} ↔ ${rName.to}`;
                      })()}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {booking.journeyDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" />
                      {booking.pickupTime}
                    </span>
                  </div>

                  {/* Passengers & Vehicles */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-gray-400" />
                      {booking.passengers} {t('bookings.passengers')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Car size={14} className="text-gray-400" />
                      {booking.vehiclesNeeded} {t('bookings.vehicles')}
                    </span>
                  </div>

                  {/* Fare */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{t('bookings.totalFare')}</span>
                    <span className="text-lg font-bold text-kumbh-text">
                      ₹{booking.totalFare.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Booking Ref & Payment */}
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{t('bookings.ref')}: {booking.bookingRef}</span>
                    {booking.transactionId && (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold">
                        {booking.transactionId}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Hotel Booking Details */}
              {isHotelBooking(booking) && (
                <div className="space-y-3">
                  {/* Hotel Name */}
                  <div className="flex items-center gap-2">
                    <Hotel size={16} className="text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-kumbh-text">
                      {(() => {
                        const hotel = hotels.find((h) => h.id === booking.hotelId);
                        return hotel ? getHotelName(hotel, lang) : booking.hotelId;
                      })()}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>
                      {booking.checkIn} → {booking.checkOut}
                    </span>
                  </div>

                  {/* Guests, Rooms, Nights */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-gray-400" />
                      {booking.guests} {t('bookings.guests')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={14} className="text-gray-400" />
                      {booking.rooms} {t('bookings.rooms')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {booking.nights} {t('bookings.nights')}
                    </span>
                  </div>

                  {/* Fare */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{t('bookings.totalFare')}</span>
                    <span className="text-lg font-bold text-kumbh-text">
                      ₹{booking.totalFare.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Booking Ref & Payment */}
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{t('bookings.ref')}: {booking.bookingRef}</span>
                    {booking.transactionId && (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold">
                        {booking.transactionId}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggleTicket(booking.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-kumbh-cream text-kumbh-orange hover:bg-orange-100 transition-colors min-h-[44px]"
                >
                  <Ticket size={16} />
                  {expandedTicket === booking.id
                    ? t('bookings.hideTicket')
                    : t('bookings.viewTicket')}
                  {expandedTicket === booking.id ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>

                {booking.status === 'upcoming' && (
                  <button
                    onClick={() => setCancellingId(booking.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors min-h-[44px]"
                  >
                    <X size={16} />
                    {t('bookings.cancel')}
                  </button>
                )}
              </div>

              {/* Expanded Ticket */}
              {expandedTicket === booking.id && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 animate-fade-in">
                  <div className="bg-kumbh-cream rounded-2xl p-5 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="px-3 py-1 bg-orange-100 text-kumbh-deep rounded-full text-xs font-bold">
                        Official Boarding Pass
                      </div>
                      <div className="bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-xs">
                        <img src="./buildtek-logo.png" alt="BuildTek Events" className="h-3.5 object-contain" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-kumbh-text mb-1">
                      {isRideBooking(booking)
                        ? (() => {
                            const route = routes.find((r) => r.id === booking.routeId);
                            if (!route) return booking.routeId;
                            const rName = getRouteName(route, lang);
                            return `${rName.from} ↔ ${rName.to}`;
                          })()
                        : (() => {
                            const hotel = hotels.find((h) => h.id === (booking as HotelBooking).hotelId);
                            return hotel ? getHotelName(hotel, lang) : (booking as HotelBooking).hotelId;
                          })()}
                    </h3>

                    <p className="text-xs text-gray-500 mb-4 font-mono">{booking.bookingRef}</p>

                    <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                      <QRCodeSVG value={booking.bookingRef} size={120} />
                    </div>

                    <p className="text-xs text-gray-400 mb-4 max-w-[200px]">
                      {t('confirm.qrNote')}
                    </p>

                    {/* Ticket Details */}
                    <div className="w-full text-left space-y-2 text-sm mb-4">
                      {isRideBooking(booking) && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t('bookings.date')}</span>
                            <span className="font-medium">{booking.journeyDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t('bookings.time')}</span>
                            <span className="font-medium">{booking.pickupTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t('bookings.passengers')}</span>
                            <span className="font-medium">{booking.passengers}</span>
                          </div>
                        </>
                      )}
                      {isHotelBooking(booking) && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t('bookings.checkIn')}</span>
                            <span className="font-medium">{booking.checkIn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t('bookings.checkOut')}</span>
                            <span className="font-medium">{booking.checkOut}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t('bookings.guests')}</span>
                            <span className="font-medium">{booking.guests}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-500 font-medium">{t('bookings.totalFare')}</span>
                        <span className="font-bold text-kumbh-orange">
                          ₹{booking.totalFare.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Download size={16} />
                      {t('bookings.download')}
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel Confirmation Dialog */}
              {cancellingId === booking.id && (
                <div className="mt-4 pt-4 border-t border-red-100 animate-fade-in">
                  <div className="bg-red-50 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-red-800 mb-1">
                          {t('bookings.cancelConfirm')}
                        </h4>
                        <p className="text-xs text-red-600">{t('bookings.refundDemo')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelConfirm(booking.id)}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors min-h-[44px]"
                      >
                        {t('bookings.yesCancel')}
                      </button>
                      <button
                        onClick={() => setCancellingId(null)}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors min-h-[44px]"
                      >
                        {t('bookings.keepBooking')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { MyBookingsPage };
export default MyBookingsPage;
