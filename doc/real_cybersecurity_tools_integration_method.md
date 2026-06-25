# Real Cybersecurity Tools (API) Integration Method

> Goal: Integrate **real cybersecurity tooling** (third-party APIs and/or controlled scanner services) into the CyberShield Lab in a way that is:
> - safe (no secrets in frontend)
> - auditable (job records, logs)
> - scalable (async jobs)
> - pluggable (multiple providers)

This document explains a concrete backend method and how you can connect the results into existing **Report/Log** flows.

---

## 1) Ethical + usage constraints (must follow)
- Only scan targets the user is explicitly authorized to test.
- Do not run destructive actions (no exploitation against systems you don’t own).
- For web scanning, prefer passive / non-invasive checks or use strict safe modes.
- Ensure provider terms allow integration and automated scanning.

---

## 2) Recommended architecture (provider adapters)

### Backend layers
1. **Routes layer**: exposes endpoints for starting scans and getting status.
2. **Service layer**: creates scan jobs, validates requests, rate-limits.
3. **Provider layer** (pluggable adapters): wraps each external tool.
4. **Persistence layer**: stores job + results in Mongo.
5. **Audit/Logging**: writes high-level events into your `Log` model.

### Why this design
- Frontend calls your backend only.
- Secrets (API keys) remain server-side.
- You can switch tools without rewriting UI.

---

## 3) Add a provider framework (implementation plan)

### 3.1 Create folders
Create:
- `backend/src/services/securityProviders/`
  - `BaseProvider.js`
  - `snykProvider.js`
  - `zapProvider.js` (optional: if you use OWASP ZAP REST API)
  - `virustotalProvider.js` (optional)

### 3.2 Base provider interface
Each provider adapter should implement:
- `createJob(input)` → returns `{ jobId }` or executes immediately
- `getJobStatus(jobId)` → returns `{ status, progress, result? }`
- `normalizeFindings(raw)` → converts provider output into a unified format

Unified findings format example:
```js
{
  provider: 'snyk',
  type: 'vulnerability',
  title: 'OpenSSL vulnerability',
  severity: 'high',
  evidence: { ... },
  references: [ 'https://...' ]
}
```

---

## 4) Backend endpoints to integrate scans

### 4.1 New routes
Create `backend/src/routes/security-scan.routes.js`:
- `POST /api/security-scan/start`
- `GET  /api/security-scan/status/:jobId`
- `GET  /api/security-scan/results/:jobId`

### 4.2 Expected request/response
Start scan:
```json
{
  "provider": "snyk",
  "target": { "projectName": "my-app" },
  "options": { "safeMode": true }
}
```

Start response:
```json
{ "jobId": "...", "status": "queued" }
```

---

## 5) Mongo models to store jobs and results
Create a new model, for example:
- `backend/src/models/SecurityScanJob.js`

Example schema fields:
- `userId` (required)
- `provider` (string)
- `status` (`queued|running|completed|failed`)
- `progress` (number)
- `input` (sanitized)
- `result` (findings, summary)
- `error` (if failed)
- `createdAt`, `updatedAt`

### Connecting to existing `Report`
After `completed`, you can map findings to your existing `Report` model fields:
- `vulnerability`: findings title/category
- `requestData`: sanitized evidence
- `ipAddress`: client IP (or target)
- `riskScore`: computed severity-to-score

---

## 6) Concrete provider integration methods (real tool examples)

### 6.1 Snyk (real SaaS security intelligence)
**Use case:** dependency vulnerability intelligence.

**Method overview:**
1. Backend reads `SNYK_API_TOKEN`.
2. Backend calls Snyk API with a target manifest.
3. Normalize returned vulnerabilities into unified findings.
4. Store in `SecurityScanJob` and map to `Report`.

**Key env vars** (add to `backend/.env`):
- `SNYK_API_TOKEN=...`
- `SNYK_ORG=...` (optional depending on plan)

**Provider adapter logic (detailed):**
- Build the Snyk HTTP request using `node-fetch` or `axios`.
- Include authentication header, typically `Authorization: token <TOKEN>`.
- Handle pagination (if provider returns partial results).
- Convert provider’s vulnerability objects to your unified format.

**Safety:** only use Snyk for dependency analysis, not exploitation.

---

