---
tier: 0
role: source-of-truth
owner: human
triggers-regen: all tiers below
updated: 2026-11-24
---

# Product Brief: Ekklesia

> **AI Directive:** This document represents the authoritative root source of truth.
> Do not infer capabilities or scope not explicitly outlined here. Every downstream specification derives from this brief.

---

## 1. Product Vision & Value Proposition

**Ekklesia** is an enterprise-grade platform developed for the **Other** sector.
It empowers **Other** by eliminating manual operational overhead, providing automated workflow execution, and guaranteeing continuous multi-tenant data isolation.

### User-Provided Build Specification & Project Summary
# Software Requirements Specification (SRS)
## Ekklesia — SaaS Church Bulletin & Community Platform
**Version:** 1.0  
**Status:** Draft  
**Classification:** Internal / Engineering

---

## Table of Contents
1. Introduction
2. Product Vision & Value Proposition
3. User Personas
4. Functional Requirements — Mobile App
5. Functional Requirements — Admin Panel
6. Functional Requirements — SaaS Platform Layer
7. Advanced & AI-Powered Features
8. Non-Functional Requirements
9. Constraints & Assumptions
10. Glossary

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the complete functional and non-functional requirements for **Ekklesia**, a multi-tenant SaaS Church Bulletin and Community Engagement platform. It is intended as the single source of truth for product, design, and engineering teams.

### 1.2 Scope
Ekklesia replaces fragmented church communication tools (printed bulletins, email chains, WhatsApp groups, Facebook pages) with a unified digital platform. It serves:
- **Church members** via a branded mobile app (iOS + Android)
- **Church staff/administrators** via a web-based admin panel
- **Platform operators (Ekklesia)** via a super-admin SaaS management console

### 1.3 Product Name & Tagline
- **Product Name:** Ekklesia
- **Tagline:** *"Your church, always connected."*

---

## 2. Product Vision & Value Proposition

### 2.1 Core Value Proposition
Ekklesia transforms the Sunday bulletin from a disposable paper sheet into a living, intelligent digital hub — enabling churches to communicate, engage members, track participation, coordinate volunteers, and grow giving, all from a single platform.

### 2.2 Problems Solved

| Problem | Current State | Ekklesia Solution |
|---|---|---|
| Fragmented communication | WhatsApp, email, Facebook, paper | Single unified app per church |
| No member engagement data | Staff guesses who attends | Attendance, engagement analytics |
| Volunteer coordination chaos | Manual calls, spreadsheets | Integrated volunteer scheduling |
| Generic bulletin design | MS Word template printed weekly | Dynamic, branded digital bulletin |
| No giving intelligence | External tools (Tithe.ly, etc.) | Native giving with AI insights |
| Sermon content dies after Sunday | YouTube or nothing | AI summaries, searchable library |
| No personalization | Same bulletin for everyone | Role/interest-based content feeds |
| Poor newcomer onboarding | Paper connect cards | Digital connect flow + follow-up CRM |

---

## 3. User Personas

### Persona 1 — The Senior Pastor (Decision Maker)
- Wants visibility into church health metrics
- Delegates bulletin creation to staff
- Cares about giving trends and attendance trajectory
- Tech comfort: Medium

### Persona 2 — The Church Administrator / Office Manager (Primary Admin User)
- Publishes weekly bulletin content
- Manages event registrations
- Handles volunteer scheduling
- Tech comfort: Medium-High
- Pain points: Juggling 4-5 tools for one workflow

### Persona 3 — The Ministry Leader (Dept Admin)
- Manages a specific ministry (youth, worship, missions)
- Needs to communicate with their group
- Can only access their own ministry content
- Tech comfort: Varied

### Persona 4 — The Regular Member (Primary App User)
- Checks service times, events, sermon notes
- Gives digitally
- Wants to know what's happening this week
- Tech comfort: Medium
- Primary device: Smartphone

### Persona 5 — The First-Time Visitor
- Scans a QR code at the church entrance
- Fills out a digital connect card
- Receives an automated welcome sequence
- Needs zero friction to onboard

### Persona 6 — The Volunteer
- Gets notified of serving opportunities
- Confirms/declines shifts in-app
- Tracks their serving history

---

## 4. Functional Requirements — Mobile App

