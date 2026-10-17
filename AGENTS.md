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

## Research architecture
- All research data passes through the typed ResearchProvider interface and centralized query options; the separate mock adapter is the default so a verified provider can replace it without page redesign.
- Use Recharts for research charts and the shared shadcn-based StockTable for sortable equity views to keep visuals and interactions consistent.
- Content pages use file-based TanStack routes with individual metadata, shared loaders, and a root research shell to preserve navigation and loading boundaries.
- Keep backend quantitative models outside browser code; frontend research outputs are supplied, precomputed data only.

## Account security
- Password-reset access uses an ephemeral, user-bound PASSWORD_RECOVERY event recorded by the root auth listener; ordinary sessions never unlock the recovery form.
- Signed-in password changes collect and send the current password; recovery changes omit it because Auth validates the recovery session.
