// lib/geoLocation.ts - Server-side GeoLocation utility
import { NextRequest } from 'next/server';

// GeoLocation response interface
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
    source: 'ipapi' | 'ip-api' | 'ipinfo' | 'ipgeolocation' | 'maxmind' | 'local';
}

// Cache interface for storing geo data with TTL
interface CacheEntry {
    data: GeoLocationData;
    expiry: number;
    timestamp: number;
}

// In-memory cache with TTL (24 hours default)
const geoCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 10000; // Maximum cache entries
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Cleanup every hour

// Cleanup expired cache entries periodically
setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of geoCache.entries()) {
        if (entry.expiry <= now) {
            keysToDelete.push(key);
        }
    }

    keysToDelete.forEach(key => geoCache.delete(key));

    // If cache is still too large, remove oldest entries
    if (geoCache.size > MAX_CACHE_SIZE) {
        const entries = Array.from(geoCache.entries())
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .slice(0, geoCache.size - MAX_CACHE_SIZE);

        entries.forEach(([key]) => geoCache.delete(key));
    }
}, CLEANUP_INTERVAL);

// Extract client IP from request headers
export function extractClientIP(request: NextRequest | Request): string {
    // Handle both NextRequest and regular Request objects
    const getHeader = (name: string) => {
        if ('headers' in request && typeof request.headers.get === 'function') {
            return request.headers.get(name);
        }
        // Fallback for other request types
        return request?.headers?.[name];
    };

    // Try various headers in order of reliability
    const forwardedFor = getHeader('x-forwarded-for');
    const realIP = getHeader('x-real-ip');
    const cfConnectingIP = getHeader('cf-connecting-ip'); // Cloudflare
    const xClientIP = getHeader('x-client-ip');
    const remoteAddr = (request as any).connection?.remoteAddress ||
        (request as any).socket?.remoteAddress ||
        (request as any).remoteAddress;

    let ip = 'unknown';

    // Priority order for IP extraction
    if (cfConnectingIP) {
        ip = cfConnectingIP;
    } else if (forwardedFor) {
        // X-Forwarded-For can contain multiple IPs, take the first one
        ip = forwardedFor.split(',')[0].trim();
    } else if (realIP) {
        ip = realIP;
    } else if (xClientIP) {
        ip = xClientIP;
    } else if (remoteAddr) {
        ip = remoteAddr;
    }

    // Normalize IPv6-mapped IPv4 addresses
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }

    // Validate IP format
    if (!isValidIP(ip)) {
        ip = 'unknown';
    }

    return ip;
}

