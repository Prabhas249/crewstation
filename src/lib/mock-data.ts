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

export const mockAgents: Agent[] = [
  {
    id: "priya",
    name: "Priya",
    role: "AI Orchestrator",
    description: "Your right hand. Coordinates the entire crew, delegates tasks, resolves conflicts, and keeps everyone in sync via Telegram.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 892_400,
    costToday: 12.48,
    tasksCompleted: 47,
    tasksActive: 3,
    uptime: "23h 59m",
    lastActive: "Just now",
    avatar: "P",
    capabilities: ["delegation", "scheduling", "summarization", "telegram", "monitoring"],
  },
  {
    id: "kohli",
    name: "Kohli",
    role: "Captain / PM",
    description: "Born leader who chases every target with intensity. Sets aggressive deadlines, tracks every metric, and never settles for less than 100%.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 198_600,
    costToday: 2.78,
    tasksCompleted: 22,
    tasksActive: 2,
    uptime: "23h 14m",
    lastActive: "1 min ago",
    avatar: "V",
    capabilities: ["sprint_planning", "task_tracking", "team_motivation", "status_reports", "deadline_enforcement"],
  },
  {
    id: "messi",
    name: "Messi",
    role: "Software Engineer",
    description: "The GOAT of code. Writes elegant solutions that look effortless. Turns complex problems into beautiful, simple implementations.",
    status: "busy",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 512_400,
    costToday: 7.18,
    tasksCompleted: 28,
    tasksActive: 3,
    uptime: "23h 14m",
    lastActive: "Just now",
    avatar: "L",
    capabilities: ["shell", "file_read", "file_write", "code_review", "refactoring", "architecture"],
  },
  {
    id: "pep",
    name: "Pep",
    role: "Data Analyst",
    description: "Master tactician who sees patterns others miss. Transforms raw data into winning strategies with obsessive attention to detail.",
    status: "online",
    model: "gpt-4o",
    tokensUsed: 178_500,
    costToday: 2.68,
    tasksCompleted: 14,
    tasksActive: 1,
    uptime: "20h 05m",
    lastActive: "5 min ago",
    avatar: "G",
    capabilities: ["data_analysis", "visualization", "pattern_recognition", "strategy", "metrics"],
  },
  {
    id: "nole",
    name: "Djokovic",
    role: "Quality Assurance",
    description: "Relentless perfectionist who tests every edge case. Finds every flaw, validates every fix. The wall that nothing gets past.",
    status: "online",
    model: "claude-haiku-4-5-20251001",
    tokensUsed: 67_200,
    costToday: 0.34,
    tasksCompleted: 35,
    tasksActive: 1,
    uptime: "23h 14m",
    lastActive: "8 min ago",
    avatar: "N",
    capabilities: ["testing", "browser", "shell", "bug_detection", "load_testing", "edge_cases"],
  },
  {
    id: "curry",
    name: "Curry",
    role: "Research Agent",
    description: "Precision sniper who finds insights from impossible range. Deep dives into data, surfaces killer findings, and never misses the target.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 245_832,
    costToday: 3.42,
    tasksCompleted: 18,
    tasksActive: 2,
    uptime: "23h 14m",
    lastActive: "2 min ago",
    avatar: "S",
    capabilities: ["web_search", "browser", "file_write", "deep_research", "competitor_analysis"],
  },
  {
    id: "mazzulla",
    name: "Mazzulla",
    role: "Infrastructure",
    description: "Young tactical mind managing the systems. Deploys with precision, monitors like a hawk, keeps the engine running smooth.",
    status: "offline",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 34_500,
    costToday: 0.48,
    tasksCompleted: 7,
    tasksActive: 0,
    uptime: "0h 0m",
    lastActive: "3 hours ago",
    avatar: "J",
    capabilities: ["shell", "monitoring", "deployment", "ci_cd", "infrastructure"],
  },
  {
    id: "abd",
    name: "ABD",
    role: "UI/UX Designer",
    description: "Mr. 360° of design. Creates stunning interfaces from every angle. No challenge too creative, no viewport too small.",
    status: "busy",
    model: "gpt-4o",
    tokensUsed: 142_300,
    costToday: 2.14,
    tasksCompleted: 11,
    tasksActive: 2,
    uptime: "12h 30m",
    lastActive: "Just now",
    avatar: "A",
    capabilities: ["browser", "file_write", "prototyping", "design_systems", "responsive_design"],
  },
  {
    id: "kdb",
    name: "KDB",
    role: "Content Writer",
    description: "The creative playmaker. Crafts content with vision and precision — blog posts, docs, and copy that threads the needle every time.",
    status: "idle",
    model: "claude-haiku-4-5-20251001",
    tokensUsed: 89_120,
    costToday: 0.45,
    tasksCompleted: 12,
    tasksActive: 0,
    uptime: "18h 42m",
    lastActive: "15 min ago",
    avatar: "K",
    capabilities: ["file_write", "web_search", "content_strategy", "copywriting", "documentation"],
  },
  {
    id: "zlatan",
    name: "Zlatan",
    role: "Team Catalyst",
    description: "Zlatan doesn't do motivation. Zlatan IS motivation. Pushes every agent to peak performance and dares the crew to be great.",
    status: "online",
    model: "claude-sonnet-4-5-20250929",
    tokensUsed: 95_600,
    costToday: 1.34,
    tasksCompleted: 16,
    tasksActive: 1,
    uptime: "23h 14m",
    lastActive: "3 min ago",
    avatar: "Z",
    capabilities: ["performance_review", "team_coaching", "code_review", "sprint_motivation", "retrospectives"],
  },
];

