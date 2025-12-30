import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'bn'],

    // Used when no locale matches
    defaultLocale: 'bn',

    // Disable automatic locale detection based on Accept-Language header
    // This ensures Bengali is always the default for new visitors
    localeDetection: false
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(bn|en)/:path*']
};
