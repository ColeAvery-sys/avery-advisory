'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { LeadFormType } from '@/lib/lead-capture';
import { trackEvent } from '@/lib/analytics';

type FormValues = Record<string, string>;

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
};

type LeadFormProps = {
  formType: LeadFormType;
  title: string;
  description: string;
  fields: Field[];
};

const baseClass = 'min-h-11 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#d4af37]/60';
const textareaClass = `${baseClass} min-h-[160px] leading-7`;

async function logLeadEvent(eventType: 'view' | 'start' | 'complete', formType: LeadFormType) {
  await fetch('/api/lead-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventType, formType, path: window.location.pathname }),
  });
}

export default function LeadCaptureForm({ formType, title, description, fields }: LeadFormProps) {
  const [values, setValues] = useState<FormValues>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('We respond within 1 business day.');
  const [started, setStarted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const viewTracked = useRef(false);

  const requiredFields = useMemo(() => fields.filter((field) => field.required).map((field) => field.name), [fields]);

  useEffect(() => {
    if (!viewTracked.current) {
      viewTracked.current = true;
      void logLeadEvent('view', formType);
      trackEvent('form_view', { formType });
    }
  }, [formType]);

  function setField(name: string, value: string) {
    if (!started) {
      setStarted(true);
      void logLeadEvent('start', formType);
      trackEvent('form_start', { formType });
    }
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const form = formRef.current;
      const formData = form ? new FormData(form) : new FormData();
      const payload = Object.fromEntries(formData.entries());

      for (const fieldName of requiredFields) {
        const value = String(payload[fieldName] ?? '').trim();
        if (!value) {
          setStatus('error');
          setMessage(`Please complete the ${fieldName} field before continuing.`);
          return;
        }
      }

      setStatus('submitting');
      setMessage('Submitting your request...');

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          formType,
        }),
      });

      const result = (await response.json().catch(() => null)) as null | { ok?: boolean; error?: string; message?: string; redirectUrl?: string };

      if (!response.ok || !result?.ok) {
        setStatus('error');
        setMessage(result?.error || 'Something went wrong. Please try again.');
        return;
      }

      void logLeadEvent('complete', formType);
      trackEvent('form_submit', { formType, status: 'complete' });
      setStatus('success');
      setMessage(result.message || 'Thanks. We received your submission.');
      window.location.href = result.redirectUrl || '/thank-you';
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">{title}</p>
        <p className="text-sm leading-7 text-white/65">{description}</p>
      </div>

      <form ref={formRef} className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <input type="hidden" name="formType" value={formType} />
        <input type="hidden" name="source" value="website" />
        <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="grid gap-2 md:col-span-1">
              <span className="text-sm text-white/75">
                {field.label}
                {field.required ? <span className="text-[#f4df9d]"> *</span> : null}
              </span>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  value={values[field.name] || ''}
                  onChange={(event) => setField(field.name, event.target.value)}
                  className={textareaClass}
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  required={field.required}
                  value={values[field.name] || ''}
                  onChange={(event) => setField(field.name, event.target.value)}
                  className={baseClass}
                >
                  <option value="">Select one</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  required={field.required}
                  type={field.type || 'text'}
                  value={values[field.name] || ''}
                  onChange={(event) => setField(field.name, event.target.value)}
                  className={baseClass}
                  placeholder={field.placeholder}
                />
              )}
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e8c55d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Request'}
          </button>
          <p className="text-xs leading-5 text-white/45">We never auto-send. Every submission goes to Cole for follow-up.</p>
        </div>

        <p aria-live="polite" className={`text-sm ${status === 'error' ? 'text-red-300' : status === 'success' ? 'text-[#f4df9d]' : 'text-white/60'}`}>
          {message}
        </p>
      </form>
    </div>
  );
}