const taskTitles = [
  "Research competitor pricing strategies",
  "Implement authentication middleware",
  "Write API documentation for v2 endpoints",
  "Analyze user churn data for Q4",
  "Fix pagination bug in search results",
  "Design onboarding flow wireframes",
  "Set up monitoring dashboards",
  "Review and merge PR #142",
  "Create email campaign content",
  "Optimize database query performance",
  "Write unit tests for payment module",
  "Deploy staging environment",
  "Analyze A/B test results",
  "Refactor notification service",
  "Create social media content calendar",
  "Set up error tracking with Sentry",
  "Research SEO optimization strategies",
  "Implement rate limiting on API",
  "Write blog post on product updates",
  "Configure CI/CD pipeline",
];

export const mockTasks: Task[] = taskTitles.map((title, i) => {
  const statuses: TaskStatus[] = ["pending", "in_progress", "completed", "completed", "completed", "failed"];
  const priorities: TaskPriority[] = ["low", "medium", "medium", "high", "critical"];
  const agent = mockAgents[randomInt(0, mockAgents.length - 1)];
  const status = randomItem(statuses);
  return {
    id: `task-${i + 1}`,
    title,
    description: `Detailed description for: ${title}`,
    status,
    priority: randomItem(priorities),
    assignedTo: agent.id,
    agentName: agent.name,
    createdAt: `${randomInt(1, 23)}h ago`,
    updatedAt: `${randomInt(1, 60)}m ago`,
    tokensUsed: randomInt(5000, 150_000),
    cost: randomFloat(0.05, 2.5),
    duration: status === "completed" || status === "failed" ? `${randomInt(2, 45)}m` : "-",
  };
});

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Sprint Planning War Room",
    participants: ["Kohli", "Messi", "ABD", "Priya"],
    messageCount: 47,
    lastMessage: "Kohli: No excuses. Auth middleware ships today, rate limiter tomorrow. Messi, you're up.",
    lastMessageAt: "5 min ago",
    status: "active",
  },
  {
    id: "conv-2",
    title: "Bug Hunt: Search Performance",
    participants: ["Messi", "Djokovic", "Pep"],
    messageCount: 23,
    lastMessage: "Messi: Query optimization done. Response time down 60%. Djokovic, validate it.",
    lastMessageAt: "12 min ago",
    status: "active",
  },
  {
    id: "conv-3",
    title: "Content Masterclass",
    participants: ["KDB", "Curry", "Kohli", "Priya"],
    messageCount: 35,
    lastMessage: "KDB: I see the gap — AI orchestration tutorials. Threading the needle with a 3-part series.",
    lastMessageAt: "1 hour ago",
    status: "active",
  },
  {
    id: "conv-4",
    title: "Infrastructure Overhaul",
    participants: ["Mazzulla", "Messi"],
    messageCount: 18,
    lastMessage: "Mazzulla: All services migrated. Monitoring is green across the board.",
    lastMessageAt: "3 hours ago",
    status: "archived",
  },
  {
    id: "conv-5",
    title: "Design System Refresh",
    participants: ["ABD", "Messi", "Kohli"],
    messageCount: 29,
    lastMessage: "ABD: New component library ready — I approached it from every angle. 360° coverage.",
    lastMessageAt: "2 hours ago",
    status: "active",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    agentId: "kohli",
    agentName: "Kohli",
    content: "Team, let's attack today's backlog. Three critical tasks on the board — we chase every single one down. No dropping intensity.",
    timestamp: "9:00 AM",
    role: "agent",
    tokensUsed: 1200,
  },
  {
    id: "msg-2",
    agentId: "messi",
    agentName: "Messi",
    content: "Auth middleware is done. JWT validation complete. Clean implementation, handles all the edge cases. Pep, verify the token refresh logic.",
    timestamp: "9:05 AM",
    role: "agent",
    tokensUsed: 3400,
  },
  {
    id: "msg-3",
    agentId: "pep",
    agentName: "Pep",
    content: "I've analyzed the error patterns. The data tells us three scenarios need attention: expired tokens, concurrent refresh requests, and mid-session rotation. We must control every variable.",
    timestamp: "9:08 AM",
    role: "agent",
    tokensUsed: 4200,
  },
  {
    id: "msg-4",
    agentId: "nole",
    agentName: "Djokovic",
    content: "Test cases prepared for all three scenarios. I will find every flaw. Running the full suite now — expect results in 10 minutes.",
    timestamp: "9:12 AM",
    role: "agent",
    tokensUsed: 2100,
  },
  {
    id: "msg-5",
    agentId: "abd",
    agentName: "ABD",
    content: "Onboarding wireframes done. I approached it from three different angles — progressive disclosure won. Reduces cognitive load beautifully.",
    timestamp: "9:15 AM",
    role: "agent",
    tokensUsed: 2800,
  },
  {
    id: "msg-6",
    agentId: "curry",
    agentName: "Curry",
    content: "Splash! Competitor pricing analysis complete. 78% charge per-agent, 22% flat-rate. Found the gap — hybrid model with base + per-agent addon.",
    timestamp: "9:20 AM",
    role: "agent",
    tokensUsed: 5600,
  },
  {
    id: "msg-7",
    agentId: "zlatan",
    agentName: "Zlatan",
    content: "Zlatan has reviewed the sprint. The team is performing well, but Zlatan expects more. Meeting at 2 PM — Zlatan will make sure we ship greatness.",
    timestamp: "9:25 AM",
    role: "agent",
    tokensUsed: 1800,
  },
];

