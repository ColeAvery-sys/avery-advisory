# Avery Advisory Production Audit

Date: 2026-06-17

## Scope

Audit-only review of the Avery Advisory website and deployment surface. No code changes were made as part of this audit.

## Summary

The site is functionally deployed on Vercel, but production readiness is still blocked by custom domain health and a few configuration mismatches that can confuse deployment, SEO, and future automation.

## Findings

### 1. Custom domain is not healthy

- Severity: Critical
- Priority: P0
- Status: Confirmed

The Vercel `Domains` screen shows `avery-advisory.com` with a DNS change recommendation and `www.avery-advisory.com` still generating SSL. This means the branded domain is not yet production-stable.

Exact fix:
- Use the exact DNS records currently shown in Vercel for `avery-advisory.com`
- Remove any stale or conflicting records at the registrar
- Wait for SSL to finish issuing for `www.avery-advisory.com`
- Recheck until Vercel shows `Valid Configuration`

### 2. Runtime site URL can point at a broken domain by default

- Severity: High
- Priority: P1
- Status: Confirmed

`src/lib/site.ts` defaults `siteUrl` to `https://avery-advisory.com`. That domain is currently unhealthy, so metadata, canonicals, OG URLs, robots, and sitemap output can point at a broken production URL if `NEXT_PUBLIC_SITE_URL` is not set correctly in deployment.

Exact fix:
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the currently valid public URL until the custom domain is healthy
- After DNS is fixed, switch it back to the custom domain
- Keep the env value aligned with the live public site

### 3. Environment variable documentation does not match runtime naming

- Severity: Medium
- Priority: P2
- Status: Confirmed

The app reads `NEXT_PUBLIC_SITE_URL`, but `.env.example` still advertises `PUBLIC_SITE_BASE_URL`. That mismatch can cause misconfiguration in Vercel and local setup.

Exact fix:
- Standardize on one public site URL variable name
- Update `.env.example` and deployment docs to the same variable the app actually reads
- Remove the outdated placeholder name or map it intentionally

### 4. Sitemap uses a dynamic timestamp for every URL

- Severity: Low
- Priority: P3
- Status: Confirmed

`src/app/sitemap.ts` stamps every route with `new Date()` on each build. That works, but it makes the sitemap unnecessarily churn on every deploy and can reduce cache stability.

Exact fix:
- Use a stable last-modified date per release or a static build timestamp
- If the site changes frequently, centralize the timestamp once instead of regenerating per route

### 5. Mobile layout is probably acceptable, but needs a real device pass

- Severity: Low
- Priority: P3
- Status: Code review only

The Tailwind layout is responsive on paper, but the audit did not complete a full device-level visual pass on narrow screens. The hero, footer, and pricing grid should be checked on a small phone viewport before launch sign-off.

Exact fix:
- Test at common widths such as 390px, 414px, and 768px
- Confirm no horizontal scrolling, clipped cards, or oversized hero content
- Verify header, footer, and pricing cards stack cleanly

### 6. Lighthouse performance was not completed in this audit window

- Severity: Medium
- Priority: P2
- Status: Verification gap

I attempted a Lighthouse run against the live Vercel app, but the command exceeded the available time window and did not produce a report file. The site should still be profiled with Lighthouse before launch sign-off.

Exact fix:
- Run Lighthouse on the live Vercel URL and record Performance, SEO, Accessibility, and Best Practices scores
- Set an explicit performance budget
- Watch for font loading, large visual sections, and unused JS growth

## Verified Positives

- Vercel production deployment is present and marked current
- GitHub `main` matches the local `main` commit
- `robots.txt` exists and points to the sitemap
- `sitemap.xml` exists
- App metadata is configured in `src/app/layout.tsx`
- Core pages exist:
  - Home
  - Services
  - About
  - Contact
  - Privacy Policy
  - Terms of Service
  - Refund Policy

## Recommended Priority Order

1. Fix custom domain DNS and SSL
2. Align `NEXT_PUBLIC_SITE_URL` with the live public URL
3. Standardize the environment variable naming
4. Run Lighthouse and set a performance baseline
5. Verify mobile layouts on a real narrow viewport
6. Tighten sitemap timestamp behavior

## Launch Readiness

Current status: not fully production-ready for branded domain launch.

The site is close, but the branded domain and configuration alignment still need to be resolved before it should be treated as the final public URL.
