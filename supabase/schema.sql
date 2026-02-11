-- CrewStation Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- ── Workspaces ──────────────────────────────────────────────────────
create table workspaces (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'My Workspace',
  anthropic_api_key text,
  gateway_url text,
  gateway_token text,
  plan text not null default 'free',
  max_agents int not null default 2,
  max_tasks_per_day int not null default 10,
  created_at timestamptz default now() not null
);

-- ── Agents ──────────────────────────────────────────────────────────
create table agents (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  role text not null,
  personality text not null,
  model text not null default 'claude-sonnet-4-5-20250929',
  status text not null default 'idle',
  session_key text,
  avatar text,
  tokens_used bigint not null default 0,
  cost_total numeric(10,2) not null default 0,
  tasks_completed int not null default 0,
  created_at timestamptz default now() not null
);

-- ── Tasks ────────────────────────────────────────────────────────────
create table tasks (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  description text not null,
  status text not null default 'inbox',
  priority text not null default 'medium',
  assigned_agent_id uuid references agents(id) on delete set null,
  tokens_used bigint not null default 0,
  cost numeric(10,2) not null default 0,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- ── Messages ────────────────────────────────────────────────────────
create table messages (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references tasks(id) on delete cascade not null,
  agent_id uuid references agents(id) on delete set null,
  content text not null,
  role text not null default 'agent',
  tokens_used bigint not null default 0,
  created_at timestamptz default now() not null
);

-- ── Activities ──────────────────────────────────────────────────────
create table activities (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  type text not null,
  description text not null,
  agent_id uuid references agents(id) on delete set null,
  created_at timestamptz default now() not null
);

-- ── Row Level Security ──────────────────────────────────────────────
alter table workspaces enable row level security;
alter table agents enable row level security;
alter table tasks enable row level security;
alter table messages enable row level security;
alter table activities enable row level security;

-- Workspace: only owner
create policy "Users manage own workspaces" on workspaces
  for all using (user_id = auth.uid());

-- Agents: only workspace owner
create policy "Users manage own agents" on agents
  for all using (
    workspace_id in (select id from workspaces where user_id = auth.uid())
  );

-- Tasks: only workspace owner
create policy "Users manage own tasks" on tasks
  for all using (
    workspace_id in (select id from workspaces where user_id = auth.uid())
  );

-- Messages: only via owned tasks
create policy "Users manage own messages" on messages
  for all using (
    task_id in (
      select id from tasks where workspace_id in (
        select id from workspaces where user_id = auth.uid()
      )
    )
  );

-- Activities: only workspace owner
create policy "Users manage own activities" on activities
  for all using (
    workspace_id in (select id from workspaces where user_id = auth.uid())
  );

-- ── Indexes ─────────────────────────────────────────────────────────
create index idx_agents_workspace on agents(workspace_id);
create index idx_tasks_workspace on tasks(workspace_id);
create index idx_tasks_agent on tasks(assigned_agent_id);
create index idx_messages_task on messages(task_id);
create index idx_activities_workspace on activities(workspace_id, created_at desc);

-- ── Realtime ────────────────────────────────────────────────────────
-- Enable realtime on tables that need live updates
alter publication supabase_realtime add table activities;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table agents;
