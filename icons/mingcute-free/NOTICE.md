# Open MingCute icon attribution

This directory contains artwork from the open MingCute Icon collection by **MingCute Design**,
licensed under **Apache License 2.0**. The complete license is included in
[LICENSE-APACHE-2.0](./LICENSE-APACHE-2.0).

- Author and upstream: https://github.com/mingcute-design/mingcute-icons
- Original package attribution URL: https://github.com/Richard9394/MingCute
- Distribution: `@iconify-json/mingcute`, version **1.2.8** (Apache-2.0).
- Source data: the package's `icons.json`.
- Source SHA-256: `062cd8a1d3bf1f60173784352c0b679a2b747945230aa8dac4d59f66f0787ed7`.
- Original license: https://github.com/mingcute-design/mingcute-icons/blob/main/LICENSE

## Changes in Folo Personal

On 2026-10-07, Folo Personal replaced its bundled commercial MGC artwork with this open collection.
`compatibility.json` maps existing CSS identifiers and mobile component names to public MingCute icons.
Only the identifiers are retained; all vector geometry comes from the pinned open package.
SVG wrappers and React Native components are generated locally, and colors inherit the application theme.
No network icon service, MingCute Pro account, or proprietary icon files are needed to build or run.

Most old Cute Regular / Filled names map to the open Line / Fill equivalents.
Special aliases include `folo_bot_original` → `robot-fill`, `moonshotai_original` → `moon-line`,
and the three `power` variants → `flash-fill` / `flash-line`; these are interface substitutes,
not a claim to reproduce the original brand artwork.

Regenerate with `pnpm exec tsx scripts/svg-to-rn.ts`.
Verify SVG provenance with `pnpm exec tsx scripts/update-icon.ts --check`, and verify generated
mobile components with `pnpm exec tsx scripts/svg-to-rn.ts --check`.

The removed `icons/mgc` directory and its commercial artwork are not part of this distribution.
The repository's historical license exception for that directory does not apply to these
independently sourced Apache-2.0 files.
