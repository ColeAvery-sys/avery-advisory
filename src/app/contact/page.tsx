import ContactForm from '@/components/contact-form';
import { contactEmail, responseTime, siteName } from '@/lib/site';

export const metadata = {
  title: 'Contact',
  description: 'Contact Avery Advisory for consultations, strategy sessions, and custom automation projects.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Contact</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Start with a clear intake and a response within one business day.</h1>
        <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
          {siteName} keeps the intake process simple. Send the basics, describe the problem, and we&apos;ll respond with the next best
          step.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <ContactForm />

        <aside className="space-y-4">
          <div className="panel rounded-[1.75rem] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Contact Information</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/65">
              <p>
                Email:{' '}
                <a className="text-[#f4df9d] transition hover:text-[#ffe9a8]" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
              <p>Response Time: {responseTime}</p>
              <p>Availability is best for consulting, operational systems, and automation projects.</p>
            </div>
          </div>

          <div className="panel rounded-[1.75rem] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Stripe Readiness</p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Strategy Session, Automation Audit, and Custom Project payment links can be wired in as live Stripe Payment Links
              using environment variables during deployment.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
