-- Projects table
create table projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  description text,
  tags        text[],
  thumbnail   text,          -- Supabase Storage URL
  video_url   text,          -- hover preview video URL
  live_url    text,
  github_url  text,
  featured    boolean default false,
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- Pricing plans table
create table pricing_plans (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric not null,
  currency    text default 'USD',
  period      text default 'month',
  features    text[],
  highlighted boolean default false,
  cta_label   text default 'Get Started',
  order_index integer default 0
);

-- Contact submissions
create table contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table projects enable row level security;
alter table pricing_plans enable row level security;
alter table contact_submissions enable row level security;

-- Policies for public reading
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read pricing plans" on pricing_plans for select using (true);

-- Policies for anon insertions
create policy "Anon can insert contact submissions" on contact_submissions for insert with check (true);

-- Admin policies (would be scoped to admin role in prod, but keeping it open for the scaffold test)
create policy "Service role manages projects" on projects using (true);
create policy "Service role manages pricing" on pricing_plans using (true);
create policy "Service role manages contacts" on contact_submissions using (true);
