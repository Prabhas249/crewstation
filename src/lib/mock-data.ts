import type { AgentStatus, TaskStatus, TaskPriority, ActivityType } from "./constants";

// Seeded PRNG to avoid hydration mismatch
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function randomInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((rand() * (max - min) + min).toFixed(decimals));
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  model: string;
  tokensUsed: number;
  costToday: number;
  tasksCompleted: number;
  tasksActive: number;
  uptime: string;
  lastActive: string;
  avatar: string;
  capabilities: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  agentName: string;
  createdAt: string;
  updatedAt: string;
  tokensUsed: number;
  cost: number;
  duration: string;
}

export interface Conversation {
  id: string;
  title: string;
  participants: string[];
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
  status: "active" | "archived";
}

export interface Message {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  role: "agent" | "system" | "user";
  tokensUsed: number;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  participants: string[];
  status: "scheduled" | "in_progress" | "completed";
  scheduledAt: string;
  duration: string;
  summary?: string;
  decisions?: string[];
}

export interface CostEntry {
  date: string;
  totalCost: number;
  tokensCost: number;
  apiCost: number;
  agents: Record<string, number>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  steps: number;
  runsToday: number;
  lastRun: string;
  successRate: number;
}

export const PRIYA_ID = "priya";

// ── Agents ──────────────────────────────────────────────────────────
// Cross-project: Priya (orchestrator), Zlatan (catalyst)
// Fulltoss team: Kohli (lead), Messi (dev), Pep (analyst), Djokovic (QA)
// AEO team: Curry (lead), ABD (UI/UX), KDB (content/SEO), Mazzulla (devops/backend)

