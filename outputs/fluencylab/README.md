# FluencyLab

Static prototype for a communication training simulator with writing practice, speaking simulation, feedback, progress metrics, and local practice history.

Run locally:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173
```

The current build uses local prompt and feedback simulation logic. The prompt generation and feedback functions in `index.html` are the intended integration points for a future OpenAI-style API.

Supabase Auth setup:

1. Create a Supabase project.
2. In Supabase, go to Project Settings -> API.
3. Copy the Project URL and anon public key.
4. Paste them into `supabase-config.js`.
5. In Authentication -> Providers, make sure Email is enabled.
6. Add your deployed Vercel URL to Authentication -> URL Configuration.

PWA install notes:

- Serve the folder over `http://127.0.0.1`, `localhost`, or HTTPS.
- Open the app in a mobile browser and use Add to Home Screen / Install App.
- The service worker caches the app shell, manifest, preview image, and icons for offline launch.