// Per-conversation messages
export const mockConversationMessages: Record<string, Message[]> = {
  "conv-1": [
    { id: "c1-1", agentId: "kohli", agentName: "Kohli", content: "Right, let's get into it. 12 items in the backlog — I want the top 3 shipped this sprint. No negotiation.", timestamp: "10:00 AM", role: "agent", tokensUsed: 1400 },
    { id: "c1-2", agentId: "messi", agentName: "Messi", content: "Auth middleware is almost done. Rate limiting should be next — it's the last blocker before public launch.", timestamp: "10:02 AM", role: "agent", tokensUsed: 2200 },
    { id: "c1-3", agentId: "abd", agentName: "ABD", content: "I need 2 days for the onboarding redesign. I want to explore multiple angles before committing to a direction.", timestamp: "10:04 AM", role: "agent", tokensUsed: 1800 },
    { id: "c1-4", agentId: "kohli", agentName: "Kohli", content: "Done. Priority order: 1) Auth completion, 2) Rate limiter, 3) Onboarding. Messi, you start rate limiting right after auth. No breaks.", timestamp: "10:06 AM", role: "agent", tokensUsed: 2600 },
    { id: "c1-5", agentId: "messi", agentName: "Messi", content: "Auth will be done by EOD. Rate limiting tomorrow morning. Simple.", timestamp: "10:08 AM", role: "agent", tokensUsed: 1200 },
    { id: "c1-6", agentId: "priya", agentName: "Priya", content: "I've updated all task priorities and notified the crew. Messi is on auth, ABD starts onboarding wireframes. Everything synced.", timestamp: "10:12 AM", role: "agent", tokensUsed: 1600 },
  ],
  "conv-2": [
    { id: "c2-1", agentId: "messi", agentName: "Messi", content: "Found the root cause. Query wasn't hitting the composite index on (workspace_id, created_at). Easy fix.", timestamp: "11:00 AM", role: "agent", tokensUsed: 3200 },
    { id: "c2-2", agentId: "pep", agentName: "Pep", content: "The slow query logs confirm it — 94% of slow queries miss the index. Average 2.3s vs our 200ms target. The data is clear.", timestamp: "11:05 AM", role: "agent", tokensUsed: 4100 },
    { id: "c2-3", agentId: "nole", agentName: "Djokovic", content: "I'll set up load tests. Every scenario, every edge case. What's the expected throughput after the fix?", timestamp: "11:08 AM", role: "agent", tokensUsed: 1800 },
    { id: "c2-4", agentId: "messi", agentName: "Messi", content: "Should drop to ~50ms. Migration pushed, deploying to staging now.", timestamp: "11:10 AM", role: "agent", tokensUsed: 2400 },
    { id: "c2-5", agentId: "nole", agentName: "Djokovic", content: "Load test results: p99 latency dropped from 2.8s to 47ms. 500 concurrent requests, zero failures. Nothing gets past me.", timestamp: "11:30 AM", role: "agent", tokensUsed: 3600 },
    { id: "c2-6", agentId: "messi", agentName: "Messi", content: "Query optimization done. Response time down 60%. Ready for production.", timestamp: "11:35 AM", role: "agent", tokensUsed: 1400 },
  ],
  "conv-3": [
    { id: "c3-1", agentId: "curry", agentName: "Curry", content: "Splash! Mapped out competitor content strategies. Nobody is covering AI orchestration tutorials or multi-agent workflow patterns. Wide open.", timestamp: "2:00 PM", role: "agent", tokensUsed: 5200 },
    { id: "c3-2", agentId: "kdb", agentName: "KDB", content: "I see the opening. Three-part series: (1) Getting Started with Agent Crews, (2) Advanced Workflow Patterns, (3) Cost Optimization. Threading the needle.", timestamp: "2:05 PM", role: "agent", tokensUsed: 2800 },
    { id: "c3-3", agentId: "kohli", agentName: "Kohli", content: "Love the aggression. Curry, compile the data points. KDB, start drafting. I want part 1 this week.", timestamp: "2:08 PM", role: "agent", tokensUsed: 1600 },
    { id: "c3-4", agentId: "curry", agentName: "Curry", content: "On it. Pulling data from every angle — competitor gaps, search volume, trending topics. Full research package incoming.", timestamp: "2:15 PM", role: "agent", tokensUsed: 3400 },
  ],
  "conv-4": [
    { id: "c4-1", agentId: "mazzulla", agentName: "Mazzulla", content: "Current setup: 3 EC2 instances, single Postgres, Redis cache. We're hitting memory limits at peak. Time to level up.", timestamp: "3:00 PM", role: "agent", tokensUsed: 2800 },
    { id: "c4-2", agentId: "messi", agentName: "Messi", content: "Agree on Kubernetes. I've containerized the auth service as a proof of concept — clean, minimal, ready for review.", timestamp: "3:10 PM", role: "agent", tokensUsed: 3600 },
    { id: "c4-3", agentId: "mazzulla", agentName: "Mazzulla", content: "All services migrated to the new cluster. Monitoring is green across the board. Systems are locked in.", timestamp: "3:45 PM", role: "agent", tokensUsed: 2200 },
  ],
  "conv-5": [
    { id: "c5-1", agentId: "abd", agentName: "ABD", content: "I've audited every component. 23 button styles, 8 card patterns — chaos. Time to unify. I'm approaching this from every angle.", timestamp: "1:00 PM", role: "agent", tokensUsed: 3200 },
    { id: "c5-2", agentId: "messi", agentName: "Messi", content: "I'll set up Storybook. Tailwind config for the tokens — it's what we already use. Keep it simple.", timestamp: "1:05 PM", role: "agent", tokensUsed: 2400 },
    { id: "c5-3", agentId: "kohli", agentName: "Kohli", content: "Tailwind config. ABD, define the final token set. I want this locked down by end of day.", timestamp: "1:08 PM", role: "agent", tokensUsed: 1800 },
    { id: "c5-4", agentId: "abd", agentName: "ABD", content: "Done. 5 button variants, 3 card styles, 4 text sizes, 4px spacing grid. 360° coverage — every pattern documented.", timestamp: "1:20 PM", role: "agent", tokensUsed: 4000 },
    { id: "c5-5", agentId: "abd", agentName: "ABD", content: "Component library ready for review. Every angle covered, every edge case handled.", timestamp: "1:45 PM", role: "agent", tokensUsed: 2600 },
  ],
};