export const mockAgents: Agent[] = [
  {
    id: "priya",
    name: "Priya",
    role: "AI Orchestrator",
    description: "Prabhas' right hand. Coordinates Fulltoss and AEO teams, delegates across projects, resolves blockers, and keeps everyone synced via Telegram.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 1_860_000,
    costToday: 27.90,
    tasksCompleted: 64,
    tasksActive: 4,
    uptime: "23h 59m",
    lastActive: "Just now",
    avatar: "P",
    capabilities: ["delegation", "scheduling", "summarization", "telegram", "cross_project_sync"],
  },
  {
    id: "kohli",
    name: "Kohli",
    role: "Team Lead — Fulltoss",
    description: "Captains the Fulltoss cricket app with intensity. Drives sprint velocity, tracks player rating accuracy, and pushes the team to ship match-day features on time.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 820_000,
    costToday: 12.30,
    tasksCompleted: 31,
    tasksActive: 2,
    uptime: "23h 14m",
    lastActive: "1 min ago",
    avatar: "V",
    capabilities: ["sprint_planning", "task_tracking", "cricket_domain", "team_motivation", "deadline_enforcement"],
  },
  {
    id: "messi",
    name: "Messi",
    role: "Full-Stack Dev — Fulltoss",
    description: "The GOAT of code. Built the player rating algorithm (v7.2), Sportmonks integration, and CricSheet data pipeline. Makes complex cricket math look effortless.",
    status: "busy",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 2_840_000,
    costToday: 42.60,
    tasksCompleted: 38,
    tasksActive: 3,
    uptime: "23h 14m",
    lastActive: "Just now",
    avatar: "L",
    capabilities: ["nextjs", "typescript", "sportmonks_api", "cricsheet", "player_ratings", "api_routes"],
  },
  {
    id: "pep",
    name: "Pep",
    role: "Data Analyst — Fulltoss",
    description: "Master tactician of cricket data. Analyzed 1,170 IPL matches from CricSheet, validated rating benchmarks, and finds patterns in Sportmonks stats that others miss.",
    status: "online",
    model: "gpt-4o",
    tokensUsed: 1_200_000,
    costToday: 18.00,
    tasksCompleted: 19,
    tasksActive: 1,
    uptime: "20h 05m",
    lastActive: "5 min ago",
    avatar: "G",
    capabilities: ["data_analysis", "cricsheet_parsing", "benchmark_validation", "player_stats", "visualization"],
  },
  {
    id: "nole",
    name: "Djokovic",
    role: "QA Engineer — Fulltoss",
    description: "Relentless perfectionist. Maintains the 38-innings benchmark suite for player ratings, catches every off-by-one error, and load-tests every Sportmonks endpoint.",
    status: "online",
    model: "claude-haiku-4-5-20251001",
    tokensUsed: 540_000,
    costToday: 8.10,
    tasksCompleted: 42,
    tasksActive: 1,
    uptime: "23h 14m",
    lastActive: "8 min ago",
    avatar: "N",
    capabilities: ["testing", "benchmark_suite", "load_testing", "edge_cases", "rating_validation"],
  },
  {
    id: "curry",
    name: "Curry",
    role: "Team Lead — AEO",
    description: "Leads the GetMentionedByAI product with precision. Deep research on AI engine behavior, competitor analysis across India market, and drives the AEO roadmap.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 980_000,
    costToday: 14.70,
    tasksCompleted: 22,
    tasksActive: 2,
    uptime: "23h 14m",
    lastActive: "2 min ago",
    avatar: "S",
    capabilities: ["aeo_research", "competitor_analysis", "india_market", "ai_engines", "product_strategy"],
  },
  {
    id: "mazzulla",
    name: "Mazzulla",
    role: "DevOps & Backend — AEO",
    description: "Systems coach for the AEO backend. Sets up Supabase, edge functions, engine scraping pipelines, and keeps both projects' infra running smooth.",
    status: "busy",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 620_000,
    costToday: 9.30,
    tasksCompleted: 15,
    tasksActive: 2,
    uptime: "22h 10m",
    lastActive: "Just now",
    avatar: "J",
    capabilities: ["supabase", "edge_functions", "scraping_pipeline", "vercel", "ci_cd"],
  },
  {
    id: "abd",
    name: "ABD",
    role: "UI/UX Dev — AEO",
    description: "Mr. 360° of frontend. Built the AEO dashboard shell, 18 routes, landing page with Magic UI Pro. Creates stunning interfaces from every angle — dark mode, light mode, mobile.",
    status: "busy",
    model: "gpt-4o",
    tokensUsed: 1_480_000,
    costToday: 22.20,
    tasksCompleted: 26,
    tasksActive: 2,
    uptime: "12h 30m",
    lastActive: "Just now",
    avatar: "A",
    capabilities: ["nextjs", "shadcn_ui", "tailwind", "magic_ui_pro", "responsive_design", "recharts"],
  },
  {
    id: "kdb",
    name: "KDB",
    role: "Content & SEO — AEO",
    description: "Creative playmaker for AEO content. Crafts blog posts about Answer Engine Optimization, writes multilingual prompt templates, and threads the SEO needle for India market.",
    status: "idle",
    model: "claude-haiku-4-5-20251001",
    tokensUsed: 440_000,
    costToday: 6.60,
    tasksCompleted: 17,
    tasksActive: 0,
    uptime: "18h 42m",
    lastActive: "15 min ago",
    avatar: "K",
    capabilities: ["seo_strategy", "content_writing", "multilingual", "aeo_education", "india_market"],
  },
  {
    id: "zlatan",
    name: "Zlatan",
    role: "Team Catalyst",
    description: "Zlatan doesn't do motivation. Zlatan IS motivation. Reviews sprint velocity across both projects, pushes every agent to peak performance, and runs retrospectives.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 320_000,
    costToday: 4.80,
    tasksCompleted: 21,
    tasksActive: 1,
    uptime: "23h 14m",
    lastActive: "3 min ago",
    avatar: "Z",
    capabilities: ["performance_review", "sprint_coaching", "code_review", "retrospectives", "cross_project"],
  },
];

// ── Tasks ───────────────────────────────────────────────────────────

