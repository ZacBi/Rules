## Learned User Preferences

- For blackmatrix7 `ios_rule_script` URLs and paths, rely on naming conventions; avoid fetching or reading whole rule files when the path or filename is enough to proceed.
- Prefer remote rule-provider URLs over adding in-repo ruleset copies when a suitable upstream ruleset already exists.
- README and other public-facing docs should stay professional: avoid coarse wording and avoid embedding full personal verification or self-check runbooks.
- Do not commit personal identifiers, local machine paths, or private subscription material; this repository is public.

## Learned Workspace Facts

- After editing `shared/rulesets.js`, `shared/groups.js`, or related `shared/` sources, run `node scripts/build.js` to regenerate outputs such as `mihomo/overwrite.js`; generated files are not the canonical source of truth.
- Surge `policy-path` must reference a Surge-compatible policy list; raw Clash or YAML subscription bodies are not valid without conversion (for example via this repo’s scripts).
- Prefer blackmatrix7 `ios_rule_script` rule sets where they cover the traffic, rather than maintaining large parallel hand-written rule lists.
- Artifacts produced by `node scripts/build.js` may be gitignored rather than committed; `shared/` and `scripts/` remain canonical.
