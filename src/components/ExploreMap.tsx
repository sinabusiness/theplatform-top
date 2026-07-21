import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Compass,
  Map as MapIcon,
  X,
  AlertCircle,
} from 'lucide-react';

interface ExploreMapProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  selectedPost: Post | null;
  currentSimulatedCity: string;
  onCityChange: (city: string) => void;
  isVerifiedCreatorMode: boolean;
  onPinNewLocation?: (lat: number, lng: number, locationName: string) => void;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  'All': { lat: 39.8283, lng: -98.5795, zoom: 3 },
  'San Francisco': { lat: 37.7749, lng: -122.4194, zoom: 12 },
  'Denver': { lat: 39.7392, lng: -104.9903, zoom: 11 },
  'Rome': { lat: 41.9028, lng: 12.4964, zoom: 12 },
};

const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

const BADGE_COLORS: Record<string, string> = {
  local: '#f43f5e',
  national: '#10b981',
  international: '#0ea5e9',
  vintage: '#f59e0b',
};

function getBadgeSvg(tier: string): string {
  const color = BADGE_COLORS[tier] || BADGE_COLORS.international;
  let path: string;
  switch (tier) {
    case 'local':
      path = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';
      break;
    case 'national':
      path = 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l5.59-5.59L17 9l-7 7z';
      break;
    case 'vintage':
      path = 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z M12 15.5l-3.5 1.5 1.5-4-3-2.5 3.8-.2L12 6.5l1.2 3.8 3.8.2-3 2.5 1.5 4z';
      break;
    default:
      path = 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
  }
  return `<svg viewBox="0 0 24 24" style="width:85%;height:85%;fill:${color}" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;
}

function createAvatarIcon(post: Post, isSelected: boolean): L.DivIcon {
  const badgeSvg = getBadgeSvg(post.tier);
  const selectedStyle = isSelected
    ? 'transform:scale(1.2);box-shadow:0 0 0 2px white,0 0 20px rgba(255,255,255,0.3);z-index:1000 !important;'
    : 'transform:scale(1);';

  return L.divIcon({
    className: '',
    html: `
      <div style="width:40px;height:40px;position:relative;border-radius:9999px;padding:2px;background:linear-gradient(to top right,#eab308,#ec4899,#9333ea);box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:transform 0.15s;cursor:pointer;${selectedStyle}">
        <div style="width:100%;height:100%;border-radius:9999px;overflow:hidden;border:2px solid black;background:#171717;">
          <img src="${post.creatorAvatar}" alt="" referrerPolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none'" />
        </div>
        <span style="position:absolute;bottom:0;right:0;width:14px;height:14px;border-radius:9999px;border:1px solid black;display:flex;align-items:center;justify-content:center;background:#18181b;line-height:1;">
          ${badgeSvg}
        </span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function MapClickHandler({ isVerifiedCreatorMode, onPinNewLocation }: { isVerifiedCreatorMode: boolean; onPinNewLocation?: (lat: number, lng: number, name: string) => void }) {
  useMapEvents({
    click(e) {
      if (isVerifiedCreatorMode && onPinNewLocation) {
        onPinNewLocation(e.latlng.lat, e.latlng.lng, `Tagged Spot (${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)})`);
      }
    },
  });
  return null;
}

function FlyToCity({ city }: { city: string }) {
  const map = useMap();
  const prevCity = useRef(city);

  useEffect(() => {
    if (prevCity.current !== city) {
      const coords = CITY_COORDINATES[city] || CITY_COORDINATES['All'];
      map.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 1.5 });
      prevCity.current = city;
    }
  }, [city, map]);

  return null;
}

const POPUP_STYLES = `
  .dark-popup .leaflet-popup-content-wrapper {
    background: #0a0a0b !important;
    color: white !important;
    border-radius: 12px !important;
    border: 1px solid #262626 !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.8) !important;
  }
  .dark-popup .leaflet-popup-tip {
    background: #0a0a0b !important;
    border: 1px solid #262626 !important;
  }
  .dark-popup .leaflet-popup-close-button {
    color: #737373 !important;
    font-size: 16px !important;
    top: 6px !important;
    right: 6px !important;
  }
  .dark-popup .leaflet-popup-close-button:hover {
    color: white !important;
  }
  .dark-popup .leaflet-popup-content {
    margin: 10px 12px !important;
  }
  .custom-avatar-marker {
    background: none !important;
    border: none !important;
  }
`;

