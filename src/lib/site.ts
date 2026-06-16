export const siteName = 'Avery Advisory';
export const tagline = 'Business Automation • AI Consulting • Operational Excellence';
export const companyLegalName = 'Avery Industries LLC';
export const founderName = 'Cole Ends';
export const contactEmail = 'alphapotentiallive@gmail.com';
export const responseTime = 'Within 1 Business Day';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avery-advisory.com';
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
    title: 'AI Automation',
    body: 'Replace repetitive admin work with dependable systems that improve speed, accuracy, and throughput.',
  },
  {
    title: 'Business Systems',
    body: 'Turn scattered processes into simple operating rhythms, clearer ownership, and better visibility.',
  },
  {
    title: 'Process Optimization',
    body: 'Remove waste, compress cycle time, and make the work easier to repeat as the company grows.',
  },
];

export const processSteps = [
  {
    step: '1',
    title: 'Discovery',
    body: 'We review your goals, bottlenecks, tools, and current operating model.',
  },
  {
    step: '2',
    title: 'Strategy',
    body: 'We map the highest-value automation and process changes for the business.',
  },
  {
    step: '3',
    title: 'Implementation',
    body: 'We build the system, document the workflow, and launch the working version.',
  },
  {
    step: '4',
    title: 'Support',
    body: 'We tune the process, answer questions, and maintain momentum after launch.',
  },
];

export const services = [
  'AI & Automation Consulting',
  'Business Process Design',
  'Workflow Optimization',
  'Content & Marketing Systems',
  'Operations Audits',
  'Custom Automation Projects',
];

export const pricingCards = [
  {
    name: 'Discovery Call',
    price: 'Free',
    description: 'A short intake call to identify the problem and decide whether we are a fit.',
    actionLabel: 'Book Free Consultation',
    href: '/contact',
  },
  {
    name: 'Strategy Session',
    price: '$150',
    description: 'A focused working session with next-step recommendations and clarity.',
    actionLabel: 'Pay with Stripe',
    href: getPaymentLink('strategy') ?? '/contact',
  },
  {
    name: 'Automation Audit',
    price: '$500',
    description: 'A practical review of systems, bottlenecks, and automation opportunities.',
    actionLabel: 'Pay with Stripe',
    href: getPaymentLink('audit') ?? '/contact',
  },
  {
    name: 'Custom Project',
    price: 'Custom Quote',
    description: 'A scoped implementation project for recurring operational leverage.',
    actionLabel: 'Contact Us',
    href: getPaymentLink('custom') ?? '/contact',
  },
];

export const founderProfile = {
  name: founderName,
  title: 'Founder',
  bio:
    '10+ years of experience across customer service, sales, operations, technology, and business systems. Focused on helping organizations implement practical automation and AI solutions that drive measurable results.',
  mission: 'Build useful technology that helps people work smarter, not harder.',
};
