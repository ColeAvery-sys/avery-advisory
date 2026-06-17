import { companyLegalName, contactEmail, effectiveDate, siteName } from '@/lib/site';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Avery Advisory.',
};

const sections = [
  {
    title: 'Agreement to Terms',
    body: [
      `By using the website or engaging ${siteName} services, you agree to these Terms of Service.`,
      `If you do not agree, do not use the website or purchase services from ${companyLegalName}.`,
    ],
  },
  {
    title: 'Services',
    body: [
      `${siteName} provides consulting, strategy, process improvement, automation design, and related operating services.`,
      'Specific deliverables, timelines, and scope will be confirmed in writing before work begins.',
    ],
  },
  {
    title: 'Client Responsibilities',
    body: [
      'You agree to provide accurate information, timely feedback, and access to the systems or materials reasonably needed to complete the work.',
      'Delays caused by missing information, late approvals, or unavailable access may affect project timelines.',
    ],
  },
  {
    title: 'Payments',
    body: [
      'Fees are due according to the selected service offering, invoice, or payment link.',
      'Unless otherwise stated in writing, all fees are non-refundable once work has begun, subject to the separate refund policy below.',
    ],
  },
  {
    title: 'Intellectual Property',
    body: [
      'We retain ownership of our pre-existing frameworks, templates, methods, and internal tools.',
      'Upon full payment, you receive the usage rights described in the applicable proposal or agreement for the final deliverables created specifically for your project.',
    ],
  },
  {
    title: 'Confidentiality',
    body: [
      'Both parties agree to keep non-public business, financial, operational, and technical information confidential, except where disclosure is required by law or authorized in writing.',
    ],
  },
  {
    title: 'No Guaranteed Results',
    body: [
      'We work to improve systems and outcomes, but we do not guarantee specific financial, operational, or business results.',
      'Implementation success depends on many factors outside our control, including your internal execution and external market conditions.',
    ],
  },
  {
    title: 'Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, our liability for claims arising from the website or services is limited to the amount you paid for the specific service giving rise to the claim.',
      'We are not liable for indirect, incidental, or consequential damages.',
    ],
  },
  {
    title: 'Termination',
    body: [
      'Either party may end a project with written notice if the engagement is not working as expected.',
      'Any completed work and outstanding balances remain subject to the applicable agreement and refund policy.',
    ],
  },
  {
    title: 'Governing Law',
    body: [
      'These Terms will be governed by the laws of the applicable jurisdiction for the business, unless a separate written agreement says otherwise.',
    ],
  },
  {
    title: 'Contact',
    body: [
      `Questions about these Terms can be sent to ${contactEmail}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <article className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Terms of Service</h1>
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
            <h2 className="text-xl font-semibold text-white">Updates</h2>
            <p>
              We may revise these Terms from time to time. Continued use of the website after changes are posted means you accept
              the updated Terms.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
