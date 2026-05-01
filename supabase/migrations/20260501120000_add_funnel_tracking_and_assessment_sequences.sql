create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  page_title text,
  referrer text,
  source text,
  article_slug text,
  assessment_result text,
  offer_slug text,
  target_href text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_funnel_events_event_name on public.funnel_events(event_name);
create index if not exists idx_funnel_events_created_at on public.funnel_events(created_at);
create index if not exists idx_funnel_events_assessment_result on public.funnel_events(assessment_result);
create index if not exists idx_funnel_events_offer_slug on public.funnel_events(offer_slug);

alter table public.funnel_events enable row level security;

drop policy if exists "Admins can view funnel events" on public.funnel_events;
create policy "Admins can view funnel events"
on public.funnel_events
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create table if not exists public.assessment_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text not null default 'family_situation_assessment',
  assessment_result text not null,
  recommended_offer text,
  answers jsonb not null default '{}'::jsonb,
  subscribed_at timestamptz not null default now(),
  last_result_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_assessment_leads_result on public.assessment_leads(assessment_result);
create index if not exists idx_assessment_leads_recommended_offer on public.assessment_leads(recommended_offer);
create index if not exists idx_assessment_leads_last_result_at on public.assessment_leads(last_result_at);

alter table public.assessment_leads enable row level security;

drop policy if exists "Admins can view assessment leads" on public.assessment_leads;
create policy "Admins can view assessment leads"
on public.assessment_leads
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create table if not exists public.assessment_followup_templates (
  id uuid primary key default gen_random_uuid(),
  assessment_result text not null,
  day_offset integer not null,
  subject text not null,
  preview_text text not null,
  body_markdown text not null,
  primary_cta_label text not null,
  primary_cta_href text not null,
  created_at timestamptz not null default now(),
  unique (assessment_result, day_offset)
);

create index if not exists idx_assessment_followup_templates_result on public.assessment_followup_templates(assessment_result);

alter table public.assessment_followup_templates enable row level security;

drop policy if exists "Admins can view assessment followup templates" on public.assessment_followup_templates;
create policy "Admins can view assessment followup templates"
on public.assessment_followup_templates
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

insert into public.assessment_followup_templates
  (assessment_result, day_offset, subject, preview_text, body_markdown, primary_cta_label, primary_cta_href)