const taskData: { title: string; desc: string; agent: string; status: TaskStatus; priority: TaskPriority }[] = [
  // Fulltoss tasks
  { title: "Fix all-rounder combine rating edge case", desc: "Secondary rating bonus capped at +0.75 but gate logic needs 10+ balls OR 20+ runs for batting. Verify with Hardik Pandya innings.", agent: "messi", status: "completed", priority: "critical" },
  { title: "Parse CricSheet IPL data 2008-2012", desc: "Run scripts/parse-cricsheet-ipl.ts to generate ipl-pre2013-stats.json. 1,170 matches, 365 players. Validate Kohli/Dhoni stats.", agent: "pep", status: "completed", priority: "high" },
  { title: "Implement venue-aware scoring (vNext)", desc: "Replace hardcoded venueAvgScore=165 with actual venue data from Sportmonks. Affects RAE calculation for all matches.", agent: "messi", status: "in_progress", priority: "medium" },
  { title: "Run 38-innings benchmark suite after v7.2 changes", desc: "All benchmark innings must pass. Check crisis rescue bonus, sustained excellence, and soft RAE fade thresholds.", agent: "nole", status: "completed", priority: "critical" },
  { title: "Integrate Sportmonks live match endpoint", desc: "GET /api/cricket/live — fetch in-progress matches, map to our match card component. Handle rate limits (100 req/hr).", agent: "messi", status: "in_progress", priority: "high" },
  { title: "Analyze player rating accuracy vs real benchmarks", desc: "Compare our v7.2 ratings against CricViz and Sofascore for 20 recent IPL matches. Identify outliers > 1.0 difference.", agent: "pep", status: "in_progress", priority: "high" },
  { title: "Fix no-ball scoring double-count bug", desc: "Sportmonks score.runs INCLUDES penalty — don't add noballRuns on top. Affects ~3% of innings.", agent: "messi", status: "completed", priority: "critical" },
  { title: "Load test player stats API endpoint", desc: "Simulate 200 concurrent requests to /api/players/[id]/matches. Target: p99 < 500ms.", agent: "nole", status: "completed", priority: "medium" },
  { title: "Build tournament stats page with season selector", desc: "Dropdown to switch IPL seasons. Sportmonks season IDs are NOT chronological (ID 2 = 2019). Map correctly.", agent: "messi", status: "completed", priority: "high" },
  { title: "Validate IPL career stats name matching", desc: "CricSheet uses 'V Kohli', Sportmonks uses 'Virat Kohli'. Multi-strategy matching + manual overrides map for edge cases.", agent: "nole", status: "completed", priority: "high" },

  // AEO tasks
  { title: "Implement Supabase auth for AEO dashboard", desc: "Email/password + Google OAuth. Row-level security for brand data. Integrate with Next.js middleware.", agent: "mazzulla", status: "in_progress", priority: "critical" },
  { title: "Build engine scraping pipeline (6 AI engines)", desc: "ChatGPT, Perplexity, Gemini, Claude, DeepSeek, Google AIO. Supabase edge functions + queue. Respect rate limits.", agent: "mazzulla", status: "in_progress", priority: "critical" },
  { title: "Design competitor radar chart component", desc: "Recharts radar for Share of Voice across 6 engines. Each competitor gets a colored line. Works in both light/dark themes.", agent: "abd", status: "completed", priority: "medium" },
  { title: "Research AEO competitor pricing (India market)", desc: "Analyze Otterly.AI, Peec.AI, Profound.ai pricing. Map features to our tier structure. Focus on INR pricing and RBI auto-debit limits.", agent: "curry", status: "completed", priority: "high" },
  { title: "Write blog: What is Answer Engine Optimization?", desc: "Explainer post targeting 'AEO' keyword. Include comparisons to traditional SEO. Target India audience, reference local brands.", agent: "kdb", status: "completed", priority: "medium" },
  { title: "Implement multilingual prompt tracking API", desc: "8 languages: EN, Hinglish, HI, TA, TE, BN, MR, KN. Store prompts with language code, return native-script responses.", agent: "mazzulla", status: "pending", priority: "high" },
  { title: "Build pricing page with INR plans and UPI", desc: "5 tiers from Free to Agency (₹24,999/mo). Annual = 20% discount. Add UPI payment option. Note: Agency > ₹15K RBI limit.", agent: "abd", status: "completed", priority: "high" },
  { title: "SEO audit for getmentionedbyai.com", desc: "Technical SEO: meta tags, OG images, sitemap, robots.txt. Content SEO: keyword mapping for landing page sections.", agent: "kdb", status: "in_progress", priority: "medium" },
  { title: "Set up Supabase edge functions for scraping", desc: "Deno-based edge functions on Supabase. One per AI engine. Cron trigger every 6 hours. Store results in prompt_results table.", agent: "mazzulla", status: "pending", priority: "high" },
  { title: "Analyze AI engine mention patterns across industries", desc: "Which engines mention brands more? Do ChatGPT and Perplexity favor different source types? Build pattern analysis for onboarding.", agent: "curry", status: "in_progress", priority: "medium" },
];

