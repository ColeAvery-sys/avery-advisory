import { companyLegalName, contactEmail, effectiveDate, siteName, siteUrl } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Avery Advisory.',
};

const sections = [
  {
    title: 'Overview',
    body: [
      `${siteName} is operated by ${companyLegalName} and provides consulting, strategy, and operational services through ${siteUrl}.`,
      'This Privacy Policy explains what information we collect, how we use it, and the choices you have when you interact with our website or contact us.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'We may collect information you submit directly through the contact form, including your name, email address, company name, phone number, and project details.',
      'We may also collect limited technical information such as browser type, device type, pages visited, and approximate usage data for security and performance analysis.',
    ],
  },
  {
    title: 'How We Use Information',
    body: [
      'We use contact information to respond to inquiries, prepare proposals, deliver services, schedule calls, and maintain project records.',
      'We use technical information to monitor website health, improve user experience, prevent abuse, and understand which pages are most useful.',
    ],
  },
  {
    title: 'Sharing and Disclosure',
    body: [
      'We do not sell personal information.',
      'We may share information with trusted service providers that help us operate the website, host content, process payments, or manage communications, subject to reasonable confidentiality obligations.',
    ],
  },
  {
    title: 'Payment Processing',
    body: [
      'If we use Stripe Payment Links or similar payment tools, payment information is handled by the payment provider according to its own privacy and security practices.',
      'We do not store full card details on our website.',
    ],
  },
  {
    title: 'Data Retention',
    body: [
      'We keep inquiry records for as long as reasonably necessary for business, tax, legal, or service delivery purposes.',
      'If you would like us to remove a record where legally permitted, contact us using the email address below.',
    ],
  },
  {
    title: 'Cookies and Analytics',
    body: [
      'We may use cookies or similar technologies for basic site functionality, security, and performance analytics.',
      'You can adjust browser settings to limit cookies, but some features may not function correctly if cookies are disabled.',
    ],
  },
  {
    title: 'Your Choices',
    body: [
      'You may request access to, correction of, or deletion of information you have submitted to us, subject to legal and contractual obligations.',
      'You can opt out of non-essential communications by contacting us directly.',
    ],
  },
  {
    title: 'Security',
    body: [
      'We use reasonable administrative, technical, and organizational safeguards to protect the information we maintain.',
      'No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
    ],
  },
  {
    title: 'Children',
    body: [
      'Our services are intended for business use and are not directed to children under 13.',
      'We do not knowingly collect personal information from children under 13.',
    ],
  },
  {
    title: 'Contact',
    body: [
      `Questions about this policy can be sent to ${contactEmail}.`,
      'We will review privacy requests and respond as soon as reasonably practicable.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <article className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Privacy Policy</h1>
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
            <h2 className="text-xl font-semibold text-white">Policy Updates</h2>
            <p>
              We may update this policy from time to time to reflect changes in the website, services, legal requirements, or
              operational practices. The updated version will be posted on this page with a revised effective date.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