### 6.2 OWASP ZAP (real web scanner, run locally/controlled)
**Use case:** web security scanning in controlled environment.

**Method overview:**
1. Run ZAP container or local ZAP daemon.
2. Enable its REST API.
3. Backend starts a scan by calling ZAP endpoints.
4. Backend polls ZAP status.
5. Backend downloads alerts and stores normalized results.

**Operational steps:**
- ZAP runs as a separate service (Docker recommended).
- Backend never exposes ZAP internal network to the browser; it calls ZAP server-side.

**Key env vars:**
- `ZAP_BASE_URL=http://localhost:8080`
- `ZAP_API_KEY=...` (if enabled)

**Provider adapter logic:**
- `createJob(input)`:
  - call ZAP “spider” or “active scan” endpoints (safeMode should avoid intrusive scanning)
  - return a local `jobId` that maps to ZAP scan ids
- `getJobStatus(jobId)`:
  - poll ZAP status endpoints
- `normalizeFindings(raw)`:
  - transform ZAP alert objects into unified findings

**Safety recommendation for academic labs:**
- Use spidering + passive rules first.
- Gate active scans behind strict options.

---

### 6.3 VirusTotal (real IOC intelligence)
**Use case:** hash and domain reputation checks.

**Method overview:**
- Compute hashes server-side (if needed) or accept hashes from authorized users.
- Send hash/domain to VirusTotal API.
- Normalize result into your unified findings.

**Env vars:**
- `VT_API_KEY=...`

**Safety:** no exploitation—only intelligence lookups.

---

### 6.4 AbuseIPDB (real IP reputation)
**Use case:** IP reputation and reports.

**Env vars:**
- `ABUSEIPDB_API_KEY=...`

**Safety:** intel lookups only.

---

## 7) Detailed end-to-end method (what you implement in the project)

### Step 1: Add scan job model
- Create `SecurityScanJob` model.

### Step 2: Add provider layer
- Create provider adapters under `backend/src/services/securityProviders/`.

### Step 3: Add service to orchestrate jobs
Create `backend/src/services/securityScanService.js` that:
1. Validates request and checks authentication/role (use existing JWT middleware).
2. Rate-limits by user (prevents provider abuse).
3. Creates a job record in Mongo with `status=queued`.
4. Executes provider job either:
   - immediately (small scans), or
   - background (recommended): use a worker (BullMQ/Agenda) or a simple queue (setImmediate) for your semester scope.
5. Stores normalized findings.
6. Creates/updates `Report` documents based on findings.
7. Writes an audit entry into `Log` (high-level only, with sanitized evidence).

### Step 4: Add routes
Implement the endpoints that call `securityScanService`.

### Step 5: Frontend integration (minimal changes)
- Add a UI button in the relevant page (Services/Labs/Admin) to start scan.
- Poll status and show results using existing report components.

### Step 6: Update existing security report flow
- Ensure findings map to existing `Report` schema:
  - `userId`
  - `vulnerability`
  - `requestData` (sanitized)
  - `ipAddress`
  - `detectedAt`
  - `riskScore`

---

## 8) Security hardening required BEFORE integrating real tools
Because real tool integration can leak secrets or be abused, you must apply these fixes first (tie-in to your error doc):
- Never log raw request bodies for auth endpoints (mask passwords/tokens).
- Do not expose stack traces in production.
- Add strict CORS origins.
- Implement job authorization (only allowed users can run scans).

---

## 9) What to add to the existing repository
Expected new/updated files:
- New:
  - `backend/src/routes/security-scan.routes.js`
  - `backend/src/services/securityScanService.js`
  - `backend/src/services/securityProviders/*`
  - `backend/src/models/SecurityScanJob.js`
- Updated:
  - `backend/src/app.js` to register the new route under `/api`
  - add env vars to `backend/ENV_SETUP.md`
  - optionally update `doc/cyber_shield_lab_full_project_implementation_guide.md`

---

## 10) Example provider response normalization (pattern)
When a provider returns vulnerabilities/alerts:
1. Extract `title/name` and `severity`.
2. Capture evidence in a minimal set.
3. Convert severity → riskScore mapping.

Severity mapping example:
- critical → 100
- high → 80
- medium → 50
- low → 20
- info → 5

---

## End of document

