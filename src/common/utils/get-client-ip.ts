import type { Request } from 'express';

export function getClientIp(req: Request): string {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.length) {
        const first = xff.split(',')[0].trim();
        if (first) return normalizeIp(first);
    }

    const xr = req.headers['x-real-ip'];
    if (typeof xr === 'string' && xr.length) return normalizeIp(xr);

    if ((req as any).ip) return normalizeIp((req as any).ip);

    if (req.socket && req.socket.remoteAddress) return normalizeIp(req.socket.remoteAddress);

    return 'Unknown';
}

function normalizeIp(ip: string): string {
    let cleaned = ip;
    if (cleaned.startsWith('::ffff:')) cleaned = cleaned.replace('::ffff:', '');
    if (cleaned === '::1') cleaned = '127.0.0.1';
    return cleaned;
}
