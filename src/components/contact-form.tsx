'use client';

import { FormEvent, useState } from 'react';
import { contactEmail } from '@/lib/site';

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectDetails: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  projectDetails: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');
  const [message, setMessage] = useState('');

  function handleChange(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name || !form.email || !form.projectDetails) {
      setStatus('idle');
      setMessage('Please complete name, email, and project details before continuing.');
      return;
    }

    const subject = encodeURIComponent(`Avery Advisory inquiry from ${form.name}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Company: ${form.company || 'Not provided'}`,
        `Phone: ${form.phone || 'Not provided'}`,
        '',
        'Project Details:',
        form.projectDetails,
      ].join('\n'),
    );

    setStatus('ready');
    setMessage('Your email app will open with a draft so you can review it before sending.');
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/75">Name</span>
            <input
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37]/60"
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/75">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37]/60"
              placeholder="you@company.com"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/75">Company</span>
            <input
              value={form.company}
              onChange={(event) => handleChange('company', event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37]/60"
              placeholder="Company name"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/75">Phone</span>
            <input
              value={form.phone}
              onChange={(event) => handleChange('phone', event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37]/60"
              placeholder="(555) 123-4567"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm text-white/75">Project Details</span>
          <textarea
            rows={6}
            value={form.projectDetails}
            onChange={(event) => handleChange('projectDetails', event.target.value)}
            className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37]/60"
            placeholder="Tell us what you want to automate, improve, or audit."
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d]"
          >
            Send Draft Email
          </button>
          <p className="text-xs leading-5 text-white/45">
            The form opens a draft in your email app. No message is auto-sent.
          </p>
        </div>

        <p aria-live="polite" className={`text-sm ${status === 'ready' ? 'text-[#f4df9d]' : 'text-white/60'}`}>
          {message || 'We respond within 1 business day.'}
        </p>
      </form>
    </div>
  );
}
