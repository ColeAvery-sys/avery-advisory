export const siteName = 'Avery Advisory';
export const tagline = 'Marketing Consolidation | AI Second | Operational Clarity';
export const companyLegalName = 'Avery Industries LLC';
export const founderName = 'Cole Avery Ends';
export const contactEmail = 'alphapotentiallive@gmail.com';
export const secondaryContactEmail = 'ColeAvery@Avery-Advisory.com';
export const leadNotificationEmail = contactEmail;
export const responseTime = 'Within 1 Business Day';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avery-advisory.com';
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
export const stripeIsConfigured = stripePublishableKey.trim().length > 0;
export const effectiveDate = 'June 16, 2026';

export type PaymentPlanKey = 'strategy' | 'audit' | 'custom';
export type CreatorLogisticsPlanKey = 'creator-starter' | 'creator-growth' | 'creator-operator';

export type PaymentPlan = {
  key: PaymentPlanKey;
  name: string;
  price: string;
  description: string;
  amount: number;
  currency: 'usd';
  successPath: string;
  productLabel: string;
};

export const paymentPlans: PaymentPlan[] = [
  {
    key: 'strategy',
    name: 'Strategy Session',
    price: '$150',
    description: 'A focused working session to find the fastest path to cleaner messaging and stronger conversion.',
    amount: 15000,
    currency: 'usd',
    successPath: '/payment-success',
    productLabel: 'Strategy Session',
  },
  {
    key: 'audit',
    name: 'Automation Audit',
    price: '$500',
    description: 'A practical review of pages, offers, channels, and repeat work to identify what should be combined for more leverage.',
    amount: 50000,
    currency: 'usd',
    successPath: '/payment-success',
    productLabel: 'Automation Audit',
  },
  {
    key: 'custom',
    name: 'Custom Project Deposit',
    price: '$1,000',
    description: 'A scoped implementation deposit for premium custom work and recurring operational leverage.',
    amount: 100000,
    currency: 'usd',
    successPath: '/payment-success',
    productLabel: 'Custom Project Deposit',
  },
];

export type CreatorLogisticsPlan = {
  key: CreatorLogisticsPlanKey;
  name: string;
  price: string;
  description: string;
  priceIdEnv: string;
};

export const creatorLogisticsPlans: CreatorLogisticsPlan[] = [
  {
    key: 'creator-starter',
    name: 'Starter Package',
    price: '$750/month',
    description: '2 long-form edits, 4 shorts, thumbnail support, and upload assistance.',
    priceIdEnv: 'STRIPE_PRICE_CREATOR_STARTER',
  },
  {
    key: 'creator-growth',
    name: 'Growth Package',
    price: '$1,500/month',
    description: '4 long-form edits, 10 shorts, thumbnail design, SEO optimization, and analytics review.',
    priceIdEnv: 'STRIPE_PRICE_CREATOR_GROWTH',
  },
  {
    key: 'creator-operator',
    name: 'Operator Package',
    price: '$2,500/month',
    description: '8 long-form edits, 20 shorts, thumbnail strategy, channel management, upload scheduling, and a monthly strategy call.',
    priceIdEnv: 'STRIPE_PRICE_CREATOR_OPERATOR',
  },
];

export function getCreatorLogisticsPlan(key: CreatorLogisticsPlanKey) {
  return creatorLogisticsPlans.find((plan) => plan.key === key) ?? null;
}

export function getPaymentPlan(key: PaymentPlanKey) {
  return paymentPlans.find((plan) => plan.key === key) ?? null;
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
    href: '/pay?plan=strategy',
    badge: 'Best Entry',
  },
  {
    name: 'Automation Audit',
    price: '$500',
    description: 'A practical review of pages, offers, channels, and repeat work to identify what should be combined for more leverage.',
    actionLabel: 'Pay with Stripe',
    href: '/pay?plan=audit',
    badge: 'Best Value',
    featured: true,
  },
  {
    name: 'Custom Project Deposit',
    price: '$1,000',
    description: 'A scoped implementation deposit for recurring operational leverage and premium execution.',
    actionLabel: 'Contact Us',
    href: '/pay?plan=custom',
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
