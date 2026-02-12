# ClawDirector Pricing Plan
## India Market | Token-Based Credits | BYOK Launch Strategy

**Last Updated:** Feb 11, 2026
**Status:** Phase 1 (BYOK Launch)

---

## Pricing Philosophy

1. **Launch with BYOK** (Bring Your Own Key) to validate demand
2. **Simple credit system** - avoid complex billing until validated
3. **70-80% margins** on unified billing (future)
4. **India-first pricing** - INR, affordable for bootstrapped startups

---

## Phase 1: BYOK Launch (Ship Now)

### Free Tier
- **Price:** ₹0/month
- **Agents:** 2 concurrent agents
- **Tasks:** 50 tasks/month (rate limit, not hard cap)
- **Model:** User's own API key (Claude, GPT-4, Gemini, DeepSeek)
- **Key Features:**
  - Full agent orchestration
  - Dashboard access
  - Basic analytics
  - Community support
- **Goal:** Onboard users, validate use cases

### Starter
- **Price:** ₹999/month (~$12)
- **Agents:** 5 concurrent agents
- **Tasks:** 500 tasks/month
- **Model:** User's own API key
- **Key Features:**
  - Everything in Free
  - Priority queue
  - Email support
  - Extended task history (90 days)
- **Target:** Solo developers, side projects

### Pro
- **Price:** ₹3,999/month (~$48)
- **Agents:** 15 concurrent agents
- **Tasks:** 2,000 tasks/month
- **Model:** User's own API key
- **Key Features:**
  - Everything in Starter
  - Advanced workflows
  - Slack notifications
  - API access
  - 1-year task history
- **Target:** Small teams, startups

### Agency
- **Price:** ₹9,999/month (~$120)
- **Agents:** 50 concurrent agents
- **Tasks:** 10,000 tasks/month
- **Model:** User's own API key
- **Key Features:**
  - Everything in Pro
  - Dedicated support
  - Custom integrations
  - Unlimited task history
  - SLA guarantee
- **Target:** Agencies, larger teams

---

## Phase 2: Unified Billing (After Validation)

### Model Cost Analysis (Corrected)

#### DeepSeek V3 (Cheapest)
- **Input:** $0.27/1M tokens × ₹83 = **₹22.41 per 1M tokens** (~₹0.022 per 1K)
- **Output:** $1.10/1M tokens × ₹83 = **₹91.30 per 1M tokens** (~₹0.091 per 1K)
- **Blended (60:40 ratio):** ~₹50 per 1M tokens = **₹0.05 per 1K tokens**
- **Best for:** Simple tasks, research, summarization
- **Weakness:** Weaker at complex agent workflows, tool use

#### Claude Sonnet 4.5 (Best for Agents)
- **Input:** $3/1M tokens × ₹83 = **₹249 per 1M tokens** (~₹0.249 per 1K)
- **Output:** $15/1M tokens × ₹83 = **₹1,245 per 1M tokens** (~₹1.245 per 1K)
- **Blended (60:40 ratio):** ~₹650 per 1M tokens = **₹0.65 per 1K tokens**
- **Best for:** Complex agent orchestration, tool use, reasoning
- **Winner for:** Multi-step workflows, code generation

#### GPT-4o (Balanced)
- **Input:** $2.50/1M tokens × ₹83 = **₹207.50 per 1M tokens** (~₹0.208 per 1K)
- **Output:** $10/1M tokens × ₹83 = **₹830 per 1M tokens** (~₹0.83 per 1K)
- **Blended:** ~₹460 per 1M tokens = **₹0.46 per 1K tokens**
- **Best for:** General purpose, vision tasks

#### Gemini Pro 2.0 (Google)
- **Input:** $1.25/1M tokens × ₹83 = **₹103.75 per 1M tokens** (~₹0.104 per 1K)
- **Output:** $5/1M tokens × ₹83 = **₹415 per 1M tokens** (~₹0.415 per 1K)
- **Blended:** ~₹230 per 1M tokens = **₹0.23 per 1K tokens**
- **Best for:** Multimodal, long context

---

