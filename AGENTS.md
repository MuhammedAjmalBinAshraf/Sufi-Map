<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Maps load only through the shared loader in `src/lib/google-maps.ts` (one async script, Sahn map styles, SVG pin icons); every map view must render a calm fallback when the browser key is missing or loading fails, so the list stays usable.
- All interface text lives in the `en`/`ml`/`ar` dictionaries in `src/lib/i18n.tsx`, and site data carries all three languages; use logical spacing/position utilities (`ps`, `pe`, `start`, `end`, `ms`, `me`) so Arabic RTL mirrors without extra code.
- Form validation lives in `src/lib/submission.ts` as zod schemas whose messages are i18n keys, so rules stay testable and translated in one place.
- Steward progress (visits, kept sites, submissions, corrections) is stored on the visitor's device via `src/lib/steward.tsx` until a backend exists; badge thresholds live only in `src/lib/badges.ts`.
- Colors used inside Google map imagery are mirrored as hex in `src/lib/google-maps.ts` because Google renders outside our stylesheet; keep them in sync with `src/styles.css` tokens.
