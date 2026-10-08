# Karaoke Stream Buddy

A web app for picking which song to sing next during a livestream: a song
library of YouTube videos, a notepad for song ideas to look up later, and a
random wheel to pick your next song — all filterable by artist, Disney, and
musical theatre.

Anyone with the link can view the library, use the filters, and spin the
wheel. Only you, signed in with your Google account
(`isabelagbu13@gmail.com`), can add, edit, or delete songs and notes. Anyone
else who signs in with a different Google account gets a view-only session —
the Firestore rules enforce this server-side, not just the UI.

## One-time setup (Firebase)

This app stores your songs and notes in Firebase so they sync across every
device you use.

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project (any name, e.g. "karaoke-stream-buddy"). You can decline Google Analytics, it's not needed.
2. In the project, click **Build → Firestore Database → Create database**. Start in **production mode**, pick any region.
3. Still in Firestore, go to the **Rules** tab, delete the existing contents, and paste in the contents of [firestore.rules](firestore.rules) from this repo. Click **Publish**. (These rules only grant write access to `isabelagbu13@gmail.com` — if you ever want to use a different Google account, update the email in both `firestore.rules` and [src/config.ts](src/config.ts).)
4. Click **Build → Authentication → Get started**. Under **Sign-in method**, enable **Google**. Pick a support email when prompted (your own is fine).
5. Go to **Project settings** (gear icon, top left) → scroll to **Your apps** → click the **Web** (`</>`) icon to register a new web app (any nickname). Firebase will show you a `firebaseConfig` object.
6. Copy [.env.example](.env.example) to a new file named `.env.local` in this project, and fill in the values from that `firebaseConfig` object:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

## Running locally

```bash
npm install
npm run dev
```

Open the printed localhost URL. Click **Log in** (top right) and sign in with
your `isabelagbu13@gmail.com` Google account to add songs and notes.

## Deploying so it works from any device

Any static host works (the app is just a Vite build). The easiest is
[Vercel](https://vercel.com) or [Netlify](https://netlify.com):

1. Push this project to a GitHub repo.
2. Import it in Vercel/Netlify.
3. Add the same six `VITE_FIREBASE_*` values from your `.env.local` as environment variables in the host's project settings.
4. Deploy.
5. Back in the Firebase console, go to **Authentication → Settings → Authorized domains** and add your deployed domain (e.g. `your-app.vercel.app`) — Google sign-in only works from domains Firebase has been told to trust. `localhost` is already allowed by default.
6. The same Google login works from any device/browser that visits the deployed URL.

## How it works

- **Library** — add songs with a YouTube URL, artist, and Disney/musical
  theatre checkboxes. Click a song (or **Play**) to load it into the embedded
  player.
- **Notepad** — a running list of song ideas to look up and add later.
- **Wheel** — spins over whichever songs match your currently checked
  filters (artist / Disney / musical theatre); with nothing checked it spins
  over your whole library.
- Filters (the checkbox panel) are shared between the Library and Wheel tabs.