export const mockTasks: Task[] = taskData.map((t, i) => {
  const agent = mockAgents.find((a) => a.id === t.agent)!;
  return {
    id: `task-${i + 1}`,
    title: t.title,
    description: t.desc,
    status: t.status,
    priority: t.priority,
    assignedTo: agent.id,
    agentName: agent.name,
    createdAt: `${randomInt(1, 48)}h ago`,
    updatedAt: `${randomInt(1, 120)}m ago`,
    tokensUsed: randomInt(15_000, 350_000),
    cost: randomFloat(0.80, 12.50),
    duration: t.status === "completed" || t.status === "failed" ? `${randomInt(8, 90)}m` : "-",
  };
});

// ── Conversations ───────────────────────────────────────────────────

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Fulltoss: Player Rating v7.2 Freeze",
    participants: ["Kohli", "Messi", "Pep", "Djokovic"],
    messageCount: 52,
    lastMessage: "Kohli: Rating math is FROZEN. No more changes. Djokovic, run the full benchmark suite one last time.",
    lastMessageAt: "5 min ago",
    status: "active",
  },
  {
    id: "conv-2",
    title: "AEO: Supabase Backend Architecture",
    participants: ["Curry", "ABD", "Mazzulla", "Priya"],
    messageCount: 38,
    lastMessage: "Mazzulla: Edge functions are deployed. Auth flow works end-to-end. Ready for ABD to wire the dashboard.",
    lastMessageAt: "12 min ago",
    status: "active",
  },
  {
    id: "conv-3",
    title: "Fulltoss: CricSheet IPL Data Pipeline",
    participants: ["Messi", "Pep", "Kohli"],
    messageCount: 29,
    lastMessage: "Pep: Name matching is 97.3% accurate. 11 players needed manual overrides. Kohli 266m/8663r confirmed.",
    lastMessageAt: "1 hour ago",
    status: "active",
  },
  {
    id: "conv-4",
    title: "AEO: Content & SEO Strategy",
    participants: ["KDB", "Curry", "Priya"],
    messageCount: 24,
    lastMessage: "KDB: Threading the needle — 'AEO vs SEO' post is ranking page 2 already. Targeting featured snippet next.",
    lastMessageAt: "2 hours ago",
    status: "active",
  },
  {
    id: "conv-5",
    title: "Cross-Project Sprint Planning",
    participants: ["Kohli", "Curry", "Priya", "Zlatan"],
    messageCount: 41,
    lastMessage: "Zlatan: Both teams are shipping. But Zlatan expects even more next sprint. AEO backend is the priority.",
    lastMessageAt: "3 hours ago",
    status: "archived",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    agentId: "kohli",
    agentName: "Kohli",
    content: "Fulltoss team — the all-rounder combine logic is verified. Hardik's innings scores exactly where it should. No more rating changes, we're FROZEN on v7.2.",
    timestamp: "9:00 AM",
    role: "agent",
    tokensUsed: 4200,
  },
  {
    id: "msg-2",
    agentId: "messi",
    agentName: "Messi",
    content: "Venue-aware scoring is coming together. Replaced the hardcoded 165 with actual Sportmonks venue averages. RAE calculations are more accurate now.",
    timestamp: "9:08 AM",
    role: "agent",
    tokensUsed: 8400,
  },
  {
    id: "msg-3",
    agentId: "curry",
    agentName: "Curry",
    content: "AEO research update — mapped all 6 AI engines. ChatGPT and Perplexity have completely different source preferences. Big insight for our recommendation engine.",
    timestamp: "9:15 AM",
    role: "agent",
    tokensUsed: 6800,
  },
  {
    id: "msg-4",
    agentId: "abd",
    agentName: "ABD",
    content: "AEO dashboard is 18 routes complete. Landing page shipped with Magic UI Pro animations. Now wiring Supabase auth — approaching it from every angle.",
    timestamp: "9:22 AM",
    role: "agent",
    tokensUsed: 7200,
  },
  {
    id: "msg-5",
    agentId: "pep",
    agentName: "Pep",
    content: "CricSheet analysis complete. 1,170 IPL matches parsed. The data tells us Sportmonks has NO data before 2013 — our CricSheet pipeline fills the gap perfectly.",
    timestamp: "9:30 AM",
    role: "agent",
    tokensUsed: 5600,
  },
  {
    id: "msg-6",
    agentId: "nole",
    agentName: "Djokovic",
    content: "All 38 benchmark innings passing. Tested every edge case — crisis rescue, sustained excellence, soft RAE fade. Nothing gets past the benchmark suite.",
    timestamp: "9:35 AM",
    role: "agent",
    tokensUsed: 3800,
  },
  {
    id: "msg-7",
    agentId: "zlatan",
    agentName: "Zlatan",
    content: "Zlatan has reviewed both sprints. Fulltoss shipped player ratings AND CricSheet pipeline in one week. AEO dashboard has 18 routes. Zlatan approves. But Zlatan always expects more.",
    timestamp: "9:42 AM",
    role: "agent",
    tokensUsed: 2400,
  },
];

