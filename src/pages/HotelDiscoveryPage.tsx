import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Building2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { hotels, getHotelName, getHotelLocation, getAmenityName } from '../data/hotelsData';

export function HotelDiscoveryPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'panchvati' | 'trimbakeshwar' | 'nashikCity'>('all');
  const [selectedBudget, setSelectedBudget] = useState<'all' | 'under2000' | '2000to4000' | 'above4000'>('all');

  const filteredHotels = hotels.filter((hotel) => {
    // Search filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName =
        hotel.nameEn.toLowerCase().includes(q) ||
        hotel.nameHi.toLowerCase().includes(q) ||
        hotel.nameMr.toLowerCase().includes(q);
      const matchLoc =
        hotel.locationEn.toLowerCase().includes(q) ||
        hotel.locationHi.toLowerCase().includes(q) ||
        hotel.locationMr.toLowerCase().includes(q);
      if (!matchName && !matchLoc) return false;
    }

    // Location filter
    if (selectedLocation === 'panchvati' && !hotel.tags.includes('panchvati')) return false;
    if (selectedLocation === 'trimbakeshwar' && !hotel.tags.includes('trimbakeshwar')) return false;
    if (selectedLocation === 'nashikCity' && !hotel.tags.some((t) => ['city-centre', 'station', 'riverside'].includes(t)))
      return false;

    // Budget filter
    if (selectedBudget === 'under2000' && hotel.startingPrice >= 2000) return false;
    if (selectedBudget === '2000to4000' && (hotel.startingPrice < 2000 || hotel.startingPrice > 4000))
      return false;
    if (selectedBudget === 'above4000' && hotel.startingPrice <= 4000) return false;

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-kumbh-text">{t('hotel.title')}</h1>
        <p className="text-xs text-gray-500">
          Dharamshalas, ashrams & hotels near Nashik & Trimbakeshwar ghats
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('hotel.search')}
          className="input-field pl-11 pr-4"
        />
      </div>

      {/* Filter Chips */}
      <div className="space-y-2">
        {/* Location Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-xs font-bold text-gray-400 whitespace-nowrap mr-1">
            {t('hotel.location')}:
          </span>
          <button
            onClick={() => setSelectedLocation('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLocation === 'all'
                ? 'bg-kumbh-orange text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.allLocations')}
          </button>
          <button
            onClick={() => setSelectedLocation('panchvati')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLocation === 'panchvati'
                ? 'bg-kumbh-orange text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.panchvati')}
          </button>
          <button
            onClick={() => setSelectedLocation('trimbakeshwar')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLocation === 'trimbakeshwar'
                ? 'bg-kumbh-orange text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.trimbakeshwar')}
          </button>
          <button
            onClick={() => setSelectedLocation('nashikCity')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLocation === 'nashikCity'
                ? 'bg-kumbh-orange text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.nashikCity')}
          </button>
        </div>

        {/* Budget Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-xs font-bold text-gray-400 whitespace-nowrap mr-1">
            {t('hotel.budget')}:
          </span>
          <button
            onClick={() => setSelectedBudget('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedBudget === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.allBudgets')}
          </button>
          <button
            onClick={() => setSelectedBudget('under2000')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedBudget === 'under2000'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.under2000')}
          </button>
          <button
            onClick={() => setSelectedBudget('2000to4000')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedBudget === '2000to4000'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.2000to4000')}
          </button>
          <button
            onClick={() => setSelectedBudget('above4000')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedBudget === 'above4000'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('hotel.above4000')}
          </button>
        </div>
      </div>

      {/* Hotel Cards List */}
      {filteredHotels.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Building2 size={40} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-kumbh-text">{t('hotel.noResults')}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">{t('hotel.tryAdjusting')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => navigate(`/hotels/${hotel.id}`)}
              className="card overflow-hidden cursor-pointer hover:border-kumbh-orange transition-all flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={hotel.image}
                  alt={getHotelName(hotel, lang)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-kumbh-text shadow-md">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>{hotel.rating}</span>
                  <span className="text-gray-400 font-normal">({hotel.reviewCount})</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                  {hotel.distanceToGhat} {t('hotel.fromGhat')}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-kumbh-text group-hover:text-kumbh-orange transition-colors">
                    {getHotelName(hotel, lang)}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin size={13} className="flex-shrink-0 text-kumbh-orange" />
                    <span>{getHotelLocation(hotel, lang)}</span>
                  </p>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 3).map((a) => (
                    <span
                      key={a.id}
                      className="px-2 py-0.5 rounded-md bg-orange-50 text-[11px] font-medium text-kumbh-deep border border-orange-100"
                    >
                      {getAmenityName(a, lang)}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[11px] text-gray-400">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price and Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">{t('home.startingFrom')}</span>
                    <p className="text-lg font-extrabold text-kumbh-orange">
                      ₹{hotel.startingPrice.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-gray-500">{t('home.perNight')}</span>
                    </p>
                  </div>

                  <button className="btn-primary text-xs py-2.5 px-4">
                    {t('hotel.viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

