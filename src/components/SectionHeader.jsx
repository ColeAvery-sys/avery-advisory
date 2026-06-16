import React from 'react';

function SectionHeader({ kicker, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {kicker ? (
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeader;