// Validate IP address format
function isValidIP(ip: string): boolean {
    // IPv4 regex
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 regex (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Check if IP is private/local
function isPrivateIP(ip: string): boolean {
    if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') return true;

    const privateRanges = [
        /^10\./, // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
        /^192\.168\./, // 192.168.0.0/16
        /^169\.254\./, // Link-local
        /^::1$/, // IPv6 localhost
        /^fc00:/, // IPv6 private
        /^fe80:/, // IPv6 link-local
    ];

    return privateRanges.some(range => range.test(ip));
}

// Main GeoLocation function with multiple service fallbacks
export async function getGeoLocation(ip: string, options?: {
    timeout?: number;
    useCache?: boolean;
    accuracy?: 'high' | 'medium' | 'low';
}): Promise<GeoLocationData> {
    const {
        timeout = 5000,
        useCache = true,
        accuracy = 'medium'
    } = options || {};

    // Handle private/local IPs
    if (isPrivateIP(ip)) {
        return {
            ip,
            country: 'Local Network',
            countryCode: 'LOCAL',
            region: null,
            regionCode: null,
            city: null,
            latitude: null,
            longitude: null,
            timezone: null,
            isp: null,
            organization: null,
            asn: null,
            currency: null,
            language: null,
            isEU: null,
            isVPN: false,
            isTor: false,
            isProxy: false,
            isDataCenter: false,
            isMobile: null,
            zipCode: null,
            accuracy: 'high',
            source: 'local'
        };
    }

    // Check cache first
    const cacheKey = `${ip}-${accuracy}`;
    if (useCache && geoCache.has(cacheKey)) {
        const cached = geoCache.get(cacheKey)!;
        if (cached.expiry > Date.now()) {
            return cached.data;
        }
        geoCache.delete(cacheKey);
    }

    // Define service configurations based on accuracy requirement
    const services = getServicesForAccuracy(ip, accuracy);

    let lastError: Error | null = null;

    // Try each service until one succeeds
    for (const service of services) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(service.url.replace('{ip}', ip), {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Portfolio-Analytics/1.0 (+https://yoursite.com)',
                    'Accept': 'application/json',
                    ...service.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const geoData = service.parser(data, ip);

            // Cache the result
            if (useCache) {
                geoCache.set(cacheKey, {
                    data: geoData,
                    expiry: Date.now() + CACHE_TTL,
                    timestamp: Date.now()
                });
            }

            return geoData;

        } catch (error) {
            lastError = error as Error;
            console.warn(`GeoLocation service ${service.name} failed for IP ${ip}:`, error);
            continue;
        }
    }

    // All services failed, return basic data
    console.error(`All GeoLocation services failed for IP ${ip}. Last error:`, lastError);

    return {
        ip,
        country: null,
        countryCode: null,
        region: null,
        regionCode: null,
        city: null,
        latitude: null,
        longitude: null,
        timezone: null,
        isp: null,
        organization: null,
        asn: null,
        currency: null,
        language: null,
        isEU: null,
        isVPN: null,
        isTor: null,
        isProxy: null,
        isDataCenter: null,
        isMobile: null,
        zipCode: null,
        accuracy: 'low',
        source: 'local'
    };
}

// Service configurations for different accuracy levels
function getServicesForAccuracy(ip: string, accuracy: 'high' | 'medium' | 'low') {
    const allServices = [
        // IPapi.co (Free tier: 1000/day, Paid: more + better accuracy)
        {
            name: 'IPapi.co',
            url: `https://ipapi.co/${ip}/json/`,
            headers: {},
            parser: (data: any, ip: string): GeoLocationData => ({
                ip,
                country: data.country_name || null,
                countryCode: data.country_code || null,
                region: data.region || null,
                regionCode: data.region_code || null,
                city: data.city || null,
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                timezone: data.timezone || null,
                isp: data.org || null,
                organization: data.org || null,
                asn: data.asn || null,
                currency: data.currency || null,
                language: data.languages || null,
                isEU: data.in_eu || null,
                isVPN: null,
                isTor: null,
                isProxy: null,
                isDataCenter: null,
                isMobile: null,
                zipCode: data.postal || null,
                accuracy: 'high',
                source: 'ipapi'
            })
        },

        // IP-API.com (Free tier: 15/minute, 1000/hour)
        {
            name: 'IP-API.com',
            url: 'http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query,mobile,proxy',
            headers: {},
            parser: (data: any, ip: string): GeoLocationData => ({
                ip,
                country: data.country || null,
                countryCode: data.countryCode || null,
                region: data.regionName || null,
                regionCode: data.region || null,
                city: data.city || null,
                latitude: data.lat || null,
                longitude: data.lon || null,
                timezone: data.timezone || null,
                isp: data.isp || null,
                organization: data.org || null,
                asn: data.as || null,
                currency: null,
                language: null,
                isEU: null,
                isVPN: null,
                isTor: null,
                isProxy: data.proxy || null,
                isDataCenter: null,
                isMobile: data.mobile || null,
                zipCode: null,
                accuracy: 'medium',
                source: 'ip-api'
            })
        },

        // IPinfo.io (Free tier: 50,000/month)
        {
            name: 'IPinfo.io',
            url: 'https://ipinfo.io/{ip}/json',
            headers: process.env.IPINFO_TOKEN ? {
                'Authorization': `Bearer ${process.env.IPINFO_TOKEN}`
            } : {},
            parser: (data: any, ip: string): GeoLocationData => {
                const [lat, lon] = data.loc ? data.loc.split(',').map(Number) : [null, null];
                return {
                    ip,
                    country: data.country || null,
                    countryCode: data.country || null,
                    region: data.region || null,
                    regionCode: data.region || null,
                    city: data.city || null,
                    latitude: lat,
                    longitude: lon,
                    timezone: data.timezone || null,
                    isp: data.org || null,
                    organization: data.org || null,
                    asn: data.org ? data.org.split(' ')[0] : null,
                    currency: null,
                    language: null,
                    isEU: null,
                    isVPN: null,
                    isTor: null,
                    isProxy: null,
                    isDataCenter: null,
                    isMobile: null,
                    zipCode: data.postal || null,
                    accuracy: 'medium',
                    source: 'ipinfo'
                };
            }
        },

        // IPGeolocation.io (Free tier: 1000/day)
        {
            name: 'IPGeolocation.io',
            url: `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY || 'demo'}&ip={ip}`,
            headers: {},
            parser: (data: any, ip: string): GeoLocationData => ({
                ip,
                country: data.country_name || null,
                countryCode: data.country_code2 || null,
                region: data.state_prov || null,
                regionCode: data.state_prov || null,
                city: data.city || null,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                timezone: data.time_zone?.name || null,
                isp: data.isp || null,
                organization: data.organization || null,
                asn: data.asn || null,
                currency: data.currency?.code || null,
                language: null,
                isEU: data.is_eu || null,
                isVPN: null,
                isTor: null,
                isProxy: null,
                isDataCenter: null,
                isMobile: null,
                zipCode: data.zipcode || null,
                accuracy: 'high',
                source: 'ipgeolocation'
            })
        }
    ];

    // Return services based on accuracy requirement
    switch (accuracy) {
        case 'high':
            return allServices; // Try all services for best accuracy
        case 'medium':
            return allServices.slice(0, 2); // Use first 2 services
        case 'low':
            return [allServices[1]]; // Use only IP-API (fastest, free)
        default:
            return allServices.slice(0, 2);
    }
}

// Batch GeoLocation lookup for multiple IPs
export async function getBatchGeoLocation(
    ips: string[],
    options?: { timeout?: number; useCache?: boolean; accuracy?: 'high' | 'medium' | 'low' }
): Promise<GeoLocationData[]> {
    const promises = ips.map(ip => getGeoLocation(ip, options));
    return Promise.all(promises);
}

// Get visitor's location from request
export async function getVisitorLocation(
    request: NextRequest | Request,
    options?: { timeout?: number; useCache?: boolean; accuracy?: 'high' | 'medium' | 'low' }
): Promise<GeoLocationData> {
    const ip = extractClientIP(request);
    return getGeoLocation(ip, options);
}

// Enhanced visitor tracking function
export async function trackVisitorWithLocation(
    request: NextRequest | Request,
    additionalData?: {
        userAgent?: string;
        referer?: string;
        page?: string;
    }
) {
    const ip = extractClientIP(request);
    const geoData = await getGeoLocation(ip, { useCache: true, accuracy: 'medium' });

    const visitorData = {
        ip,
        ...geoData,
        userAgent: additionalData?.userAgent || request.headers.get('user-agent') || 'Unknown',
        referer: additionalData?.referer || request.headers.get('referer') || null,
        page: additionalData?.page || null,
        timestamp: new Date(),
        sessionId: generateSessionId()
    };

    return visitorData;
}

// Generate a session ID
function generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Clear cache utility
export function clearGeoCache(): void {
    geoCache.clear();
}

// Get cache stats
export function getCacheStats() {
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;

    for (const entry of geoCache.values()) {
        if (entry.expiry > now) {
            activeEntries++;
        } else {
            expiredEntries++;
        }
    }

    return {
        totalEntries: geoCache.size,
        activeEntries,
        expiredEntries,
        maxSize: MAX_CACHE_SIZE,
        ttl: CACHE_TTL
    };
}

// Utility to check if GeoLocation services are available
export async function checkGeoLocationServices(): Promise<{
    service: string;
    available: boolean;
    responseTime?: number;
    error?: string;
}[]> {
    const testIP = '8.8.8.8'; // Google DNS
    const services = getServicesForAccuracy(testIP, 'medium');

    const results = await Promise.allSettled(
        services.map(async (service) => {
            const start = Date.now();
            try {
                const response = await fetch(service.url.replace('{ip}', testIP), {
                    signal: AbortSignal.timeout(3000)
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                await response.json();

                return {
                    service: service.name,
                    available: true,
                    responseTime: Date.now() - start
                };
            } catch (error) {
                return {
                    service: service.name,
                    available: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        })
    );

    return results.map((result, index) => ({
        service: services[index].name,
        available: result.status === 'fulfilled' ? result.value.available : false,
        responseTime: result.status === 'fulfilled' ? result.value.responseTime : undefined,
        error: result.status === 'fulfilled' ? result.value.error : 'Promise rejected'
    }));
}

// Export types for use in other files
export type { GeoLocationData, CacheEntry };

// Usage example in API route:
/*
// app/api/visitors/route.ts
import { getVisitorLocation } from '@/lib/geoLocation';

export async function POST(request: NextRequest) {
  try {
    const visitorData = await getVisitorLocation(request, {
      accuracy: 'medium',
      timeout: 3000,
      useCache: true
    });
    
    // Save to database
    const visitor = await db.visitor.upsert({
      where: { ip: visitorData.ip },
      update: { 
        visits: { increment: 1 },
        lastVisit: new Date(),
        country: visitorData.country,
        city: visitorData.city
      },
      create: { 
        ip: visitorData.ip,
        visits: 1,
        country: visitorData.country,
        region: visitorData.region,
        city: visitorData.city,
        latitude: visitorData.latitude,
        longitude: visitorData.longitude,
        timezone: visitorData.timezone,
        isp: visitorData.isp
      }
    });
    
    return NextResponse.json({ success: true, visitor });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
  }
}
*/