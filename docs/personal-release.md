# Personal edition distribution

This edition derives from RSSNext/Folo `desktop/v1.15.0`, commit `b7b6e3a`. The personal AI changes began on 2026-10-07. It is an unofficial macOS build maintained separately from the upstream hosted service.

## License and provenance

- Retain the root `LICENSE`, upstream copyright notices, and component licenses. The application as a whole is distributed under AGPL-3.0; do not replace it with a permissive license.
- The upstream license explicitly excludes redistribution of `icons/mgc`. This includes artwork copied into generated React Native components, CSS, and application archives.
- The personal distribution uses separately licensed open MingCute artwork and includes its attribution. Class names retained for source compatibility do not imply reuse of the restricted artwork.
- Publish a clean source snapshot without the old Git history: the old history contains restricted artwork even after a deletion commit. Keep the original development checkout locally for upstream comparisons. Record its final source commit in the publication commit message.
- Distribute binaries only alongside their corresponding, buildable source and the applicable notices. Do not reuse the old application ZIP built with restricted icons.

## Release checks

1. Run the repository quality checks in order: typecheck, lint, tests. Rebuild generated icons and verify every used icon resolves.
2. Build and install the macOS application. Check single-article translation, feed and timeline questions, actual discovery recommendations, cancellation, errors, and restored local conversations.
3. Inspect the source snapshot and archive for credentials, account data, local gateway settings, caches, original restricted artwork, and generated copies. Include only source and required build inputs. Never copy the app profile, keychain items, or CLI configuration.
4. Initialize a new Git repository from the sanitized source snapshot. Its `origin` must be the personal repository, not RSSNext/Folo. Do not copy the development checkout's `.git` directory or push its old refs.
5. Keep upstream deployment workflows disabled in the personal GitHub repository until they are separately adapted and verified. A source push must not deploy upstream sites, publish OTA files, or release official packages.
6. Push only after the tested source is committed. Read back the remote commit and repository visibility to confirm the destination and final state.

## Build and rollback

Use the commands in `PERSONAL.md`. Retain the previous personal application bundle locally before replacing it. Do not delete or migrate the user data directory when replacing or rolling back the app. Ad-hoc builds can require renewed macOS Keychain authorization after an update; this authorization is performed by the user in the system dialog.

The initial GitHub publication is source only. Creating a hosted release, an automatic updater, or an Apple-notarized distribution is a separate release action.
