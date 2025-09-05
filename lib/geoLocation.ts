// lib/geoLocation.ts
import { NextRequest } from 'next/server';

// --------------------
// Types
// --------------------
export interface GeoLocationData {
    ip: string;
    country: string | null;
    countryCode: string | null;
    region: string | null;
    regionCode: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    timezone: string | null;
    isp: string | null;
    organization: string | null;
    asn: string | null;
    currency: string | null;
    language: string | null;
    isEU: boolean | null;
    isVPN: boolean | null;
    isTor: boolean | null;
    isProxy: boolean | null;
    isDataCenter: boolean | null;
    isMobile: boolean | null;
    zipCode: string | null;
    accuracy: 'high' | 'medium' | 'low';
    source: 'ipapi' | 'ip-api' | 'ipinfo' | 'ipgeolocation' | 'local';
}

interface CacheEntry {
    data: GeoLocationData;
    expiry: number;
    timestamp: number;
}

interface ExtendedRequest extends Request {
    connection?: { remoteAddress?: string };
    socket?: { remoteAddress?: string };
    remoteAddress?: string;
}

// --------------------
// Cache
// --------------------
const geoCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 10000;
const CLEANUP_INTERVAL = 60 * 60 * 1000;

setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of geoCache.entries()) {
        if (entry.expiry <= now) keysToDelete.push(key);
    }

    keysToDelete.forEach(key => geoCache.delete(key));

    if (geoCache.size > MAX_CACHE_SIZE) {
        Array.from(geoCache.entries())
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .slice(0, geoCache.size - MAX_CACHE_SIZE)
            .forEach(([key]) => geoCache.delete(key));
    }
}, CLEANUP_INTERVAL);

// --------------------
// IP Extraction
// --------------------

interface GenericRequest {
    headers?: Headers | Record<string, string | null>;
    connection?: { remoteAddress?: string };
    socket?: { remoteAddress?: string };
    remoteAddress?: string;
}

export function extractClientIP(request: GenericRequest): string {
    const getHeader = (req: GenericRequest, name: string): string | null => {
        if (req.headers instanceof Headers) return req.headers.get(name);
        if (req.headers && !(req.headers instanceof Headers)) return req.headers[name] ?? null;
        return null;
    };

    const forwardedFor = getHeader(request, 'x-forwarded-for');
    const realIP = getHeader(request, 'x-real-ip');
    const cfConnectingIP = getHeader(request, 'cf-connecting-ip');
    const xClientIP = getHeader(request, 'x-client-ip');

    let remoteAddr: string | undefined;
    if (request.connection?.remoteAddress) remoteAddr = request.connection.remoteAddress;
    else if (request.socket?.remoteAddress) remoteAddr = request.socket.remoteAddress;
    else if (request.remoteAddress) remoteAddr = request.remoteAddress;

    let ip = 'unknown';
    if (cfConnectingIP) ip = cfConnectingIP;
    else if (forwardedFor) ip = forwardedFor.split(',')[0].trim();
    else if (realIP) ip = realIP;
    else if (xClientIP) ip = xClientIP;
    else if (remoteAddr) ip = remoteAddr;

    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
    if (!isValidIP(ip)) ip = 'unknown';

    return ip;
}


function isValidIP(ip: string): boolean {
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4.test(ip) || ipv6.test(ip);
}

function isPrivateIP(ip: string): boolean {
    if (['unknown', '127.0.0.1', '::1'].includes(ip)) return true;
    const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[01])\./,
        /^192\.168\./,
        /^169\.254\./,
        /^::1$/,
        /^fc00:/,
        /^fe80:/,
    ];
    return privateRanges.some(r => r.test(ip));
}

// --------------------
// GeoLocation Services
// --------------------
type GeoServiceParser<T> = (data: T, ip: string) => GeoLocationData;

interface GeoService<T = unknown> {
    name: string;
    url: string;
    headers: Record<string, string>;
    parser: GeoServiceParser<T>;
}

