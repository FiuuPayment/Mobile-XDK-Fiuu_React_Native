# Merchant Integration Guide

`fiuu-mobile-xdk-reactnative` is the Fiuu payment plugin for React Native. After install, your app can open Fiuu checkout (cards, e-wallets, cash channels), Google Pay (Android), and Apple Pay (iOS) without writing native payment code.

This guide is for **merchant app developers**. A working reference app is in `example/`.

---

## 1. What you get

```
Your React Native app
        │
        ▼
startFiuu(paymentDetails, onSuccess, onError)
        │
   ┌────┴────┐
   ▼         ▼
Android     iOS
native XDK  FiuuXDKSwift
```

| Platform | Native SDK | How it is pulled in |
|---|---|---|
| Android | `Mobile-XDK-Fiuu_Android_Library` 3.34.41 | JitPack (via this plugin) |
| iOS | `FiuuXDKSwift` 1.1.1 | CocoaPods (via this plugin’s podspec) |

JS API is the same on both platforms:

```ts
import payment from 'fiuu-mobile-xdk-reactnative';

payment.startFiuu(paymentDetails, onSuccess, onError);
```

---

## 2. Requirements

Get these from [Fiuu Merchant Portal](https://portal.fiuu.com/) before coding:

- Merchant ID (`mp_merchant_ID`)
- Verification key (`mp_verification_key`)
- Username / password / app name (standard checkout)
- Secret key (server-side checksum only — **never put this in the app**)

| Item | Minimum |
|---|---|
| React Native | 0.76+ |
| Node.js | 22.13+ recommended |
| Android `minSdk` | 26 |
| Android `compileSdk` | **37** |
| iOS deployment target | **16.0** |
| Xcode | 15+ |

---

## 3. Install the plugin

From your React Native app root:

```bash
npm install fiuu-mobile-xdk-reactnative
```

TypeScript types ship with the package. Do **not** add a manual `declare module 'fiuu-mobile-xdk-reactnative'` stub.

Then complete the **Android** and **iOS** native steps below. Both are required for a dual-platform app.

---

## 4. Android setup

### 4.1 Autolinking

React Native 0.76+ autolinks this plugin. After `npm install`, rebuild the Android app:

```bash
npx react-native run-android
```

### 4.2 JitPack repository

The Android payment SDK is hosted on JitPack. Add it to your **host app**.

**React Native 0.76+ (`android/settings.gradle` or `android/build.gradle` repositories):**

```groovy
maven { url 'https://jitpack.io' }
```

Example in `android/build.gradle`:

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}
```

If your project uses `dependencyResolutionManagement` in `settings.gradle`, add JitPack there instead.

### 4.3 SDK versions

In `android/build.gradle` (or `ext` block):

```groovy
minSdkVersion = 26
compileSdkVersion = 37
targetSdkVersion = 36
```

`compileSdk` **37** is required by Fiuu Android Library 3.34.41. A lower value fails Gradle with an AAR metadata error.

### 4.4 Internet permission

Your app `AndroidManifest.xml` must include:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### 4.5 Theme (recommended)

Use a `NoActionBar` theme so the native action bar does not flash when returning from checkout:

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    ...
</style>
```

### 4.6 Rebuild

```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

---

## 5. iOS setup

### 5.1 CocoaPods

```bash
cd ios && pod install && cd ..
```

This pulls **`FiuuXDKSwift` 1.1.1** automatically. You do not add that pod by hand unless you are debugging a link error.

### 5.2 Static frameworks (required for the Swift SDK)

`FiuuXDKSwift` is a Swift xcframework. In `ios/Podfile`, set this **before** `use_react_native!`:

```ruby
platform :ios, '16.0'

ENV['USE_FRAMEWORKS'] ||= 'static'

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  use_frameworks! :linkage => linkage.to_sym
end
```

Then run `pod install` again.

### 5.3 Info.plist

Add these keys to `ios/<AppName>/Info.plist`:

| Key | Example value |
|---|---|
| App Transport Security → Allow Arbitrary Loads | `YES` |
| `NSPhotoLibraryUsageDescription` | `Payment images` |
| `NSPhotoLibraryAddUsageDescription` | `Payment images` |

XML example:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
<key>NSPhotoLibraryUsageDescription</key>
<string>Payment images</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Payment images</string>
```

### 5.4 Apple Pay (only if you use Apple Pay)

