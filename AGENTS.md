<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Feature delivery

- After every new feature implementation, run the relevant checks, commit the feature changes, and push the current branch to its configured remote before reporting completion.
- Treat this as standing authorization for routine commits and pushes; do not ask for separate confirmation unless a newer user instruction says to keep the work local.
- Include only changes belonging to the task. Do not force-push unless explicitly requested. If a push cannot be completed, report the specific blocker.
