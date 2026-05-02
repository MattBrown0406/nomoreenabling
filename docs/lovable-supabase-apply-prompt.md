Use this prompt in Lovable after the latest GitHub commit is visible:

```text
Please apply and verify the latest No More Enabling backend changes from the repository.

Context:
- Supabase is managed inside Lovable for this project.
- The frontend now includes high-intent consultation pages, lead scoring, advertiser inquiry capture, and admin dashboard reporting.

Please do the following:
1. Apply the new migration:
   - supabase/migrations/20260502160000_add_consultation_and_advertiser_leads.sql

2. Confirm these tables exist with RLS enabled and admin read policies:
   - public.consultation_leads
   - public.advertiser_inquiries

3. Redeploy these Supabase Edge Functions:
   - send-contact-form
   - track-funnel-event

4. Confirm send-contact-form can:
   - store consultation requests in public.consultation_leads
   - store advertiser inquiries in public.advertiser_inquiries
   - still send the email notification to matt@nomoreenabling.com

5. Confirm track-funnel-event accepts these event names:
   - consultation_request
   - advertiser_inquiry

6. Test from the deployed site:
   - Submit one test consultation request from /family-addiction-consultation
   - Submit one test advertiser inquiry from /advertise
   - Confirm both appear in the admin dashboard
   - Delete the test rows after verification

7. Confirm these pages load and are included in the deployed sitemap:
   - /intervention-help
   - /family-addiction-coaching
   - /addiction-intervention-for-adult-child
   - /alcohol-intervention-help
   - /what-to-do-when-they-refuse-treatment
   - /family-addiction-consultation
```

Search Console URLs to request indexing after Lovable deploys:

```text
https://nomoreenabling.com/intervention-help
https://nomoreenabling.com/family-addiction-coaching
https://nomoreenabling.com/addiction-intervention-for-adult-child
https://nomoreenabling.com/alcohol-intervention-help
https://nomoreenabling.com/what-to-do-when-they-refuse-treatment
https://nomoreenabling.com/family-addiction-consultation
```
