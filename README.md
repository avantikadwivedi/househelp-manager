# Ghar Kaam v2 — Deployment Guide

## What's new in v2

- **Task library** — All tasks (default + custom) are editable/toggleable
- **Timed vs anytime tasks** — Set a time only if it's fixed; otherwise she does it whenever
- **Smart notifications:**
  - Timed tasks → 5 min before
  - Weekly / monthly tasks → 8 AM alert + 5 PM nudge (in case she forgot)
- **Multi-family** — Each home has a unique code, isolated data
- **Live sync** — Employer adds a task → maid sees it instantly

## Files

- `employer.html` — For you (add tasks, edit weekly/monthly, see status)
- `helper.html` / `index.html` — For the maid (view + hear tasks, mark done)
- `firebase-config.js` — Firebase connection
- `sw.js` — Service worker for notifications

## Deployment

### 1. Set Firestore security rules (do once)

1. Go to **console.firebase.google.com** → project `househelp-manager`
2. **Firestore Database** → **Rules** tab
3. Delete existing rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /homes/{homeCode}/{document=**} {
      allow read, write: if homeCode.matches('[a-z0-9-]{3,15}');
    }
  }
}
```

4. Click **Publish**

### 2. Upload to GitHub

Delete old files, upload all 5 new files, commit. Wait ~1 min.

### 3. Test

1. Open `employer.html` → enter home code (e.g., `ava-home`)
2. Default 13 tasks auto-added — toggle/edit/delete as needed
3. Open `helper.html` in another tab with same code
4. Add/edit tasks → they appear on helper instantly
5. Tap ▶ to hear voice, ⭕ to mark done

### 4. Share with maid

Tap 📋 Copy link + code button, send via WhatsApp.

## Notification logic

- Timed task → 5 min before its time
- Weekly / monthly / laundry → 8 AM alert + 5 PM nudge

## Troubleshooting

- **Notifications:** She must add to home screen; check battery restrictions on Vivo
- **Sync issues:** Confirm same home code (case-insensitive)
- **Hindi voice:** Install Google TTS Hindi voice data in phone settings

## Free tier
Firebase Spark plan: 50k reads / 20k writes daily. You'll never hit this.