values
  (
    'safety',
    0,
    'Your safety-first route',
    'When risk is active, the next step is not another normal family conversation.',
    'Your assessment pointed to a safety-first situation. For the next 24 hours, focus on reducing immediate risk before trying to persuade, explain, or negotiate. Write down the specific safety concern, decide who is safest to contact, and avoid confronting someone while they are intoxicated, threatening, or unstable. If danger is immediate, use emergency support first.',
    'Open the safety path',
    'https://nomoreenabling.com/topic-hubs/crisis-and-safety'
  ),
  (
    'safety',
    2,
    'What not to do when safety is involved',
    'Do not turn active risk into another debate about intentions.',
    'The common mistake in a safety-first situation is treating danger like a communication problem. Do not argue about whether the risk is real while the situation is unstable. Do not keep children, money, keys, or housing decisions on autopilot. Separate safety decisions from emotional persuasion.',
    'Request private guidance',
    'https://nomoreenabling.com/work-with-matt'
  ),
  (
    'safety',
    5,
    'When to escalate beyond self-help',
    'If the risk keeps returning, the family needs a higher level of structure.',
    'If threats, impaired driving, using in the home, stealing, overdose risk, or unsafe conflict keep returning, self-help reading is not enough. The family needs a clearer plan, professional support, or emergency services when risk is active. Your job is not to manage danger alone.',
    'See intervention support',
    'https://nomoreenabling.com/support/freedom-interventions'
  ),
  (
    'intervention',
    0,
    'Your intervention-readiness route',
    'When talks keep failing, stop improvising the next conversation.',
    'Your assessment pointed to intervention readiness. The next step is not a bigger speech. It is alignment, preparation, treatment options, and clear consequences before the next conversation happens. Start by writing down what the family has already tried and where each attempt broke down.',
    'Read the intervention hub',
    'https://nomoreenabling.com/topic-hubs/intervention'
  ),
  (
    'intervention',
    2,
    'What not to do with treatment refusal',
    'Another unplanned confrontation usually strengthens the pattern.',
    'Do not let the most frightened family member run the next conversation alone. Do not debate while everyone is activated. Do not offer consequences the family will not hold. Treatment refusal needs structure before emotion, or the family ends up repeating the same failed talk.',
    'Request guidance from Matt',
    'https://nomoreenabling.com/work-with-matt'
  ),
  (
    'intervention',
    5,
    'When to bring in intervention support',
    'If refusal and consequences keep escalating, the family needs help planning.',
    'Consider professional intervention support when treatment is repeatedly refused, consequences are escalating, the family is divided, or safety concerns are getting minimized. The goal is not pressure for pressure’s sake. The goal is a coordinated plan that gives recovery a real opening.',
    'See Freedom Interventions',
    'https://nomoreenabling.com/support/freedom-interventions'
  ),
  (
    'boundaries',
    0,
    'Your boundaries route',
    'The issue is not lack of love. It is the limit collapsing under pressure.',
    'Your assessment pointed to a boundaries problem. Start with one boundary, not the whole family system. Write it as something you will do, not something you will force your loved one to do. The simpler the boundary, the more likely you can hold it under pressure.',
    'Start the boundaries course',
    'https://nomoreenabling.com/support/boundaries-course'
  ),
  (
    'boundaries',
    2,
    'What not to do with a boundary',
    'Do not announce a boundary you are not ready to hold.',
    'The common mistake is using a boundary as a warning, lecture, or emotional last stand. A boundary is a plan for your behavior. Do not make the line bigger than your follow-through. Do not explain it ten different ways. Say it calmly, then let your action carry the meaning.',
    'Take the helping vs enabling tool',
    'https://nomoreenabling.com/helping-or-enabling'
  ),
  (
    'boundaries',
    5,
    'When boundaries need outside support',
    'If guilt keeps undoing the limit, get more structure around the family.',
    'If every limit turns into guilt, panic, threats, or family division, do not keep trying to hold it alone. The family may need coaching, a course structure, or professional planning so the boundary does not depend on willpower in the hardest moment.',
    'Request family guidance',
    'https://nomoreenabling.com/work-with-matt'
  ),
  (
    'after-treatment',
    0,
    'Your after-treatment route',
    'Recovery support needs structure before old roles quietly return.',
    'Your assessment pointed to after-treatment support. The family needs clear house rules, aftercare expectations, communication boundaries, and a plan for relapse concerns. Try to make the structure visible before fear and hope start making decisions for everyone.',
    'Read the after-treatment path',
    'https://nomoreenabling.com/topic-hubs/after-treatment'
  ),
  (
    'after-treatment',
    2,
    'What not to do after rehab',
    'Do not make one family member the recovery manager.',
    'After treatment, families often slide into monitoring, rescuing, testing, or pretending everything is fine. None of those are stable. Support recovery without becoming the person who manages every appointment, mood, rule, or consequence.',
    'See Family Bridge',
    'https://nomoreenabling.com/support/family-bridge'
  ),
  (
    'after-treatment',
    5,
    'When after-treatment support should escalate',
    'If old patterns return quickly, the family needs a stronger support plan.',
    'If aftercare is being skipped, relapse warning signs are building, trust is being used as leverage, or the family is slipping into the old rescue pattern, escalate the structure. This may mean a shared family plan, coaching, treatment-team communication, or a clearer recovery support tool.',
    'Open Family Bridge',
    'https://nomoreenabling.com/support/family-bridge'
  ),
  (
    'support',
    0,
    'Your support and orientation route',
    'You do not have to solve the whole situation before asking a better question.',
    'Your assessment pointed to support and orientation. The next step is to describe what is happening clearly enough to choose a path. Separate immediate danger, treatment refusal, boundaries, after-treatment needs, and general family burnout. One clear category is better than another night of panic searching.',
    'Visit Sober Helpline',
    'https://nomoreenabling.com/support/sober-helpline'
  ),
  (
    'support',
    2,
    'What not to do when you are overwhelmed',
    'Do not turn confusion into five urgent actions at once.',
    'When the family is overwhelmed, the common mistake is trying to read everything, call everyone, and fix every relationship at once. Pick one next question. Is this safety, treatment refusal, boundaries, after-treatment, or support? Let the answer choose the next move.',
    'Start with guided paths',
    'https://nomoreenabling.com/start-here'
  ),
  (
    'support',
    5,
    'When support should become a bigger step',
    'If the same pattern keeps repeating, move from orientation to action.',
    'Support is a starting point, not a place to stay stuck. If the family keeps circling the same money, housing, relapse, refusal, or safety problem, choose the next level of help. The best time to build structure is before everyone is completely exhausted.',
    'Take the assessment again',
    'https://nomoreenabling.com/family-situation-assessment'
  )
on conflict (assessment_result, day_offset) do update
set
  subject = excluded.subject,
  preview_text = excluded.preview_text,
  body_markdown = excluded.body_markdown,
  primary_cta_label = excluded.primary_cta_label,
  primary_cta_href = excluded.primary_cta_href;
