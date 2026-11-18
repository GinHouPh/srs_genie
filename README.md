<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SRS Genie™ — Autonomous Specification Engineering Platform

> Generate comprehensive Software Requirement Specifications (IEEE 830 compliant), 22-file `.specs` architectural suites, 9 strategic planning documents, and AI-ready Vibe Tasks for autonomous coding agents (Cursor, Windsurf, Claude Code, Antigravity) with Multi-AI Provider and MCP Gateway support.

---

## 📖 Client Setup & Onboarding Guide

> **Important for Clients:** If you have just purchased SRS Genie, open our standalone, interactive setup guide in your browser:
>
> 🚀 **[SETUP_GUIDE.html](file:///d:/PROJECTS/srs_genie/SETUP_GUIDE.html)** (Double-click to open in any web browser, or access live at `/setup-guide.html` after deployment).
>
> It covers:
> - **Track 1:** 5-minute cPanel / Shared Hosting / StackCP / Hostinger deployment.
> - **Track 2:** Ubuntu 22.04 / 24.04 LTS VPS deployment with Nginx & PHP 8.2-FPM.
> - **Track 3:** Local development & testing in Sandbox Mode.
> - **Interactive Tools:** Database Config Generator, Web Server VirtualHost Generator, and Setup Checklist.
> - **Post-Installation:** Admin login, License key activation, Multi-AI API setup, Cashfree billing, and IDE MCP integration.

---

## Quick Start (Local Development)

**Prerequisites:** Node.js 18+ LTS, PHP 8.1+ / MySQL 8.0+

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Configure API key:**
   Set `GEMINI_API_KEY` in [.env.local](.env.local) or configure your preferred AI provider in the Admin Console.

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. (Localhost runs in permissive sandbox developer mode).

4. **Compile for Production:**
   ```bash
   npm run build
   ```
   Production assets are written to `dist/`, ready for direct upload to your web host.

---

## Production Deployment Checklist

1. Upload contents of `dist/` and `public/api/` to your server's `public_html/`.
2. Configure your MySQL credentials in `api/config.php`.
3. Visit `https://yourdomain.com/api/health.php` to verify MySQL connection and trigger auto-migration of all database tables.
4. Log into the Admin Console with default credentials (`admin@srsgenie.ai` / `Admin123!`) and change the password immediately.
5. Activate your Envato Purchase Code or Agape License Key in **Admin Console > License & Updates**.

---
&copy; 2026 Agape Infosys. All rights reserved.
