# Run your Ordering Marketplace app

This runbook takes a fresh public clone to a configured consumer app and a visible edit. Work against your own development project. Setup reads public project data; it does not create accounts, publish an app or change backend data.

## 1. Check the actual toolchain

React Native 0.81 requires **Node >=20.19.4** and **Xcode >=16.1** ([release requirements](https://reactnative.dev/blog/2025/08/12/react-native-0.81)). Prefer Node 22 LTS and Yarn Classic 1.22. Select a compatible Node version for this shell; do not change other projects' global runtime. Use [React Native 0.81 environment setup](https://reactnative.dev/docs/0.81/set-up-your-environment) for installation details.

```sh
node --version
yarn --version
```

For Android, use JDK 17 and Android Studio. This checkout specifies Android SDK/compile target **36**, Build Tools **36.0.0**, NDK **27.1.12297006**, and minimum Android SDK 24 in `android/build.gradle`. Install those versions and set `JAVA_HOME` to JDK 17 and `ANDROID_HOME` to your local SDK directory. Add its `platform-tools` and `emulator` directories to your shell PATH. Configure a running emulator or USB device.

```sh
java -version
adb devices
```

For iOS, use macOS, the selected Xcode installation and an available iOS simulator. Use **Ruby 3.3.10** from `.ruby-version`, **Bundler 2.7.1** and **CocoaPods 1.16.2** recorded in `Gemfile.lock`; use a project-local Ruby manager/runtime if your global Ruby differs. `pod --version` alone may describe an unrelated global installation. `bundle exec pod --version` is the relevant check. Keep `Gemfile`, `Gemfile.lock`, `ios/Podfile` and `ios/Podfile.lock` intact.

```sh
xcodebuild -version
xcrun simctl list devices available
ruby --version
bundle _2.7.1_ --version
```

## 2. Clone and install the pinned source

```sh
git clone --recurse-submodules https://github.com/Ordering-co/ordering-app-marketplace.git
cd ordering-app-marketplace
yarn install --frozen-lockfile
```

The SDK is public and pinned by the gitlink. For a non-recursive clone, run `git submodule update --init --recursive`. Do not independently update it to another revision. `yarn install` executes the existing patch-package postinstall; keep those patches. Use `HUSKY=0` for a CI installation if needed.

## 3. Detect a connection and choose the destination

```sh
node scripts/onboarding/cli.mjs detect
```

`detect` looks for an existing local Ordering MCP launcher. `detect --helper /absolute/path/to/ordering-dev-quickstart/ordering` uses the `ordering` launcher from a trusted existing Quickstart checkout with its `.clients/runtime-ready` marker; do not manufacture that marker to bypass setup. A `connected` result returns only a public project identity; credentials stay with that connection. `none` or `unavailable` means no usable existing connection was found. It does not mean the app cannot be configured: ask your project owner for its exact project code, and use the manual command below. Do not paste an administrator API key, MCP token or password into `src/config.json`.


```sh
node scripts/onboarding/cli.mjs configure --project YOUR_PROJECT_SLUG
node scripts/onboarding/cli.mjs doctor
```

The helper validates `GET /API_VERSION/LANGUAGE/PROJECT/current` without authentication and requires `result.code` to equal your selected project.  A successful public response proves the API destination exists; it does not prove project ownership, a working login, or permission to place orders. Use the connected assistant's read-only project checks when available. Without a connection, this remains the public/manual route.

Optional public API overrides:

```sh
node scripts/onboarding/cli.mjs configure --project YOUR_PROJECT_SLUG --api-url https://YOUR_API_ORIGIN --api-version v400 --language en
```

Only the supported fields are changed:

| Field | Purpose |
| --- | --- |
| `project` | Exact public project code |
| `api.url` | HTTPS API origin; existing default is preserved unless supplied |
| `api.version` | API version, for example `v400` |
| `api.language` | API language, for example `en` |


Every other field in `src/config.json` stays intact, including app/bundle IDs, `socket.url`, merchant ID, `businessSlug`, feature flags and root-point source settings. Configured development builds pin this project and disable the legacy root-point selector during onboarding. Release preserves the source root-point flag and existing project/session behavior. `src/config.js` derives runtime settings without rewriting the JSON.

### Manual configuration and recovery

If using a plain editor, set only the fields above and then run `doctor`. Before editing, keep a private copy of your full configuration under the ignored `.ordering-setup/` directory. Prefer `configure`: it validates before changing anything, writes atomically, creates a private local backup, preserves unknown configuration, and refuses a destination change without `--confirm-project-change`.

The CLI prints the backup filename after a successful change. To undo that change, pass that exact filename:

```sh
node scripts/onboarding/cli.mjs restore --backup BACKUP_FILENAME_FROM_CONFIGURE
node scripts/onboarding/cli.mjs doctor
```

Backups belong to this checkout and may contain your existing private configuration. Do not commit, upload or paste them into diagnostics. Restore may intentionally return you to the original placeholder; `doctor` then reports that setup is still required. Do not delete `yarn.lock`, `Gemfile.lock` or `Podfile.lock` as a repair strategy.

## 4. Configure your own native services

The current native projects include Firebase and call its initialization during launch. **Normal native launches require your own Firebase app registrations**: supply `android/app/google-services.json` and `ios/GoogleService-Info.plist`. Include the iOS plist in the **ReactNativeAppsTemplate5** target and verify the resource path in Xcode. Match the native bundle/package IDs declared by `builder.json`, `app.json`, Android and Xcode. A project slug or `firebase.json` is not a Firebase registration. Do not use another customer's files or fabricate a plist just to turn a build green.

Set your own restricted Maps keys in the Android manifest and iOS AppDelegate when using Maps. Use your own OneSignal app, app group and push entitlements; keep the notification extension and app target aligned. Apple device/release builds require your own team and signing profiles. Android release builds require your own signing keystore; the included standard `debug.keystore` is for local debug builds only.

Facebook, Google sign-in, Intercom, Segment, Stripe/Apple Pay and Forter depend on the features enabled in your project. Configure your own public app registrations and restricted native service keys for those features; do not claim them tested just because the catalog loads. Existing placeholder guards stay in place. Keep private credentials, provisioning material and production keystores out of Git. The service registration paths and private signing formats are ignored.

## Local iOS simulator preview without Firebase

If you do not have Firebase registrations yet, you can explicitly preview the app using your public Ordering project. This path needs the same Node/Yarn/Xcode/Ruby/pods toolchain above, but it does not register a Firebase app or invent service configuration.

With the pinned Ruby selected and `BUNDLE_PATH` pointing to your repository-local gems, run:

```sh
yarn ordering:ios-local --without-firebase --project YOUR_PROJECT_SLUG
```

The adapter validates that public project in a private temporary configuration, preserving your actual `src/config.json`. It generates an ignored native project/workspace beside the original iOS project, omitting only the Firebase plist resource and Firebase Crashlytics upload phase from that generated copy. It builds Debug for a dedicated simulator owned by this checkout and starts a separate Metro port; it preserves native identifiers, schemes and all dependency pins.

`--api-url`, `--api-version` and `--language` supply the same public overrides as configure. `--franchise-slug` is required for Franchise. When your source already has another project, add `--confirm-project-change` deliberately; the adapter never supplies that confirmation automatically. `--port` selects a free Metro port, and `--derived-data` can point to a build cache that belongs to this checkout. `--prepare-only` validates and generates the local workspace without creating a simulator or starting Metro.

Runtime selection happens before owned-device reuse. The adapter queries the selected Xcode through `xcrun --find simctl` and `simctl list runtimes/devicetypes/devices --json`. It orders available iOS runtime versions numerically, newest first, requires host architecture support and checks each iPhone type against the runtime's `supportedDeviceTypes` and type minimum/maximum runtime metadata. Older metadata without a whitelist must provide compatible type bounds; missing compatibility is not guessed. An older saved simulator never overrides this policy.

Choose an installed runtime explicitly only when needed for reproduction:

```sh
yarn ordering:ios-local --without-firebase --project YOUR_PROJECT_SLUG --runtime 26.0
# Equivalent exact identifier:
yarn ordering:ios-local --without-firebase --project YOUR_PROJECT_SLUG --runtime com.apple.CoreSimulator.SimRuntime.iOS-26-0
```

An unavailable, ambiguous or incompatible explicit runtime fails without fallback or download. A saved UDID is reused only within the selected runtime when checkout/name, actual device name, availability and compatible type all match. Otherwise the adapter creates another owned simulator, preserving the previous device without shutdown, erase or deletion. Its exact ownership bytes are archived under `.ordering-setup/ios-local/simulator-history/`, with a warning. The current record includes runtime, device type and selected Xcode metadata. Runtime selection is separate from proving app startup, crash recovery or full app compatibility; inspect the real native screen and its diagnostics. Do not hide crashes by suppressing CrashReporter or restarting unrelated devices.

The native opt-in is compiled only for Debug + iOS Simulator. Release and ordinary native launches ignore it and retain the normal Firebase setup. JavaScript verifies the native marker and development platform before accepting only the selected public fields. The local session identity differs from the normal app, so it cannot adopt a remembered consumer token. Firebase messaging, notification registration, automatic tracking/analytics and optional native provider initialization are skipped in this mode. Maps, location, payments, notifications and production integration behavior are not part of this preview; use your own registrations for those features.

Logs and owned simulator/Metro records are in the private `.ordering-setup/ios-local/` directory. Repeating the adapter reuses a live Metro process only after matching its root, PID, command and port; it refuses to overwrite an unrelated live process record. A host with simulator runtimes but no Simulator GUI may run and capture the app headlessly; inspect an actual screenshot or device snapshot before claiming the UI appeared. Do not treat `simctl launch` or Metro status alone as that verification. The source JSON, normal iOS project and release path remain intact.

## 5. Build and open the native app

For iOS, with the pinned Ruby selected:

```sh
export BUNDLE_PATH="$PWD/vendor/bundle"
export BUNDLE_FROZEN=true
bundle _2.7.1_ install
cd ios
bundle _2.7.1_ exec pod install --deployment
cd ..
bundle _2.7.1_ exec pod --version
```

If CocoaPods reports incompatible locked dependencies, inspect that exact conflict. Do not run `pod update` or remove locks to conceal it. In one terminal run `yarn start`; in another run:

```sh
yarn ios --simulator "YOUR_AVAILABLE_SIMULATOR_NAME"
```

The workspace/target is `ios/ReactNativeAppsTemplate5.xcworkspace` / `ReactNativeAppsTemplate5`. Open the workspace, rather than the `.xcodeproj`, when inspecting signing or build diagnostics in Xcode. The existing UIScene support is part of this project; onboarding does not replace it.

For Android, with JDK/SDK and an emulator or device ready, start Metro and use:

```sh
yarn android
# A build-only check, without claiming the emulator launched:
cd android
./gradlew :app:assembleDebug
cd ..
```

Native success means the APK/app was built and installed and an actual simulator/emulator/device displays the app. A successful Metro bundle, API doctor, Jest test or running server proves only that specific step. Do not stop someone else's Metro process. Use a free port with the CLI's `--port` option consistently for Metro and the native launch when another checkout is running.

In a configured development build or explicit local preview, `ProjectSetupGate` repeats public destination checks before the Ordering providers mount. Non-development/Release builds bypass this new gate before any public request or storage migration. Placeholder, mismatched project, unavailable franchise or network failure displays a clear setup screen with retry. No SDK session hydrates while that gate is closed.

## 6. Make one visible edit with Fast Refresh

With the app open in development mode and Metro serving this checkout, enable Fast Refresh from the developer menu. Temporarily add a small `Text` element in `App.tsx`, above `ProjectSetupGate`, with the text **“My first Ordering edit”**; import `Text` from `react-native`. Save and verify the exact words appear on the device without rebuilding native code. Then remove that temporary element and verify it disappears. In the local preview, you can instead temporarily change “Local simulator” in `src/onboarding/local-project-banner.tsx`, verify the changed words and project/slug, then restore them. On the setup error screen, edit `setupTitle` in `src/project-setup-gate.tsx`.

[Fast Refresh behavior](https://reactnative.dev/docs/0.81/fast-refresh) depends on the module being edited; edits to native code or service registrations need a native rebuild. Record a screenshot of the visible edit and its removal if documenting acceptance. This step is not measured until seen on the actual device.

## 7. Verify normal consumer behavior

Confirm `doctor` reports your exact project. Check visible catalog/business branding against that destination. Confirm the app has not silently switched to a demo or a remembered project. Use the in-app login with an ordinary consumer account from that project. The developer/administrator connection is only a setup aid and never becomes the consumer session. Public browsing can work as a guest; that does not prove authenticated checkout.

Test one harmless consumer path appropriate to your development project. Creating orders, taking payments and sending messages are separate actions; use your project's intended test workflow. Do not claim native location, notifications, login or payments verified from mocks.

## Switch project, disconnect and update

To switch destinations deliberately:

```sh
node scripts/onboarding/cli.mjs configure --project ANOTHER_PROJECT_SLUG --confirm-project-change
node scripts/onboarding/cli.mjs doctor
```

Reload/relaunch after a destination change. Configured development startup compares the API origin, version, project with its local identity. It retires only known SDK session/tenant cache keys before mounting; credentials are discarded, unrelated preferences remain, and non-authenticated tenant state is archived locally in AsyncStorage under `ordering-onboarding-archive-v1:*`. Returning to a previous destination requires a fresh ordinary consumer login. A legacy `project_name` value cannot override the configured tenant. This local archive is not a config backup or a credential export.

To disconnect the consumer session, use the app's logout action. To disconnect the developer connection, use the connection manager where you created it; the CLI does not revoke backend credentials. To remove the local project choice, restore the pre-configuration backup and relaunch. Restoring the source opt-in returns to the previous startup behavior; doctor may report an unconfigured project.

To update source, review upstream changes in your fork/branch, update the pinned submodule only as part of a deliberate repository update, rerun `yarn install --frozen-lockfile`, locked pod install and local checks, then rebuild native code. Keep local configuration backups private and reconcile public settings rather than replacing your whole file with the template.

## Troubleshooting and a diagnosis prompt

| Symptom | Check |
| --- | --- |
| `detect` says unavailable | Existing Ordering connection/launcher; fall back to your exact manual project code |
| Public project mismatch or HTTP failure | Project spelling, API origin, version, language and network; no admin token is required for this check |
| Franchise required/unavailable | This product does not require or auto-select a franchise |
| Old user or cart after a project switch | Fully relaunch; inspect tenant marker and the known-key migration; never reuse an administrator token |
| Node engine error | Actual Node must be >=20.19.4; use Node 22 in this shell |
| No Java / SDK / device | `java -version`, JDK17 `JAVA_HOME`, `ANDROID_HOME`, exact SDK versions and `adb devices` |
| CocoaPods fails | Selected Ruby/Bundler and `bundle exec pod --version`; preserve the lock and report the first underlying error |
| Missing Firebase plist/JSON or default app | Own service registrations, native target membership/path; project configuration cannot replace these |
| App installed but blank, map/login/push unavailable | Capture native launch logs, JS logs and optional integration settings separately |
| Text edit does not appear | Verify this checkout's Metro root/port and Fast Refresh. After an SDK/source update, restart only your verified Metro with `--reset-cache` on its existing port, reload once to establish a baseline, then make a new edit and observe it without another reload. Never reset global Watchman or stop another checkout's server; native edits need rebuilding |

Give your assistant this diagnosis prompt:

```text
Diagnose this app using setup.md and the current checkout. Run onboarding doctor; show only its public summary, not configuration backups or credentials. Check actual Node/Yarn, JDK/Android SDK or Xcode/Ruby/Bundler/CocoaPods and available devices. Reproduce the failing install/build/launch once and capture its first real error. Separate a public project check, JS bundle, native build, simulator launch and visible Fast Refresh; never claim the later steps from the earlier ones. Preserve locks, native IDs, SDK gitlink, services and my existing public settings. Do not use an administrator session as consumer login or deploy anything.
```

## Explicit development opt-in

A historical `project` in the source configuration does not enable onboarding. Existing development and Release runs keep their original project selector, session and flags, and perform no new setup validation or storage migration. `configure` enables the development workflow with the source boolean `localProjectConfigured: true`; manual setup must deliberately set that exact boolean along with the public project/API settings (and an explicitly validated franchise for Franchise). The explicit `--without-firebase` simulator launch is its own opt-in and uses only ignored temporary configuration. Release always bypasses this development workflow. Restore the previous backup to undo the source opt-in exactly.
