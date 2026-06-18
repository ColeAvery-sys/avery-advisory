import { siteUrl } from '@/lib/site';

const routes = ['', '/services', '/about', '/contact', '/creator-logistics', '/privacy-policy', '/terms-of-service', '/refund-policy'];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
