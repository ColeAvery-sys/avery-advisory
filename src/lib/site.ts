export const siteName = 'Avery Advisory';
export const tagline = 'Marketing Consolidation | AI Second | Operational Clarity';
export const companyLegalName = 'Avery Industries LLC';
export const founderName = 'Cole Avery Ends';
export const contactEmail = 'alphapotentiallive@gmail.com';
export const secondaryContactEmail = 'ColeAvery@Avery-Advisory.com';
export const responseTime = 'Within 1 Business Day';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avery-advisory.com';
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
export const stripeIsConfigured = stripePublishableKey.trim().length > 0;
export const effectiveDate = 'June 16, 2026';

type PaymentLinkKey = 'strategy' | 'audit' | 'custom';

const paymentLinkEnvMap: Record<PaymentLinkKey, string> = {
  strategy: 'NEXT_PUBLIC_STRIPE_STRATEGY_LINK',
  audit: 'NEXT_PUBLIC_STRIPE_AUDIT_LINK',
  custom: 'NEXT_PUBLIC_STRIPE_CUSTOM_LINK',
};

export function getPaymentLink(key: PaymentLinkKey) {
  const envKey = paymentLinkEnvMap[key];
  const value = process.env[envKey];
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms-of-service', label: 'Terms' },
  { href: '/refund-policy', label: 'Refunds' },
];

export const whyCards = [
  {
    title: 'Marketing Consolidation',
    body: 'Pull scattered offers, pages, and messages into one cleaner operating structure that is easier to sell and manage.',
  },
  {
    title: 'Execution Systems',
    body: 'Turn recurring work into simple operating rhythms with clearer ownership, reporting, and follow-through.',
  },
  {
    title: 'AI Second',
    body: 'Apply AI where it removes friction after the marketing and operations structure is already clean.',
  },
];

export const processSteps = [
  {
    step: '1',
    title: 'Consolidate',
    body: 'We review offers, pages, channels, and repeat work to find what should be unified.',
  },
  {
    step: '2',
    title: 'Clarify',
    body: 'We define the core message, the primary offer, and the smallest structure that can support growth.',
  },
  {
    step: '3',
    title: 'Automate',
    body: 'We add AI and workflow support after the marketing foundation is organized and easier to run.',
  },
  {
    step: '4',
    title: 'Maintain',
    body: 'We keep the system documented, measurable, and easy to operate as the brand grows.',
  },
];

export const services = [
  'Marketing Consolidation',
  'Brand Messaging Systems',
  'AI Workflow Support',
  'Operations Audit',
  'Content System Design',
  'Custom Automation Projects',
];

export const pricingCards = [
  {
    name: 'Discovery Call',
    price: 'Free',
    description: 'A short intake call to identify the highest-leverage problem and decide whether we are a fit.',
    actionLabel: 'Book Free Call',
    href: '/contact',
  },
  {
    name: 'Strategy Session',
    price: '$150',
    description: 'A focused working session to find the fastest path to cleaner messaging and stronger conversion.',
    actionLabel: 'Pay with Stripe',
    href: getPaymentLink('strategy') ?? '/contact',
    badge: 'Best Entry',
  },
  {
    name: 'Consolidation Audit',
    price: '$500',
    description: 'A practical review of pages, offers, channels, and repeat work to identify what should be combined for more leverage.',
    actionLabel: 'Pay with Stripe',
    href: getPaymentLink('audit') ?? '/contact',
    badge: 'Best Value',
    featured: true,
  },
  {
    name: 'Custom Project',
    price: 'Custom Quote',
    description: 'A scoped implementation project for recurring operational leverage and premium execution.',
    actionLabel: 'Contact Us',
    href: getPaymentLink('custom') ?? '/contact',
    badge: 'Premium',
  },
];

export const founderProfile = {
  name: founderName,
  title: 'Founder',
  bio:
    '10+ years of experience across customer service, sales, operations, marketing, and business systems. Focused on helping organizations consolidate the message first, then apply AI where it creates leverage.',
  mission: 'Build useful systems that make marketing cleaner, operations simpler, and AI more effective.',
};
