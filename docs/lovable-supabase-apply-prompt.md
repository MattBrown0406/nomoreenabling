Use this prompt in Lovable after the latest GitHub commit is visible:

```text
Please apply and verify the latest No More Enabling backend changes from the repository.

Context:
- Supabase is managed inside Lovable for this project.
- The frontend now includes high-intent consultation pages, lead scoring, advertiser inquiry capture, admin dashboard reporting, and consultation follow-up automation.

Please do the following:
1. Apply the migrations:
   - supabase/migrations/20260502160000_add_consultation_and_advertiser_leads.sql
   - supabase/migrations/20260502173000_add_consultation_followup_automation.sql

2. Confirm these tables exist with RLS enabled and admin read policies:
   - public.consultation_leads
   - public.advertiser_inquiries
   - public.consultation_followup_queue

3. Redeploy these Supabase Edge Functions:
   - send-contact-form
   - track-funnel-event
   - process-consultation-followups

4. Confirm send-contact-form can:
   - store consultation requests in public.consultation_leads
   - create two queued rows in public.consultation_followup_queue for consultation requests
   - store advertiser inquiries in public.advertiser_inquiries
   - still send the email notification to matt@nomoreenabling.com
   - send the requester a confirmation email

5. Confirm track-funnel-event accepts these event names:
   - consultation_request
   - advertiser_inquiry

6. Confirm process-consultation-followups:
   - is deployed with verify_jwt = false
   - rejects unauthenticated calls unless called by an admin session or with x-automation-secret matching FOLLOWUP_AUTOMATION_SECRET
   - sends due consultation follow-up emails through Resend
   - marks sent rows with sent_at
   - updates consultation_leads.last_followup_at, next_followup_at, and followup_status

7. Optional but recommended: add a Lovable/Supabase scheduled job to call process-consultation-followups every hour.
   - If using a scheduler without an admin user JWT, set FOLLOWUP_AUTOMATION_SECRET and send it as x-automation-secret.

8. Test from the deployed site:
   - Submit one test consultation request from /family-addiction-consultation
   - Submit one test advertiser inquiry from /advertise
   - Confirm the consultation lead appears in the admin dashboard
   - Confirm two follow-up queue rows were created
   - Temporarily set one follow-up scheduled_for to now and run process-consultation-followups
   - Confirm the follow-up email sends and sent_at is filled
   - Confirm advertiser inquiry appears in the admin dashboard
   - Delete the test rows after verification

9. Confirm these pages load and are included in the deployed sitemap:
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
