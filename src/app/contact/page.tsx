import LeadCaptureForm from '@/components/lead-capture-form';
import { contactEmail, responseTime, secondaryContactEmail, siteName } from '@/lib/site';
import { leadFormDescriptions, leadFormLabels } from '@/lib/lead-capture';

export const metadata = {
  title: 'Contact',
  description: 'Contact Avery Advisory for marketing consolidation, AI support, and custom systems work.',
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

      <section className="mt-10 grid gap-6">
        <LeadCaptureForm
          formType="contact"
          title={leadFormLabels.contact}
          description={leadFormDescriptions.contact}
          fields={[
            { name: 'name', label: 'Name', required: true, placeholder: 'Your name' },
            { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
            { name: 'company', label: 'Company', placeholder: 'Company name' },
            { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us what you need help with.' },
          ]}
        />

        <LeadCaptureForm
          formType="consultation"
          title={leadFormLabels.consultation}
          description={leadFormDescriptions.consultation}
          fields={[
            { name: 'name', label: 'Name', required: true, placeholder: 'Your name' },
            { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
            { name: 'company', label: 'Company', placeholder: 'Company name' },
            { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
            {
              name: 'businessSize',
              label: 'Business Size',
              type: 'select',
              required: true,
              options: [
                { label: 'Solo / Founder', value: 'Solo / Founder' },
                { label: '2-10 people', value: '2-10 people' },
                { label: '11-50 people', value: '11-50 people' },
                { label: '50+ people', value: '50+ people' },
              ],
            },
            {
              name: 'currentChallenges',
              label: 'Current Challenges',
              type: 'textarea',
              required: true,
              placeholder: 'What is slowing the business down right now?',
            },
            {
              name: 'preferredMeetingTime',
              label: 'Preferred Meeting Time',
              placeholder: 'Best days/times and timezone',
            },
          ]}
        />

        <LeadCaptureForm
          formType="automation-audit"
          title={leadFormLabels['automation-audit']}
          description={leadFormDescriptions['automation-audit']}
          fields={[
            { name: 'name', label: 'Name', required: true, placeholder: 'Your name' },
            { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
            { name: 'company', label: 'Company', placeholder: 'Company name' },
            { name: 'website', label: 'Website', type: 'url', placeholder: 'https://example.com' },
            {
              name: 'monthlyRevenueRange',
              label: 'Monthly Revenue Range',
              type: 'select',
              required: true,
              options: [
                { label: 'Under $10k', value: 'Under $10k' },
                { label: '$10k-$50k', value: '$10k-$50k' },
                { label: '$50k-$250k', value: '$50k-$250k' },
                { label: '$250k+', value: '$250k+' },
              ],
            },
            {
              name: 'teamSize',
              label: 'Team Size',
              type: 'select',
              required: true,
              options: [
                { label: '1', value: '1' },
                { label: '2-5', value: '2-5' },
                { label: '6-15', value: '6-15' },
                { label: '16+', value: '16+' },
              ],
            },
            {
              name: 'currentTools',
              label: 'Current Tools',
              type: 'textarea',
              required: true,
              placeholder: 'What systems, apps, or tools are in use now?',
            },
            {
              name: 'biggestBottleneck',
              label: 'Biggest Bottleneck',
              type: 'textarea',
              required: true,
              placeholder: 'What is causing the most friction?',
            },
          ]}
        />

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
              <p>
                Secondary Email:{' '}
                <a className="text-[#f4df9d] transition hover:text-[#ffe9a8]" href={`mailto:${secondaryContactEmail}`}>
                  {secondaryContactEmail}
                </a>
              </p>
              <p>Response Time: {responseTime}</p>
              <p>Availability is best for marketing consolidation, operational systems, and AI support projects.</p>
            </div>
          </div>

          <div className="panel rounded-[1.75rem] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Working Style</p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              We review the current message, simplify the structure, and then decide where AI makes the most sense.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
