import React from 'react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import { Mail, Building2, User2, FileText } from 'lucide-react';

function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="AveryTech contact inquiry form for investor, partner, and general interest messages."
      />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Contact"
          title="Simple contact form UI."
          description="This page is presentation-only for now and is not connected to a backend."
          align="center"
        />

        <form
          className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-8"
          onSubmit={(event) => event.preventDefault()}
          aria-label="AveryTech inquiry form"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <User2 className="h-4 w-4 text-sky-300" />
                Name
              </span>
              <input
                type="text"
                name="name"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20"
                placeholder="Your name"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Mail className="h-4 w-4 text-sky-300" />
                Email
              </span>
              <input
                type="email"
                name="email"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20"
                placeholder="name@company.com"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Building2 className="h-4 w-4 text-sky-300" />
                Organization
              </span>
              <input
                type="text"
                name="organization"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20"
                placeholder="Organization or company"
              />
            </label>
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <FileText className="h-4 w-4 text-sky-300" />
                Message
              </span>
              <textarea
                name="message"
                rows="6"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20"
                placeholder="Tell AveryTech what you need."
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:translate-y-[-1px] hover:bg-sky-300"
            >
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Contact;
