---
tier: 4
role: infrastructure
depends-on: architecture/system_design.md
updated: 2026-11-24
---

# Infrastructure, Containerization & CI/CD: Ekklesia

## 1. Production Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. GitHub Actions CI/CD Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run build
      - name: Deploy to Serverbyt StackCP
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ssh.gb.stackcp.com
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ~/srsgenie && git pull origin main && bash deploy.sh
```
