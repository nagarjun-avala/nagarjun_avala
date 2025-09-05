// utils/analytics.ts - Analytics utilities
export interface UserAgentInfo {
    device: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot';
    browser: string;
    os: string;
    isMobile: boolean;
    isTablet: boolean;
    isBot: boolean;
}

export function parseUserAgent(userAgent: string): UserAgentInfo {
    const ua = userAgent.toLowerCase();

    // Bot detection
    const isBot = /bot|crawler|spider|scraper|wget|curl|python|php|ruby|java|go-http|axios|fetch/i.test(ua);

    // Device detection
    const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const isTablet = /tablet|ipad|playbook|silk/i.test(ua);

    let device: UserAgentInfo['device'] = 'Desktop';
    if (isBot) device = 'Bot';
    else if (isTablet) device = 'Tablet';
    else if (isMobile) device = 'Mobile';

    // Browser detection
    let browser = 'Other';
    if (ua.includes('edg/') || ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opr/') || ua.includes('opera')) browser = 'Opera';
    else if (ua.includes('chrome/') && !ua.includes('edg')) browser = 'Chrome';
    else if (ua.includes('firefox/')) browser = 'Firefox';
    else if (ua.includes('safari/') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('msie') || ua.includes('trident')) browser = 'Internet Explorer';

    // OS detection
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return {
        device,
        browser,
        os,
        isMobile,
        isTablet,
        isBot
    };
}

export function getClientInfo(req: Request) {
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    const ip = forwarded || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null;

    const { device, browser, os, isBot } = parseUserAgent(userAgent);

    return {
        ip,
        userAgent: userAgent.substring(0, 500),
        referrer,
        device,
        browser,
        os,
        isBot
    };
}