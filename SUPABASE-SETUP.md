# Supabase Setup Guide - ClawDirector

## Step 1: Enable Email Confirmation (5 min)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Click your project: `pqojhnvpjljgtcevtyuf`
3. Left sidebar → **Authentication** → **Providers**
4. Click **Email** tab
5. Find **Confirm email** toggle → Turn it **ON**
6. Click **Save** at bottom

✅ Done! Now users must confirm email before logging in.

---

## Step 2: Enable Google Login (10 min)

### Part A: Get Google OAuth Credentials

1. Go to: https://console.cloud.google.com/
2. Click **Select a project** dropdown → **NEW PROJECT**
3. Project name: `ClawDirector`
4. Click **CREATE**
5. Wait for project to be created (30 seconds)
6. Left sidebar → **APIs & Services** → **Credentials**
7. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
8. If prompted "Configure consent screen":
   - Click **CONFIGURE CONSENT SCREEN**
   - Choose **External** → **CREATE**
   - App name: `ClawDirector`
   - User support email: your email
   - Developer contact: your email
   - Click **SAVE AND CONTINUE** (skip all other steps)
   - Click **BACK TO DASHBOARD**
9. Go back to **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
10. Application type: **Web application**
11. Name: `ClawDirector Web`
12. **Authorized redirect URIs** → Click **+ ADD URI**
    - Add: `https://pqojhnvpjljgtcevtyuf.supabase.co/auth/v1/callback`
    - Click **+ ADD URI** again
    - Add: `https://clawdirector.com/auth/callback`
13. Click **CREATE**
14. **COPY** these 2 values (keep this tab open):
    ```
    Client ID: something.apps.googleusercontent.com
    Client secret: GOCSPX-xxxxxxxxxxxxx
    ```

### Part B: Add to Supabase

1. Go back to Supabase Dashboard
2. **Authentication** → **Providers** → **Google**
3. Toggle **Enable Sign in with Google** to **ON**
4. Paste **Client ID** from Google
5. Paste **Client Secret** from Google
6. Click **Save**

✅ Done! Google login now works!

---

## Step 3: Configure Redirect URLs

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://clawdirector.com`
3. **Redirect URLs** → Add these (one per line):
   ```
   http://localhost:3000/*
   https://clawdirector.com/*
   https://*.vercel.app/*
   ```
4. Click **Save**

✅ Done!

---

## Step 4: Test Email Confirmation

1. Go to: https://crewstation-lat1fj0cd-prabhasraju1817-gmailcoms-projects.vercel.app/signup
2. Sign up with a test email
3. You should see: **"Check your email"** screen
4. Check your email inbox (and spam folder)
5. Click the confirmation link
6. Should redirect to onboarding

If no email arrives:
- Check Supabase → **Authentication** → **Email Templates**
- Make sure SMTP is configured (Supabase uses their own by default)

---

## Step 5: Test Google Login

1. Go to login page
2. Click **Continue with Google**
3. Choose your Google account
4. Should redirect to onboarding after success

---

## Optional: Enable MFA (Later)

**Skip this for now** - only enable when you need 2FA for users.

1. Supabase → **Authentication** → **Multi-Factor Authentication**
2. Enable **TOTP** (authenticator app) - FREE
3. Or enable **Phone** - requires Twilio account (costs money)

---

## Troubleshooting

### Email confirmation not working?
- Check spam folder
- Supabase → **Authentication** → **Logs** to see what happened
- Make sure "Confirm email" toggle is ON

### Google login not working?
- Check redirect URIs match exactly (no trailing slash)
- Make sure OAuth consent screen is published
- Check browser console for errors

### Still stuck?
- Check Supabase logs: **Authentication** → **Logs**
- Paste error here and I'll help

---

## Summary Checklist

- [ ] Email confirmation enabled
- [ ] Google OAuth credentials created
- [ ] Google login enabled in Supabase
- [ ] Redirect URLs configured
- [ ] Tested email signup → confirmation
- [ ] Tested Google login

Done! 🎉
