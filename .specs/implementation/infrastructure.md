---
tier: 4
role: infrastructure-and-deployment
depends-on: architecture/system_design.md · architecture/security_model.md
feeds-into: execution/tasks.md
owner: AI-generated · human-reviewed
updated: YYYY-MM-DD
---

# Infrastructure

> AI instruction: Use this file when generating Dockerfiles, CI configs, deploy scripts,
> or environment variable references. Do not use env var names not defined in the
> env var schema below. Do not introduce cloud resources not listed in the
> resource map.

---

## Cloud provider and services

**Provider:** [e.g. AWS / GCP / Railway / Render / Fly.io / DigitalOcean]

| Service | Used for | Tier |
|---------|---------|------|
| [e.g. Railway / ECS] | API server compute | Production |
| [e.g. RDS / Supabase] | PostgreSQL database | Production |
| [e.g. Redis Cloud / Upstash] | Cache + rate limiting | Production |
| [e.g. S3 / Cloudflare R2] | File storage | Production |
| [e.g. CloudFront / Vercel] | Frontend CDN | Production |
| [e.g. GitHub Actions] | CI/CD | All |

---

## Environments

| Name | Purpose | Branch | URL pattern |
|------|---------|--------|-------------|
| `development` | Local dev | any | localhost |
| `staging` | Pre-production testing | `main` | `staging.[domain]` |
| `production` | Live | tagged release | `[domain]` |

---

## Environment variable schema

> All variables must be declared here before use. Prod values are never committed.
> Use a secrets manager or CI/CD env injection for production.

| Variable | Required in | Description | Example |
|----------|------------|-------------|---------|
| `DATABASE_URL` | all | Full DB connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | all | ≥32 char random string for token signing | — |
| `NODE_ENV` | all | Runtime environment | `production` |
| `PORT` | all | API server port | `3000` |
| `REDIS_URL` | staging + prod | Redis connection string | `redis://...` |
| `STORAGE_BUCKET` | staging + prod | File storage bucket name | `my-app-files` |
| `STORAGE_REGION` | staging + prod | Bucket region | `ap-southeast-1` |
| `EMAIL_API_KEY` | staging + prod | Email service API key | — |
| `VITE_API_URL` | frontend builds | Public API base URL | `https://api.[domain]` |

---

## Docker

### API Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

### docker-compose.yml (local development)
```yaml
version: '3.9'
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://dev:dev@db:5432/app_dev
      NODE_ENV: development
      JWT_SECRET: dev-secret-not-for-production
    depends_on: [db, redis]
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_USER: dev, POSTGRES_PASSWORD: dev, POSTGRES_DB: app_dev }
    volumes: [pg_data:/var/lib/postgresql/data]
    ports: ["5432:5432"]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
volumes:
  pg_data:
```

---

## CI/CD pipeline

**Platform:** [e.g. GitHub Actions]

### Pipeline stages
```
on: push to main / PR to main
─────────────────────────────
1. lint          → ESLint + tsc --noEmit
2. test          → unit + integration (against test DB)
3. build         → docker build (API) + vite build (frontend)
4. deploy:staging → auto-deploy on main push
5. deploy:prod   → manual trigger on release tag
```

### Key rules
- Failing tests block all deploy stages
- Staging deploy is automatic; production requires a tagged release + manual approval
- Database migrations run as a pre-deploy step in the CI pipeline (not at app startup)

---

## Scaling rules

| Metric | Threshold | Action |
|--------|-----------|--------|
| API CPU | > 70% for 5 min | Add 1 instance |
| DB connections | > 80% pool | Increase pool size or read replica |
| Response p95 | > 2000ms | Alert + investigate |
