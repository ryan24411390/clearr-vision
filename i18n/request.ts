import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Bengali only - no locale detection needed
  const locale = 'bn';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
