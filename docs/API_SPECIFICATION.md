# REST API Specification
## Job Application Tracker API v1

---

## 1. API Architecture & Standard Conventions

### 1.1 Base URL & Versioning
All API endpoints are versioned using URI path versioning.
* **Base URL**: `https://api.jobtracker.domain.com/api/v1` (Production)
* **Local Base URL**: `http://localhost:3000/api/v1` (Development)

### 1.2 Content Type & Encoding
* Request Content-Type: `application/json` (except document upload endpoints using `multipart/form-data`).
* Response Content-Type: `application/json; charset=utf-8`.

### 1.3 Authentication Header
Protected endpoints require a valid JWT Access Token passed in the HTTP Authorization header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## 2. Standard Query Parameters & Pagination Format

### 2.1 Standard Query Parameters
* `page`: Integer (Default: `1`, Min: `1`)
* `limit`: Integer (Default: `20`, Max: `100`)
* `search`: String (Free-text search across titles, names, notes)
* `sortBy`: String (Field name to sort by, e.g., `createdAt`, `appliedDate`)
* `sortOrder`: String (`ASC` | `DESC`, Default: `DESC`)

### 2.2 Standard Paginated Collection Response
```json
{
  "data": [ ... ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 3. HTTP Status Codes & Error Formats

### 3.1 HTTP Status Codes Used
* `200 OK`: Successful GET, PATCH, or PUT request.
* `201 Created`: Successful POST request resulting in resource creation.
* `204 No Content`: Successful DELETE request.
* `400 Bad Request`: Validation failure or invalid query/body params.
* `401 Unauthorized`: Missing, expired, or invalid JWT access token.
* `403 Forbidden`: Authenticated user lacks permission to access resource.
* `404 Not Found`: Requested entity resource does not exist.
* `409 Conflict`: Resource state conflict (e.g., duplicate email address).
* `422 Unprocessable Entity`: Business rule constraint violation.
* `500 Internal Server Error`: Server exception.

### 3.2 Standard Error Response Schema
```json
{
  "statusCode": 400,
  "timestamp": "2026-07-27T17:05:00.000Z",
  "path": "/api/v1/job-applications",
  "error": "Bad Request",
  "message": [
    "salaryMin must not be greater than salaryMax",
    "workMode must be one of: REMOTE, HYBRID, ON_SITE"
  ]
}
```

---

## 4. Endpoint Specifications

### 4.1 Authentication Module (`/auth`)

#### `POST /auth/register`
Creates a new user account.
* **Public Access**: Yes
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "fullName": "Jane Doe"
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "user": {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "USER",
      "createdAt": "2026-07-27T17:00:00.000Z"
    },
    "accessToken": "eyJhbGciOi..."
  }
  ```

