# Error Checklist & Resolution Guide (CyberShield Lab)

> Purpose: This document maps the **current security/logic problems** found in the codebase to **exact files** and provides concrete resolution steps. 
> Scope: backend behaviors currently implemented to demonstrate vulnerabilities, plus correctness bugs that can break functionality.

---

## A) High-risk security misconfigurations (currently implemented)

### 1) CORS allows all origins with credentials
- **Where:** `backend/src/app.js`
- **Current code:**
  ```js
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  ```
- **Why it’s a problem:** `origin: '*'` combined with `credentials: true` is unsafe and can cause browsers to reject requests depending on runtime behavior; in real deployments it enables credential leakage.

**Fix (production-safe):**
1. Define an allow-list in environment variables, e.g. `CORS_ORIGINS=http://localhost:5173,http://yourdomain.com`.
2. Parse it and set `origin` as a function or array.
3. Keep `credentials: true` only for explicit origins.

**Target change:** `backend/src/app.js`
- Replace the `cors({ origin: '*', credentials: true })` block with an allow-list approach.

---

### 2) Verbose error handler leaks stack traces and internal objects
- **Where:** `backend/src/app.js`
- **Current code:**
  ```js
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
    stack: err.stack,
    details: err
  });
  ```
- **Why it’s a problem:** Leaks server internals to the client (useful for attackers, confusing in UX).

**Fix:**
1. In production (`NODE_ENV=production`), return a generic message only.
2. Optionally log detailed errors server-side.

**Target change:** `backend/src/app.js`
- Guard `stack/details` by `process.env.NODE_ENV !== 'production'`.

---

### 3) Server prints entire environment variables to console
- **Where:** `backend/src/server.js`
- **Current code:**
  ```js
  console.log('Environment variables:', process.env);
  ```
- **Why it’s a problem:** JWT secrets, Mongo URIs, and other credentials can appear in logs.

**Fix:**
- Remove the line entirely.
- If you need diagnostics, log only non-sensitive values (e.g. `PORT`, `NODE_ENV`).

---

### 4) Request logger stores sensitive payloads (PII/tokens/passwords)
- **Where:** `backend/src/middleware/logger.middleware.js`
- **Current behavior:** logs `req.body`, `req.query`, `req.params` into Mongo when requests occur.
- **Why it’s a problem:** Registration/login payload includes `password`. Even if passwords are hashed after save, the request body still contains the raw password at the time of logging.

**Fix:**
1. Implement a sanitization layer before `Log.create(...)`.
2. Mask common sensitive fields:
   - `password`, `token`, `jwt`, `Authorization`, `email` (optional), `refreshToken`, `apiKey`, `secret`.
3. Avoid storing full bodies for auth endpoints; store only metadata.

**Target change:** `backend/src/middleware/logger.middleware.js`
- Add helper `sanitizeRequestData(data)` and apply to:
  - `body: req.body`
  - `query: req.query`
  - `params: req.params`

---

### 5) Log schema requires `userId`, but middleware may create logs with `userId: null`
- **Where:**
  - `backend/src/models/Log.js` (`userId.required: true`)
  - `backend/src/middleware/logger.middleware.js` (creates logs with `userId: req.user ? req.user._id : null`)
- **Why it’s a problem:** When logging unauthenticated auth attempts, `userId` becomes `null`. Since `userId` is required, `Log.create()` can fail.

**Fix options:**
- **Option A (recommended):** Make `userId` optional in schema.
- **Option B:** Ensure `userId` is always set for any log creation path (harder—auth attempts may have no token yet).

**Target change:** `backend/src/models/Log.js`
- Change `userId.required` to `false`.

---

### 6) Logout does not invalidate JWTs
- **Where:** `backend/src/controllers/auth.controller.js`
- **Current behavior:**
  ```js
  const logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
  };
  ```
- **Why it’s a problem:** JWTs remain valid until expiry; “logout” becomes cosmetic.

**Fix:** (choose one)
1. **JWT blacklist / token revocation list** (store `jti` + expiry in Mongo/Redis).
2. **Refresh tokens** with rotation + revocation.
3. Shorten access token lifespan and revoke refresh tokens.

**Target changes:**
- Update JWT generation to include `jti`.
- Update auth middleware to check blacklist.
- Update logout endpoint to add current token to blacklist.

---

## B) Incorrect/fragile risk-scoring & logging logic (may break lab/monitoring)

### 7) Logger overrides `res.send` and logs `res.statusCode` at send time
- **Where:** `backend/src/middleware/logger.middleware.js`
- **Risk:** If downstream uses `res.json` (which calls `res.send` internally in Express), it works; but for streaming, errors, or middleware calling `next(err)` it may not log what you expect.

**Fix:**
- Prefer an established logging pattern using response finish events (`res.on('finish')`) rather than monkey-patching `res.send`.

---

### 8) `checkSuspiciousActivity` uses naive regexes
- **Where:** `backend/src/middleware/logger.middleware.js`
- **Risk:** High false positives and missed real payloads because it stringifies body/query as JSON.

**Fix:**
- Keep it educational, but for reporting use structured signals:
  - detect content-type
  - parse JSON safely
  - use request-size limits
  - record which patterns matched

---

## C) Resolution checklist (quick runbook)

1. **Remove credential exposure**
   - Delete `console.log('Environment variables:', process.env);`
2. **Harden error responses**
   - Return stack traces only in development.
3. **Fix CORS**
   - Use explicit origin allow-list.
4. **Sanitize logging**
   - Mask passwords/tokens before writing to DB.
5. **Fix Log schema mismatch**
   - Make `userId` optional or ensure it is always present.
6. **Implement real logout**
   - Add JWT revocation mechanism.

---

## D) What to do next
- After implementing fixes, run these verifications:
  - Register/login still works
  - No passwords/tokens stored in `logs.requestData`
  - Logging does not crash due to `userId` requirement
  - CORS works for frontend origin
  - Production error responses do not contain stack traces