function getServicesForAccuracy(ip: string, accuracy: 'high' | 'medium' | 'low'): GeoService[] {
    const allServices: GeoService[] = [
        // IPapi.co
        {
            name: 'IPapi.co',
            url: `https://ipapi.co/${ip}/json/`,
            headers: {},
            parser: (data: unknown, ip: string) => {
                const obj = data as Record<string, unknown>;
                return {
                    ip,
                    country: typeof obj.country_name === 'string' ? obj.country_name : null,
                    countryCode: typeof obj.country_code === 'string' ? obj.country_code : null,
                    region: typeof obj.region === 'string' ? obj.region : null,
                    regionCode: typeof obj.region_code === 'string' ? obj.region_code : null,
                    city: typeof obj.city === 'string' ? obj.city : null,
                    latitude: typeof obj.latitude === 'number' ? obj.latitude : null,
                    longitude: typeof obj.longitude === 'number' ? obj.longitude : null,
                    timezone: typeof obj.timezone === 'string' ? obj.timezone : null,
                    isp: typeof obj.org === 'string' ? obj.org : null,
                    organization: typeof obj.org === 'string' ? obj.org : null,
                    asn: typeof obj.asn === 'string' ? obj.asn : null,
                    currency: typeof obj.currency === 'string' ? obj.currency : null,
                    language: typeof obj.languages === 'string' ? obj.languages : null,
                    isEU: typeof obj.in_eu === 'boolean' ? obj.in_eu : null,
                    isVPN: null,
                    isTor: null,
                    isProxy: null,
                    isDataCenter: null,
                    isMobile: null,
                    zipCode: typeof obj.postal === 'string' ? obj.postal : null,
                    accuracy: 'high',
                    source: 'ipapi',
                };
            }
        },

        // IP-API.com
        {
            name: 'IP-API.com',
            url: `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query,mobile,proxy`,
            headers: {},
            parser: (data: unknown, ip: string) => {
                const obj = data as Record<string, unknown>;
                return {
                    ip,
                    country: typeof obj.country === 'string' ? obj.country : null,
                    countryCode: typeof obj.countryCode === 'string' ? obj.countryCode : null,
                    region: typeof obj.regionName === 'string' ? obj.regionName : null,
                    regionCode: typeof obj.region === 'string' ? obj.region : null,
                    city: typeof obj.city === 'string' ? obj.city : null,
                    latitude: typeof obj.lat === 'number' ? obj.lat : null,
                    longitude: typeof obj.lon === 'number' ? obj.lon : null,
                    timezone: typeof obj.timezone === 'string' ? obj.timezone : null,
                    isp: typeof obj.isp === 'string' ? obj.isp : null,
                    organization: typeof obj.org === 'string' ? obj.org : null,
                    asn: typeof obj.as === 'string' ? obj.as : null,
                    currency: null,
                    language: null,
                    isEU: null,
                    isVPN: null,
                    isTor: null,
                    isProxy: typeof obj.proxy === 'boolean' ? obj.proxy : null,
                    isDataCenter: null,
                    isMobile: typeof obj.mobile === 'boolean' ? obj.mobile : null,
                    zipCode: null,
                    accuracy: 'medium',
                    source: 'ip-api',
                };
            }
        },

        // IPinfo.io
        {
            name: 'IPinfo.io',
            url: `https://ipinfo.io/${ip}/json`,
            headers: process.env.IPINFO_TOKEN ? { Authorization: `Bearer ${process.env.IPINFO_TOKEN}` } : {},
            parser: (data: unknown, ip: string) => {
                const obj = data as Record<string, unknown>;
                const loc = typeof obj.loc === 'string' ? obj.loc.split(',').map(Number) : [null, null];
                return {
                    ip,
                    country: typeof obj.country === 'string' ? obj.country : null,
                    countryCode: typeof obj.country === 'string' ? obj.country : null,
                    region: typeof obj.region === 'string' ? obj.region : null,
                    regionCode: typeof obj.region === 'string' ? obj.region : null,
                    city: typeof obj.city === 'string' ? obj.city : null,
                    latitude: typeof loc[0] === 'number' ? loc[0] : null,
                    longitude: typeof loc[1] === 'number' ? loc[1] : null,
                    timezone: typeof obj.timezone === 'string' ? obj.timezone : null,
                    isp: typeof obj.org === 'string' ? obj.org : null,
                    organization: typeof obj.org === 'string' ? obj.org : null,
                    asn: typeof obj.org === 'string' ? obj.org.split(' ')[0] : null,
                    currency: null,
                    language: null,
                    isEU: null,
                    isVPN: null,
                    isTor: null,
                    isProxy: null,
                    isDataCenter: null,
                    isMobile: null,
                    zipCode: typeof obj.postal === 'string' ? obj.postal : null,
                    accuracy: 'medium',
                    source: 'ipinfo',
                };
            }
        },

        // IPGeolocation.io
        {
            name: 'IPGeolocation.io',
            url: `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY || 'demo'}&ip=${ip}`,
            headers: {},
            parser: (data: unknown, ip: string) => {
                const obj = data as IPGeoResponse;
                return {
                    ip,
                    country: typeof obj.country_name === 'string' ? obj.country_name : null,
                    countryCode: typeof obj.country_code2 === 'string' ? obj.country_code2 : null,
                    region: typeof obj.state_prov === 'string' ? obj.state_prov : null,
                    regionCode: typeof obj.state_prov === 'string' ? obj.state_prov : null,
                    city: typeof obj.city === 'string' ? obj.city : null,
                    latitude: typeof obj.latitude === 'string' ? parseFloat(obj.latitude) : null,
                    longitude: typeof obj.longitude === 'string' ? parseFloat(obj.longitude) : null,
                    timezone: typeof obj.time_zone?.name === 'string' ? obj.time_zone.name : null,
                    isp: typeof obj.isp === 'string' ? obj.isp : null,
                    organization: typeof obj.organization === 'string' ? obj.organization : null,
                    asn: typeof obj.asn === 'string' ? obj.asn : null,
                    currency: typeof obj.currency?.code === 'string' ? obj.currency.code : null,
                    language: null,
                    isEU: typeof obj.is_eu === 'boolean' ? obj.is_eu : null,
                    isVPN: null,
                    isTor: null,
                    isProxy: null,
                    isDataCenter: null,
                    isMobile: null,
                    zipCode: typeof obj.zipcode === 'string' ? obj.zipcode : null,
                    accuracy: 'high',
                    source: 'ipgeolocation',
                };
            }
        },
    ];

    if (accuracy === 'high') return allServices;
    if (accuracy === 'medium') return allServices.slice(0, 3);
    return [allServices[1]]; // low
}