#### `POST /auth/login`
Authenticates a user and sets an HttpOnly refresh cookie.
* **Public Access**: Yes
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```
* **Response Header**: `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict`
* **Response `200 OK`**:
  ```json
  {
    "user": {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOi..."
  }
  ```

#### `POST /auth/refresh`
Rotates access token using HTTP refresh cookie.
* **Public Access**: Yes (Requires cookie)
* **Response `200 OK`**:
  ```json
  {
    "accessToken": "eyJhbGciOi..."
  }
  ```

#### `POST /auth/logout`
Invalidates refresh token and clears session cookie.
* **Public Access**: Protected
* **Response `200 OK`**:
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

#### `GET /auth/me`
Retrieves currently logged-in user profile.
* **Public Access**: Protected
* **Response `200 OK`**: Returns user profile object.

---

### 4.2 Companies Module (`/companies`)

#### `GET /companies`
Lists user's target companies.
* **Protected**: Yes
* **Query Parameters**: `page`, `limit`, `search`, `sortBy`, `sortOrder`
* **Response `200 OK`**: Paginated array of Company objects.

#### `POST /companies`
Creates a company entry.
* **Protected**: Yes
* **Request Body**:
  ```json
  {
    "name": "Acme Corporation",
    "website": "https://acme.example.com",
    "industry": "Software & Technology",
    "location": "San Francisco, CA",
    "notes": "Fast growing Series B startup."
  }
  ```
* **Response `201 Created`**: Returns created Company object.

#### `GET /companies/:id`
* **Protected**: Yes
* **Response `200 OK`**: Single Company object.

#### `PATCH /companies/:id`
* **Protected**: Yes
* **Request Body**: Partial<CompanyDto>
* **Response `200 OK`**: Updated Company object.

#### `DELETE /companies/:id`
* **Protected**: Yes
* **Response `204 No Content`**

---

### 4.3 Contacts Module (`/contacts`)

#### `GET /contacts`
Lists user contacts.
* **Protected**: Yes
* **Query Parameters**: `companyId`, `search`, `page`, `limit`
* **Response `200 OK`**: Paginated array of Contact objects.

#### `POST /contacts`
Creates a contact.
* **Protected**: Yes
* **Request Body**:
  ```json
  {
    "companyId": "c1111111-9c0b-4ef8-bb6d-6bb9bd380a11",
    "fullName": "Sarah Jenkins",
    "roleTitle": "Senior Technical Recruiter",
    "email": "sarah.j@acme.example.com",
    "phone": "+1-555-0192",
    "linkedinUrl": "https://linkedin.com/in/sarahjenkins",
    "notes": "Met at Tech Expo 2026."
  }
  ```
* **Response `201 Created`**: Contact object.

---

### 4.4 Job Applications Module (`/job-applications`)

#### `GET /job-applications`
Lists job applications with advanced filters.
* **Protected**: Yes
* **Query Parameters**:
  * `status`: Enum (`SAVED`, `APPLIED`, `SCREENING`, `ASSESSMENT`, `INTERVIEW`, `FINAL_INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`, `WITHDRAWN`)
  * `workMode`: Enum (`REMOTE`, `HYBRID`, `ON_SITE`)
  * `companyId`: UUID
  * `search`: String
  * `appliedAfter`: ISO Date
  * `appliedBefore`: ISO Date
  * `page`, `limit`, `sortBy`, `sortOrder`
* **Response `200 OK`**: Paginated list of Job Application objects including joined `company` and `submittedResume` summary objects.

#### `POST /job-applications`
Creates a new job application.
* **Protected**: Yes
* **Request Body**:
  ```json
  {
    "companyId": "c1111111-9c0b-4ef8-bb6d-6bb9bd380a11",
    "jobTitle": "Senior Full Stack Engineer",
    "jobDescription": "We are seeking a React + NestJS engineer...",
    "jobUrl": "https://acme.example.com/careers/123",
    "location": "Remote - US",
    "workMode": "REMOTE",
    "salaryMin": 130000,
    "salaryMax": 150000,
    "currency": "USD",
    "source": "LinkedIn",
    "status": "APPLIED",
    "appliedDate": "2026-07-27T00:00:00.000Z",
    "submittedResumeId": "d9999999-9c0b-4ef8-bb6d-6bb9bd380a11",
    "contactIds": ["ct111111-9c0b-4ef8-bb6d-6bb9bd380a11"],
    "notes": "Applied via easy apply."
  }
  ```
* **Response `201 Created`**: JobApplication object.

#### `PATCH /job-applications/:id/status`
Dedicated transition endpoint to update status and auto-record history.
* **Protected**: Yes
* **Request Body**:
  ```json
  {
    "status": "SCREENING",
    "notes": "Recruiter emailed to set up 30-minute screening call."
  }
  ```
* **Response `200 OK`**: Updated JobApplication object.

#### `GET /job-applications/:id/history`
Gets audit history of status transitions.
* **Protected**: Yes
* **Response `200 OK`**:
  ```json
  [
    {
      "id": "h1111111-9c0b-4ef8-bb6d-6bb9bd380a11",
      "fromStatus": "APPLIED",
      "toStatus": "SCREENING",
      "notes": "Recruiter emailed to set up 30-minute screening call.",
      "changedAt": "2026-07-27T17:05:00.000Z"
    },
    {
      "id": "h0000000-9c0b-4ef8-bb6d-6bb9bd380a11",
      "fromStatus": null,
      "toStatus": "APPLIED",
      "notes": "Initial creation",
      "changedAt": "2026-07-25T10:00:00.000Z"
    }
  ]
  ```

---

### 4.5 Interviews Module (`/interviews`)

#### `POST /interviews`
Schedules an interview round.
* **Protected**: Yes
* **Request Body**:
  ```json
  {
    "jobApplicationId": "app11111-9c0b-4ef8-bb6d-6bb9bd380a11",
    "roundTitle": "System Design Round",
    "roundType": "SYSTEM_DESIGN",
    "scheduledAt": "2026-07-29T14:00:00.000Z",
    "durationMinutes": 60,
    "locationLink": "https://zoom.us/j/987654321",
    "interviewers": "Alex Rivera (Staff Engineer)",
    "notes": "Review distributed caching and microservice patterns."
  }
  ```
* **Response `201 Created`**: Interview object.

#### `PATCH /interviews/:id`
Updates interview state or adds post-interview feedback.
* **Request Body**:
  ```json
  {
    "status": "COMPLETED",
    "feedback": "Felt confident about DB indexing question; asked to clarify queue fallback strategy."
  }
  ```
* **Response `200 OK`**: Updated Interview object.

---

### 4.6 Tasks Module (`/tasks`)

#### `POST /tasks`
Creates a follow-up task.
* **Protected**: Yes
* **Request Body**:
  ```json
  {
    "jobApplicationId": "app11111-9c0b-4ef8-bb6d-6bb9bd380a11",
    "title": "Send thank you note to Sarah",
    "description": "Mention appreciation for the insight into team architecture.",
    "dueDate": "2026-07-28T18:00:00.000Z",
    "priority": "HIGH"
  }
  ```
* **Response `201 Created`**: Task object.

---

### 4.7 Documents Module (`/documents`)

#### `POST /documents`
Uploads a document file.
* **Protected**: Yes
* **Content-Type**: `multipart/form-data`
* **Form Fields**:
  * `file`: Binary file (PDF/DOCX max 10MB)
  * `name`: String ("Full Stack Resume 2026")
  * `documentType`: Enum (`RESUME`, `COVER_LETTER`, `PORTFOLIO`, `CERTIFICATE`, `OTHER`)
  * `versionTag`: String ("v2.1-Senior")
* **Response `201 Created`**: Document metadata object.

---

### 4.8 Analytics Module (`/analytics`)

#### `GET /analytics/overview`
Retrieves aggregated top-line dashboard metrics.
* **Protected**: Yes
* **Query Parameters**: `startDate`, `endDate`
* **Response `200 OK`**:
  ```json
  {
    "totalApplications": 48,
    "activeApplications": 12,
    "interviewsScheduled": 8,
    "offersReceived": 2,
    "rejections": 14,
    "applicationToInterviewRate": 16.67,
    "interviewToOfferRate": 25.0
  }
  ```

#### `GET /analytics/by-status`
* **Protected**: Yes
* **Response `200 OK`**:
  ```json
  [
    { "status": "SAVED", "count": 5 },
    { "status": "APPLIED", "count": 15 },
    { "status": "SCREENING", "count": 4 },
    { "status": "INTERVIEW", "count": 3 },
    { "status": "OFFER", "count": 2 },
    { "status": "REJECTED", "count": 14 }
  ]
  ```

#### `GET /analytics/by-source`
* **Protected**: Yes
* **Response `200 OK`**:
  ```json
  [
    { "source": "LinkedIn", "total": 25, "interviews": 5, "conversionRate": 20.0 },
    { "source": "Referral", "total": 4, "interviews": 3, "conversionRate": 75.0 },
    { "source": "Company Website", "total": 10, "interviews": 1, "conversionRate": 10.0 }
  ]
  ```