export const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Daily Standup",
    description: "Daily sync — Kohli runs a tight ship",
    participants: ["Kohli", "Messi", "ABD", "Djokovic"],
    status: "completed",
    scheduledAt: "Today, 9:00 AM",
    duration: "15 min",
    summary: "All agents reported progress. Auth middleware on track. Kohli pushed for faster delivery on rate limiting.",
    decisions: [
      "Auth middleware ships by EOD — Messi on it",
      "Djokovic starts testing search fix immediately",
      "ABD presents onboarding wireframes at 2 PM",
    ],
  },
  {
    id: "meeting-2",
    title: "Pricing Strategy Review",
    description: "Curry presents competitor research, Pep analyzes the data",
    participants: ["Kohli", "Curry", "Pep"],
    status: "scheduled",
    scheduledAt: "Today, 2:00 PM",
    duration: "45 min",
  },
  {
    id: "meeting-3",
    title: "Sprint Retrospective",
    description: "Zlatan makes sure everyone aims higher next sprint",
    participants: ["Kohli", "Messi", "ABD", "Djokovic", "KDB", "Pep"],
    status: "scheduled",
    scheduledAt: "Tomorrow, 10:00 AM",
    duration: "30 min",
  },
  {
    id: "meeting-4",
    title: "Architecture Review",
    description: "Messi and Mazzulla plan the microservices migration",
    participants: ["Messi", "Mazzulla", "Kohli"],
    status: "completed",
    scheduledAt: "Yesterday, 3:00 PM",
    duration: "60 min",
    summary: "Agreed on phased migration. Mazzulla sets up Kubernetes, Messi containerizes auth service first.",
    decisions: [
      "Phase 1: Auth service migration (1 week)",
      "Phase 2: API gateway setup (3 days)",
      "Phase 3: Remaining services (2 weeks)",
    ],
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Content Pipeline",
    description: "Curry Research → KDB Write → Djokovic Review → Publish",
    status: "active",
    steps: 4,
    runsToday: 3,
    lastRun: "25 min ago",
    successRate: 92,
  },
  {
    id: "wf-2",
    name: "Bug Fix Flow",
    description: "Pep Triage → Messi Fix → Djokovic Test → Mazzulla Deploy",
    status: "active",
    steps: 4,
    runsToday: 7,
    lastRun: "8 min ago",
    successRate: 87,
  },
  {
    id: "wf-3",
    name: "Sprint Planning",
    description: "Pep Metrics → Kohli Prioritize → Priya Assign → Zlatan Motivate",
    status: "active",
    steps: 4,
    runsToday: 1,
    lastRun: "2 hours ago",
    successRate: 100,
  },
  {
    id: "wf-4",
    name: "Customer Feedback Analysis",
    description: "Curry Collect → Pep Categorize → Pep Analyze → KDB Report",
    status: "paused",
    steps: 4,
    runsToday: 0,
    lastRun: "Yesterday",
    successRate: 95,
  },
  {
    id: "wf-5",
    name: "Deployment Pipeline",
    description: "Messi Build → Djokovic Test → Mazzulla Stage → Mazzulla Deploy → Pep Monitor",
    status: "active",
    steps: 5,
    runsToday: 2,
    lastRun: "1 hour ago",
    successRate: 78,
  },
];

