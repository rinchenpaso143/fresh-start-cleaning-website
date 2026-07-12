# Fresh Start Cleaning Adelaide — Website

A simple website with a working contact form. When someone submits the form:
1. Their enquiry is saved (so you never lose it, even if email fails)
2. You get an email notification with their details

## What's in this folder

- `public/index.html` — the website itself
- `server.js` — the backend that receives form submissions
- `data/leads.json` — where enquiries are saved (created automatically)
- `.env.example` — template for your settings (copy this to `.env`)

## Test it on your own computer (optional)

1. Install [Node.js](https://nodejs.org) (choose the LTS version) if you don't have it
2. Open a terminal in this folder and run:
   ```
   npm install
   cp .env.example .env
   npm start
   ```
3. Open `http://localhost:3000` in your browser

You don't need to do this step to deploy — it's just useful for previewing changes.

## Deploying it for real (recommended: Render.com)

Render has a free tier, deploys straight from a GitHub repo, and doesn't require any command-line skills once it's set up.

**Step 1 — Put this code on GitHub**
1. Create a free account at [github.com](https://github.com)
2. Create a new repository (e.g. `fresh-start-cleaning-website`)
3. Upload this entire folder to it (GitHub's website lets you drag and drop files — no Git knowledge needed)

**Step 2 — Connect it to Render**
1. Create a free account at [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select your new repository
4. Fill in:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Advanced** and add these environment variables (from your `.env.example`):
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `TO_EMAIL`, `ADMIN_KEY`
6. Click **Create Web Service**

Render will build and deploy your site, giving you a live URL like `fresh-start-cleaning.onrender.com` within a few minutes.

**Step 3 — Get email notifications working**

If you use Gmail:
1. Turn on 2-Step Verification on your Google account
2. Create an "App Password" at https://myaccount.google.com/apppasswords
3. Use your Gmail address as `SMTP_USER` and the app password as `SMTP_PASS`

You can also use a dedicated email-sending service like [Resend](https://resend.com) or [SendGrid](https://sendgrid.com) if you'd rather not use your personal Gmail — both have free tiers and simple setup guides.

**Step 4 — Connect your own domain (optional)**

Once deployed, Render lets you add a custom domain (e.g. `freshstartcleaningadelaide.com.au`) under the service's **Settings → Custom Domains**. You'll buy the domain separately through a registrar like [namecheap.com](https://namecheap.com) or [crazydomains.com.au](https://crazydomains.com.au), then point it at Render by following their instructions.

## Viewing saved enquiries

Even without email working, every enquiry is saved. View them anytime at:

```
https://your-site-url.onrender.com/api/leads?key=YOUR_ADMIN_KEY
```

(Replace `YOUR_ADMIN_KEY` with whatever you set as `ADMIN_KEY`.)

**Note on the free tier:** Render's free web services "sleep" after 15 minutes of no traffic and take ~30 seconds to wake up on the next visit. This is fine for a small business starting out — if it becomes a problem, Render's paid tier ($7/month) keeps it always-on. Also note that on the free tier, `leads.json` may reset if the service restarts — for guaranteed record-keeping, make sure email notifications are set up so enquiries land safely in your inbox too.

## Alternative: simpler no-backend option

If this feels like more than you want to manage, you can also host just `public/index.html` for free on [Netlify](https://netlify.com) with their built-in form handling — no server or code required, submissions land straight in your inbox. Worth considering if you'd rather not think about servers at all.
