# Avery Advisory Site URL Standardization Report

Date: 2026-06-17

## Objective

Establish one source of truth for the public site URL so metadata, canonicals, sitemap output, and social previews all point to the same live domain.

## Current URL Sources

### Runtime source of truth

- `src/lib/site.ts`
- Variable: `siteUrl`
- Current logic: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avery-advisory.com'`

### Metadata consumers

- `src/app/layout.tsx`
  - `metadataBase`
  - OpenGraph `url`
  - canonical URL
- `src/app/brands/[slug]/page.tsx`
  - canonical URL per brand page
  - OpenGraph `url`
- `src/app/privacy-policy/page.tsx`
  - body text references `siteUrl`
- `src/app/sitemap.ts`
  - all sitemap URLs
- `src/app/robots.ts`
  - sitemap URL

## Findings

### 1. Default site URL still points to the custom domain

- Severity: High
- Priority: P1
- Status: Confirmed

If `NEXT_PUBLIC_SITE_URL` is missing or stale in production, the app falls back to `https://avery-advisory.com`. That is risky while the custom domain is not fully healthy, because it can send canonicals, OpenGraph links, sitemap URLs, and policy copy to a broken destination.

Exact fix:
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the currently healthy public URL until the custom domain is fully green
- Once `avery-advisory.com` is healthy, switch it back to the branded domain
- Keep the value synchronized with the live public URL at all times

### 2. Environment variable naming is inconsistent

- Severity: Medium
- Priority: P2
- Status: Confirmed

The app reads `NEXT_PUBLIC_SITE_URL`, but `.env.example` still shows `PUBLIC_SITE_BASE_URL`. This creates avoidable confusion during deployment and local setup.

Exact fix:
- Standardize on `NEXT_PUBLIC_SITE_URL` in docs and examples
- Remove or explicitly map the old placeholder name
- Update deployment instructions to use the same variable name the app reads

### 3. Metadata, sitemap, and robots are structurally correct but depend on the site URL variable

- Severity: Low
- Priority: P3
- Status: Confirmed

The metadata stack is wired correctly, but its correctness depends entirely on `siteUrl` being set to the correct public domain.

Exact fix:
- No code structure change required unless you want to centralize the URL helper further
- Ensure the environment variable is correct in production and preview

## Recommended Single Source of Truth

Use one value for the public website URL:

- `NEXT_PUBLIC_SITE_URL`

Recommended behavior:

- If custom domain is healthy: `https://avery-advisory.com`
- If custom domain is not healthy: `https://avery-advisory.vercel.app`

## Exact Fix Plan

1. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the current healthy public URL
2. Update `.env.example` to use `NEXT_PUBLIC_SITE_URL` instead of `PUBLIC_SITE_BASE_URL`
3. Confirm metadata, sitemap, and robots all resolve to the same URL
4. Recheck the live site and generated metadata
5. When the custom domain is fixed, switch the value back to `https://avery-advisory.com`

## Verification Checklist

- `metadataBase` resolves to the intended public URL
- OpenGraph URLs use the intended public URL
- Canonical URLs use the intended public URL
- `sitemap.xml` uses the intended public URL
- `robots.txt` points at the sitemap on the intended public URL
- Privacy policy copy references the intended public URL

## Status

The app is structurally ready, but the production URL source of truth still needs to be standardized across deployment and documentation.
