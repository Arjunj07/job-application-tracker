# Software Requirements Specification (SRS)
## Job Application Tracker

---

## 1. Introduction

### 1.1 Document Purpose
This Software Requirements Specification (SRS) defines the functional, non-functional, security, and architectural requirements for the **Job Application Tracker** application. It serves as the single source of truth for developers, system architects, and testers during the software development lifecycle.

### 1.2 Product Overview
The **Job Application Tracker** is a personal job-search Customer Relationship Management (CRM) platform designed to streamline and organize an individual's job application pipeline. It enables job seekers to record job opportunities, track progress across distinct hiring stages, manage recruiter/company contacts, log interview rounds, set follow-up task reminders, attach tailored resume versions, and analyze search metrics through comprehensive dashboard analytics.

---

## 2. Project Scope & Goals

### 2.1 Scope
The system encompasses a web-based client application (`frontend/` built with React 19 + JavaScript / JSX + Vite 8), a RESTful API service (`backend/` built with NestJS 11 + TypeScript 5.7), a relational database (PostgreSQL 16), an asynchronous job processor (Redis 7 + BullMQ), and Dockerized deployment configurations. 

#### In-Scope:
* User authentication and session management via JWTs (Access & Refresh tokens).
* Company directory and recruiter/hiring manager contact management.
* Comprehensive job application pipeline tracking with 10 distinct status states.
* Multistage interview logging with stage-specific feedback and schedule tracking.
* Follow-up task and reminder management with automated notification scheduling.
* Resume and document version control (mapping specific resumes to job applications).
* Real-time metrics and conversion analytics (stage conversions, response rates, source ROI).
* Containerized local and production runtime environment configurations.

#### Out-of-Scope (MVP):
* Native mobile applications (iOS/Android) — responsive web design will be used instead.
* Automatic web scraping of job board websites.
* Direct integration with email providers (IMAP/Gmail API auto-ingestion).

### 2.2 Goals
* **Efficiency**: Reduce time spent manually updating application status spreadsheets by 70%.
* **Organization**: Eliminate missed follow-ups and interview sessions via automated notification queues.
* **Insights**: Provide actionable analytics on application conversion rates by source, resume version, and work mode.
* **Reliability**: Ensure 99.9% uptime with response times under 200ms for core CRUD transactions.

---

## 3. User Roles & Personas

