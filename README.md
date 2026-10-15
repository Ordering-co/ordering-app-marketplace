# Ordering Marketplace App

Copy this single prompt into your coding assistant:

```text
Get https://github.com/Ordering-co/ordering-app-marketplace.git, preserving any existing checkout. Read setup.md and set up my project. Detect its connection or ask for its slug. Install the pinned dependencies and open the app; use the explicit local preview if Firebase files are missing. Verify the displayed project and one visible edit with Fast Refresh.
```

## Your three steps

1. Paste the prompt above; your assistant follows [setup.md](setup.md).
2. Confirm your Ordering project. Sign in to the developer connection only if needed; consumer login in the app is separate.
3. Check the destination label in the local preview, then observe one visible edit through Fast Refresh.

## Manual alternative

The local preview selects the newest available compatible iOS runtime from the selected Xcode before considering a saved simulator. Use `--runtime 26.0` or its full installed runtime identifier only when you deliberately need that runtime; an invalid/incompatible selection fails without fallback. Existing simulators and ownership history are preserved. See [setup.md](setup.md#local-ios-simulator-preview-without-firebase) for details.

Follow [setup.md](setup.md) for the pinned toolchains, native setup, the explicit local simulator preview without Firebase and troubleshooting. `configure` deliberately activates development onboarding with the source boolean `localProjectConfigured: true`; a historical project alone does not activate validation or session migration. Normal legacy development and Release keep their original selectors, flags and sessions.

Customer mobile app: businesses, catalog, cart, checkout and order tracking.

A bare React Native project for Android and iOS. React Native 0.81.1, React 19.1.0 and TypeScript.

## Requirements

- Node.js 22 LTS (React Native requires Node >=20.19.4) and Yarn Classic 1.22.
- Android: JDK 17, Android Studio, and the SDK and NDK versions specified in `android/build.gradle`.
- iOS: macOS, Xcode compatible with React Native 0.81, Ruby as specified in `.ruby-version`, Bundler and CocoaPods as specified in `Gemfile.lock`. [React Native 0.81 requires Xcode 16.1 or later](https://reactnative.dev/blog/2025/08/12/react-native-0.81).
- An Ordering project with API and sockets enabled to test real workflows.

## Get the source

```sh
git clone --recurse-submodules https://github.com/Ordering-co/ordering-app-marketplace.git
cd ordering-app-marketplace
yarn install --frozen-lockfile
```

The SDK is a submodule from `https://github.com/Finitless-com/ordering-components.git`. If you cloned without submodules, run `git submodule update --init --recursive`. Keep the revision pinned by the repository's gitlink.

## Configure your application

Choose your public destination explicitly:

```sh
node scripts/onboarding/cli.mjs detect
node scripts/onboarding/cli.mjs configure --project YOUR_PROJECT_SLUG
node scripts/onboarding/cli.mjs doctor
```

Detection is separate from consumer login. Public validation confirms the destination, not project ownership or app authentication. If no developer connection is available, provide the exact project code manually. Manual edits must deliberately include `localProjectConfigured: true` as described in [setup.md](setup.md#explicit-development-opt-in).

Edit `src/config.json` and replace `YOUR_PROJECT` with your project. Review `api`, `socket`, language, app name and product settings. Public identifiers and product options are defined in the source. `src/theme.json` contains the theme and visual assets.

`builder.json`, `app.json`, Android/iOS projects and schemes must match your application identifiers. Set up your own bundle identifier, Apple team, provisioning profiles and signing in Xcode. Configure your own Android release signing; `android/app/debug.keystore` is the public debug template and must not be used to publish a production application.

Add your own Firebase registrations at `android/app/google-services.json` and `ios/GoogleService-Info.plist`, and ensure the plist belongs to the `ReactNativeAppsTemplate5` target. These service files are required for native builds using Firebase. Replace native Maps placeholders and configure the integrations you enable with your own service settings. Keep private credentials, provisioning profiles and production keystores out of the repository.

Checkout, payments, analytics and tracking depend on your project configuration and enabled services. Configure your own Apple Pay, Facebook, Forter and Intercom identifiers when using those integrations.

## Run

```sh
yarn start
# In another terminal:
yarn android
```

For iOS, install Ruby dependencies and pods first:

```sh
bundle _2.7.1_ install
cd ios
bundle _2.7.1_ exec pod install --deployment
cd ..
yarn ios
```

Running on a device requires your own permissions and services. Metro serves JavaScript; it does not by itself produce APK/IPA files or verify login, orders, payments, location or notifications.

## Validate

```sh
node --test scripts/onboarding/*.test.mjs
yarn test:onboarding
yarn lint:check
yarn exec tsc --noEmit
yarn test --runInBand
yarn test:coverage --runInBand
yarn test:coverage:summary --no-run
yarn i18n:verify
yarn i18n:check-generated
```

`yarn lint` applies changes; use `lint:check` for review. Coverage measures the paths listed in `jest/coverage-include.js`; CI requires a 70% average across statements, branches, functions and its line-count fallback. Mocks do not replace device testing against your backend.

## Translations

`i18n/translations.json` is the locale catalog. Run `yarn i18n:generate` to regenerate derived files and see `i18n/README.md`. English fallback values provide visible text where a translation is still missing; review translations before distributing your app in those languages.

## License

This code is distributed under the terms in [license-ordering.txt](license-ordering.txt). Dependencies, the SDK and third-party assets retain their own licenses and notices.
