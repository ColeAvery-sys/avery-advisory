export type CompanyDivision = {
  slug: string;
  name: string;
  domain: string;
  role: string;
  launchStage: 'Now' | 'Next' | 'Later';
  summary: string;
  headline: string;
  operatingFocus: string[];
  nextStep: string;
};

export const companyDivisions: CompanyDivision[] = [
  {
    slug: 'avery-advisory',
    name: 'Avery Advisory',
    domain: 'avery-advisory.com',
    role: 'Service division',
    launchStage: 'Now',
    summary: 'Consulting, automation, and operational support that creates the first cash-flow lane.',
    headline: 'The service division that turns company knowledge into revenue.',
    operatingFocus: ['Client intake', 'Automation audits', 'Operational strategy', 'Approval-gated delivery'],
    nextStep: 'Use this division for consulting, audits, and scoped operating work.',
  },
  {
    slug: 'averytech',
    name: 'AveryTech',
    domain: 'averytech.com',
    role: 'Tech division',
    launchStage: 'Now',
    summary: 'Accessible, practical technology products and tools for the broader company system.',
    headline: 'The technology division that builds the tools behind the umbrella company.',
    operatingFocus: ['Accessibility tooling', 'Internal products', 'Automation utilities', 'Prototype systems'],
    nextStep: 'Use this division for software, research, and product experiments.',
  },
  {
    slug: 'atlas-protocol',
    name: 'Atlas Protocol',
    domain: 'atlasprotocol.com',
    role: 'Portfolio division',
    launchStage: 'Now',
    summary: 'The portfolio and proof layer that shows the company network, work samples, and credibility.',
    headline: 'The proof division that presents the work, the standards, and the receipts.',
    operatingFocus: ['Portfolio', 'Case studies', 'Brand proof', 'Executive presentation'],
    nextStep: 'Use this division to show work, credibility, and public-facing proof.',
  },
  {
    slug: 'creator-logistics',
    name: 'Creator Logistics',
    domain: 'creatorlogistics.com',
    role: 'Creator products',
    launchStage: 'Next',
    summary: 'Creator-facing productized offers, systems, and fulfillment support.',
    headline: 'The creator division for productized offers and fulfillment support.',
    operatingFocus: ['Productized offers', 'Fulfillment', 'Content systems', 'Creator operations'],
    nextStep: 'Launch after the first three divisions are stable.',
  },
  {
    slug: 'avery-supply-co',
    name: 'Avery Supply Co.',
    domain: 'averysupplyco.com',
    role: 'Apparel division',
    launchStage: 'Next',
    summary: 'Clothing and branded merchandise built from the same company infrastructure.',
    headline: 'The apparel division for clothing and branded merch.',
    operatingFocus: ['Apparel', 'Merchandise', 'Brand drops', 'Fulfillment planning'],
    nextStep: 'Use when the shared commerce stack is ready.',
  },
  {
    slug: 'avery-athletics',
    name: 'Avery Athletics',
    domain: 'averyathletics.com',
    role: 'Fitness division',
    launchStage: 'Next',
    summary: 'Fitness, training, and supplement-oriented products when the operating base is ready.',
    headline: 'The fitness division for training, performance, and supplements.',
    operatingFocus: ['Fitness products', 'Training content', 'Supplement strategy', 'Performance branding'],
    nextStep: 'Launch after brand and compliance foundations are in place.',
  },
  {
    slug: 'coletrain-studios',
    name: 'ColeTrain Studios',
    domain: 'coletrainstudios.com',
    role: 'Studio division',
    launchStage: 'Later',
    summary: 'Art and animation production with a reusable creative pipeline.',
    headline: 'The art and animation studio for future creative production.',
    operatingFocus: ['Animation', 'Art direction', 'Production pipeline', 'Creative IP'],
    nextStep: 'Activate once the media and content stack can support it.',
  },
  {
    slug: 'avery-entertainment',
    name: 'Avery Entertainment',
    domain: 'averyentertainment.com',
    role: 'Media division',
    launchStage: 'Later',
    summary: 'The mother media company for public-facing content and distribution.',
    headline: 'The media division for public-facing content and distribution.',
    operatingFocus: ['Media brands', 'Distribution', 'Audience systems', 'Publishing'],
    nextStep: 'Use as the parent media layer when the audience pipeline is ready.',
  },
  {
    slug: 'avery-foundation',
    name: 'Avery Foundation',
    domain: 'averyfoundation.com',
    role: 'Charity division',
    launchStage: 'Later',
    summary: 'Charity and community support work routed through a controlled public identity.',
    headline: 'The charity division for community support and grants.',
    operatingFocus: ['Charity ops', 'Grant support', 'Community programs', 'Impact reporting'],
    nextStep: 'Launch with clear governance and approval gates.',
  },
  {
    slug: 'avery-collectables',
    name: 'Avery Collectables',
    domain: 'averycollectables.com',
    role: 'Products division',
    launchStage: 'Later',
    summary: 'Toy and collectible product ideas once the shared commerce stack is proven.',
    headline: 'The product division for toys, collectibles, and future drops.',
    operatingFocus: ['Collectibles', 'Toy concepts', 'Product drops', 'Packaging'],
    nextStep: 'Activate after the shared product pipeline is proven.',
  },
  {
    slug: 'avery-music-group',
    name: 'Avery Music Group',
    domain: 'averymusicgroup.com',
    role: 'Music division',
    launchStage: 'Later',
    summary: 'Music creation, publishing, and catalog operations under the parent company.',
    headline: 'The music division for catalog, publishing, and release operations.',
    operatingFocus: ['Music production', 'Publishing', 'Sync prep', 'Release strategy'],
    nextStep: 'Bring online when music operations need their own lane.',
  },
];

export const highlightedDivisions = companyDivisions.slice(0, 3);

const divisionBySlug = new Map(companyDivisions.map((division) => [division.slug, division]));
const divisionByDomain = new Map(companyDivisions.map((division) => [division.domain, division]));

export function normalizeHost(host: string) {
  return host.trim().toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '');
}

export function getDivisionBySlug(slug: string) {
  return divisionBySlug.get(slug);
}

export function getDivisionByDomain(domain: string) {
  return divisionByDomain.get(normalizeHost(domain));
}

export function getDivisionSlugForHost(host: string) {
  const normalizedHost = normalizeHost(host);
  return getDivisionByDomain(normalizedHost)?.slug ?? null;
}

export function isKnownDivisionDomain(host: string) {
  return getDivisionSlugForHost(host) !== null;
}

export const launchOrder = [
  'Use Avery Industries LLC as the parent company and routing layer.',
  'Launch averyindustries.com as the mother page and company directory.',
  'Activate Avery Advisory, AveryTech, and Atlas Protocol first.',
  'Reuse one codebase, one design system, and one analytics stack.',
  'Add new brands only after the shared platform and approval flow are stable.',
];

export const sharedStack = [
  'One frontend codebase with domain-based theming.',
  'One CMS or content source for all company pages.',
  'One analytics and logging layer.',
  'One form and email pipeline with approval gates.',
  'One design system with brand tokens per division.',
];

export const validationChecklist = [
  'Parent company name is Avery Industries LLC everywhere the company is referenced.',
  'Atlas Protocol is spelled correctly on all public-facing pages.',
  'Each active division has a domain, role, and launch stage.',
  'The shared stack is cheaper than maintaining separate sites.',
  'The rollout order favors revenue first and later brands second.',
];
