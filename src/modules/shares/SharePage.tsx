import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GebetaMap from '@gebeta/tiles';
import type { GebetaMapRef } from '@gebeta/tiles';
import { Car, Footprints, LoaderCircle, MapPin, Navigation, Siren, Smartphone } from 'lucide-react';
import { getNavigation } from '@/maps/navigation/service';
import { decodeRouteCoordinates } from '@/maps/utils/navigationRoute';
import { addDashedRoute } from '@/maps/utils/mapLayers';
import { androidAppUrl, isAndroid, resolveShare, type ResolvedShare, type SharePoint } from './share.service';

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;
const ADDIS: [number, number] = [38.7685, 9.0161];

type Route = { coordinates: [number, number][]; km: number; seconds: number };
type State =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'failed' }
  | { status: 'ready'; share: ResolvedShare; route: Route | null };

const toMap = (p: SharePoint): [number, number] => [p.lng, p.lat];

const formatDistance = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`);
const formatDuration = (seconds: number) => {
  const min = Math.max(1, Math.round(seconds / 60));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60} min`;
};

/** The route a `route` share describes (origin → waypoints → destination), or null if it can't be had. */
async function fetchRoute(share: ResolvedShare): Promise<Route | null> {
  if (share.kind !== 'route' || !share.origin) return null;
  try {
    const response = await getNavigation(
      [share.origin.lat, share.origin.lng],
      [share.location.lat, share.location.lng],
      (share.waypoints ?? []).map((w) => [w.lat, w.lng] as [number, number]),
      share.mode === 'walking' ? 'pedestrian' : 'auto',
    );
    const legs = response.data?.trip?.legs ?? [];
    const coordinates = decodeRouteCoordinates(legs);
    if (!coordinates.length) return null;
    return {
      coordinates,
      km: legs.reduce((sum, leg) => sum + (leg.summary?.length ?? 0), 0),
      seconds: legs.reduce((sum, leg) => sum + (leg.summary?.time ?? 0), 0),
    };
  } catch {
    // The points are still worth showing without the line.
    return null;
  }
}

/**
 * maps.gebeta.app/s/<code>: a place or route someone shared from Gebeta Maps (or another Gebeta
 * app). Phones with the app installed open the link in the app; everyone else lands here and sees
 * it on the map, with a way into the app on Android.
 */
export function SharePage() {
  const { code = '' } = useParams();
  // A new code starts over (fresh map, loading state).
  return <ShareView key={code} code={code} />;
}

function ShareView({ code }: { code: string }) {
  const mapRef = useRef<GebetaMapRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    resolveShare(code)
      .then(async (share) => {
        const route = await fetchRoute(share);
        if (!cancelled) setState({ status: 'ready', share, route });
      })
      .catch((e: { status?: number }) => {
        if (!cancelled) setState({ status: e?.status === 404 ? 'missing' : 'failed' });
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const draw = useCallback((share: ResolvedShare, route: Route | null) => {
    const map = mapRef.current;
    const instance = map?.getMapInstance();
    if (!map || !instance) return;

    map.clearMarkers();
    map.clearPaths();
    const walking = share.mode === 'walking';
    if (route) {
      if (walking) addDashedRoute(instance as never, route.coordinates, '#4285f4', 4);
      else map.addPath(route.coordinates, { color: '#ffa500', width: 5 });
    }
    if (share.kind === 'route' && share.origin) {
      map.addImageMarker(toMap(share.origin), '/pin.svg', [28, 28], undefined, 10, share.origin.name ? `<b>${escapeHtml(share.origin.name)}</b>` : undefined);
    }
    for (const w of share.waypoints ?? []) map.addImageMarker(toMap(w), '/pin.svg', [22, 22], undefined, 10);
    map.addImageMarker(toMap(share.location), '/assets/location-pin.svg', [36, 36], undefined, 20,
      share.location.name ? `<b>${escapeHtml(share.location.name)}</b>` : undefined);

    // Everything in view, clear of the card (below on phones, at the left on wider screens).
    const points = [...(route?.coordinates ?? []), toMap(share.location), ...(share.origin && share.kind === 'route' ? [toMap(share.origin)] : [])];
    const wide = window.innerWidth >= 768;
    const padding = wide ? { top: 60, bottom: 60, left: 440, right: 60 } : { top: 60, bottom: 300, left: 40, right: 40 };
    if (points.length === 1) {
      instance.jumpTo({ center: points[0], zoom: 15 });
      instance.panBy([wide ? -190 : 0, wide ? 0 : 120], { duration: 0 });
    } else {
      const lngs = points.map((p) => p[0]);
      const lats = points.map((p) => p[1]);
      instance.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding, maxZoom: 16, duration: 0 });
    }
  }, []);

  useEffect(() => {
    if (mapReady && state.status === 'ready') draw(state.share, state.route);
  }, [mapReady, state, draw]);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gray-100">
      <Helmet>
        <title>{state.status === 'ready' ? `${titleOf(state.share)} · Gebeta Maps` : 'Gebeta Maps'}</title>
      </Helmet>
      <GebetaMap ref={mapRef} apiKey={apiKey} center={ADDIS} zoom={12} onMapLoaded={() => setMapReady(true)} />

      <div className="absolute inset-x-3 bottom-3 md:inset-x-auto md:left-4 md:top-4 md:bottom-auto md:w-96 z-[500]">
        <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-4">
          {state.status === 'loading' && (
            <div className="flex items-center gap-3 text-gray-600" role="status">
              <LoaderCircle className="size-5 animate-spin text-[#ffa500]" aria-hidden />
              <span>Opening shared location…</span>
            </div>
          )}
          {(state.status === 'missing' || state.status === 'failed') && (
            <>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {state.status === 'missing' ? 'This link has expired' : "Couldn't open this link"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {state.status === 'missing'
                    ? 'The shared location is no longer available. Ask for a new link.'
                    : 'Check your connection and try again.'}
                </p>
              </div>
              <div className="flex gap-2">
                {state.status === 'failed' && (
                  <button onClick={() => window.location.reload()}
                          className="flex-1 h-11 rounded-xl bg-[#ffa500] text-white font-semibold hover:brightness-95">
                    Try again
                  </button>
                )}
                <Link to="/" className="flex-1 h-11 rounded-xl border border-gray-300 font-semibold text-gray-800 grid place-items-center hover:bg-gray-50">
                  Open the map
                </Link>
              </div>
            </>
          )}
          {state.status === 'ready' && <ShareCard share={state.share} route={state.route} />}
        </div>
      </div>
    </div>
  );
}