## Credit System Design (Phase 2)

### Credit-to-Token Conversion

**1 Credit = 1,000 Tokens (blended input/output)**

This simplifies billing while accounting for typical 60:40 input:output ratios.

### Cost Per Credit (To Us)

| Model | Blended Cost per 1K tokens | Cost per Credit | Markup (75% margin) | Price per Credit |
|-------|---------------------------|-----------------|---------------------|------------------|
| DeepSeek V3 | ₹0.05 | ₹0.05 | 4x | ₹0.20 |
| Gemini Pro 2.0 | ₹0.23 | ₹0.23 | 4x | ₹0.92 |
| GPT-4o | ₹0.46 | ₹0.46 | 3.5x | ₹1.61 |
| Claude Sonnet 4.5 | ₹0.65 | ₹0.65 | 3x | ₹1.95 |

### Simplified Pricing (3 Tiers)

#### Budget Model (DeepSeek)
- **₹0.20 per credit** (1,000 tokens)
- **₹200 per 1M tokens** (user price)
- **Cost to us:** ₹50 per 1M tokens
- **Margin:** 75%

#### Standard Model (GPT-4o/Gemini)
- **₹1.00 per credit** (1,000 tokens)
- **₹1,000 per 1M tokens** (user price)
- **Cost to us:** ₹230-460 per 1M tokens
- **Margin:** 54-77%

#### Premium Model (Claude Sonnet)
- **₹2.00 per credit** (1,000 tokens)
- **₹2,000 per 1M tokens** (user price)
- **Cost to us:** ₹650 per 1M tokens
- **Margin:** 67%

---

## Phase 2: Credit Bundles (Unified Billing)

### Free Tier
- **Price:** ₹0/month
- **Credits:** 25,000 credits (~25M tokens on DeepSeek)
- **Model:** DeepSeek V3 only
- **Agents:** 2 concurrent
- **Goal:** Let users experience AI agents without setup friction

### Starter
- **Price:** ₹1,999/month (~$24)
- **Credits:** 200,000 credits
- **Models:** DeepSeek + Gemini Pro
- **Agents:** 5 concurrent
- **Effective Cost:**
  - DeepSeek: 200M tokens (~10M per agent per month)
  - Gemini: 100M tokens (~5M per agent per month)
- **Overage:** ₹0.25/credit (₹250 per 1M tokens)

### Pro
- **Price:** ₹4,999/month (~$60)
- **Credits:** 600,000 credits
- **Models:** All models (DeepSeek, Gemini, GPT-4o, Claude)
- **Agents:** 15 concurrent
- **Effective Cost:**
  - Mixed usage: ~40M tokens per agent per month
  - Heavy Claude usage: ~10M tokens per agent per month
- **Overage:** ₹1.00/credit (₹1,000 per 1M tokens)

### Agency
- **Price:** ₹12,999/month (~$156)
- **Credits:** 2,000,000 credits
- **Models:** All models + priority access
- **Agents:** 50 concurrent
- **Effective Cost:**
  - Mixed usage: ~40M tokens per agent per month
  - Heavy usage: Sufficient for production workloads
- **Overage:** ₹0.75/credit (₹750 per 1M tokens)

---

## Token Usage Benchmarks (Real-World)

### Typical Agent Task (10-step workflow)
- **Input tokens:** 15,000 tokens (context + prompts)
- **Output tokens:** 10,000 tokens (responses + actions)
- **Total:** ~25,000 tokens = **25 credits**

### Heavy Agent Task (20+ steps, code generation)
- **Input tokens:** 50,000 tokens
- **Output tokens:** 40,000 tokens
- **Total:** ~90,000 tokens = **90 credits**

### Light Task (Simple query)
- **Input tokens:** 2,000 tokens
- **Output tokens:** 1,000 tokens
- **Total:** ~3,000 tokens = **3 credits**

### Average Task Mix (User Behavior)
- 60% light tasks: 3 credits each
- 30% typical tasks: 25 credits each
- 10% heavy tasks: 90 credits each
- **Average per task:** ~18 credits

---

## ROI Projections (Phase 2)

