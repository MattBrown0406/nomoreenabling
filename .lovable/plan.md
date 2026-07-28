
# Newsletter Growth — Build Plan (Items 1–9)

Ship nine changes aimed at converting more visitors into newsletter/course subscribers. All changes are additive; no existing content or business logic is removed.

## 1. Promote the Boundaries Email Course

- Add a dedicated **BoundariesCourseCallout** component (branded card with 4-week outline + email capture).
- Place it:
  - On the homepage below the hero (new hero-adjacent section).
  - Mid-body in article pages every ~60% scroll (in `ArticlePage.tsx` after content injection point).
  - As the final step of the Family Situation Assessment results.

## 2. Content Upgrades per Article

- Extend `blogPostMeta.ts` schema with an optional `leadMagnet` field (title, description, downloadable asset slug).
- Reuse existing `LeadMagnetCard` — render inline when `leadMagnet` is set, otherwise fall back to the Boundaries course CTA.
- Seed 3 evergreen upgrades initially:
  - "Boundary Script Templates" (attach to boundaries articles).
  - "Family Roles Self-Assessment" (attach to family-roles articles).
  - "First 7 Days Detachment Guide" (attach to detachment articles).
- Delivery: email-gated. On submit → `newsletter-signup` edge function tags subscriber with `content_upgrade:<slug>` and sends a delivery email with the PDF URL (asset placeholder path in `/public/lead-magnets/`, user drops in real PDFs later).

## 3. Email-Gate the Family Situation Assessment

- In `FamilySituationAssessment.tsx`, add an email capture step *before* the result reveal.
- Pre-check "Also send me the Boundaries email course" (opt-in).
- Persist email + result via existing `assessment_leads` flow; block result view until email submitted.
- Add a "skip for now" link that shows results but flags the lead with `no_email` in metadata.

## 4. Article-End Newsletter CTA

- Add **ArticleEndSubscribe** component: contextual headline ("Get weekly guidance for families like this — every Sunday").
- Insert into `ArticlePage.tsx` after the article body, above related-posts.
- Uses existing newsletter-signup edge function; tagged `source: article_end`.

## 5. Softer Homepage Opt-In Below Crisis Banner

- Add a slim, non-crisis opt-in strip directly below `CrisisResourcesBanner` on the homepage: "Not in crisis? Get weekly clarity for families dealing with addiction." + inline email input.

## 6. Exit-Intent Popup on Blog Pages

- New `ExitIntentModal` component.
- Trigger: `mouseleave` at top of viewport (desktop) + 30s timer fallback on mobile.
- Session-storage flag to show once per session; suppressed if user already subscribed (cookie `nme_sub=1`).
- Offer: Boundaries email course.
- Mount on `ArticlePage.tsx` and `Articles.tsx` only.

## 7. A/B Test Headline & Button Copy

- Add lightweight `useAbVariant(key, variants)` hook (localStorage sticky, 50/50).
- Apply to primary NewsletterSection headline and button:
  - A: "Subscribe to the newsletter" / "Subscribe"
  - B: "Get the free Boundaries email course" / "Send me lesson 1"
- Emit `funnel_events` with `event_name: 'newsletter_variant_view'` and `newsletter_submit` including `metadata.variant`.

## 8. Social Proof Near Signup

- Add a subscriber count + testimonial line under every newsletter form (`NewsletterSection`, `ArticleEndSubscribe`, exit intent, course callouts).
- Source of truth: `SITE_STATS` constant in `src/config/socialProof.ts` (subscriber count, one rotating testimonial). Manual number now, DB-backed later.

## 9. Contact-Form Post-Submit Newsletter Opt-In

- In `ConsultationRequestForm.tsx` (and `AdvertiserInquiryForm.tsx`), after successful submit, show a follow-up card: "Would you also like weekly family support articles?" with one-click subscribe.
- Server: extend `send-contact-form` handler is out of scope (frontend-only opt-in that calls `newsletter-signup` directly on click).

## Technical Notes

- New files:
  - `src/components/newsletter/BoundariesCourseCallout.tsx`
  - `src/components/newsletter/ArticleEndSubscribe.tsx`
  - `src/components/newsletter/ExitIntentModal.tsx`
  - `src/components/newsletter/PostSubmitSubscribe.tsx`
  - `src/components/newsletter/SocialProofLine.tsx`
  - `src/hooks/useAbVariant.ts`
  - `src/config/socialProof.ts`
- Extended: `blogPostMeta.ts` (`leadMagnet?` field, all optional/back-compat).
- Edited pages: `Index.tsx`, `ArticlePage.tsx`, `Articles.tsx`, `FamilySituationAssessment.tsx`, `ConsultationRequestForm.tsx`, `AdvertiserInquiryForm.tsx`, `NewsletterSection.tsx`.
- No backend/edge-function changes required for #1–#9 (all reuse existing `newsletter-signup`, `course-enroll`, `track-funnel-event`).
- All new components use existing design tokens (cream/red/maroon palette, no hardcoded colors).
- Analytics: every new form emits `newsletter_submit` funnel events with a `source` field so we can measure per-placement conversion.

## Out of Scope

- New PDFs for lead magnets (user supplies).
- Real subscriber count wiring (uses a manual constant for now).
- Backend changes to `send-contact-form` (frontend opt-in only).

Confirm and I'll build.
