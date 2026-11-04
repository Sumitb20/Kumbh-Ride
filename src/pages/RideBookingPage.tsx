import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings, generateBookingRef } from '../context/BookingContext';
import {
  routes,
  getRouteName,
  getVehicleName,
  getVehicleDesc,
  calculateVehiclesNeeded,
  calculateTotalFare,
  pickupTimes,
  returnTimes,
} from '../data/routesData';
import { isShahiSnanDate, getShahiSnanName, shahiSnanDates } from '../data/shahiSnanDates';
import { RideWizardState, RideBooking, PaymentMethod } from '../types';
import { openRazorpayCheckout, getRazorpayKey } from '../services/razorpay';
import { UpiPaymentSection } from '../components/payment/UpiPaymentSection';

export function RideBookingPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { addBooking } = useBookings();

  const [step, setStep] = useState(1);
  const [wizard, setWizard] = useState<RideWizardState>({
    step: 1,
    routeId: routes[0].id,
    vehicleId: routes[0].vehicles[0].id,
    journeyDate: '2028-07-14', // Default to 1st Shahi Snan
    pickupTime: '06:00 AM',
    returnTime: 'Same Day — 6 hrs later',
    passengers: 1,
    customerName: 'Yatri Pilgrim',
    customerPhone: '+91 98765 43210',
    customerEmail: 'yatri@kumbhride.in',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<RideBooking | null>(null);

  const selectedRoute = routes.find((r) => r.id === wizard.routeId) || routes[0];
  const selectedVehicle =
    selectedRoute.vehicles.find((v) => v.id === wizard.vehicleId) || selectedRoute.vehicles[0];

  const vehiclesNeeded = calculateVehiclesNeeded(wizard.passengers, selectedVehicle.capacity);
  const totalFare = calculateTotalFare(wizard.passengers, selectedVehicle.pricePerPerson);
  const snanInfo = isShahiSnanDate(wizard.journeyDate);

  const handleNext = () => {
    if (step === 1 && !wizard.routeId) return;
    if (step === 2 && !wizard.vehicleId) return;
    if (step === 3 && !wizard.journeyDate) return;
    if (step === 4 && (!wizard.pickupTime || !wizard.returnTime)) return;
    if (step === 5 && wizard.passengers < 1) return;
    if (step === 6) {
      if (!wizard.customerName.trim() || !wizard.customerPhone.trim()) {
        alert('Please enter your full name and phone number');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePay = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      if (simulateFailure) {
        setPaymentStatus('failed');
      } else {
        const ref = generateBookingRef('ride');
        const booking: RideBooking = {
          id: crypto.randomUUID(),
          type: 'ride',
          routeId: wizard.routeId,
          vehicleId: wizard.vehicleId,
          journeyDate: wizard.journeyDate,
          pickupTime: wizard.pickupTime,
          returnTime: wizard.returnTime,
          passengers: wizard.passengers,
          vehiclesNeeded,
          customerName: wizard.customerName,
          customerPhone: wizard.customerPhone,
          customerEmail: wizard.customerEmail,
          totalFare,
          status: 'upcoming',
          paymentStatus: 'success',
          paymentMethod,
          bookingRef: ref,
          createdAt: new Date().toISOString(),
        };
        addBooking(booking);
        setConfirmedBooking(booking);
        setPaymentStatus('success');
        setStep(9);
      }
    }, 1500);
  };

  const handleUpiComplete = (txnId: string) => {
    setPaymentStatus('processing');
    setTimeout(() => {
      const ref = `KR-${Math.floor(100000 + Math.random() * 900000)}`;
      const booking: RideBooking = {
        id: crypto.randomUUID(),
        type: 'ride',
        routeId: wizard.routeId,
        vehicleId: wizard.vehicleId,
        journeyDate: wizard.journeyDate,
        pickupTime: wizard.pickupTime,
        returnTime: wizard.returnTime,
        passengers: wizard.passengers,
        vehiclesNeeded,
        customerName: wizard.customerName,
        customerPhone: wizard.customerPhone,
        customerEmail: wizard.customerEmail,
        totalFare,
        status: 'upcoming',
        paymentStatus: 'success',
        paymentMethod: 'upi',
        bookingRef: ref,
        transactionId: txnId,
        createdAt: new Date().toISOString(),
      };
      addBooking(booking);
      setConfirmedBooking(booking);
      setPaymentStatus('success');
      setStep(9);
    }, 1200);
  };

  const handleRazorpay = () => {
    setPaymentStatus('processing');
    openRazorpayCheckout({
      amount: totalFare,
      description: `Ride: ${getRouteName(selectedRoute, lang).from} ↔ ${getRouteName(selectedRoute, lang).to}`,
      customerName: wizard.customerName,
      customerPhone: wizard.customerPhone,
      customerEmail: wizard.customerEmail,
      onSuccess: (paymentId) => {
        const ref = `KR-${Math.floor(100000 + Math.random() * 900000)}`;
        const booking: RideBooking = {
          id: crypto.randomUUID(),
          type: 'ride',
          routeId: wizard.routeId,
          vehicleId: wizard.vehicleId,
          journeyDate: wizard.journeyDate,
          pickupTime: wizard.pickupTime,
          returnTime: wizard.returnTime,
          passengers: wizard.passengers,
          vehiclesNeeded,
          customerName: wizard.customerName,
          customerPhone: wizard.customerPhone,
          customerEmail: wizard.customerEmail,
          totalFare,
          status: 'upcoming',
          paymentStatus: 'success',
          paymentMethod: 'upi',
          bookingRef: ref,
          transactionId: `RZP-${paymentId}`,
          createdAt: new Date().toISOString(),
        };
        addBooking(booking);
        setConfirmedBooking(booking);
        setPaymentStatus('success');
        setStep(9);
      },
      onFailure: (err) => {
        setPaymentStatus('failed');
        console.error('Razorpay Error:', err);
      },
      onDismiss: () => {
        setPaymentStatus('idle');
      },
    });
  };

  const stepTitles = [
    t('ride.selectRoute'),
    t('ride.selectVehicle'),
    t('ride.selectDate'),
    t('ride.selectTime'),
    t('ride.selectPassengers'),
    t('ride.enterDetails'),
    t('ride.reviewBooking'),
    t('ride.payment'),
    t('ride.confirmed'),
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">
      {/* Step Header */}
      {step < 9 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="p-1 rounded-full hover:bg-gray-100 text-kumbh-text"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <span className="text-kumbh-deep font-bold">
                {t('common.step')} {step} {t('common.of')} 8
              </span>
            </div>
            <span className="text-gray-400 font-medium">{stepTitles[step - 1]}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-kumbh-orange h-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Select Route */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.selectRoute')}</h2>
            <p className="text-xs text-gray-500">Official pilgrim routes for Nashik Simhastha 2028</p>
          </div>

          <div className="space-y-3">
            {routes.map((route) => {
              const names = getRouteName(route, lang);
              const isSelected = wizard.routeId === route.id;
              const minPrice = Math.min(...route.vehicles.map((v) => v.pricePerPerson));

              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setWizard({
                      ...wizard,
                      routeId: route.id,
                      vehicleId: route.vehicles[0].id,
                    });
                  }}
                  className={`card p-4 cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-kumbh-orange bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="badge-demo">{t('home.roundTrip')}</span>
                    <span>{route.distance} • {route.duration}</span>
                  </div>

                  <div className="flex items-center gap-2 font-bold text-base text-kumbh-text">
                    <span>{names.from}</span>
                    <ArrowRight size={16} className="text-kumbh-orange flex-shrink-0" />
                    <span>{names.to}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {route.vehicles.map((v) => (v.type === 'two-wheeler' ? '2-Wheeler' : '4-Wheeler')).join(' / ')}
                    </span>
                    <span className="font-extrabold text-kumbh-orange text-sm">
                      ₹{minPrice} <span className="text-xs font-normal text-gray-500">{t('home.perPerson')}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            <span>{t('ride.next')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: Select Vehicle */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.selectVehicle')}</h2>
            <p className="text-xs text-gray-500">
              {getRouteName(selectedRoute, lang).from} ↔ {getRouteName(selectedRoute, lang).to}
            </p>
          </div>

          {/* Manmad advisory if applicable */}
          {selectedRoute.id === 'manmad-nashik' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{t('ride.manmadNote')}</span>
            </div>
          )}

          <div className="space-y-3">
            {selectedRoute.vehicles.map((vehicle) => {
              const isSelected = wizard.vehicleId === vehicle.id;
              const isBike = vehicle.type === 'two-wheeler';

              return (
                <div
                  key={vehicle.id}
                  onClick={() => setWizard({ ...wizard, vehicleId: vehicle.id })}
                  className={`card p-4 cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-kumbh-orange bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isBike ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-kumbh-deep'
                        }`}
                      >
                        {isBike ? <Bike size={24} /> : <Car size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-kumbh-text">
                          {getVehicleName(vehicle, lang)}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {t('ride.capacity')}: {vehicle.capacity} {t('common.person')} / {t('common.vehicle')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-kumbh-orange">
                        ₹{vehicle.pricePerPerson}
                      </span>
                      <p className="text-[10px] text-gray-400">{t('home.roundTrip')}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    {getVehicleDesc(vehicle, lang)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="btn-secondary flex-1">
              {t('ride.back')}
            </button>
            <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <span>{t('ride.next')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Journey Date */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.selectDate')}</h2>
            <p className="text-xs text-gray-500">Choose your Simhastha Kumbh pilgrimage date (2028)</p>
          </div>

          <div className="card p-4 space-y-3">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{t('ride.journeyDate')}</span>
            </label>
            <input
              type="date"
              value={wizard.journeyDate}
              min="2028-01-01"
              max="2028-12-31"
              onChange={(e) => setWizard({ ...wizard, journeyDate: e.target.value })}
              className="input-field font-semibold text-kumbh-deep"
            />

            {/* Shahi Snan Alert */}
            {snanInfo && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl space-y-1 animate-slide-up">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>{getShahiSnanName(snanInfo, lang)}</span>
                </div>
                <p className="text-xs text-amber-700">{t('ride.shahiSnanNote')}</p>
              </div>
            )}
          </div>

          {/* Quick Select Auspicious Dates */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-kumbh-text">Auspicious Shahi Snan Dates (2028):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shahiSnanDates.map((snan) => (
                <button
                  key={snan.date}
                  type="button"
                  onClick={() => setWizard({ ...wizard, journeyDate: snan.date })}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                    wizard.journeyDate === snan.date
                      ? 'border-kumbh-orange bg-orange-50 text-kumbh-deep font-bold'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span>{getShahiSnanName(snan, lang)}</span>
                  <span className="text-[11px] text-gray-500 font-mono">{snan.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="btn-secondary flex-1">
              {t('ride.back')}
            </button>
            <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <span>{t('ride.next')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Timings */}
      {step === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.selectTime')}</h2>
            <p className="text-xs text-gray-500">Set your pickup time and return window</p>
          </div>

          <div className="card p-4 space-y-3">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Clock size={14} />
              <span>{t('ride.pickupTime')}</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {pickupTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setWizard({ ...wizard, pickupTime: time })}
                  className={`p-2 rounded-xl text-xs font-medium text-center transition-all ${
                    wizard.pickupTime === time
                      ? 'bg-kumbh-orange text-white font-bold'
                      : 'bg-gray-50 text-kumbh-text hover:bg-gray-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <RotateCcw size={14} />
              <span>{t('ride.returnTime')}</span>
            </label>
            <div className="space-y-2">
              {returnTimes.map((rtime) => (
                <button
                  key={rtime}
                  type="button"
                  onClick={() => setWizard({ ...wizard, returnTime: rtime })}
                  className={`w-full p-3 rounded-xl text-xs font-medium text-left transition-all border ${
                    wizard.returnTime === rtime
                      ? 'border-kumbh-orange bg-orange-50/50 text-kumbh-deep font-bold'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {rtime}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="btn-secondary flex-1">
              {t('ride.back')}
            </button>
            <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <span>{t('ride.next')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Passengers & Vehicle Allocation */}
      {step === 5 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.selectPassengers')}</h2>
            <p className="text-xs text-gray-500">Vehicles will be dynamically allocated for your party</p>
          </div>

          <div className="card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-kumbh-text">{t('ride.passengers')}</p>
                <p className="text-xs text-gray-400">Total pilgrims travelling together</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWizard({ ...wizard, passengers: Math.max(1, wizard.passengers - 1) })}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-kumbh-text active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center text-xl font-extrabold text-kumbh-deep">
                  {wizard.passengers}
                </span>
                <button
                  type="button"
                  onClick={() => setWizard({ ...wizard, passengers: Math.min(10, wizard.passengers + 1) })}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-kumbh-text active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dynamic Fleet Allocation Display */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-kumbh-deep font-bold text-sm">
                {selectedVehicle.type === 'two-wheeler' ? <Bike size={20} /> : <Car size={20} />}
                <span>
                  {vehiclesNeeded}{' '}
                  {selectedVehicle.type === 'two-wheeler' ? t('ride.bikes') : t('ride.cars')}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {selectedVehicle.type === 'two-wheeler'
                  ? `For safety, 1 passenger per bike. ${wizard.passengers} bike Captain(s) allocated with helmets.`
                  : `Each car accommodates up to ${selectedVehicle.capacity} passengers. ${vehiclesNeeded} car(s) allocated.`}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">{t('ride.baseFare')}</span>
                <p className="text-xs text-gray-600">
                  {wizard.passengers} × ₹{selectedVehicle.pricePerPerson} ({t('home.roundTrip')})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">{t('ride.total')}</span>
                <p className="text-xl font-extrabold text-kumbh-orange">
                  ₹{totalFare.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="btn-secondary flex-1">
              {t('ride.back')}
            </button>
            <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <span>{t('ride.next')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Customer Details */}
      {step === 6 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.enterDetails')}</h2>
            <p className="text-xs text-gray-500">Provide contact details for driver coordination</p>
          </div>

          <div className="card p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                {t('ride.fullName')} *
              </label>
              <input
                type="text"
                value={wizard.customerName}
                onChange={(e) => setWizard({ ...wizard, customerName: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                {t('ride.phone')} *
              </label>
              <input
                type="tel"
                value={wizard.customerPhone}
                onChange={(e) => setWizard({ ...wizard, customerPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                {t('ride.email')}
              </label>
              <input
                type="email"
                value={wizard.customerEmail}
                onChange={(e) => setWizard({ ...wizard, customerEmail: e.target.value })}
                placeholder="name@example.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="btn-secondary flex-1">
              {t('ride.back')}
            </button>
            <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <span>{t('ride.next')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Review Booking */}
      {step === 7 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-kumbh-text">{t('ride.reviewBooking')}</h2>
            <p className="text-xs text-gray-500">Please verify your booking details before demo payment</p>
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t('confirm.route')}</span>
              <span className="font-bold text-sm text-kumbh-text">
                {getRouteName(selectedRoute, lang).from} ↔ {getRouteName(selectedRoute, lang).to}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t('confirm.vehicleType')}</span>
              <span className="font-semibold text-xs text-kumbh-deep">
                {getVehicleName(selectedVehicle, lang)} ({vehiclesNeeded}{' '}
                {selectedVehicle.type === 'two-wheeler' ? 'Bikes' : 'Cars'})
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t('confirm.date')}</span>
              <span className="font-semibold text-xs text-kumbh-text">
                {wizard.journeyDate} {snanInfo && `(${getShahiSnanName(snanInfo, lang)})`}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t('confirm.pickupTime')}</span>
              <span className="font-semibold text-xs text-kumbh-text">{wizard.pickupTime}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t('confirm.returnTime')}</span>
              <span className="font-semibold text-xs text-kumbh-text">{wizard.returnTime}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{t('confirm.name')}</span>
              <span className="font-semibold text-xs text-kumbh-text">
                {wizard.customerName} ({wizard.customerPhone})
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">{t('confirm.fare')}</span>
                <p className="text-xs text-green-700 font-semibold">{t('home.roundTrip')} Included</p>
              </div>
              <span className="text-2xl font-extrabold text-kumbh-orange">
                ₹{totalFare.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="btn-secondary flex-1">
              {t('ride.back')}
            </button>
            <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <span>{t('ride.proceedPayment')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Payment */}
      {step === 8 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-kumbh-text">{t('payment.title')}</h2>
              <p className="text-xs text-gray-500">Pay via Google Pay, PhonePe, Paytm or UPI QR</p>
            </div>
            <span className="badge-demo text-[10px] bg-green-100 text-green-800 border-green-200">
              REAL UPI LIVE
            </span>
          </div>

          {/* Real Direct UPI Section */}
          <UpiPaymentSection
            amount={totalFare}
            bookingRef={`RD${Math.floor(1000 + Math.random() * 9000)}`}
            description={`Ride: ${getRouteName(selectedRoute, lang).from} ↔ ${getRouteName(selectedRoute, lang).to}`}
            onPaymentComplete={handleUpiComplete}
            isProcessing={paymentStatus === 'processing'}
          />

          {/* Alternative: Razorpay Gateway */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase">
                Alternative: Debit/Credit Card & Net Banking
              </span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Razorpay Gateway Card */}
            <div className="card p-3.5 border border-blue-200 bg-blue-50/30 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-blue-900 text-xs">Razorpay Gateway</span>
                <p className="text-[11px] text-gray-500">Pay using Card, Net Banking or Wallet</p>
              </div>
              <button
                type="button"
                onClick={handleRazorpay}
                disabled={paymentStatus === 'processing'}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Open Razorpay
              </button>
            </div>
          </div>

          <button onClick={handleBack} disabled={paymentStatus === 'processing'} className="btn-secondary w-full text-xs py-2.5">
            ← {t('ride.back')} to Review
          </button>
        </div>
      )}

      {/* STEP 9: Booking Confirmation & Digital Ticket */}
      {step === 9 && confirmedBooking && (
        <div className="space-y-5 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-kumbh-text">{t('confirm.title')}</h2>
            <p className="text-xs text-gray-500">Your ride is reserved for Nashik Kumbh 2028</p>
          </div>

          {/* Ticket Card */}
          <div className="card overflow-hidden border-2 border-orange-200 shadow-xl bg-white">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-kumbh-orange to-kumbh-deep text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
                  Kumbh Ride Boarding Pass
                </span>
                <p className="text-lg font-mono font-extrabold tracking-wider mt-0.5">
                  {confirmedBooking.bookingRef}
                </p>
              </div>
              <span className="badge-demo bg-white/20 text-white border-white/30">
                CONFIRMED
              </span>
            </div>

            {/* Ticket Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">{t('confirm.route')}</span>
                  <p className="font-bold text-sm text-kumbh-text mt-0.5">
                    {getRouteName(selectedRoute, lang).from} ↔ {getRouteName(selectedRoute, lang).to}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block">{t('confirm.vehicleType')}</span>
                  <p className="font-bold text-sm text-kumbh-text mt-0.5">
                    {getVehicleName(selectedVehicle, lang)} ({confirmedBooking.vehiclesNeeded} Vehicles)
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block">{t('confirm.date')}</span>
                  <p className="font-semibold text-kumbh-text mt-0.5">
                    {confirmedBooking.journeyDate}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block">{t('confirm.pickupTime')}</span>
                  <p className="font-semibold text-kumbh-text mt-0.5">
                    {confirmedBooking.pickupTime}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block">{t('confirm.name')}</span>
                  <p className="font-semibold text-kumbh-text mt-0.5">
                    {confirmedBooking.customerName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block">{t('confirm.fare')}</span>
                  <p className="font-extrabold text-sm text-kumbh-orange mt-0.5">
                    ₹{confirmedBooking.totalFare.toLocaleString('en-IN')} (Paid)
                  </p>
                </div>
                <div className="col-span-2 p-2.5 bg-green-50/80 border border-green-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider block">
                      Verified Payment Reference / UTR
                    </span>
                    <p className="font-mono text-xs font-bold text-green-950 mt-0.5">
                      {confirmedBooking.transactionId || confirmedBooking.bookingRef}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-200 text-green-800 text-[10px] font-extrabold uppercase tracking-wide">
                    PAID & VERIFIED ✓
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <QRCodeSVG value={confirmedBooking.bookingRef} size={140} />
                </div>
                <p className="text-[11px] text-gray-500">{t('confirm.qrNote')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>{t('confirm.downloadTicket')}</span>
            </button>

            <button
              onClick={() => navigate('/bookings')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <span>{t('confirm.viewBookings')}</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2"
            >
              {t('confirm.backHome')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