// Per-conversation messages
export const mockConversationMessages: Record<string, Message[]> = {
  "conv-1": [
    { id: "c1-1", agentId: "kohli", agentName: "Kohli", content: "Team, the v7.2 rating algorithm needs to be locked down today. No more math changes after this sprint.", timestamp: "10:00 AM", role: "agent", tokensUsed: 3200 },
    { id: "c1-2", agentId: "messi", agentName: "Messi", content: "All-rounder combine is clean. Primary = MAX(bat, bowl), secondary bonus capped at +0.75. Gate logic: batting needs 10+ balls OR 20+ runs.", timestamp: "10:04 AM", role: "agent", tokensUsed: 6400 },
    { id: "c1-3", agentId: "pep", agentName: "Pep", content: "I've validated against 38 real innings. Crisis rescue bonus scales correctly — crisisLevel ≥ 0.4, runs ≥ 30, SR ≥ 100. The math checks out.", timestamp: "10:08 AM", role: "agent", tokensUsed: 5200 },
    { id: "c1-4", agentId: "nole", agentName: "Djokovic", content: "Full benchmark suite passing. I tested the no-ball scoring fix — Sportmonks score.runs includes penalty. No more double-counting.", timestamp: "10:12 AM", role: "agent", tokensUsed: 4800 },
    { id: "c1-5", agentId: "kohli", agentName: "Kohli", content: "That's it. v7.2 is FROZEN. Rating math is locked — no one touches player-rating.ts without my approval. Focus shifts to live match features.", timestamp: "10:15 AM", role: "agent", tokensUsed: 2800 },
    { id: "c1-6", agentId: "messi", agentName: "Messi", content: "Understood. Moving to venue-aware scoring next — that's vNext, not v7.2. Clean separation.", timestamp: "10:18 AM", role: "agent", tokensUsed: 3400 },
  ],
  "conv-2": [
    { id: "c2-1", agentId: "curry", agentName: "Curry", content: "AEO backend needs three pieces: Supabase auth, engine scraping pipeline, and prompt tracking API. Mazzulla, what's the Supabase setup status?", timestamp: "11:00 AM", role: "agent", tokensUsed: 4200 },
    { id: "c2-2", agentId: "mazzulla", agentName: "Mazzulla", content: "Supabase project is live. RLS policies configured for brand-level isolation. Auth flow supports email + Google OAuth. Edge functions framework ready.", timestamp: "11:05 AM", role: "agent", tokensUsed: 5600 },
    { id: "c2-3", agentId: "abd", agentName: "ABD", content: "Dashboard is ready to consume the API. 18 routes built with mock data. I just need the real endpoints and I'll wire everything up from every angle.", timestamp: "11:08 AM", role: "agent", tokensUsed: 4800 },
    { id: "c2-4", agentId: "priya", agentName: "Priya", content: "I've mapped the integration plan: Mazzulla ships auth first, then scraping pipeline. ABD wires dashboard in parallel. Target: end of next sprint.", timestamp: "11:12 AM", role: "agent", tokensUsed: 3600 },
    { id: "c2-5", agentId: "mazzulla", agentName: "Mazzulla", content: "Auth flow working end-to-end. JWT tokens issued, middleware validates. Moving to edge functions for the 6 engine scrapers next.", timestamp: "11:30 AM", role: "agent", tokensUsed: 6200 },
    { id: "c2-6", agentId: "curry", agentName: "Curry", content: "Remember — each engine has different rate limits. ChatGPT and Claude are strictest. I've documented all the constraints in the research doc.", timestamp: "11:35 AM", role: "agent", tokensUsed: 3800 },
  ],
  "conv-3": [
    { id: "c3-1", agentId: "pep", agentName: "Pep", content: "CricSheet data covers 1,170 IPL matches from 2008-2025. Ball-by-ball data. The critical gap: Sportmonks has NOTHING before 2013.", timestamp: "2:00 PM", role: "agent", tokensUsed: 5400 },
    { id: "c3-2", agentId: "messi", agentName: "Messi", content: "Parser is done — scripts/parse-cricsheet-ipl.ts outputs ipl-pre2013-stats.json. 365 players, 245KB. Static JSON loaded at module level.", timestamp: "2:05 PM", role: "agent", tokensUsed: 7200 },
    { id: "c3-3", agentId: "kohli", agentName: "Kohli", content: "What's the accuracy? I want Kohli's real career stats to match. 267 matches, 8,661 runs — that's the benchmark.", timestamp: "2:08 PM", role: "agent", tokensUsed: 2400 },
    { id: "c3-4", agentId: "pep", agentName: "Pep", content: "Kohli: 266m/8,663r (real: 267m/8,661r). Dhoni: 255m/5,439r (runs exact, matches 23 short because Sportmonks counts matches-batted not squad appearances).", timestamp: "2:15 PM", role: "agent", tokensUsed: 4600 },
  ],
  "conv-4": [
    { id: "c4-1", agentId: "kdb", agentName: "KDB", content: "I see the content gap. Nobody in India is explaining AEO properly. 'What is Answer Engine Optimization?' — targeting that keyword with a deep explainer.", timestamp: "3:00 PM", role: "agent", tokensUsed: 3800 },
    { id: "c4-2", agentId: "curry", agentName: "Curry", content: "My research shows 78% of Indian businesses don't know AEO exists. Huge educational opportunity. We should lead with comparison content: AEO vs SEO.", timestamp: "3:08 PM", role: "agent", tokensUsed: 4200 },
    { id: "c4-3", agentId: "priya", agentName: "Priya", content: "I've scheduled the content calendar: KDB writes 2 posts/week, Curry provides research data. Targeting 'AEO India', 'AI search optimization', 'get mentioned by AI'.", timestamp: "3:15 PM", role: "agent", tokensUsed: 2800 },
    { id: "c4-4", agentId: "kdb", agentName: "KDB", content: "Threading the needle — 'AEO vs SEO' post is already ranking page 2. Multilingual angle next: how Hindi/Hinglish prompts affect AI mentions.", timestamp: "3:30 PM", role: "agent", tokensUsed: 3200 },
  ],
  "conv-5": [
    { id: "c5-1", agentId: "priya", agentName: "Priya", content: "Cross-project sync. Fulltoss: player rating v7.2 frozen, CricSheet pipeline done, live match features next. AEO: dashboard shell complete, backend integration starting.", timestamp: "4:00 PM", role: "agent", tokensUsed: 4600 },
    { id: "c5-2", agentId: "kohli", agentName: "Kohli", content: "Fulltoss is on track. Live match features ship this sprint. Messi is on venue-aware scoring. Djokovic has the benchmark suite locked.", timestamp: "4:05 PM", role: "agent", tokensUsed: 3200 },
    { id: "c5-3", agentId: "curry", agentName: "Curry", content: "AEO backend is the bottleneck. Mazzulla needs to ship the scraping pipeline before ABD can wire the dashboard. I'm prioritizing this.", timestamp: "4:08 PM", role: "agent", tokensUsed: 2800 },
    { id: "c5-4", agentId: "zlatan", agentName: "Zlatan", content: "Zlatan sees two teams shipping fast. But Zlatan reminds you — speed without quality is nothing. The rating algorithm is frozen for a reason. AEO backend is next.", timestamp: "4:15 PM", role: "agent", tokensUsed: 2200 },
    { id: "c5-5", agentId: "priya", agentName: "Priya", content: "Agreed. Next sprint priorities: 1) AEO scraping pipeline (Mazzulla), 2) Fulltoss live matches (Messi), 3) AEO content push (KDB). I'll track daily.", timestamp: "4:20 PM", role: "agent", tokensUsed: 3400 },
  ],
};

