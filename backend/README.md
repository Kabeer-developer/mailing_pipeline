# Automated Outreach Pipeline

## Overview

This project automates the entire outbound outreach workflow using multiple APIs.

The user provides a single seed company domain.

The system automatically:

1. Finds similar companies using Ocean.io
2. Finds decision makers using Prospeo
3. Retrieves verified emails using Prospeo Enrich
4. Generates a preview of contacts
5. Sends personalized emails using Brevo

No manual intervention is required between steps.

---

# Architecture

```text
User Domain
     │
     ▼
Ocean.io
(Find Similar Companies)
     │
     ▼
Prospeo Search Person
(Find Decision Makers)
     │
     ▼
Prospeo Enrich Person
(Get Verified Email)
     │
     ▼
Safety Checkpoint
(Preview Contacts)
     │
     ▼
Brevo
(Send Personalized Emails)
     │
     ▼
Outreach Completed
```

---

# Tech Stack

* Node.js
* Express.js
* Axios
* Ocean.io API
* Prospeo API
* Brevo API

---

# Folder Structure

```text
backend/

├── src/
│
├── config/
│   └── axiosClient.js
│
├── controllers/
│   └── pipelineController.js
│
├── routes/
│   └── pipelineRoutes.js
│
├── services/
│   ├── oceanService.js
│   ├── prospeoService.js
│   └── brevoService.js
│
├── pipeline/
│   └── runPipeline.js
│
├── utils/
│   ├── delay.js
│   ├── retry.js
│   ├── logger.js
│   └── deduplicate.js
│
├── app.js
├── server.js
│
├── .env
├── package.json
└── README.md
```

---

# APIs Used

## Ocean.io

Purpose:

* Finds companies similar to a seed domain.

Example:

```text
openai.com
```

Returns:

```text
unigen.com
rkseeds.com
xagi.in
...
```

---

## Prospeo Search

Purpose:

* Finds company decision makers.

Example:

```text
CEO
Founder
VP
Director
Head
```

---

## Prospeo Enrich

Purpose:

* Converts person profile into verified email.

Example:

```text
David Kwon
```

Returns:

```text
dkwon@unigen.com
```

---

## Brevo

Purpose:

* Sends personalized outreach emails.

---

# Why Eazyreach Was Removed

The original workflow used Eazyreach for email resolution.

During implementation, Eazyreach onboarding/login was unavailable.

Prospeo Enrich already provides verified work emails.

Therefore Prospeo Enrich was used as the email-resolution stage.

This reduced dependencies while preserving the same business outcome.

---

# Features Implemented

## Similar Company Discovery

Uses Ocean.io to discover lookalike companies.

---

## Decision Maker Identification

Filters contacts by:

* CEO
* Founder
* Co-Founder
* VP
* Vice President
* Director
* Head
* Owner

---

## Verified Email Retrieval

Uses Prospeo Enrich.

Only verified emails are accepted.

---

## Deduplication

Duplicate emails are removed before outreach.

---

## Error Handling

Handles:

* NO_RESULTS
* NO_MATCH
* Network failures
* API failures

Pipeline continues even if some companies fail.

---

## Retry Logic

Failed API requests are retried automatically.

---

## Rate Limiting

Prospeo free tier limits are respected using delays between requests.

---

## Safety Checkpoint

Emails are never sent immediately.

Step 1:

```http
POST /api/pipeline/run
```

Preview contacts.

Step 2:

```http
POST /api/pipeline/execute
```

Send emails.

This prevents accidental outreach.

---

# Environment Variables

Create a .env file.

```env
PORT=5000

OCEAN_API_KEY=your_ocean_api_key

PROSPEO_API_KEY=your_prospeo_api_key

BREVO_API_KEY=your_brevo_api_key

SENDER_EMAIL=your_verified_sender_email
```

---

# Installation

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

---

# API Usage

## Preview Contacts

### Endpoint

```http
POST /api/pipeline/run
```

### Request

```json
{
  "domain": "openai.com"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "readyToSend": true,
    "contactsFound": 1,
    "contacts": [
      {
        "company": "Unigen",
        "domain": "unigen.com",
        "name": "David Kwon",
        "title": "Director",
        "email": "dkwon@unigen.com"
      }
    ]
  }
}
```

---

## Send Emails

### Endpoint

```http
POST /api/pipeline/execute
```

### Request

```json
{
  "domain": "openai.com",
  "email": {
    "subject": "Quick question for {{company}}",
    "body": "<p>Hi {{name}},</p><p>I noticed you're working as {{title}} at {{company}}.</p><p>Would love to connect.</p><p>Regards,<br/>Kabeer</p>"
  }
}
```

---

# Dynamic Placeholders

Supported placeholders:

```text
{{name}}
{{company}}
{{title}}
```

Example:

Template:

```text
Hi {{name}}
```

Generated:

```text
Hi David Kwon
```

---

# End-to-End Workflow

1. User enters domain
2. Ocean finds similar companies
3. Prospeo finds decision makers
4. Prospeo enriches contacts
5. Verified emails are retrieved
6. Contacts are previewed
7. User approves outreach
8. Brevo sends emails
9. Outreach completed

---

# Example Run

Input:

```text
openai.com
```

Pipeline:

```text
Ocean
  ↓
Unigen
  ↓
Prospeo Search
  ↓
David Kwon
  ↓
Prospeo Enrich
  ↓
dkwon@unigen.com
  ↓
Preview
  ↓
Brevo
  ↓
Email Sent
```

---

# Future Improvements

* Frontend dashboard
* Contact export (CSV)
* Database storage
* Analytics tracking
* Email open tracking
* Multi-template campaigns

---

# Author

Kabeer AR