### 4.1 Onboarding & Authentication

**REQ-MOB-001** — The app SHALL display a church-branded splash screen on launch.  
**REQ-MOB-002** — Users SHALL be able to register via email/password, Google SSO, Apple SSO, or phone number (OTP).  
**REQ-MOB-003** — Guest/visitor mode SHALL allow read-only access to the bulletin, service times, and the connect card WITHOUT creating an account.  
**REQ-MOB-004** — First-time visitors SHALL be prompted to complete a "Connect Card" (name, contact info, interests, how they heard about the church) which feeds into the Admin CRM.  
**REQ-MOB-005** — After registration, users SHALL complete a preference onboarding flow selecting their: ministries of interest, notification preferences, and campus (if multi-campus church).  

### 4.2 Home / Bulletin Feed

**REQ-MOB-010** — The home screen SHALL display the current week's "Digital Bulletin" — a dynamic, scrollable card feed.  
**REQ-MOB-011** — The bulletin feed SHALL include: Welcome message, Service order/liturgy, Announcements, Featured events, Sermon series card, Prayer requests, Giving spotlight, and Ministry highlights.  
**REQ-MOB-012** — The bulletin SHALL be personalized: members see ministry-specific announcements relevant to their registered interests.  
**REQ-MOB-013** — The bulletin SHALL show a countdown timer to the next service.  
**REQ-MOB-014** — Past bulletins SHALL be archived and searchable by date.  
**REQ-MOB-015** — Bulletin cards SHALL be shareable to external apps (WhatsApp, Instagram, etc.) with auto-generated graphics.

### 4.3 Sermon Library

**REQ-MOB-020** — The app SHALL display a searchable sermon library organized by series, speaker, date, and topic tag.  
**REQ-MOB-021** — Each sermon entry SHALL support: title, speaker, date, series name, cover art, video link (YouTube/Vimeo embed), audio stream/download, PDF notes, and scripture references.  
**REQ-MOB-022** — The app SHALL display an AI-generated sermon summary (150-250 words) on each sermon page.  
**REQ-MOB-023** — Users SHALL be able to take and save personal sermon notes within the app, synchronized to their account.  
**REQ-MOB-024** — AI SHALL suggest "related sermons" based on the current sermon's topic tags and user's watch history.  
**REQ-MOB-025** — Sermons SHALL be bookmarkable and playable with a persistent mini-player.  
**REQ-MOB-026** — Users SHALL be able to set playback speed (0.75x, 1x, 1.25x, 1.5x, 2x) for audio sermons.

### 4.4 Events

**REQ-MOB-030** — The app SHALL display an events calendar in both list view and monthly calendar view.  
**REQ-MOB-031** — Each event entry SHALL include: title, description, date/time, location (with map link), cover image, registration status, capacity, and ministry tag.  
**REQ-MOB-032** — Users SHALL be able to RSVP/register for events directly in the app.  
**REQ-MOB-033** — RSVP confirmation SHALL trigger: in-app confirmation, push notification reminder (configurable: 1 day and 1 hour before), and calendar export (iCal/Google Calendar).  
**REQ-MOB-034** — Events SHALL support ticket tiers (free / paid / donation-based), with payment processed in-app.  
**REQ-MOB-035** — The app SHALL surface a "Happening This Week" section on the home screen showing events in the next 7 days.  
**REQ-MOB-036** — Recurring events SHALL be supported (weekly, monthly, custom).

### 4.5 Giving / Donations

**REQ-MOB-040** — The app SHALL support in-app giving via: credit/debit card, Apple Pay, Google Pay, and ACH bank transfer.  
**REQ-MOB-041** — Users SHALL be able to give to: General Fund, specific ministries/campaigns, or custom funds defined by the church.  
**REQ-MOB-042** — Users SHALL be able to set up recurring giving (weekly, bi-weekly, monthly) with a chosen start date.  
**REQ-MOB-043** — The app SHALL display a personal giving history with transaction details.  
**REQ-MOB-044** — End-of-year giving statements SHALL be generated and downloadable as PDF.  
**REQ-MOB-045** — Campaign-based giving SHALL display a visual fundraising progress bar (goal vs. raised).  
**REQ-MOB-046** — "Quick Give" feature SHALL allow repeat givers to give with one tap using saved payment method.  
**REQ-MOB-047** — AI SHALL generate personal giving insights: "Your 2024 total giving was $X — that's $Y per week" and suggest giving goals.