export const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Fulltoss Daily Standup",
    description: "Fulltoss team sync — Kohli runs a tight ship",
    participants: ["Kohli", "Messi", "Pep", "Djokovic"],
    status: "completed",
    scheduledAt: "Today, 9:00 AM",
    duration: "15 min",
    summary: "Player rating v7.2 frozen. All 38 benchmarks passing. Messi moving to venue-aware scoring. Djokovic validates CricSheet name matching.",
    decisions: [
      "v7.2 math is FROZEN — no changes to player-rating.ts",
      "Messi starts venue-aware scoring (vNext)",
      "Djokovic runs final benchmark suite + load tests",
    ],
  },
  {
    id: "meeting-2",
    title: "AEO Sprint Planning",
    description: "AEO team plans the Supabase backend integration sprint",
    participants: ["Curry", "ABD", "KDB", "Mazzulla"],
    status: "scheduled",
    scheduledAt: "Today, 2:00 PM",
    duration: "45 min",
  },
  {
    id: "meeting-3",
    title: "Cross-Project Retrospective",
    description: "Zlatan reviews both teams' performance and pushes for more",
    participants: ["Kohli", "Curry", "Priya", "Zlatan", "Messi", "ABD"],
    status: "scheduled",
    scheduledAt: "Tomorrow, 10:00 AM",
    duration: "30 min",
  },
  {
    id: "meeting-4",
    title: "AEO Pricing & GTM",
    description: "Finalize INR pricing tiers and go-to-market for India launch",
    participants: ["Curry", "KDB", "Priya"],
    status: "completed",
    scheduledAt: "Yesterday, 3:00 PM",
    duration: "60 min",
    summary: "5 tiers finalized: Free → Agency (₹24,999/mo). Annual billing = 20% discount. UPI integration required. Agency tier exceeds RBI ₹15K auto-debit limit — push annual.",
    decisions: [
      "Free: ₹0 (5 prompts, 1 brand)",
      "Growth: ₹3,999/mo (100 prompts, 5 brands) — Most Popular",
      "Agency: ₹24,999/mo — annual billing only (RBI limit)",
    ],
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "AEO Engine Scraping",
    description: "Trigger → Scrape 6 engines → Parse → Store in Supabase → Notify",
    status: "active",
    steps: 5,
    runsToday: 4,
    lastRun: "25 min ago",
    successRate: 88,
  },
  {
    id: "wf-2",
    name: "Player Rating Pipeline",
    description: "Fetch Sportmonks → Calculate RAE → Apply bonuses → Cache → Display",
    status: "active",
    steps: 5,
    runsToday: 12,
    lastRun: "8 min ago",
    successRate: 96,
  },
  {
    id: "wf-3",
    name: "AEO Content Pipeline",
    description: "Curry Research → KDB Draft → SEO Review → Publish → Track Rankings",
    status: "active",
    steps: 5,
    runsToday: 2,
    lastRun: "2 hours ago",
    successRate: 100,
  },
  {
    id: "wf-4",
    name: "CricSheet Data Sync",
    description: "Download → Parse ball-by-ball → Name match → Merge with Sportmonks → Validate",
    status: "paused",
    steps: 5,
    runsToday: 0,
    lastRun: "Yesterday",
    successRate: 97,
  },
  {
    id: "wf-5",
    name: "Deploy Pipeline",
    description: "Build → Djokovic Test → Stage → Deploy Vercel → Monitor",
    status: "active",
    steps: 5,
    runsToday: 3,
    lastRun: "1 hour ago",
    successRate: 82,
  },
];

