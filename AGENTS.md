<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shared public pages belong in `src/components/site/` and route leaves in `src/routes/`; keep public intake writes in validated `src/lib/*.functions.ts` server functions so each page uses the same protected server-side submission boundary.
- Each public page has its own `src/routes/` leaf with unique page metadata and renders the shared page from `src/components/site/`, keeping URLs crawlable and navigation type-safe.
