# Customer Marketplace onboarding verification

Local evidence recorded on 2026-10-14 from the public product worktree at base `79a8fb7`, branch `codex/sergio-137-product-onboarding`. This report records observed checks; it does not certify unmeasured consumer workflows. No deployment, backend write, release signing or administrator app session was performed.

## Implemented

- A single setup prompt at the start of `README.md`, the canonical public clone command and product-specific `setup.md` runbook.
- Shared CLI v1 plus the product manifest: public exact-project validation, atomic configuration changes, private ignored backups, explicit switching, doctor and checksum-checked restore.
- Configured development onboarding blocks SDK mounting until public project validation and local tenant migration complete. Its project cannot come from a remembered `project_name`. Credentials from an unmarked or different destination are retired only from known SDK keys; unrelated preferences remain, and recoverable non-authenticated tenant cache is archived only in this app's AsyncStorage.
- In configured development, the selected source project is used without a demo fallback or a remembered root-point selection; Release keeps its original flags and legacy project/session behavior.
- Non-development/Release builds bypass the new validation and migration before any public request or storage read, preserving source flags and legacy numeric franchise IDs. The native Firebase exception remains Debug + Simulator + explicit opt-in only.
- `package.json` enforces Node >=20.19.4. Pods use React Native's existing minimum iOS version instead of the obsolete iOS 12 floor, while preserving higher targets. **Only `PODFILE CHECKSUM` changed in `Podfile.lock`; dependency entries, versions, sources and pins stayed identical.** `yarn.lock`, `Gemfile.lock`, the SDK gitlink, licensing and native identifiers stayed unchanged.

## Checks observed

| Check | Observed result | Evidence |
| --- | --- | --- |
| Yarn install | Passed with Yarn Classic 1.22.22 / Node 22.23.1 and `--frozen-lockfile` | Existing patches applied; lock unchanged |
| Shared CLI and real native manifest tests | 35 passed: 30 common contract + 2 product preservation + 3 local adapter argument tests | `node --test scripts/onboarding/*.test.mjs` |
| Native bootstrap and setup screen tests | 28 passed in 4 suites | `yarn test:onboarding`; provider mount, retry, exact destination, explicit enabled franchise, stale setup cancellation, known-key isolation and unrelated preference preservation |
| Entire existing app suite plus onboarding | 993 passed in 268 suites | `yarn test:coverage --runInBand --watchman=false` |
| Coverage gate | Passed; scoped average 71.12% against 70% | `yarn test:coverage:summary --no-run`; scope remains `jest/coverage-include.js` |
| Lint | Pass: 0 errors; 1,922 existing warnings. | `yarn lint:check` |
| TypeScript | Fails with 346 diagnostics, equal to the original base | `yarn exec tsc --noEmit`; a read-only compiler host using HEAD versions of changed files reproduced exactly 346; 0 diagnostics in new files |
| Translation verification/generated catalogs | Both passed | `yarn i18n:verify`, `yarn i18n:check-generated` |
| Public test project | Exact `current.result.code` confirmed as `orderingv1`, no auth header | Public GET only; the committed JSON remains `YOUR_PROJECT` |
| Public franchise filtering | Exact enabled slug filter confirmed through public GET | `where={conditions:[{attribute:"slug",value:chosen}],conector:"AND"}`; no arbitrary choice persisted |
| Pinned iOS dependencies | Passed: Ruby 3.3.10 / Bundler 2.7.1 / CocoaPods 1.16.2; 159 pods installed | Project-local gems and `bundle _2.7.1_ exec pod install --deployment` |
| Xcode/simulator inventory | Xcode 27.0, available iOS 26.0 and 27.0 simulators confirmed outside the restricted shell | `xcodebuild -version`, `xcrun simctl list devices available` |
| iOS native build with temporary diagnostic target 15.6 | Build attempted; reached missing own `ios/GoogleService-Info.plist` | `xcodebuild ... CODE_SIGNING_ALLOWED=NO IPHONEOS_DEPLOYMENT_TARGET=15.6 build`; no service registration fabricated |
| iOS native build after Podfile correction | Attempted default build without deployment override; obsolete deployment errors resolved, then failed on missing own Firebase plist | Exact final `Build input file cannot be found: ios/GoogleService-Info.plist`; dependency pins unchanged |
| Android native build | Attempted; cannot proceed because this machine has no Java runtime | `./gradlew :app:assembleDebug`; Android SDK is also absent |
| Explicit local Debug simulator build | **Passed** without a fabricated Firebase registration | Generated native workspace omits only the plist resource and Crashlytics upload phase; final Maps guard also compiled successfully |
| Local simulator launch and initial UI | **Passed** in the checkout-owned simulator | Native install/launch, Metro connection, real CoreSimulator screenshot and central agent-device snapshot; Simulator GUI app is absent on this host |
| Visible Fast Refresh edit | **Passed** | Central QA observed “My first local edit · orderingv1” in accessibility and screenshot without reload; original component bytes restored exactly |
| Consumer login, catalog appearance, location, notifications, checkout/payments | **Not measured** | Public reads, mocks and coverage do not prove these workflows |