function ShareCard({ share, route }: { share: ResolvedShare; route: Route | null }) {
  const walking = share.mode === 'walking';
  const ModeIcon = share.kind === 'sos' ? Siren : share.kind === 'route' ? (walking ? Footprints : Car) : MapPin;
  const { lat, lng, name } = share.location;
  const mapLink = `/?${new URLSearchParams({ lat: String(lat), lng: String(lng), name: name || 'Shared location' })}`;

  return (
    <>
      <div className="flex items-start gap-3">
        <div className={`size-10 shrink-0 rounded-full grid place-items-center ${share.kind === 'sos' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-[#e69500]'}`}>
          <ModeIcon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{eyebrowOf(share)}</p>
          <h1 className="text-lg font-semibold text-gray-900 leading-snug break-words">{titleOf(share)}</h1>
          {share.kind === 'route' && share.origin?.name && (
            <p className="text-sm text-gray-600 mt-0.5 break-words">From {share.origin.name}</p>
          )}
          {share.sender?.name && <p className="text-xs text-gray-500 mt-1">Shared by {share.sender.name}</p>}
        </div>
      </div>

      {route && (
        <div className="flex items-center gap-4 rounded-xl bg-gray-50 px-4 py-3">
          <div>
            <p className="text-xl font-semibold text-gray-900 tabular-nums">{formatDuration(route.seconds)}</p>
            <p className="text-xs text-gray-500">{walking ? 'on foot' : 'by car'}</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <p className="text-xl font-semibold text-gray-900 tabular-nums">{formatDistance(route.km)}</p>
            <p className="text-xs text-gray-500">distance</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {isAndroid() && (
          <a href={androidAppUrl(share.code)}
             className="h-11 rounded-xl bg-[#ffa500] text-white font-semibold flex items-center justify-center gap-2 hover:brightness-95">
            <Smartphone className="size-4" aria-hidden />
            {share.kind === 'route' ? 'Start in Gebeta Maps' : 'Open in Gebeta Maps'}
          </a>
        )}
        <Link to={mapLink}
              className="h-11 rounded-xl border border-gray-300 font-semibold text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50">
          <Navigation className="size-4" aria-hidden />
          Directions from my location
        </Link>
      </div>
    </>
  );
}

function titleOf(share: ResolvedShare) {
  return share.location.name || (share.kind === 'sos' ? 'Emergency location' : 'Shared location');
}

function eyebrowOf(share: ResolvedShare) {
  if (share.kind === 'sos') return 'SOS · needs help here';
  if (share.kind === 'route') return share.mode === 'walking' ? 'Walking route to' : 'Driving route to';
  if (share.kind === 'route_dest') return 'Directions to';
  return 'Shared place';
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