### Starter (₹1,999/mo)
- **Credits:** 200,000
- **Typical tasks:** 200K / 18 = ~11,000 tasks/month
- **Our cost (DeepSeek heavy):** ₹500-800
- **Margin:** ₹1,200-1,500 (60-75%)

### Pro (₹4,999/mo)
- **Credits:** 600,000
- **Typical tasks:** 600K / 18 = ~33,000 tasks/month
- **Our cost (mixed models):** ₹1,500-2,500
- **Margin:** ₹2,500-3,500 (50-70%)

### Agency (₹12,999/mo)
- **Credits:** 2,000,000
- **Typical tasks:** 2M / 18 = ~110,000 tasks/month
- **Our cost (heavy Claude):** ₹4,000-6,000
- **Margin:** ₹7,000-9,000 (54-69%)

---

## Startup Credit Strategy

### Available Credits
- **Anthropic:** $100,000 (~₹83L)
- **OpenAI:** $100,000 (~₹83L)
- **Google:** $350,000 (~₹2.9Cr)
- **Total:** $550,000 (~₹4.5Cr)

### Usage Strategy
1. **Free tier:** DeepSeek self-hosted or Google credits (cheapest)
2. **Paid tiers:** Use startup credits for first 6-12 months
3. **Priority order:** Google → OpenAI → Anthropic (save best for last)
4. **Claude strategy:** Use for paid tiers only (most expensive, best capability)

### Burn Rate Estimate
- **100 users on Free (DeepSeek):** ₹5,000/month
- **50 users on Starter:** ₹40,000/month revenue, ₹15,000 cost = ₹25,000 profit
- **20 users on Pro:** ₹99,980/month revenue, ₹40,000 cost = ₹59,980 profit
- **5 users on Agency:** ₹64,995/month revenue, ₹25,000 cost = ₹39,995 profit
- **Net:** ₹1.9L revenue/month, ₹85K costs = **₹1L profit at 175 users**

With ₹4.5Cr in credits, burn rate is effectively zero for 12-18 months.

---

## Model Selection by Use Case

### DeepSeek V3 - Best For:
- ✅ Research and summarization
- ✅ Simple automation
- ✅ High-volume, low-complexity tasks
- ✅ Free tier (subsidized by us)
- ❌ Complex multi-step workflows
- ❌ Advanced tool use

### Gemini Pro 2.0 - Best For:
- ✅ Multimodal tasks (vision, audio)
- ✅ Long context (1M+ tokens)
- ✅ Cost-conscious startups
- ✅ General automation
- ⚠️ Agent orchestration (decent, not best)

### GPT-4o - Best For:
- ✅ Balanced performance
- ✅ Popular choice (brand trust)
- ✅ Vision tasks
- ⚠️ Higher cost than Gemini
- ⚠️ Not specialized for agents

### Claude Sonnet 4.5 - Best For:
- ✅ **Complex agent workflows** (BEST)
- ✅ Advanced tool use
- ✅ Code generation
- ✅ Multi-step reasoning
- ✅ Production workloads
- ❌ Most expensive

### Recommendation by Tier:
- **Free:** DeepSeek only (we subsidize)
- **Starter:** DeepSeek + Gemini (cost-effective)
- **Pro:** All 4 models (flexibility)
- **Agency:** All models + priority Claude access

---

## Launch Checklist

### Phase 1: BYOK (Week 1-4)
- [x] Google auth working
- [x] Onboarding flow polished
- [ ] API key encryption/storage
- [ ] Rate limiting per tier
- [ ] Dashboard with task logs
- [ ] Razorpay integration (INR)
- [ ] Landing page conversion
- [ ] Documentation (API key setup)

### Phase 2: Unified Billing (Month 2-3)
- [ ] Token tracking middleware
- [ ] Credit balance system
- [ ] Stripe metering API integration (or Razorpay subscriptions)
- [ ] Model selection in dashboard
- [ ] Usage analytics per model
- [ ] Overage alerts
- [ ] Billing page with credit balance