1. Enable **Apple Pay** on the app target: Xcode → Signing & Capabilities → + Capability → Apple Pay.
2. Use a Merchant ID from [Apple Developer](https://developer.apple.com/account/) (this is **not** your Fiuu merchant ID).
3. Pass it as `mp_ap_merchant_ID`.
4. Test on a **real device** with Apple Pay set up. Simulator support is limited.

### 5.5 Rebuild

```bash
npx react-native run-ios
```

---

## 6. Start a payment (both platforms)

Always pass **both** callbacks.

```tsx
import payment from 'fiuu-mobile-xdk-reactnative';

function payNow() {
  const paymentDetails = {
    mp_username: 'YOUR_USERNAME',
    mp_password: 'YOUR_PASSWORD',
    mp_merchant_ID: 'YOUR_MERCHANT_ID',
    mp_app_name: 'YOUR_APP_NAME',
    mp_verification_key: 'YOUR_VERIFY_KEY',
    mp_order_ID: String(Date.now()), // unique per attempt
    mp_currency: 'MYR',
    mp_country: 'MY',
    mp_channel: 'multi',
    mp_amount: '1.01', // 2 decimal places, minimum 1.01
    mp_bill_description: 'Order payment',
    mp_bill_name: 'Customer Name',
    mp_bill_email: 'customer@example.com',
    mp_bill_mobile: '0123456789',
    mp_closebutton_display: true,
    mp_extended_vcode: true, // set true if enabled on your Fiuu account
  };

  payment.startFiuu(
    paymentDetails,
    (data) => {
      // Verify the transaction on your backend. Do not log raw payloads in production.
      if (__DEV__) {
        const statCode =
          typeof data === 'object' && data !== null
            ? String(data.StatCode ?? data.status_code ?? '')
            : '';
        console.log('[Fiuu] Payment success callback', {
          payloadType: typeof data,
          statCode: statCode || '(none)',
        });
      }
    },
    (error) => {
      if (__DEV__) {
        const statCode =
          typeof error === 'object' && error !== null
            ? String(error.StatCode ?? error.status_code ?? '')
            : '';
        console.log('[Fiuu] Payment error callback', {
          payloadType: typeof error,
          statCode: statCode || '(none)',
        });
      }
    }
  );
}
```

### Required fields

The plugin rejects the request (and calls `onError`) if these are missing or still placeholders:

| Field | Notes |
|---|---|
| `mp_merchant_ID` | From Fiuu portal |
| `mp_verification_key` | From Fiuu portal |
| `mp_amount` | String, 2 decimals, e.g. `"1.01"` |

Do not ship placeholder values such as `merchantid`, `verificationkey`, or `merchant_id`.

### Recommended fields

| Field | Why |
|---|---|
| `mp_order_ID` | Must be unique for every attempt |
| `mp_currency` / `mp_country` | Usually `MYR` / `MY` |
| `mp_channel` | `'multi'` shows all enabled channels |
| `mp_bill_*` | Pre-fills billing; user is asked if omitted |
| `mp_extended_vcode` | Required if your account uses extended verify |

The full parameter list is in `README.md`.

---

## 7. Environments

Set `mp_core_env` as a **string**.

| Value | Environment | Base URL |
|---|---|---|
| `"1"` | Production V1 | `https://pay.fiuu.com/RMS/API/xdk/` |
| `"2"` | Production V2 (default) | `https://xdk.fiuu.com/` |
| `"3"` | UAT V2 | `https://uat-xdk.fiuu.com/` |
| `"4"` | Sandbox V2 | `https://sandbox-xdk.fiuu.com/` |

Sandbox / UAT credentials only work against the matching environment.

---

## 8. Google Pay (Android only)

Omit `mp_channel`. Use Google Pay sandbox first.

```tsx
if (Platform.OS !== 'android') {
  return;
}

payment.startFiuu(
  {
    mp_sandbox_mode: true,
    mp_merchant_ID: 'YOUR_MERCHANT_ID',
    mp_verification_key: 'YOUR_VERIFY_KEY',
    mp_order_ID: String(Date.now()),
    mp_currency: 'MYR',
    mp_country: 'MY',
    mp_amount: '1.01',
    mp_bill_description: 'Google Pay',
    mp_bill_name: 'Customer',
    mp_bill_email: 'customer@example.com',
    mp_bill_mobile: '0123456789',
    mp_gpay_channel: ['SHOPEEPAY', 'TNG-EWALLET', 'CC'],
    mp_extended_vcode: true,
  },
  onSuccess,
  onError
);
```

Before production Google Pay:

1. Request production access from [Google Pay](https://developers.google.com/pay/api/android/guides/test-and-deploy/request-prod-access) (Gateway integration).
2. Register your **applicationId + signing certificate SHA-1** with Google Pay / Fiuu.
3. Set `mp_sandbox_mode: false` and use production credentials.
4. Test from a **signed release** build. Debug SHA-1 often fails with signing-key mismatch until it is registered.

---

## 9. Apple Pay (iOS only)

```tsx
if (Platform.OS !== 'ios') {
  return;
}

payment.startFiuu(
  {
    mp_express_mode: true,
    mp_allowed_channels: ['ApplePay'],
    mp_channel: 'ApplePay',
    mp_merchant_ID: 'YOUR_MERCHANT_ID',
    mp_verification_key: 'YOUR_VERIFY_KEY',
    mp_ap_merchant_ID: 'merchant.com.your.applepay.id',
    mp_order_ID: String(Date.now()),
    mp_currency: 'MYR',
    mp_country: 'MY',
    mp_amount: '1.01',
    mp_bill_description: 'Apple Pay',
    mp_bill_name: 'Customer',
    mp_bill_email: 'customer@example.com',
    mp_bill_mobile: '0123456789',
    mp_extended_vcode: true,
  },
  onSuccess,
  onError
);
```

`mp_ap_merchant_ID` is the Apple Pay merchant identifier, not the Fiuu merchant ID.

---

## 10. Handle results

Callbacks receive a **plain JavaScript object** (not a JSON string), except setup errors which are strings.

| Callback | When | Payload |
|---|---|---|
| `onSuccess` | `StatCode` is `"00"` | Object |
| `onError` | `StatCode` is `"22"` (pending) | Object (raw backend JSON) |
| `onError` | `StatCode` is `"11"` or other failure | Object (`ErrorCode`, `ErrorDesc`) |
| `onError` | Missing fields, module not linked, no Activity/window | String |

`StatCode`:

| Code | Meaning | Callback |
|---|---|---|
| `"00"` | Success / captured | `onSuccess` |
| `"22"` | Pending (typical for cash channels) | `onError` (object payload) |
| `"11"` | Failed or canceled | `onError` |

Example:

```ts
function onSuccess(data: unknown) {
  if (typeof data === 'object' && data && 'StatCode' in data) {
    const result = data as { StatCode?: string; TranID?: string };
    if (result.StatCode === '00') {
      // show success — then verify on your server
    }
  }
}

function onError(error: unknown) {
  if (typeof error === 'string') {
    // integration / validation problem
    return;
  }
  if (typeof error === 'object' && error && 'StatCode' in error) {
    const result = error as { StatCode?: string; TranID?: string };
    if (result.StatCode === '22') {
      // pending — show cash instructions if needed; do not fulfill yet
      return;
    }
  }
  if (typeof error === 'object' && error && 'ErrorDesc' in error) {
    // backend failure — read ErrorCode / ErrorDesc
  }
}
```

**Do not settle an order from the client callback alone.** Verify on your backend.

### Checksum (server-side)

Using your **secret key** (portal only):

```
VrfKey = md5(Amount + secret_key + Domain + TranID + StatCode)
```

Private-secret-key formula (if you use that account setting):

```
chksum = MD5(mp_merchant_ID + msgType + txn_ID + amount + status_code + merchant_private_secret_key)
```

If you use the private secret key, ignore `mp_secured_verified` from the XDK and validate on your server.

---

## 11. Cash channels (7-Eleven and similar)

1. Customer starts a cash payment. XDK stays on the **Payment instruction** screen. Result `StatCode` is `"22"` (pending).
2. Customer taps Close.
3. To show the same instruction later, call `startFiuu` again with the original payment details **plus** `mp_transaction_id` set to the `TranID` from step 1.
4. After the customer pays at the counter, they can close the XDK again. Confirm the paid status from your server.

---

## 12. Checklist

**Both platforms**

- [ ] `npm install fiuu-mobile-xdk-reactnative`
- [ ] Real sandbox credentials (not placeholders)
- [ ] Unique `mp_order_ID` per tap
- [ ] Amount as `"1.01"` (two decimals)
- [ ] Both success and error callbacks
- [ ] Server-side checksum / status check before fulfilling the order

**Android**

- [ ] JitPack repository
- [ ] `minSdk` 26, `compileSdk` 37
- [ ] `INTERNET` permission
- [ ] App rebuilt after install
- [ ] Google Pay: SHA-1 registered (production)

**iOS**

- [ ] `platform :ios, '16.0'`
- [ ] `ENV['USE_FRAMEWORKS'] = 'static'`
- [ ] `pod install`
- [ ] Info.plist ATS + photo library keys
- [ ] Apple Pay capability + `mp_ap_merchant_ID` (if used)
- [ ] Test Apple Pay on a device

---

## 13. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `FiuuPayment native module not found` | Native module not linked / app not rebuilt | Rebuild Android; on iOS run `pod install` then rebuild |
| `Missing or invalid required payment field(s)` | Empty or placeholder credentials | Use portal sandbox/production values |
| Gradle `minCompileSdk` / AAR metadata error | `compileSdk` below 37 | Set `compileSdkVersion` to 37 |
| Could not resolve `Mobile-XDK-Fiuu_Android_Library` | JitPack missing | Add `maven { url 'https://jitpack.io' }` |
| iOS Swift / xcframework link error | Dynamic frameworks | `ENV['USE_FRAMEWORKS'] = 'static'` then `pod install` |
| Google Pay signing-key / fingerprint error | Debug SHA-1 not registered | Register SHA-1 or test a signed release |
| Apple Pay does nothing / fails on simulator | Capability or merchant ID | Enable Apple Pay, set `mp_ap_merchant_ID`, use a device |
| Error `P03` | Bad payment payload | Fill required fields; set `mp_extended_vcode: true` if your account needs it |

---

## 14. Support

- Technical: [support-sa@fiuu.com](mailto:support-sa@fiuu.com)
- Merchant support: [support@fiuu.com](mailto:support@fiuu.com)
- Portal: [https://portal.fiuu.com/](https://portal.fiuu.com/)

Full parameter reference: `README.md`  
Sample app: `example/App.tsx`