### 3.1 User Roles
* **Standard User (`USER`)**: A job seeker who registers an account to manage their personal job search lifecycle. Has full CRUD access over their own domain entities (applications, companies, contacts, interviews, tasks, documents).
* **System Administrator (`ADMIN`)**: Platform administrative role with privileges to manage platform parameters, view aggregate user metrics, monitor queue processing health, and perform maintenance tasks.

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization (`FR-AUTH`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-AUTH-001` | Users shall be able to register a new account using an email address, full name, and password. | High |
| `FR-AUTH-002` | Users shall be able to log in securely and receive an HTTP-only JWT refresh token and an in-memory access token. | High |
| `FR-AUTH-003` | The system shall support silent token refresh using a valid refresh token cookie. | High |
| `FR-AUTH-004` | Users shall be able to log out, which invalidates the refresh token and clears client session storage. | High |
| `FR-AUTH-005` | Users shall be able to request a password reset email containing a time-limited verification token. | Medium |
| `FR-AUTH-006` | The system shall enforce Role-Based Access Control (RBAC) ensuring users can only access their own data. | High |

### 4.2 Company & Contact Management (`FR-CMP` & `FR-CNT`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-CMP-001` | Users shall be able to create, view, edit, and delete company profiles (Name, Website, Industry, Location, Notes). | High |
| `FR-CMP-002` | Users shall be able to view all job applications associated with a specific company. | Medium |
| `FR-CNT-001` | Users shall be able to add contacts (Recruiters, Hiring Managers, Referrals) linked to a specific company. | High |
| `FR-CNT-002` | Contacts must record Full Name, Role/Title, Email, Phone Number, LinkedIn URL, and Notes. | High |
| `FR-CNT-003` | Users shall be able to assign one or more contacts to a job application. | High |

### 4.3 Job Application Management (`FR-APP`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-APP-001` | Users shall be able to log a new job application with required fields: Company Name, Job Title, Application Date, and Status. | High |
| `FR-APP-002` | Optional fields shall include: Job URL, Location, Work Mode (`REMOTE`, `HYBRID`, `ON_SITE`), Salary Min, Salary Max, Currency, Application Source, Job Description, and Notes. | High |
| `FR-APP-003` | Users shall be able to view applications in Kanban Board view (grouped by status) and Table/List view. | High |
| `FR-APP-004` | Users shall be able to update application details and transition an application from one status to another. | High |
| `FR-APP-005` | The system shall automatically append an entry to `ApplicationStatusHistory` whenever a status transition occurs. | High |
| `FR-APP-006` | Users shall be able to associate a specific uploaded document (Resume version) with an application. | High |
| `FR-APP-007` | Users shall be able to soft-delete or permanently delete an application. | Medium |

### 4.4 Interview Management (`FR-INT`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-INT-001` | Users shall be able to schedule interview rounds for a specific job application. | High |
| `FR-INT-002` | Each interview round must support fields: Round Title, Round Type (`PHONE_SCREEN`, `TECHNICAL_SCREEN`, `TAKE_HOME_ASSESSMENT`, `SYSTEM_DESIGN`, `CODING_ALGORITHM`, `BEHAVIORAL`, `MANAGERIAL`, `CULTURE_FIT`, `HR_FINAL`, `OFFER_DISCUSSION`), Scheduled Date/Time, Duration (minutes), Interviewer Names, Location/Link, Notes, and Feedback. | High |
| `FR-INT-003` | Interview status shall support: `SCHEDULED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`. | High |
| `FR-INT-004` | Users shall be able to mark an interview as completed and input post-interview feedback/notes. | High |

### 4.5 Task & Reminder Management (`FR-TSK`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-TSK-001` | Users shall be able to create tasks linked to an application, interview, or standalone. | High |
| `FR-TSK-002` | Tasks must specify: Title, Description, Due Date/Time, Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and Status (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`). | High |
| `FR-TSK-003` | The system shall schedule background reminder jobs (via BullMQ + Redis) to alert users before task due dates. | High |
| `FR-TSK-004` | Users shall receive in-app and/or email notifications for upcoming tasks and interviews. | Medium |

### 4.6 Document Management (`FR-DOC`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-DOC-001` | Users shall be able to upload document files (PDF, DOCX) up to 10MB. | High |
| `FR-DOC-002` | Documents must record: Name, Version Tag (e.g., "Frontend_v2.pdf"), Document Type (`RESUME`, `COVER_LETTER`, `PORTFOLIO`, `CERTIFICATE`, `OTHER`), File Path/URL, and Upload Date. | High |
| `FR-DOC-003` | Users shall be able to preview or download stored documents directly in the application. | High |
| `FR-DOC-004` | The system shall track how many and which applications used a specific resume version. | High |

### 4.7 Dashboard Analytics (`FR-ANA`)
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| `FR-ANA-001` | Users shall see summary metric cards: Total Applications, Active Applications, Total Interviews, Total Offers, Total Rejections. | High |
| `FR-ANA-002` | The system shall compute Application-to-Interview conversion rate (`(Interviews / Total Applications) * 100`). | High |
| `FR-ANA-003` | The system shall compute Interview-to-Offer conversion rate (`(Offers / Interviews) * 100`). | High |
| `FR-ANA-004` | The system shall display Application Status Breakdown as a pie/donut chart. | High |
| `FR-ANA-005` | The system shall display Application Velocity over time (Weekly/Monthly applications count) as a line chart. | High |
| `FR-ANA-006` | The system shall display Performance by Application Source (LinkedIn, Indeed, Referral, etc.) as a bar chart. | High |
| `FR-ANA-007` | Users shall be able to filter analytics by date range (e.g., Last 30 Days, Last 90 Days, Year-to-Date, All-Time). | Medium |

---

## 5. Application Status Workflow & Business Rules

### 5.1 Application Status Enum
* `SAVED`: Opportunity logged for future application.
* `APPLIED`: Application submitted to company.
* `SCREENING`: Initial resume review or recruiter phone call scheduled.
* `ASSESSMENT`: Technical test or take-home project in progress.
* `INTERVIEW`: Core technical or team interview rounds in progress.
* `FINAL_INTERVIEW`: Executive/Leadership/HR final round.
* `OFFER`: Formal job offer received.
* `HIRED`: Offer accepted; candidate successfully hired.
* `REJECTED`: Application declined by company.
* `WITHDRAWN`: Application withdrawn by job candidate.

### 5.2 Transition State Machine

```
               +-----------------------------------------------------------+
               |                                                           |
               v                                                           |
[SAVED] ---> [APPLIED] ---> [SCREENING] ---> [ASSESSMENT] ---> [INTERVIEW] +---> [FINAL_INTERVIEW] ---> [OFFER] ---> [HIRED]
   |            |               |                 |                 |                  |                  |
   +------------+---------------+-----------------+-----------------+------------------+------------------+
   |                                                                                                          |
   +----------------------------------> [REJECTED] / [WITHDRAWN] <--------------------------------------------+
```

### 5.3 Business Rules (BR)
* `BR-001`: An application status can move to `REJECTED` or `WITHDRAWN` from **any** active state (`SAVED`, `APPLIED`, `SCREENING`, `ASSESSMENT`, `INTERVIEW`, `FINAL_INTERVIEW`, `OFFER`).
* `BR-002`: Transitioning an application to `HIRED` requires an active status of `OFFER` or `FINAL_INTERVIEW`.
* `BR-003`: Every status change MUST auto-create a row in `ApplicationStatusHistory` capturing `previousStatus`, `newStatus`, `changedAt`, and an optional `reasonNote`.
* `BR-004`: A deleted `Company` record CANNOT be hard deleted if active `JobApplication` records depend on it; soft deletion or reassignment to an generic company entity is enforced.
* `BR-005`: Soft-deleted job applications are excluded from analytics calculations by default.
* `BR-006`: Salary ranges must enforce `salaryMin <= salaryMax`.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Performance Requirements
* **API Latency**: 95% of standard CRUD requests must respond within < 150ms; complex analytics queries must respond within < 300ms.
* **Page Load**: Client initial render (First Contentful Paint) under 1.2s over standard broadband.
* **Background Jobs**: Scheduled task reminders must be executed within 30 seconds of scheduled execution time.

### 6.2 Security Requirements
* **Data Encryption**: TLS 1.3 in transit; AES-256 for document attachments at rest.
* **Password Storage**: Passwords hashed using `bcrypt` with a minimum salt factor of 12.
* **Authentication**: Short-lived JWT Access Tokens (15-minute validity) paired with HTTP-only, Secure, SameSite=Strict Refresh Tokens (7-day validity).
* **Sanitization**: All HTTP inputs parsed and sanitized using NestJS `ValidationPipe` + `class-validator` to prevent SQL Injection and XSS.

### 6.3 Reliability & Availability
* **Availability**: Target system availability of 99.9%.
* **Database Backup**: Automated daily PostgreSQL dump back-ups with a point-in-time recovery strategy.
* **Fault Tolerance**: Redis BullMQ queues must retry failed notification jobs up to 3 times with exponential backoff.

### 6.4 Maintainability & Code Quality
* Clean modular codebase across Frontend (React + JSX) and Backend (NestJS 11 + TS).
* Modular architecture following NestJS domain-driven module pattern.
* Code coverage target of > 80% for critical backend business services.

---

## 7. Key User Flows

### 7.1 Flow 1: Create Application & Set Reminder
1. User logs in and navigates to the Job Applications Dashboard.
2. User clicks "Add Application".
3. User selects or creates a Company ("Acme Corp") and specifies details (Title: "Senior Full Stack Engineer", Source: "LinkedIn", Salary: "$130k - $150k", Work Mode: "Remote").
4. User attaches their uploaded "FullStack_Resume_2026.pdf".
5. User clicks "Save & Create Follow-up Task".
6. User enters task: "Follow up with Recruiter Sarah", sets due date for 5 days later.
7. System saves application in `APPLIED` status, logs status history, links resume, and enqueues BullMQ reminder job.

### 7.2 Flow 2: Interview Round Completion & Pipeline Progression
1. User receives notification that an interview is scheduled.
2. User opens the job application details drawer.
3. User creates an Interview record (Type: `TECHNICAL_SCREEN`, Date: Tomorrow 2:00 PM, Link: "https://zoom.us/j/12345").
4. Following the interview, User marks the interview status as `COMPLETED` and enters notes/feedback ("Coding exercise went well. Solved dynamic programming question.").
5. User updates application status from `SCREENING` to `INTERVIEW`.
6. System captures status history transition automatically and updates Analytics dashboard metrics.

---

## 8. Validation Requirements

* **User Email**: Must conform to RFC 5322 format, converted to lowercase before storage.
* **Password**: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
* **Job Application Dates**: `appliedDate` cannot be in the future.
* **URLs**: `jobUrl`, `companyWebsite`, `linkedinUrl` must validate as valid HTTP/HTTPS URLs.
* **File Uploads**: Restrict mime types to `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`. Maximum file size 10 MB.

---

## 9. Acceptance Criteria

* **AC-001**: User can transition job application through all status states without errors, with history updated correctly.
* **AC-002**: Dashboard analytics accurately compute conversion rates and dynamically update upon application state changes.
* **AC-003**: System fires reminder notifications when BullMQ triggers scheduled task jobs.
* **AC-004**: Users are isolated: User A cannot read, update, or delete any company, application, contact, interview, task, or document belonging to User B.
* **AC-005**: All Docker containers (`web`, `api`, `postgres`, `redis`) start cleanly with single command `docker-compose up --build`.

---

## 10. Feature Roadmap: MVP vs. Future Enhancements

| Feature Category | MVP (Phase 1) | Future Enhancements (Phase 2+) |
| :--- | :--- | :--- |
| **Authentication** | Email/Password, JWT Refresh, Role-Based Access | OAuth2 / Google & GitHub Social Login, 2FA |
| **Applications** | Manual entry, Kanban board, Status history, Source tagging | Chrome extension auto-fill, Browser scraper |
| **Documents** | File upload (PDF/DOCX), Resume mapping to application | In-app Resume Version Diff tool, AI keyword matcher |
| **Interviews** | Stage tracking, Date & feedback notes | iCal/Google Calendar sync, Automated Zoom links |
| **Tasks & Reminders** | Manual task creation, BullMQ scheduled alerts | AI suggested follow-up dates based on stage |
| **Analytics** | Key KPIs, Status distribution, Conversion rates | Salary negotiation insights, Industry benchmark comparison |
| **Email** | Transactional & notification emails via SMTP/Nodemailer | Auto-ingest rejection/interview emails via Gmail API |