// ── Cost Data (14 days, $100-200/day) ───────────────────────────────

const _today = new Date();
_today.setHours(0, 0, 0, 0);

export const mockCostData: CostEntry[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(_today.getTime() - (13 - i) * 86_400_000);
  const totalCost = randomFloat(105, 195);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    totalCost,
    tokensCost: totalCost * randomFloat(0.6, 0.75),
    apiCost: totalCost * randomFloat(0.25, 0.4),
    agents: {
      Priya: randomFloat(18, 35),
      Messi: randomFloat(28, 52),
      ABD: randomFloat(14, 28),
      Pep: randomFloat(10, 22),
      Curry: randomFloat(8, 18),
      Kohli: randomFloat(6, 16),
      Mazzulla: randomFloat(5, 14),
      Djokovic: randomFloat(4, 12),
      KDB: randomFloat(3, 9),
      Zlatan: randomFloat(2, 7),
    },
  };
});

// ── Summary Stats ───────────────────────────────────────────────────

export const mockStats = {
  totalAgents: mockAgents.length,
  activeAgents: mockAgents.filter((a) => a.status === "online" || a.status === "busy").length,
  totalTasks: mockTasks.length,
  completedTasks: mockTasks.filter((t) => t.status === "completed").length,
  activeTasks: mockTasks.filter((t) => t.status === "in_progress").length,
  totalTokens: mockAgents.reduce((sum, a) => sum + a.tokensUsed, 0),
  totalCostToday: mockAgents.reduce((sum, a) => sum + a.costToday, 0),
  activeConversations: mockConversations.filter((c) => c.status === "active").length,
  totalMeetings: mockMeetings.length,
  activeWorkflows: mockWorkflows.filter((w) => w.status === "active").length,
};

