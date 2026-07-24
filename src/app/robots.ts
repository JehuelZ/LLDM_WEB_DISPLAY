import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lldmrodeo.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/portal',
          '/portal/*',
          '/dashboard',
          '/dashboard/*',
          '/display',
          '/display/*',
          '/activar',
          '/activar/*',
          '/tv',
          '/tv/*',
          '/directory',
          '/directory/*',
          '/calendar',
          '/calendar/*',
          '/auth',
          '/auth/*',
          '/api',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
