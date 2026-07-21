# My Ready Score — Cloudflare Worker + D1 + Brevo

This package upgrades the existing static site into a full-stack Cloudflare Worker while preserving the current design, quiz, Amazon affiliate links, and Safari scroll fix.

## Included

- Static site in `public/`
- Worker API in `src/worker.js`
- `POST /api/lead` endpoint
- D1 lead/event schema
- Brevo contact synchronization
- Optional Brevo welcome email
- UTM/campaign capture
- Privacy Policy
- Existing D1 configuration:
  - Database: `myreadyscoredb`
  - Database ID: `ca6cdf05-58a4-45b7-9893-975005c79625`
  - Binding: `DB`

## Important before deploying

The current Cloudflare dashboard upload flow is intended for static assets. This full-stack version should be deployed with Wrangler or connected to a Git repository.

## Option A — Deploy from your Mac with Wrangler

### 1. Install Node.js

Install the current LTS version from https://nodejs.org if it is not already installed.

### 2. Open Terminal in this project folder

```bash
cd /path/to/myreadyscore-v2-cloudflare
npm install
```

### 3. Log in to Cloudflare

```bash
npx wrangler login
```

A browser window will open for authorization.

### 4. Create the D1 tables

Run this once:

```bash
npm run db:remote
```

### 5. Add the Brevo API key securely

```bash
npx wrangler secret put BREVO_API_KEY
```

Paste the Brevo API key when prompted. It will not be stored in the project files.

### 6. Add the Brevo list ID

Open `wrangler.jsonc` and change:

```json
"BREVO_LIST_ID": ""
```

to your numeric Brevo list ID, for example:

```json
"BREVO_LIST_ID": "12"
```

The API also accepts multiple comma-separated list IDs, such as `"12,19"`.

### 7. Optional welcome email

The form and contact capture work without this step.

#### Choice 1: Use a Brevo template

Add a secret or variable named `BREVO_TEMPLATE_ID` containing the numeric template ID.

```bash
npx wrangler secret put BREVO_TEMPLATE_ID
```

#### Choice 2: Use the built-in welcome email

Add your verified Brevo sender email:

```bash
npx wrangler secret put BREVO_SENDER_EMAIL
```

The sender name defaults to `My Ready Score` and can be changed in `wrangler.jsonc`.

### 8. Deploy

```bash
npm run deploy
```

Because the Worker name remains `broad-resonance-119a`, the existing `myreadyscore.com` custom domain should remain associated. Verify the Domains tab after deployment.

## Option B — GitHub deployment

1. Create a private GitHub repository.
2. Upload all files from this folder.
3. In Cloudflare, open the Worker and connect its Build settings to the repository.
4. Use `npm install` as the install command if requested.
5. Use `npm run deploy` as the deploy command if requested.
6. Add `BREVO_API_KEY` under Cloudflare Variables and Secrets as an encrypted secret.
7. Run the D1 schema once from your Mac with `npm run db:remote`, or paste `database/schema.sql` into the D1 Console.

## Test before buying traffic

1. Complete the Quick Assessment.
2. Submit a test name and email.
3. Confirm the success message appears.
4. In Cloudflare D1, run:

```sql
SELECT email, first_name, quick_score, weakest_category, campaign, created_at
FROM leads
ORDER BY created_at DESC
LIMIT 20;
```

5. Confirm the contact appears in the selected Brevo list.
6. Test again with a URL containing UTMs, for example:

```text
https://myreadyscore.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=mvp_test&utm_content=creative_1
```

7. Confirm the UTM fields are stored in D1.

## Data captured

- First name
- Email
- Quick Ready Score
- Weakest readiness category
- UTM source, medium, campaign, content, and term
- Landing page URL
- Country code supplied by Cloudflare
- Browser user agent
- Consent timestamp

## Brevo behavior

D1 is the source of truth. If Brevo is temporarily unavailable, the lead still saves in D1. Brevo synchronization runs in the background.

## Files to edit most often

- Quiz questions: `public/js/app.js`
- Affiliate products: `public/js/recommendations.js`
- Design: `public/css/styles.css`
- Lead API: `src/worker.js`
- Cloudflare configuration: `wrangler.jsonc`
