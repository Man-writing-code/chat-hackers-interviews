# Chat Hackers interviews

An interviewer guide and response form. Answers submit directly to Google Forms and its linked response spreadsheet; no application server or private credentials are needed.

## Hosting

GitHub Actions builds a Next.js static export and deploys `out/` to GitHub Pages on each push to `main`.

Site: https://man-writing-code.github.io/chat-hackers-interviews/

The repository's Pages source must be GitHub Actions. The workflow supplies `NEXT_PUBLIC_BASE_PATH=/chat-hackers-interviews` so scripts and styles load under the repository URL.

## Development

Run `npm ci`, then `npm run dev`. Run `npm run build` to export the site into `out/`; serve that folder with any static web server. `next start` does not serve static exports.

## Editing questions

Questions and choices live in `app/page.tsx`. Google Form URLs and entry IDs are in `lib/google-form.ts`. Keep the native Form and interface in sync, including exact choice values and required fields. Adding or replacing a Google Form question requires updating its entry ID here.

Submission feedback is optimistic: the browser cannot read Google's cross-origin confirmation. Verify receipt in the linked Google response sheet when needed.