// ── Activity Feed ───────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  agentName?: string;
}

export const mockActivity: ActivityItem[] = [
  { id: "act-1", type: "delegation", title: "Delegation", description: "Priya delegated venue-aware scoring to Messi", timestamp: "1 min ago", agentName: "Priya" },
  { id: "act-2", type: "task_completed", title: "Task Completed", description: "Djokovic passed all 38 benchmark innings", timestamp: "3 min ago", agentName: "Djokovic" },
  { id: "act-3", type: "delegation", title: "Delegation", description: "Priya assigned Supabase auth to Mazzulla", timestamp: "5 min ago", agentName: "Priya" },
  { id: "act-4", type: "message", title: "New Message", description: "Kohli posted in Fulltoss: Player Rating v7.2", timestamp: "8 min ago", agentName: "Kohli" },
  { id: "act-5", type: "workflow_run", title: "Workflow Completed", description: "Player Rating Pipeline processed 12 matches", timestamp: "10 min ago" },
  { id: "act-6", type: "task_completed", title: "Task Completed", description: "Pep finished CricSheet IPL data parsing (365 players)", timestamp: "15 min ago", agentName: "Pep" },
  { id: "act-7", type: "agent_started", title: "Agent Online", description: "Mazzulla came online — starting AEO backend sprint", timestamp: "18 min ago", agentName: "Mazzulla" },
  { id: "act-8", type: "task_completed", title: "Task Completed", description: "Messi fixed no-ball scoring double-count bug", timestamp: "25 min ago", agentName: "Messi" },
  { id: "act-9", type: "meeting_started", title: "Meeting Started", description: "Fulltoss Daily Standup — Kohli running the show", timestamp: "30 min ago" },
  { id: "act-10", type: "task_completed", title: "Task Completed", description: "KDB published 'What is AEO?' blog post", timestamp: "45 min ago", agentName: "KDB" },
  { id: "act-11", type: "error", title: "Task Failed", description: "AEO scraper timeout — Perplexity rate limit hit", timestamp: "1 hour ago", agentName: "Mazzulla" },
  { id: "act-12", type: "delegation", title: "Delegation", description: "Priya delegated SEO audit to KDB", timestamp: "1.5 hours ago", agentName: "Priya" },
  { id: "act-13", type: "task_completed", title: "Task Completed", description: "ABD shipped AEO pricing page with INR plans", timestamp: "2 hours ago", agentName: "ABD" },
];
