import { contactEmail, effectiveDate, siteName } from '@/lib/site';

export const metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for consulting services offered by Avery Advisory.',
};

const sections = [
  {
    title: 'General Policy',
    body: [
      `${siteName} provides consulting and custom services that require time, planning, and expert labor.`,
      'Because those services are delivered through scheduled work and business insight, refunds are limited as described below.',
    ],
  },
  {
    title: 'Discovery Call',
    body: [
      'Discovery Calls are free and do not require a refund process.',
    ],
  },
  {
    title: 'Strategy Session',
    body: [
      'Strategy Sessions are non-refundable once the session has been scheduled or delivered.',
      'If you need to reschedule, contact us as early as possible and we will try to accommodate a new time.',
    ],
  },
  {
    title: 'Automation Audit',
    body: [
      'Automation Audits are non-refundable once the work has started because the audit involves analysis, review, and preparation time.',
      'If we fail to deliver the agreed audit materials, we will work in good faith to correct the issue before any refund is considered.',
    ],
  },
  {
    title: 'Custom Projects',
    body: [
      'Custom project refunds depend on the written scope, delivery status, and any milestone approvals already completed.',
      'If a project is canceled before work starts, any prepaid amount may be refundable minus reasonable administrative or processing costs where permitted.',
    ],
  },
  {
    title: 'Exceptional Circumstances',
    body: [
      'We review refund requests for billing errors, duplicate charges, or obvious service failures on a case-by-case basis.',
      'Approved refunds are returned to the original payment method when possible.',
    ],
  },
  {
    title: 'How to Request a Review',
    body: [
      `Send your name, invoice or receipt details, and a short explanation to ${contactEmail}.`,
      'We will review the request and respond within a reasonable time.',
    ],
  },
  {
    title: 'Chargebacks',
    body: [
      'If you have a billing concern, contact us first so we can try to resolve it quickly.',
      'Unresolved chargebacks may delay future service delivery while the matter is reviewed by the payment processor.',
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <article className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Refund Policy</h1>
        <p className="mt-4 text-sm text-white/55">Effective Date: {effectiveDate}</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-white/65">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Policy Changes</h2>
            <p>
              We may update this policy when service offerings change or when legal or operational requirements shift.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
