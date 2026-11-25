import { api } from '@/shared/services/api';

export type ShareKind = 'place' | 'route_dest' | 'route' | 'sos';

export interface SharePoint {
  lat: number;
  lng: number;
  name?: string | null;
}

export interface ShareUser {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

/** GET /api/shares/:code (traffic backend), as the app reads it. */
export interface ResolvedShare {
  code: string;
  kind: ShareKind;
  location: SharePoint & { city?: string | null; country?: string | null; type?: string | null };
  origin?: SharePoint | null;
  mode?: 'driving' | 'walking' | null;
  waypoints?: SharePoint[] | null;
  sender?: ShareUser | null;
  createdAt: string;
  expiresAt: string | null;
}

/** The share behind a /s/<code> link; rejects with `status` 404 when it is unknown or expired. */
export const resolveShare = (code: string) =>
  api.get<ResolvedShare>(`/api/shares/${encodeURIComponent(code)}`);

const ANDROID_PACKAGE = 'co.gebeta.apps.android.map';
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

export const isAndroid = () => /Android/i.test(navigator.userAgent);

/**
 * Android: open this share in the Gebeta Maps app (it reads https://maps.gebeta.app/s/<code>),
 * or the Play Store when the app isn't installed. A plain link to this same page wouldn't hand off
 * to the app, since the browser is already on maps.gebeta.app.
 */
export const androidAppUrl = (code: string) =>
  `intent://maps.gebeta.app/s/${encodeURIComponent(code)}#Intent;scheme=https;package=${ANDROID_PACKAGE};` +
  `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
