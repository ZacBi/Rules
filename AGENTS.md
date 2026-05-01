## Learned User Preferences

- For blackmatrix7 `ios_rule_script` URLs and paths, rely on naming conventions; avoid fetching or reading whole rule files when the path or filename is enough to proceed.
- Prefer remote rule-provider URLs over adding in-repo ruleset copies when a suitable upstream ruleset already exists.
- README and other public-facing docs should stay professional: avoid coarse wording and avoid embedding full personal verification or self-check runbooks.
- Do not commit personal identifiers, local machine paths, or private subscription material; this repository is public.
- Do not add example, sample, or placeholder runtime artifacts to this public repository. Public outputs should stay limited to the official `dist/` entrypoints and module index.
- Prefer open-source data sources, upstream repositories, and mature toolchains over inventing local tools, private rule formats, or hand-maintained parallel datasets.

## Learned Workspace Facts

- After editing `policy/catalog.js`, `policy/renderers.js`, `policy/index.js`, or related policy sources, run `node scripts/build.js` to regenerate `dist/modules/index.json`, `dist/stash/stash.stoverride`, `dist/mihomo/override.js`, and `dist/surge/module.sgmodule`.
- Surge `policy-path` must reference a Surge-compatible policy list; raw Clash or YAML subscription bodies are not valid without conversion (for example via this repo’s scripts).
- Prefer blackmatrix7 `ios_rule_script` rule sets where they cover the traffic, rather than maintaining large parallel hand-written rule lists.
- Stash runtime script, rewrite, and MITM capabilities should use mature upstream sources where possible. Keep default output small; heavier rewrite packs should remain metadata or be documented for separate import.
- Broad Stash/Surge URL rewrite rules that redirect whole URLs should not be emitted by default; they can drop path or query state. Prefer metadata-only or a path-preserving private implementation.
- After policy output changes, run `node --test`, `node --check` on touched policy files and generated JS, `git diff --check`, and scan added lines for secrets or private subscription material before committing.
