# Fiuu React Native example

Demo app for [fiuu-mobile-xdk-reactnative](https://www.npmjs.com/package/fiuu-mobile-xdk-reactnative). It installs the published npm package. This repository does not contain the XDK library source.

Fill in your own merchant credentials in `App.tsx` before running a payment. Placeholder values show a validation error instead of charging.

## Requirements

- Node.js 22.13 or later
- React Native 0.87 toolchain (Android Studio / Xcode)
- `fiuu-mobile-xdk-reactnative` **1.0.26** or later from npm
- iOS 16+, Xcode 15+
- Android min SDK 26

## Install

```sh
cd FiuuReactExampleProject
npm install
```

### iOS

```sh
bundle install
bundle exec pod install --project-directory=ios
npm run ios
```

### Android

```sh
npm run android
```

## Merchant setup

Replace the placeholders in `App.tsx`:

- `mp_merchant_ID`
- `mp_verification_key`
- (standard checkout) `mp_username`, `mp_password`, `mp_app_name`

Use a unique `mp_order_ID` for every attempt. The demo already generates one.

### Google Pay (Android)

Google Pay production matches **applicationId + signing-certificate SHA-1**. This demo uses `com.fiuu.xdkandroid` as a sample. Use your own application ID and register its SHA-1 in the Fiuu merchant portal / Google Pay console.

To sign with your release keystore, copy `android/key.properties.example` to `android/key.properties` and fill in the values. Do not commit `key.properties` or `.jks` files.

### Apple Pay (iOS)

This demo uses bundle ID `com.example.pocXdk` and merchant ID `merchant.com.example.pocXdk` as a sample. Use your own:

1. Bundle identifier in Xcode
2. Apple Pay merchant ID in the Apple Developer portal
3. `ios/example/example.entitlements` (`com.apple.developer.in-app-payments`)
4. `mp_ap_merchant_ID` in `App.tsx`

Set your Apple Development Team in Xcode signing settings.

## Learn more

- Merchant guide: [../MERCHANT_GUIDE.md](../MERCHANT_GUIDE.md)
- Parameter reference: [../README.md](../README.md)
- Wiki: https://github.com/FiuuPayment/Mobile-XDK-Fiuu_React_Native/wiki/Installation-Guide
