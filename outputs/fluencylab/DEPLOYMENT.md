# Deploy FluencyLab to Vercel

FluencyLab is a static PWA. The deployable app lives in this folder:

```text
outputs/fluencylab
```

## Option 1: Vercel Dashboard

1. Push this project to GitHub.
2. In Vercel, create a new project from the repository.
3. Use these project settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `outputs/fluencylab`
4. Deploy.

The root `vercel.json` already includes the output directory and PWA-friendly headers.

## Option 2: Vercel CLI

From the project root:

```bash
npm install -g vercel
vercel login
vercel --prod
```

If you deploy directly from `outputs/fluencylab`, use:

```bash
cd outputs/fluencylab
vercel --prod
```

After deployment, open the generated `*.vercel.app` URL and check:

- The landing page loads.
- The manifest is available at `/manifest.webmanifest`.
- The service worker is available at `/sw.js`.
- The browser offers install / Add to Home Screen.

## Supabase Auth Before Production

Update `supabase-config.js` with:

```js
export const SUPABASE_URL = "https://your-project-ref.supabase.co";
export const SUPABASE_ANON_KEY = "your-supabase-anon-key";
```

Then in Supabase:

1. Enable Email auth under Authentication -> Providers.
2. Add your Vercel URL under Authentication -> URL Configuration.
3. If email confirmation is enabled, new users must confirm their email before signing in.
