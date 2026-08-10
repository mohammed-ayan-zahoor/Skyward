---
name: claude-seo
description: >-
  Comprehensive B2B & Next.js SEO optimization skill for Skyward.
  Use when analyzing, implementing, or auditing search engine optimization (SEO),
  metadata, OpenGraph/Twitter social tags, JSON-LD structured data (Organization, LocalBusiness, Product, Project),
  sitemaps, robots.txt, semantic HTML hierarchy, dynamic routing SEO, and performance best practices.
---

# Claude SEO Skill for Skyward (Next.js App Router & B2B Structural Steel)

This skill provides step-by-step guidance, code patterns, and verification checklists for search engine optimization (SEO), metadata, structured JSON-LD schemas, and crawler configuration across the **Skyward** project.

---

## 1. Core Meta & Metadata API Setup (Next.js App Router)

All public pages in `frontend/src/app/(public)` MUST export a robust Next.js `metadata` object or `generateMetadata` function.

### Standard Page Metadata Template
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Structural Canopies & PEB Steel Fabricators | Skyward",
  description:
    "Premier B2B structural canopy fabricator specializing in petrol station canopies, high-capacity warehouses, and Pre-Engineered Buildings (PEB). Certified wind & seismic load designs.",
  keywords: [
    "structural canopy fabricator",
    "petrol station canopy manufacturer",
    "PEB industrial shed",
    "commercial steel warehouse",
    "cantilever canopy system",
    "India structural steel canopy",
  ],
  authors: [{ name: "Skyward Canopies" }],
  openGraph: {
    title: "Structural Canopies & PEB Steel Fabricators | Skyward",
    description:
      "Premier B2B structural canopy fabricator specializing in petrol station canopies, high-capacity warehouses, and Pre-Engineered Buildings (PEB).",
    url: "https://skywardcanopies.com",
    siteName: "Skyward Structural Canopies",
    images: [
      {
        url: "/hero-construction.jpg",
        width: 1200,
        height: 630,
        alt: "Skyward Pre-Engineered Steel Structure",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Structural Canopies & PEB Steel Fabricators | Skyward",
    description:
      "Certified B2B structural canopy fabricator for petrol stations and PEB industrial warehouses.",
    images: ["/hero-construction.jpg"],
  },
  alternates: {
    canonical: "https://skywardcanopies.com",
  },
};
```

---

## 2. Dynamic Route Metadata (`generateMetadata`)

For dynamic pages like `/work/[id]` (Installation Detail):

```typescript
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/installations/${params.id}`);
  if (!res.ok) {
    return {
      title: "Project Not Found | Skyward",
    };
  }

  const project = await res.json();
  const title = `${project.title} | Engineering Detail | Skyward`;
  const description = project.description || `Engineering specifications and structural canopy installation details for ${project.title}.`;
  const coverImage = project.photos?.[0]?.imageUrl || "/hero-construction.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: coverImage }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
  };
}
```

---

## 3. Schema.org JSON-LD Structured Data

Inject JSON-LD schemas into layout/page `<script>` tags for Rich Search Snippets:

### B2B Organization & Local Business Schema (`frontend/src/app/(public)/layout.tsx`)
```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Skyward Structural Canopies",
      "image": "https://skywardcanopies.com/logo.png",
      "description": "B2B fabricator of pre-engineered steel buildings, industrial warehouses, and petrol station canopies.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "countryName": "India"
      },
      "telephone": "+91-9000000000",
      "priceRange": "$$$",
      "url": "https://skywardcanopies.com"
    }),
  }}
/>
```

---

## 4. Robots & Sitemap Setup (`frontend/src/app/sitemap.ts` and `robots.ts`)

Next.js automatically generates dynamic `sitemap.xml` and `robots.txt` files:

### `frontend/src/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://skywardcanopies.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
```

### `frontend/src/app/robots.ts`
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://skywardcanopies.com/sitemap.xml',
  };
}
```

---

## 5. SEO Verification Rules & Auditing Checklist

Whenever adding or updating pages in Skyward:
- [ ] Exactly **one** `<h1>` tag per page.
- [ ] Logical heading hierarchy (`<h1>` -> `<h2>` -> `<h3>`).
- [ ] All `<img>` tags include descriptive `alt="..."` attributes.
- [ ] Canonical URLs specified via Next.js metadata.
- [ ] Administrative endpoints (`/admin/*`) blocked in `robots.ts`.
- [ ] Performance optimized with responsive image formats and clean semantic markup.
