# AuraLink AI – Payment plans (scan-based, profitable tiers)

Plans are **based on number of scans per month** so API cost scales with usage and each tier keeps a healthy margin. **Batch processing** is on a higher tier to match cost and value.

---

## Cost assumption (per scan)

Each scan = one product image → vision extraction + optional web enrichment.

- **Rough cost per scan:** ~$0.015–$0.04 (vision API + enrichment; depends on model and image size).
- **Planning assumption:** **$0.025/scan** (mid-range; adjust from your real logs).

Use this to check that **monthly price ≫ (scans × $0.025)** on every tier.

---

## Tiers (scan-based, batch on higher tier)

| Tier        | Scans/mo | Price/mo | Est. API cost* | Margin*   | Batch processing |
|------------|----------|----------|----------------|-----------|------------------|
| **Free**   | 3        | $0       | ~$0.08         | Lead gen  | No               |
| **Starter**| 50       | $12      | ~$1.25         | ~89%      | No               |
| **Pro**    | 250      | $29      | ~$6.25         | ~78%      | No               |
| **Business** | 1,000  | $79      | ~$25           | ~68%      | **Yes**          |

\* At $0.025/scan. Re-run with your actual cost/scan if different.

**Overage (optional):**  
- Sell extra scan packs (e.g. $5 per 25 scans) so heavy users pay for usage and you keep margin on overage too.

---

## Why this stays profitable

1. **Scan-based, not fixed “unlimited”**  
   Cap scans per tier so API cost is bounded. No tier where a single user can burn more than you earn.

2. **Batch on Business only**  
   Batch = many images in one go; same API cost per image but higher value for the user. Putting it on the highest tier (1,000 scans) keeps batch users on a plan that already has strong margin.

3. **Free = 3 scans**  
   Enough to try the product; then paywall. Cost is trivial (~$0.08).

4. **Starter at $12 for 50 scans**  
   Cost ~$1.25 → strong margin. Good for low-volume sellers.

5. **Pro at $29 for 250 scans**  
   Cost ~$6.25 → still ~78% margin. For regular sellers.

6. **Business at $79 for 1,000 + batch**  
   Cost ~$25 → ~68% margin. Batch + higher volume = clear upgrade reason.

---

## Suggested feature matrix (for UI/copy)

| Feature              | Free | Starter | Pro   | Business |
|----------------------|------|---------|-------|----------|
| Scans per month      | 3    | 50      | 250   | 1,000    |
| Publish to Shopify   | ✓    | ✓       | ✓     | ✓        |
| Web enrichment       | ✓    | ✓       | ✓     | ✓        |
| **Batch processing**| —    | —       | —     | **✓**    |
| Connected stores     | 1    | 1       | 2     | 5        |
| Support              | Community | Email | Email | Priority |

(Adjust store limits and support to match your product.)

---

## Implementation notes

- **Usage:** You already have `free_scans_used` / `free_scans_limit` and `get_scan_usage()`. Extend to:
  - **Paid tiers:** `stripe_subscription_id` or `plan_id` + `scans_limit` (50 / 250 / 1000) and `scans_used` (reset monthly).
- **Enforcement:** Before each extract call, check `scans_used < scans_limit` for the user’s plan; return 402 if over.
- **Batch:** Only allow batch upload/queue when `plan_id === 'business'` (or equivalent).

---

## Summary

- **Free:** 3 scans/mo, $0 – lead gen.  
- **Starter:** 50 scans/mo, **$12** – high margin, no batch.  
- **Pro:** 250 scans/mo, **$29** – strong margin, no batch.  
- **Business:** 1,000 scans/mo + **batch**, **$79** – still profitable, batch only on this tier.

Price in **scans**, not fixed “unlimited,” so API cost never outstrips revenue on any tier.
