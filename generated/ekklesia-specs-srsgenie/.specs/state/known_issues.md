---
tier: state
role: tech-debt-and-bugs
updated: 2026-11-24
---

# Known Issues & Technical Debt Registry: Ekklesia

1. **Local Storage Capacity Limits:** When managing very large project suites (>5MB), local browser storage must synchronize with persistent PostgreSQL/SQLite storage.
2. **Third-Party Payment Gateway Webhook Latency:** Payment webhooks may experience network jitter; idempotency keys and retry workers must process webhooks asynchronously.
3. **Multi-Region Latency Optimization:** In v1, database traffic routes to a single primary region; multi-region read replicas are slated for v2.0.