### 4.6 Prayer & Community

**REQ-MOB-050** — Users SHALL be able to submit prayer requests (public, ministry-visible, or private/pastoral).  
**REQ-MOB-051** — The app SHALL display a community prayer wall (only public requests shown).  
**REQ-MOB-052** — Users SHALL be able to tap "I prayed for this" on any prayer request, sending an encouraging notification to the requester.  
**REQ-MOB-053** — Prayer requests SHALL auto-expire after 30 days (configurable) unless renewed.  
**REQ-MOB-054** — Pastoral prayer requests SHALL only be visible to users with the Pastoral Care role in the admin panel.

### 4.7 Groups & Ministries

**REQ-MOB-060** — Users SHALL be able to browse and join ministry groups (e.g., Youth, Men's Group, Choir).  
**REQ-MOB-061** — Each group SHALL have its own feed: announcements, events, resources, and members list.  
**REQ-MOB-062** — Group leaders SHALL be able to send push notifications and in-app messages to their group members from the mobile app (within granted permissions).  
**REQ-MOB-063** — The app SHALL support direct messaging between members within a group context (not global DMs, to maintain focus).

### 4.8 Volunteer Management (Member Side)

**REQ-MOB-070** — Users SHALL receive in-app and push notifications for volunteer opportunities matching their skills/interests.  
**REQ-MOB-071** — Users SHALL be able to Accept, Decline, or request a Swap for a volunteer slot.  
**REQ-MOB-072** — Users SHALL see a "My Schedule" view showing upcoming serving assignments.  
**REQ-MOB-073** — Volunteer history SHALL be trackable (hours served, roles filled).

### 4.9 Check-In (Physical Attendance)

**REQ-MOB-080** — The app SHALL support QR-code-based service check-in for attendance tracking.  
**REQ-MOB-081** — Child check-in module SHALL support: child registration, security label printing (via Bluetooth), guardian matching, and allergies/special needs notes.  
**REQ-MOB-082** — Check-in SHALL be available for both services and events.

### 4.10 Notifications Strategy

**REQ-MOB-090** — The app SHALL support: Push notifications, In-app notifications (notification center), and Email digests.  
**REQ-MOB-091** — Smart notification system SHALL suppress notifications during user-defined "quiet hours".  
**REQ-MOB-092** — Behavioral triggers SHALL drive notifications: sermon released → notify subscribers; new prayer request → notify prayer team; event 24h away → remind RSVPed attendees.  
**REQ-MOB-093** — Users SHALL have granular notification controls per category: Bulletin, Events, Sermons, Giving, Groups, Prayer, Volunteer.  
**REQ-MOB-094** — The platform SHALL track notification open rates per church and surface this in the admin analytics.

### 4.11 Offline Capabilities

**REQ-MOB-100** — The current week's bulletin SHALL be cached for offline viewing.  
**REQ-MOB-101** — Downloaded sermon audio SHALL be playable offline.  
**REQ-MOB-102** — Saved sermon notes SHALL sync when connectivity is restored.  
**REQ-MOB-103** — Offline state SHALL be clearly communicated to the user.

---

## 5. Functional Requirements — Admin Panel

### 5.1 Bulletin Builder

**REQ-ADM-001** — Admins SHALL have access to a drag-and-drop Bulletin Builder with reusable block types: Announcement, Event Card, Sermon Highlight, Scripture, Image, Video, Giving Campaign, Custom HTML.  
**REQ-ADM-002** — The builder SHALL support template saving and a template library.  
**REQ-ADM-003** — Bulletin publishing SHALL support: Save Draft, Schedule (date/time), Publish Now, and Archive.  
**REQ-ADM-004** — AI Assist button SHALL pre-populate the bulletin with relevant content pulled from the church's existing CMS data (events, sermons, announcements).  
**REQ-ADM-005** — Preview mode SHALL show mobile rendering in real-time as content is built.  
**REQ-ADM-006** — The admin SHALL be able to duplicate last week's bulletin as a starting template.

### 5.2 Content Management

**REQ-ADM-010** — Admins SHALL manage: Announcements, Sermons, Events, Groups, Prayer Requests, Giving Funds.  
**REQ-ADM-011** — A media library SHALL store uploaded images, audio files, and PDFs with search and tagging.  
**REQ-ADM-012** — Sermon upload flow SHALL support: YouTube URL import, audio file upload, PDF notes upload, speaker selection, series assignment, topic tagging.  
**REQ-ADM-013** — AI SHALL auto-generate sermon summary, key points (3-5 bullets), and suggested scripture references from the sermon transcript or audio (via transcription API).  
**REQ-ADM-014** — Announcement scheduling SHALL support visibility windows (start date / end date) and targeting (all members, specific groups, new visitors).

### 5.3 Member Management (CRM Lite)

**REQ-ADM-020** — Admin SHALL view a member directory with: name, photo, contact info, join date, membership status, groups, giving summary (redacted for privacy roles), attendance summary.  
**REQ-ADM-021** — The platform SHALL auto-create a member profile when a visitor submits a connect card.  
**REQ-ADM-022** — Follow-up workflows SHALL be assignable: "Follow up with this visitor" → assigns to a pastor/elder with in-app task notification.  
**REQ-ADM-023** — Member lifecycle stages SHALL be configurable: Visitor → New Member → Active Member → Leader → Inactive.  
**REQ-ADM-024** — Admins SHALL be able to send targeted communications to filtered member segments (e.g., all members who attended 3+ times but haven't given).  
**REQ-ADM-025** — Member import SHALL support CSV upload with field mapping.  
**REQ-ADM-026** — GDPR/data deletion requests SHALL be fulfillable from the admin panel within 2 clicks.

### 5.4 Event Management

**REQ-ADM-030** — Admins SHALL create, edit, and delete events with full field control.  
**REQ-ADM-031** — Event registration management SHALL include: attendee list, waitlist management, check-in status, and CSV export.  
**REQ-ADM-032** — Paid events SHALL integrate with Stripe for ticket payment and refund management.  
**REQ-ADM-033** — Event capacity enforcement SHALL prevent over-registration with waitlist auto-promotion.  
**REQ-ADM-034** — Post-event, the system SHALL automatically send follow-up messages to attendees (configurable).

### 5.5 Volunteer Coordination

**REQ-ADM-040** — Admins SHALL create volunteer "Teams" (e.g., Ushers, Worship, Kids Ministry) with required roles per team.  
**REQ-ADM-041** — A scheduling module SHALL allow dragging volunteers into service slots with conflict detection (person already scheduled elsewhere).  
**REQ-ADM-042** — Automated scheduling suggestion: AI SHALL recommend volunteers for open slots based on past serving patterns and availability.  
**REQ-ADM-043** — Admins SHALL send bulk schedule notifications with one click.  
**REQ-ADM-044** — Volunteer confirmation tracking SHALL show who confirmed, declined, or not responded for each service.

### 5.6 Giving & Finance Dashboard

**REQ-ADM-050** — Admins SHALL see a giving dashboard: total this week, this month, this year, YoY comparison.  
**REQ-ADM-051** — Fund-level breakdown SHALL show giving per fund (General, Building, Missions, etc.).  
**REQ-ADM-052** — Giving trends chart SHALL show weekly/monthly giving trajectory.  
**REQ-ADM-053** — Individual giving records SHALL be accessible to authorized roles only (Finance role).  
**REQ-ADM-054** — Automated giving statements SHALL be generatable: per member, per year, bulk export.  
**REQ-ADM-055** — Campaign progress tracking SHALL show: goal, raised, % complete, donor count, average gift.  
**REQ-ADM-056** — AI Giving Insights SHALL flag: lapsed givers (gave before, stopped), first-time givers, giving decline trends.

### 5.7 Analytics Dashboard

**REQ-ADM-060** — The dashboard SHALL display key church health metrics: Weekly active users, Bulletin open rate, Sermon play rate, Event RSVP rate, Prayer wall engagement, Notification click-through rate.  
**REQ-ADM-061** — Attendance analytics SHALL show: service attendance trend, campus breakdown, demographic distribution (age, group membership).  
**REQ-ADM-062** — Content performance SHALL rank top-performing bulletin items, most-viewed sermons, and highest-RSVP events.  
**REQ-ADM-063** — Retention metrics SHALL show: member churn rate, re-engagement rate, visitor-to-member conversion rate.  
**REQ-ADM-064** — Custom date range filtering SHALL be available across all analytics views.  
**REQ-ADM-065** — Reports SHALL be exportable as PDF and CSV.

### 5.8 Role-Based Access Control (RBAC)

**REQ-ADM-070** — The platform SHALL support the following built-in roles: Super Admin, Pastor, Administrator, Ministry Leader, Finance Officer, Volunteer Coordinator, Content Editor, Read-Only.  
**REQ-ADM-071** — Custom roles SHALL be creatable with granular permission toggles.  
**REQ-ADM-072** — Ministry Leaders SHALL only have access to their assigned ministry's data.  
**REQ-ADM-073** — Finance Officers SHALL have exclusive access to giving records and financial exports.  
**REQ-ADM-074** — All admin actions SHALL be logged in an audit trail with timestamp and actor.

### 5.9 Communication Tools

**REQ-ADM-080** — Mass communication tool SHALL support: in-app push notification, email (via integrated SMTP/SendGrid), and SMS (via Twilio, on paid plans).  
**REQ-ADM-081** — Message targeting SHALL support filters: group, membership status, event attendance, lifecycle stage, giving status.  
**REQ-ADM-082** — Email builder SHALL provide branded templates with church logo and colors.  
**REQ-ADM-083** — Automation flows SHALL be configurable: "Visitor submits connect card → send welcome email after 1 hour → assign follow-up task to pastor → send 'How was your first visit?' SMS after 3 days."

### 5.10 Automation & Workflows

**REQ-ADM-090** — Workflow automation engine SHALL support trigger → condition → action patterns.  
**REQ-ADM-091** — Built-in triggers: New member registered, Event registered, Connect card submitted, Giving made, Volunteer confirmed, Sermon published.  
**REQ-ADM-092** — Built-in actions: Send push notification, Send email, Send SMS, Create follow-up task, Add to group, Update lifecycle stage, Notify admin.  
**REQ-ADM-093** — Automation templates SHALL be provided for common church workflows (new visitor, birthday, giving lapse, volunteer no-show).

---

## 6. Functional Requirements — SaaS Platform Layer

### 6.1 Multi-Tenancy

**REQ-SaaS-001** — Each church tenant SHALL have complete data isolation with a unique tenant ID scoped across all database queries.  
**REQ-SaaS-002** — The platform SHALL support church sub-domains: `{churchname}.ekklesia.app`.  
**REQ-SaaS-003** — The platform SHALL support custom domains (CNAME mapping) on Pro and Enterprise plans.  
**REQ-SaaS-004** — Tenant-specific encryption keys SHALL be used for sensitive data (giving, personal info).

### 6.2 Church Onboarding Flow

**REQ-SaaS-010** — Self-service signup: church name, denomination, size, country → plan selection → payment → guided setup wizard.  
**REQ-SaaS-011** — The setup wizard SHALL guide: logo upload, color palette selection, campus setup, staff invitation, first bulletin creation.  
**REQ-SaaS-012** — Onboarding completion score SHALL be displayed to motivate admin completion (0–100%).  
**REQ-SaaS-013** — In-app onboarding checklist SHALL remain visible until all setup steps are complete.

### 6.3 White-Labeling

**REQ-SaaS-020** — Churches on Pro/Enterprise plans SHALL be able to publish the mobile app under their own brand name and icon via a "Branded App" program (PWA instant; native via App Store submission service).  
**REQ-SaaS-021** — Admin panel color theme SHALL be customizable to match church brand colors.  
**REQ-SaaS-022** — All member-facing communications (emails, push notifications) SHALL use the church's name and branding, not "Ekklesia."

### 6.4 Subscription & Billing

**REQ-SaaS-030** — Billing SHALL be managed via Stripe Billing with monthly and annual options.  
**REQ-SaaS-031** — Usage limits SHALL be enforced per plan (member seats, storage, SMS credits, campuses).  
**REQ-SaaS-032** — Admin SHALL receive in-app warnings at 80% and 100% of plan limits.  
**REQ-SaaS-033** — Plan upgrades SHALL be self-service and take effect immediately.  
**REQ-SaaS-034** — A 14-day free trial SHALL be offered on all plans with no credit card required.  
**REQ-SaaS-035** — Nonprofit/church discount verification SHALL be supported via ministry credentials.

---

## 7. Advanced & AI-Powered Features

### 7.1 AI Sermon Intelligence
- Automatic transcription via Whisper API
- Summary generation (150-250 words) via LLM
- Key takeaways extraction (3-5 bullets)
- Scripture reference detection and auto-linking
- Topic/theme tagging for search and recommendation
- Sentiment analysis on sermon content for tone awareness

### 7.2 Smart Notification Engine
- Behavioral analysis: send notifications at the time each user is most likely to engage based on their past open patterns
- Suppression: mute notifications for users who never engage (reduce churn from notification fatigue)
- Personalized digest: weekly "This week at [Church Name]" tailored to user's groups and interests

### 7.3 AI Giving Intelligence
- Lapse detection: flag members who gave regularly but stopped (>4 weeks)
- First-time giver recognition for pastoral follow-up
- Seasonal giving trend predictions
- Campaign momentum alerts: "Your building fund campaign slowed 40% this week"

### 7.4 Church Health Score
- Composite metric combining: attendance trend, giving trend, engagement rate, volunteer fill rate, new member growth
- Weekly score displayed prominently on admin dashboard
- Benchmarking against anonymized peer churches (optional, opt-in)

### 7.5 Newcomer Journey Automation
- Digital connect card → CRM record → automated 3-step welcome sequence
- "Next step" recommendations based on church's defined pathway (e.g., join a group → attend a class → serve)
- AI-generated personalized next-step suggestions based on member profile

### 7.6 Virtual Bulletin Board (Classifieds)
- Community marketplace for church members: free items, service offers, job posts
- Moderated by admins
- Completely separate from the spiritual content feed

### 7.7 Live Service Integration
- "Follow Along" mode: synced scripture display and worship lyrics during live service
- Service order countdown for worship team preparation
- Live giving prompt at the point in the service when offering is collected

### 7.8 Bible Integration
- In-app Bible reader (ESV, NIV, KJV, NLT APIs) for sermon note cross-referencing
- Tap any scripture reference to open in-app Bible
- Daily Bible reading plan tracker with streak gamification

---

## 8. Non-Functional Requirements

### 8.1 Performance
- App cold start time: < 2.5 seconds on mid-range devices
- API response time (95th percentile): < 300ms
- Bulletin load time: < 1.5 seconds on 4G
- Support for 500 concurrent users per tenant without degradation

### 8.2 Security
- All data in transit: TLS 1.3+
- All data at rest: AES-256 encryption
- PCI DSS compliance for payment data (delegated to Stripe)
- OWASP Top 10 mitigations applied
- Penetration testing: bi-annual
- SOC 2 Type II certification target: Year 2

### 8.3 Availability
- Platform SLA: 99.9% uptime
- Scheduled maintenance: Sunday 2–5 AM UTC only
- Incident response: P0 < 15 minutes, P1 < 1 hour

### 8.4 Scalability
- Architecture must support 10,000+ tenant churches
- Database sharding strategy defined from Day 1
- CDN for all media assets
- Auto-scaling backend infrastructure

### 8.5 Accessibility
- WCAG 2.1 AA compliance for mobile app and admin panel
- Support for dynamic type sizes (iOS/Android)
- Screen reader compatibility (VoiceOver, TalkBack)

### 8.6 Localization
- Multi-language support: English, Spanish, Portuguese, French, Tagalog (Phase 1)
- Date/time/currency localization per tenant region
- RTL layout support (Phase 2)

### 8.7 Data Retention & Privacy
- GDPR (EU), CCPA (California), PDPA compliance
- Data residency options: US, EU (Phase 2)
- Member data export available on request
- Right to deletion within 30 days

---

## 9. Constraints & Assumptions

- Payment processing will be handled exclusively through Stripe; no custom payment gateway in V1
- Native mobile app will be built in React Native (cross-platform) for MVP; Flutter considered for V2
- Admin panel will be a React web application
- Video hosting is NOT in-scope; Ekklesia embeds from YouTube/Vimeo
- SMS is an add-on feature due to per-message cost structure
- Church must have internet connectivity at venue for live features; offline is limited to cached content
- Initial launch: English-only, with i18n infrastructure in place

---

## 10. Glossary

| Term | Definition |
|---|---|
| Bulletin | The weekly digital publication summarizing church activities, announcements, and worship content |
| Tenant | An individual church organization subscribing to the Ekklesia platform |
| Ministry | A sub-group within a church (e.g., Youth Ministry, Worship Team) |
| Connect Card | A digital form submitted by first-time visitors to express interest in the church |
| Series | A named collection of sermons around a central theme |
| Fund | A named giving category (e.g., General Fund, Building Fund, Missions) |
| Lifecycle Stage | A defined step in a member's spiritual and organizational journey |
| Campus | A physical church location (for multi-campus churches) |

### Core Value Drivers:
- **Operational Automation:** Streamlines User Registration & Sign Up, User Profile Management, User Settings & Preferences, Account Deactivation/Deletion, Password Reset/Recovery, Email/Password Login, Social Login (Google, Facebook, Apple, etc.), Email Verification, Role-based Access Control, Two-Factor Authentication (2FA), Single Sign-On (SSO) and automated business workflows.
- **Financial Integrity:** Seamless Payment Gateway Integration, Multiple Payment Methods, Subscription Management, Product Reviews & Ratings, Order Management, Abandoned Cart Recovery, Discount/Coupon System, Checkout Process, Shopping Cart with automated tax calculation and invoice reconciliation.
- **Unified Communications:** In-app Messaging/Chat, Email Notifications, File Sharing, SMS Notifications, Group Chat/Channels, In-app Notifications, Comments & Discussion Threads with multi-channel event broadcasting.
- **Enterprise Security:** Built to satisfy GDPR, OWASP Top 10, SOC 2 Type II, ISO 27001 standards from day one.

---

## 2. User Roles & Persona Matrix

| Role | Primary Responsibilities | Core Workflows | Pain Points Resolved |
|:---|:---|:---|:---|
| **Standard User / Customer** | Day-to-day platform interaction | Self-service onboarding, item creation, order tracking | Eliminates slow manual approvals and friction |
| **Team / Operations Manager** | Workspace management & team coordination | Role assignments, approval flows, operational dashboards | Provides real-time visibility across workflows |
| **Tenant Administrator** | Workspace governance & billing | Plan upgrades, payment methods, VAT invoices, audit logs | Prevents quota exhaustion and unexpected billing |
| **Super Admin / Platform Lead** | Global platform health & configuration | Global telemetry, revenue metrics, provider configs | Centralized governance with zero downtime |

---

## 3. Non-Negotiable Engineering Constraints

- **Latency SLA:** P95 API response times under **200ms** across all core transactional paths.
- **Availability Target:** **99.9% uptime SLA** with automated container health-checks and self-healing.
- **Tenant Partitioning:** Zero-tolerance data bleed across tenant partitions enforced via database Row-Level Security (RLS).
- **Compliance Baseline:** Enforce **GDPR, OWASP Top 10, SOC 2 Type II, ISO 27001** controls, AES-256 data-at-rest encryption, and TLS 1.3 in-transit.
- **Recovery Targets:** Recovery Point Objective (RPO) < 5 minutes; Recovery Time Objective (RTO) < 15 minutes.

---

## 4. Release Scope & Boundaries

### In-Scope (Phase 1 / MVP):
- Complete self-service tenant registration and authentication.
- Core business resource management and status progression.
- Automated billing integration and downloadable invoices.
- Model Context Protocol (MCP) server integration for Cursor, Windsurf, and Claude Code.
- Automated testing suites (Vitest, Supertest, Playwright) achieving 85%+ coverage.

### Explicitly Out-of-Scope (Deferred to v2.0):
- Legacy native desktop wrappers (Windows 7 / legacy macOS).
- Multi-region active-active database replication.
- Physical hardware telemetry gateways without IP connectivity.


---

## 5. Frontier AI Architectural Directives

### 1.4 Product Vision
**Vision Statement:**
To become the industry standard operational nervous system for Other, empowering organizations to automate daily routines with high precision and zero data loss.

