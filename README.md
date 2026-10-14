# Ordering Marketplace App

Copy this single prompt into your coding assistant from the cloned repository:

```text
Set up this Ordering Marketplace app using setup.md. Detect my project or ask for its slug. Configure it safely, install the pinned dependencies and open a simulator. Use the local preview when Firebase files are missing. Verify the displayed project and one visible edit with Fast Refresh.
```

Customers can browse businesses, use the catalog and checkout, track orders and manage their consumer account. React Native 0.81.1, React 19.1 and TypeScript; native Android/iOS source is included.

## Start with your project

1. Clone the public app with its pinned SDK:

   ```sh
   git clone --recurse-submodules https://github.com/Ordering-co/ordering-app-marketplace.git
   cd ordering-app-marketplace
   yarn install --frozen-lockfile
   ```

2. Inspect an existing connection, then configure your explicitly chosen project:

   ```sh
   node scripts/onboarding/cli.mjs detect
   node scripts/onboarding/cli.mjs configure --project YOUR_PROJECT_SLUG
   node scripts/onboarding/cli.mjs doctor
   ```

   Detection does not log you into the consumer app. If no connection is available, enter your own project slug manually; public validation confirms the destination, not ownership or authentication.

3. Follow [setup.md](setup.md) for your platform, an explicit iOS simulator preview without Firebase or your own native service registrations, native launch, the first visible edit and troubleshooting. A Metro process alone is not a running mobile app.

Use Node 22 LTS (minimum 20.19.4), Yarn Classic 1.22, JDK 17 for Android, or macOS/Xcode 16.1+ for iOS. The pinned Ruby, Bundler and CocoaPods requirements are in the runbook. Do not remove lockfiles to bypass an installation failure.

## Checks and source

```sh
node --test scripts/onboarding/*.test.mjs
yarn test:onboarding
yarn lint:check
yarn exec tsc --noEmit
yarn test:coverage --runInBand --watchman=false
yarn test:coverage:summary --no-run
yarn i18n:verify
yarn i18n:check-generated
```

The SDK is the gitlink at `src/@/components`, fetched from `https://github.com/Finitless-com/ordering-components.git`. If needed, run `git submodule update --init --recursive`; keep the recorded revision. The app UI lives in `src/ui`; screen wiring lives in `src/pages` and `src/navigators`. Translation maintenance is in [i18n/README.md](i18n/README.md). Tests and JS bundling do not verify native providers, payments, or real orders. The latest local evidence is in [docs/onboarding-verification.md](docs/onboarding-verification.md).

## License

This code is distributed under [license-ordering.txt](license-ordering.txt). The SDK, dependencies and third-party assets retain their own licenses and notices.