## Local preview implementation and compatibility

The explicit `ordering:ios-local --without-firebase` adapter validates only public settings in a private temporary config and preserves the source JSON. Its owned simulator and Metro records include root, PID/port and UDID. It reuses a live Metro only after verifying command, working directory and HTTP status; unverified live records are preserved rather than overwritten. Runtime directories are private, generated native projects are ignored, and the normal source project/resources remain intact.

The native marker comes only from an explicit Debug Simulator launch. `RCTSettingsManager` emits a UserDefaults boolean as NSNumber `1` on this runtime; the code accepts only `true` or `1`, never a truthy string, and tests cover that observed behavior. Native Firebase/Maps/Facebook/Intercom initialization, JavaScript Firebase messaging, push token registration, tracking prompts and analytics initialization are guarded in this preview. The selected project and resolved public franchise slug appear only in its local header, including the first Franchise alternative home screen. No consumer credentials were provided or used.

## Native limits and reproduction

The global Ruby 4.0.6/CocoaPods 1.17 installation was incompatible with the project's lock during the first CLI-managed attempt (`kconv` load failure). Verification used an isolated Ruby 3.3.10 runtime and repository-local gems; no dependency upgrade was used to bypass it. The initial Xcode 27 build also rejected dependency privacy bundles with deployment targets 12–13.4. The Podfile correction aligns their minimum with React Native's already-required minimum.

The initial normal native build commands used the available `iPhone 17` simulator; the local adapter created a separate checkout-owned `iPhone 17 Pro` simulator, with a separate derived-data directory and signing disabled. The missing Firebase file is a real prerequisite for normal native launches: the Xcode resources phase references it and `FirebaseApp.configure()` expects it. Android likewise needs its own `google-services.json`, JDK17 and the pinned SDK/NDK setup. Optional provider credentials were not fabricated and another customer's registration was not used.

Public configure/doctor/DEV-bootstrap/restore was also exercised in a temporary copy: exact project `orderingv1`, stale dummy token retired, unrelated preference retained, restore byte-identical and source JSON unchanged.

Full command logs are retained locally in the ignored `.ordering-setup/verification/` directory. They are not committed or uploaded. To reproduce, follow `setup.md`, use the explicit local preview or supply your own native registrations, run the checks above, then open the app and verify the visible edit and normal consumer login on the actual device. The existing Marketplace full CI type check still fails on the recorded base diagnostics; the scoped Franchise onboarding workflow checks the shared contract and runtime gate.

## Visible edit evidence

Both native previews displayed the validated project `orderingv1`; Franchise also displayed its resolved public slug `burger_palace`. Central QA captured each baseline, changed only “Local simulator” to “My first local edit” in `src/onboarding/local-project-banner.tsx`, and observed the new text in the actual app's accessibility tree and screenshot without reloading after that edit. Customer and Franchise source components were restored against their exact saved original bytes after those observations.

For Franchise, the first attempt did not show the newly added banner. That attempt was not counted as a successful refresh. A permitted JS/runtime baseline reload established the current UI and its public project header; the subsequent isolated text edit then produced the observed Fast Refresh result. Hermes `Function.toString()` emits `[bytecode]`, so string comparisons against it were discarded as invalid evidence of old modules.

Consumer login, guest account creation, authenticated orders, messages, payments, push, maps/location, signing and distribution remain unmeasured. No consumer credentials were copied from the administrator connection and no “Continue as Guest” action was used during this proof.

## Coordinated simulator proof

The principal observed the real app and its selected `orderingv1` project on the dedicated iOS Simulator, then changed only the local banner text. [Before](onboarding-evidence/before.png) and [after](onboarding-evidence/after.png) show the visible change through Fast Refresh without a manual reload for that text change. The source was restored exactly before commit. Franchise selection was explicitly `burger_palace`, validated to numeric ID1; no guest/checkout action was used. Firebase, push, maps, tracking and automatic location remain disabled in this explicit local preview. Ordinary consumer authentication and production integrations are not measured.