export const mockCostData: CostEntry[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(2026, 1, 8 - 13 + i);
  const totalCost = randomFloat(8, 22);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    totalCost,
    tokensCost: totalCost * randomFloat(0.6, 0.8),
    apiCost: totalCost * randomFloat(0.2, 0.4),
    agents: {
      Curry: randomFloat(1, 4),
      Messi: randomFloat(3, 8),
      KDB: randomFloat(0.2, 1.5),
      Pep: randomFloat(1, 3),
      Djokovic: randomFloat(0.1, 0.8),
      Mazzulla: randomFloat(0.2, 1),
      ABD: randomFloat(1, 3),
      Kohli: randomFloat(0.5, 2),
      Zlatan: randomFloat(0.3, 1.5),
    },
  };
});

// Summary stats
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

// Activity feed
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  agentName?: string;
}

export const mockActivity: ActivityItem[] = [
  { id: "act-0a", type: "delegation", title: "Delegation", description: "Priya delegated auth middleware to Messi", timestamp: "1 min ago", agentName: "Priya" },
  { id: "act-1", type: "task_completed", title: "Task Completed", description: "Curry finished competitor pricing analysis", timestamp: "2 min ago", agentName: "Curry" },
  { id: "act-0b", type: "delegation", title: "Delegation", description: "Priya assigned pricing model task to Pep", timestamp: "4 min ago", agentName: "Priya" },
  { id: "act-2", type: "message", title: "New Message", description: "Kohli posted in Sprint Planning War Room", timestamp: "5 min ago", agentName: "Kohli" },
  { id: "act-3", type: "workflow_run", title: "Workflow Completed", description: "Bug Fix Flow completed successfully", timestamp: "8 min ago" },
  { id: "act-4", type: "agent_started", title: "Agent Online", description: "Djokovic came online and started testing immediately", timestamp: "12 min ago", agentName: "Djokovic" },
  { id: "act-5", type: "task_completed", title: "Task Completed", description: "Messi finished implementing auth middleware", timestamp: "18 min ago", agentName: "Messi" },
  { id: "act-6", type: "meeting_started", title: "Meeting Started", description: "Daily Standup started — Kohli running the show", timestamp: "25 min ago" },
  { id: "act-7", type: "error", title: "Task Failed", description: "Mazzulla's deployment to staging timed out", timestamp: "45 min ago", agentName: "Mazzulla" },
  { id: "act-0c", type: "delegation", title: "Delegation", description: "Priya delegated blog post to KDB", timestamp: "55 min ago", agentName: "Priya" },
  { id: "act-8", type: "task_completed", title: "Task Completed", description: "KDB published blog post on AI orchestration", timestamp: "1 hour ago", agentName: "KDB" },
  { id: "act-9", type: "workflow_run", title: "Workflow Completed", description: "Content Pipeline run #3 completed", timestamp: "1.5 hours ago" },
  { id: "act-10", type: "agent_started", title: "Agent Online", description: "ABD connected and started wireframe tasks", timestamp: "2 hours ago", agentName: "ABD" },
];
