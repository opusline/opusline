# Opusline

Open-source time tracking, notes, and mission management for freelancers —
missions, clients, CRA, TJM, invoicing tracking. Built freelance-first for
the French market.

Pre-1.0 — expect breaking changes. Proper docs will come later.

## Quick start

Prerequisites: Node.js >= 20 with pnpm, and Docker (PHP only runs in
containers, through `apps/api/scripts/php.sh`).

```bash
pnpm install        # JS workspaces + git hooks
pnpm dev            # api (Docker stack), web on :3000, storybook on :6006
cd apps/api && sh scripts/php.sh php artisan migrate
```

## License

[AGPL-3.0](LICENSE).
