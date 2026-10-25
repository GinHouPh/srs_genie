---
role: known-issues-and-tech-debt
format: close items, never delete them — history matters
read: before touching any area flagged below
owner: AI appends · human reviews
---

# Known issues

> AI instruction: Before generating code in an area listed here, read the relevant
> entry. Do not "fix" items marked as intentionally deferred — they are deferred for
> a reason. When resolving an issue, mark it closed with the date and resolution.
> Never delete entries.

---

## Issue format

```
## ISSUE-NNN: [Title]
Status: open | in-progress | closed
Severity: critical | high | medium | low | tech-debt
Area: [module or file affected]
Reported: YYYY-MM-DD
Closed: YYYY-MM-DD (if closed)
Description: [What is wrong or deferred, and why.]
Workaround: [If any — what to do in the meantime.]
Resolution: [How it was fixed, when closed.]
Linked task: TASK-NNN (if a task was created to fix it)
```

---

## Open issues

<!-- Add issues here as they are discovered during development. -->
<!-- Example entry below: -->

<!--
## ISSUE-001: [Example] File upload validation incomplete
Status: open
Severity: high
Area: contracts/api_contracts.md · implementation/backend_guide.md
Reported: YYYY-MM-DD
Description: File type validation is defined in security_model.md but not yet implemented
  in the upload endpoint. Currently accepts any file type.
Workaround: Do not expose the upload endpoint publicly until TASK-00X is complete.
Resolution: —
Linked task: TASK-00X
-->

---

## Tech debt

<!-- Items that work but should be improved — not urgent but tracked. -->

<!--
## ISSUE-002: [Example] Repository queries not paginated
Status: open
Severity: tech-debt
Area: src/modules/[resource]/[resource].repository.ts
Reported: YYYY-MM-DD
Description: List queries return all rows. Will become a performance problem above ~10k rows.
Workaround: Acceptable for MVP scale.
Resolution: —
Linked task: — (defer to post-MVP)
-->

---

## Closed issues

<!-- Resolved entries moved here. Keep for audit trail. -->