### Phase 3: Scale (Month 4+)
- [ ] Self-hosted DeepSeek (cut costs 90%)
- [ ] Model routing (smart fallbacks)
- [ ] Enterprise features (SSO, audit logs)
- [ ] Reseller API
- [ ] White-label option

---

## Key Decisions for Launch

### 1. Which Phase to Launch?
**Recommendation:** Phase 1 (BYOK) first
- Ship in 2 weeks
- Validate demand
- Learn usage patterns
- Build trust before handling billing

### 2. Which Models to Support Initially?
**Recommendation:** Claude, OpenAI, Gemini (not DeepSeek yet)
- Most users already have these keys
- Less support burden
- Better agent performance
- Add DeepSeek in Phase 2 as "budget option"

### 3. Free Tier Strategy?
**Recommendation:** 50 tasks/month on their own key
- No cost to us
- Removes friction
- Converts to paid when they need more
- Rate limit, not hard cap (goodwill)

### 4. Pricing Sweet Spot?
**Recommendation:** ₹999 Starter, ₹3,999 Pro
- Lower than I initially suggested
- Matches India market expectations
- Room to add unified billing later
- Easy annual upgrade (20% discount = ₹799/mo, ₹3,199/mo)

---

## Competitor Pricing Reference

### Zapier (Workflow automation)
- Free: 100 tasks/month
- Starter: $19.99/mo (750 tasks)
- Professional: $49/mo (2,000 tasks)
- **Our advantage:** AI agents, not just workflows

### Make.com (Formerly Integromat)
- Free: 1,000 operations/month
- Core: $9/mo (10,000 ops)
- Pro: $16/mo (10,000 ops + premium apps)
- **Our advantage:** AI-powered, not just integrations

### n8n (Open source automation)
- Self-hosted: Free
- Cloud Starter: $20/mo (2,500 workflow executions)
- Cloud Pro: $50/mo (10,000 executions)
- **Our advantage:** Pre-built AI agents, easier setup

### Our Positioning:
**"AI agents for the price of workflow automation"**

---

## Final Recommendation

### Ship This in Week 1:

```
FREE
₹0/month
• 2 agents
• 50 tasks/month
• Your API key
• Community support

STARTER
₹999/month (~$12)
• 5 agents
• 500 tasks/month
• Your API key
• Email support
• 90-day history

PRO
₹3,999/month (~$48)
• 15 agents
• 2,000 tasks/month
• Your API key
• Priority support
• API access
• 1-year history

AGENCY
₹9,999/month (~$120)
• 50 agents
• 10,000 tasks/month
• Your API key
• Dedicated support
• Custom integrations
• Unlimited history
```

### Phase 2 (After 50+ Paid Users):
Add unified billing as **optional upgrade**:
- "Upgrade to unified billing: We manage your API costs"
- Premium tier: +₹500-1,000/mo for unified billing
- Users choose: BYOK (cheaper) or unified (easier)

---

## Questions to Validate

1. **Do users prefer BYOK or unified billing?** → Launch BYOK, measure support tickets
2. **What's the average task size?** → Track in Phase 1 to price Phase 2 correctly
3. **Which models do users actually use?** → Influences Phase 2 credit pricing
4. **Is ₹999 too cheap or just right?** → Monitor activation rate, upgrade rate
5. **Do agencies care about concurrent agents or total tasks?** → Adjust limits based on feedback

---

## Success Metrics

### Phase 1 (BYOK)
- **Activation:** 60%+ complete onboarding
- **Paid conversion:** 10%+ Free → Starter within 30 days
- **Retention:** 80%+ monthly retention (Starter+)
- **Revenue:** ₹1L MRR by Month 2

### Phase 2 (Unified Billing)
- **Adoption:** 30%+ of paid users upgrade to unified billing
- **Margin:** 70%+ on unified billing plans
- **Growth:** 2x revenue month-over-month

---

**Next Steps:**
1. Review this plan with team
2. Finalize Phase 1 pricing (₹999/3,999/9,999 or adjust)
3. Build rate limiting + task tracking
4. Launch landing page with pricing
5. Ship Phase 1 in 2 weeks