// --------------------
// Core Functions
// --------------------
export async function getGeoLocation(ip: string, options?: {
    timeout?: number;
    useCache?: boolean;
    accuracy?: 'high' | 'medium' | 'low';
}): Promise<GeoLocationData> {
    const { timeout = 5000, useCache = true, accuracy = 'medium' } = options || {};

    if (isPrivateIP(ip)) return {
        ip, country: 'Local Network', countryCode: 'LOCAL', region: null, regionCode: null,
        city: null, latitude: null, longitude: null, timezone: null,
        isp: null, organization: null, asn: null, currency: null, language: null,
        isEU: null, isVPN: false, isTor: false, isProxy: false, isDataCenter: false,
        isMobile: null, zipCode: null, accuracy: 'high', source: 'local'
    };

    const cacheKey = `${ip}-${accuracy}`;
    if (useCache && geoCache.has(cacheKey)) {
        const cached = geoCache.get(cacheKey)!;
        if (cached.expiry > Date.now()) return cached.data;
        geoCache.delete(cacheKey);
    }

    const services = getServicesForAccuracy(ip, accuracy);
    let lastError: Error | null = null;

    for (const service of services) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(service.url, {
                signal: controller.signal,
                headers: { 'User-Agent': 'Portfolio-Analytics/1.0', Accept: 'application/json', ...service.headers }
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const data: unknown = await response.json();
            const geoData = service.parser(data, ip);

            if (useCache) geoCache.set(cacheKey, { data: geoData, expiry: Date.now() + CACHE_TTL, timestamp: Date.now() });
            return geoData;
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            console.warn(`Service ${service.name} failed:`, lastError.message);
        }
    }

    console.error(`All GeoLocation services failed for IP ${ip}. Last error:`, lastError?.message);
    return {
        ip, country: null, countryCode: null, region: null, regionCode: null, city: null,
        latitude: null, longitude: null, timezone: null, isp: null, organization: null, asn: null,
        currency: null, language: null, isEU: null, isVPN: null, isTor: null, isProxy: null,
        isDataCenter: null, isMobile: null, zipCode: null, accuracy: 'low', source: 'local'
    };
}

// --------------------
// Batch + Visitor Tracking
// --------------------
export async function getBatchGeoLocation(
    ips: string[],
    options?: { timeout?: number; useCache?: boolean; accuracy?: 'high' | 'medium' | 'low' }
): Promise<GeoLocationData[]> {
    return Promise.all(ips.map(ip => getGeoLocation(ip, options)));
}

export async function getVisitorLocation(
    request: NextRequest | ExtendedRequest,
    options?: { timeout?: number; useCache?: boolean; accuracy?: 'high' | 'medium' | 'low' }
): Promise<GeoLocationData> {
    const ip = extractClientIP(request);
    return getGeoLocation(ip, options);
}

interface IPGeoResponse {
    country_name?: string;
    country_code2?: string;
    state_prov?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
    time_zone?: { name?: string };
    isp?: string;
    organization?: string;
    asn?: string;
    currency?: { code?: string };
    is_eu?: boolean;
    zipcode?: string;
}

export function clearGeoCache(): void { geoCache.clear(); }

export function getCacheStats() {
    const now = Date.now();
    let active = 0;
    let expired = 0;

    for (const entry of geoCache.values()) {
        if (entry.expiry > now) {
            active++;
        } else {
            expired++;
        }
    }

    return {
        totalEntries: geoCache.size,
        activeEntries: active,
        expiredEntries: expired,
        maxSize: MAX_CACHE_SIZE,
        ttl: CACHE_TTL
    };
}


export type { CacheEntry };
