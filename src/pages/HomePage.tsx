import { useNavigate } from 'react-router-dom';
import {
  Car,
  Building2,
  ArrowRight,
  Shield,
  IndianRupee,
  ArrowLeftRight,
  Zap,
  MapPin,
  Calendar,
  CheckCircle2,
  Train,
  Headphones,
  Sparkles,
  Navigation,
  Clock,
  Star,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { routes, getRouteName } from '../data/routesData';
import { hotels, getHotelName, getHotelLocation } from '../data/hotelsData';

export function HomePage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900 text-white rounded-b-3xl overflow-hidden shadow-lg">
        {/* Background Image with warm overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&h=800&fit=crop)',
          }}
        />
        <div className="relative px-5 pt-8 pb-10 max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-200">
            <Sparkles size={14} className="text-kumbh-yellow" />
            <span>{t('home.nashikTrimbak')} • {t('home.kumbh2028')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t('home.tagline')}
          </h1>

          <p className="text-sm sm:text-base text-orange-100/90 max-w-xl leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/rides')}
              className="btn-primary flex items-center gap-2 shadow-lg shadow-orange-500/30"
            >
              <Car size={18} />
              <span>{t('home.bookRide')}</span>
            </button>

            <button
              onClick={() => navigate('/hotels')}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl px-5 py-3 backdrop-blur-md border border-white/25 transition-all flex items-center gap-2"
            >
              <Building2 size={18} />
              <span>{t('home.findStay')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Two Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => navigate('/rides')}
            className="card p-5 cursor-pointer hover:border-kumbh-orange group transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-kumbh-deep flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Car size={24} />
              </div>
              <span className="badge-demo">{t('home.roundTrip')}</span>
            </div>
            <h3 className="text-lg font-bold text-kumbh-text group-hover:text-kumbh-orange transition-colors">
              {t('home.bookRide')}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t('home.bookRideDesc')}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-kumbh-orange">
              <span>{t('home.startingFrom')} ₹300{t('home.perPerson')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => navigate('/hotels')}
            className="card p-5 cursor-pointer hover:border-kumbh-orange group transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 size={24} />
              </div>
              <span className="badge-demo">Dharamshala & Hotel</span>
            </div>
            <h3 className="text-lg font-bold text-kumbh-text group-hover:text-kumbh-orange transition-colors">
              {t('home.findStay')}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t('home.findStayDesc')}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-kumbh-orange">
              <span>{t('home.startingFrom')} ₹1,000{t('home.perNight')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">{t('home.popularRoutes')}</h2>
            <button
              onClick={() => navigate('/rides')}
              className="text-xs font-semibold text-kumbh-orange hover:underline flex items-center gap-1"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route) => {
              const names = getRouteName(route, lang);
              const minPrice = Math.min(...route.vehicles.map((v) => v.pricePerPerson));
              return (
                <div
                  key={route.id}
                  onClick={() => navigate('/rides')}
                  className="card p-4 cursor-pointer hover:border-kumbh-orange transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Navigation size={13} /> {route.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {route.duration}
                    </span>
                    <span className="badge-demo">{t('home.roundTrip')}</span>
                  </div>

                  <div className="flex items-center gap-2 font-bold text-base text-kumbh-text">
                    <span>{names.from}</span>
                    <ArrowLeftRight size={16} className="text-kumbh-orange flex-shrink-0" />
                    <span>{names.to}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {route.vehicles.map((v) => (v.type === 'two-wheeler' ? '2-Wheeler' : '4-Wheeler')).join(' • ')}
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-kumbh-orange">
                        ₹{minPrice}
                      </span>
                      <span className="text-xs text-gray-500"> {t('home.perPerson')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommended Stays */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">{t('home.recommendedStays')}</h2>
            <button
              onClick={() => navigate('/hotels')}
              className="text-xs font-semibold text-kumbh-orange hover:underline flex items-center gap-1"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.slice(0, 3).map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => navigate(`/hotels/${hotel.id}`)}
                className="card overflow-hidden cursor-pointer hover:border-kumbh-orange transition-all flex flex-col"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img
                    src={hotel.image}
                    alt={getHotelName(hotel, lang)}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 text-kumbh-text shadow-sm">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span>{hotel.rating}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-medium">
                    {hotel.distanceToGhat} {t('hotel.fromGhat')}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-kumbh-text line-clamp-1">
                      {getHotelName(hotel, lang)}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span>{getHotelLocation(hotel, lang)}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">{t('home.startingFrom')}</span>
                      <p className="text-base font-extrabold text-kumbh-orange">
                        ₹{hotel.startingPrice.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-gray-500">{t('home.perNight')}</span>
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-kumbh-deep hover:underline">
                      {t('hotel.viewDetails')} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-4 bg-orange-50/60 rounded-3xl p-6 border border-orange-100">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="section-title">{t('home.howItWorks')}</h2>
            <p className="text-xs text-gray-500">Plan and secure your Simhastha pilgrimage in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-kumbh-orange flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.step1Title')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.step1Desc')}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-kumbh-orange flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.step2Title')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.step2Desc')}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-kumbh-orange flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.step3Title')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.step3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Kumbh Ride */}
        <section className="space-y-4">
          <h2 className="section-title">{t('home.whyChoose')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.feature1')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.feature1Desc')}</p>
              </div>
            </div>

            <div className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <IndianRupee size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.feature2')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.feature2Desc')}</p>
              </div>
            </div>

            <div className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ArrowLeftRight size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.feature3')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.feature3Desc')}</p>
              </div>
            </div>

            <div className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-kumbh-orange flex items-center justify-center flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-kumbh-text">{t('home.feature4')}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('home.feature4Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Information */}
        <div className="card p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-kumbh-orange text-white flex items-center justify-center flex-shrink-0">
              <Train size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-kumbh-text">{t('home.travelInfo')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('home.travelInfoDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-kumbh-text">{t('home.support')}</h3>
              <p className="text-xs text-gray-500">{t('home.supportDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => alert('Demo Support: Call +91 98765 43210 or email support@kumbhride.in')}
            className="btn-secondary text-xs py-2 px-4 whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t('home.contactUs')}
          </button>
        </div>

        {/* Demo Disclaimer */}
        <div className="text-center pb-2">
          <span className="badge-demo text-[11px]">
            {t('home.demoNotice')}
          </span>
        </div>
      </div>
    </div>
  );
}

