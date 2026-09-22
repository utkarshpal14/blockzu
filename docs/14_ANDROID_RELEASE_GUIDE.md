# BLOCKZU
## Document 14 — Android APK & AAB Packaging Guide
### Version 1.0.0

This guide provides step-by-step instructions for building both a direct-testing **Debug APK** (`app-debug.apk`) and a signed production **Android App Bundle** (`app-release.aab`) for Google Play Store submission.

---

# Method 1: Capacitor Android Build (Recommended)

### Step 1: Install Capacitor Dependencies
Run in project root:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Blockzu" "com.priorapp.blockzu" --web-dir "dist"
```

### Step 2: Build Web Production Assets
```bash
npm run build
```

### Step 3: Add Android Platform & Sync
```bash
npx cap add android
npx cap sync android
```

### Step 4: Generate Debug APK (Direct Phone Installation)
To test directly on your physical Android device:
```bash
npx cap open android
```
Inside **Android Studio**:
1. Select menu: **Build** $\rightarrow$ **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**.
2. Once complete, locate `app-debug.apk` in:
   ```text
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Transfer `app-debug.apk` to your phone via USB, WhatsApp, or Google Drive, and tap to install!

---

# Method 2: Generating Signed Production AAB for Google Play

### Step 1: Generate Release Keystore
Run the following keytool command (save the generated file securely):
```bash
keytool -genkey -v -keystore blockzu-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias blockzu
```

### Step 2: Configure `android/app/build.gradle`
Add signing config:
```groovy
android {
    ...
    defaultConfig {
        applicationId "com.priorapp.blockzu"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            storeFile file("../../blockzu-release-key.jks")
            storePassword "YOUR_STORE_PASSWORD"
            keyAlias "blockzu"
            keyPassword "YOUR_KEY_PASSWORD"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release Bundle
In Android Studio:
- **Build** $\rightarrow$ **Generate Signed Bundle / APK** $\rightarrow$ **Android App Bundle**
- Output: `app-release.aab`
- Upload `app-release.aab` directly to Google Play Console under **Production / Closed Testing**.

---

# Method 3: Trusted Web Activity (TWA) with Bubblewrap

If deploying as a PWA wrapper via Google Chrome TWA:

### Step 1: Install Bubblewrap CLI
```bash
npm i -g @bubblewrap/cli
```

### Step 2: Initialize Bubblewrap from Manifest
```bash
bubblewrap init --manifest="https://www.priorapp.co.in/games/blockzu/manifest.webmanifest"
```

### Step 3: Build Signed TWA
```bash
bubblewrap build
```

### Step 4: Configure Digital Asset Links
Upload `assetlinks.json` to:
```text
https://www.priorapp.co.in/.well-known/assetlinks.json
```
Template is provided in [`public/.well-known/assetlinks.json`](file:///c:/Users/Utkarsh%20Pal/Documents/blockzu/public/.well-known/assetlinks.json).
