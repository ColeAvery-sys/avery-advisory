import { founderProfile, siteName } from '@/lib/site';

export const metadata = {
  title: 'About',
  description: 'Meet the founder and mission behind Avery Advisory.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">About</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Practical systems work best when they are designed by people who have lived the work.</h1>
        <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
          {siteName} is built to help organizations reduce manual work, clean up their operations, and move with more confidence.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="panel rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Founder</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{founderProfile.name}</h2>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-white/50">{founderProfile.title}</p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/65">
            <p>{founderProfile.bio}</p>
          </div>
        </article>

        <article className="panel rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f4df9d]">Mission Statement</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Build useful technology that helps people work smarter, not harder.</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/65">
            <p>
              The work should be easy to understand, fast to adopt, and reliable enough to keep running after launch. The goal is
              not novelty. The goal is measurable improvement.
            </p>
            <p>
              That means clean handoffs, fewer bottlenecks, and systems that support the team instead of creating more admin.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