export const ExploreMap: React.FC<ExploreMapProps> = ({
  posts,
  onSelectPost,
  selectedPost,
  currentSimulatedCity,
  onCityChange,
  isVerifiedCreatorMode,
  onPinNewLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInfoPost, setActiveInfoPost] = useState<Post | null>(null);
  const [showHint, setShowHint] = useState(true);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (selectedPost) {
      setActiveInfoPost(selectedPost);
      const marker = markerRefs.current.get(selectedPost.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedPost]);

  const mapCenter = CITY_COORDINATES[currentSimulatedCity] || CITY_COORDINATES['All'];

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    return (
      post.locationName.toLowerCase().includes(q) ||
      post.creatorName.toLowerCase().includes(q) ||
      post.caption.toLowerCase().includes(q)
    );
  });

  const handleShowOnFeed = (postId: string) => {
    const card = document.getElementById(`post-feed-card-${postId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="explore-map-container" className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden flex flex-col h-[550px] text-left">
      <style>{POPUP_STYLES}</style>

      {/* Search and control Header */}
      <div className="p-4 bg-neutral-950 border-b border-neutral-900 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 max-md:w-full">
          <Compass className="w-5 h-5 text-sky-400 animate-spin-slow" />
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white leading-none">
              Live Explore Grid
            </h3>
            <span className="text-[9px] text-neutral-500 mt-0.5 block">
              OpenStreetMap + CartoDB Dark
            </span>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search geotags or profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-900 rounded-full py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
          />
        </div>

        <div className="flex items-center gap-1 bg-black p-1 rounded-full border border-neutral-900 overflow-x-auto scrollbar-none shrink-0 max-md:w-full">
          {['All', 'San Francisco', 'Denver', 'Rome'].map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                currentSimulatedCity === city
                  ? 'bg-white text-black font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div className="relative flex-1 bg-[#02040a] overflow-hidden select-none">
        {isVerifiedCreatorMode && (
          <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-neutral-900 text-[9px] font-black uppercase tracking-widest py-1.5 px-3.5 rounded-full flex items-center gap-1.5 z-[1000] text-sky-400 shadow-md pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>Click any point on map to Drop Tag</span>
          </div>
        )}

        <MapContainer
          key="osm-map"
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={mapCenter.zoom}
          className="w-full h-full"
          zoomControl={true}
          scrollWheelZoom={true}
          style={{ background: '#02040a' }}
        >
          <TileLayer url={DARK_TILE_URL} attribution={TILE_ATTRIBUTION} />

          <MapClickHandler isVerifiedCreatorMode={isVerifiedCreatorMode} onPinNewLocation={onPinNewLocation} />
          <FlyToCity city={currentSimulatedCity} />

          {filteredPosts.map((post) => {
            const isSelected = activeInfoPost?.id === post.id;
            return (
              <Marker
                key={post.id}
                position={[post.lat, post.lng]}
                icon={createAvatarIcon(post, isSelected)}
                ref={(ref) => {
                  if (ref) markerRefs.current.set(post.id, ref);
                  else markerRefs.current.delete(post.id);
                }}
                eventHandlers={{
                  click: () => {
                    setActiveInfoPost(post);
                    onSelectPost(post);
                  },
                }}
              >
                <Popup
                  closeButton={true}
                  className="dark-popup"
                  autoClose={true}
                >
                  <div className="max-w-[200px] p-1 font-sans text-left space-y-2">
                    <div className="flex items-center gap-1.5 border-b border-neutral-700 pb-1.5">
                      <img
                        src={post.creatorAvatar}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover border border-neutral-600"
                      />
                      <div>
                        <p className="text-[10px] font-black leading-none text-white">@{post.creatorUsername}</p>
                        <p className="text-[8px] text-zinc-400 mt-0.5">{post.locationName}</p>
                      </div>
                    </div>
                    <div className="aspect-square w-full rounded overflow-hidden">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9.5px] text-zinc-300 line-clamp-2 leading-relaxed italic">
                      &ldquo;{post.caption}&rdquo;
                    </p>
                    <button
                      onClick={() => handleShowOnFeed(post.id)}
                      className="w-full bg-blue-600 font-extrabold hover:bg-blue-700 text-white rounded py-1 px-2 text-[8.5px] text-center uppercase tracking-wide cursor-pointer"
                    >
                      Show on Feed &rarr;
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Hint banner */}
        {showHint && (
          <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md border border-neutral-800 p-2.5 rounded-xl z-[1000] flex items-center justify-between shadow-lg text-left gap-3 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              </span>
              <div>
                <p className="text-[9.5px] font-extrabold text-white leading-tight uppercase tracking-wider">
                  Free OpenStreetMap Layer Active
                </p>
                <p className="text-[8.5px] text-zinc-400 leading-tight">
                  No API key needed &mdash; real worldwide map data from OpenStreetMap, served via CartoDB dark tiles. Zero cost, zero restrictions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHint(false)}
              className="text-neutral-500 hover:text-white shrink-0 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black p-3 px-4 border-t border-neutral-900 text-[10px] font-medium uppercase tracking-widest text-neutral-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <MapIcon className="w-3.5 h-3.5" />
          OpenStreetMap &mdash; Free &amp; Open
        </span>
        <span className="font-mono">
          Total posts mapped: <strong className="text-white">{filteredPosts.length}</strong>
        </span>
      </div>
    </div>
  );
};
