# Ramadan Bot - Android APK Development Guide with Gemini AI

## Overview
This guide provides step-by-step prompts for building a native Android APK that wraps the Ramadan Bot web application (https://ramadanbot.app/app) with Firebase push notifications, persistent login (stay logged in forever), and native UI polish—avoiding the "running in Chrome" badge while maintaining premium quality.

---

## Prerequisites
- Android Studio (latest version)
- Android SDK configured
- Firebase project created at firebase.google.com
- Google Gemini API activated in Android Studio
- Minimum API Level: 24 (Android 7.0)

---

## Prompt 1: Project Setup & WebView Architecture

**Give this prompt to Gemini:**

```
Create an Android native application in Kotlin that:
1. Uses a WebView component to load https://ramadanbot.app/app as the main interface
2. Configure the application to NOT display "running in Chrome" badge by:
   - Disabling Chrome custom tabs
   - Setting up proper user agent to identify as native app
   - Implementing native Android chrome hiding for WebView
3. Create the project structure with:
   - MainActivity.kt (handles WebView initialization)
   - WebViewClient implementation for navigation
   - Custom WebChromeClient for permissions and alerts
   - AndroidManifest.xml configuration
4. Add required permissions:
   - INTERNET, ACCESS_NETWORK_STATE, CAMERA, MICROPHONE
   - POST_NOTIFICATIONS for Firebase
5. Set up proper WebView settings for:
   - JavaScript enabled
   - File access
   - Mixed content mode
6. App metadata:
   - App name: "Ramadan Bot"
   - Package: com.ramadanbot.app
   - Min SDK: 24, Target SDK: 34
   
Provide the complete Kotlin code for MainActivity and Android manifest configuration.
```

---

## Prompt 2: Firebase Push Notifications & Analytics

**Give this prompt to Gemini:**

```
Integrate Firebase into the Android app for:
1. Firebase Cloud Messaging (FCM) for push notifications:
   - Configure FirebaseMessagingService for receiving messages
   - Set up notification channels for Android 8+
   - Implement notification handling for both foreground and background
   - Build persistent notifications that survive app closure
   
2. Firebase setup code including:
   - google-services.json configuration
   - Dependencies in build.gradle
   - FirebaseMessagingService.kt implementation
   - NotificationManager setup with vibration, sound, lights
   
3. General user notification sending (NOT user-specific):
   - Topic-based subscriptions (e.g., "all_users", "daily_reflections")
   - Handling general broadcasts from your backend
   - Notification UI with app icon, title, body, action buttons
   
4. Firebase Analytics integration for:
   - App opens
   - User engagement
   - Custom events (e.g., "flyer_generated", "reflection_shared")
   
Provide complete ready-to-use code for Firebase integration, NotificationChannel setup, and the FirebaseMessagingService implementation.
```

---

## Prompt 3: Deep Linking, Share Intent & App Integration

**Give this prompt to Gemini:**

```
Implement native Android features for seamless app integration:
1. Deep linking to handle URLs like:
   - ramadanbot.app/app/flyer/[id]
   - ramadanbot.app/app/share/[reflection_id]
   - Configure intent filters in manifest
   
2. Share Intent handling:
   - Allow users to share flyers via Android share menu
   - Implement file caching for downloaded images
   - Support sharing to WhatsApp, Instagram, Twitter, Telegram
   
3. App shortcut implementation:
   - "New Reflection" quick action
   - "View Streak" quick action
   - Configure in shortcuts.xml
   
4. Status bar and icon customization:
   - Set proper status bar color (#ffffff for light, #1e293b for dark)
   - Configure app icon in multiple formats (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
   - Handle immersive mode for fullscreen experiences
   
5. Back navigation and app lifecycle:
   - Proper back button handling in WebView
   - onBackPressed override
   - Prevent closing when navigating within app
   
Provide complete implementation for intent filters, shortcuts configuration, and back navigation handling.
```

---

## Prompt 4: UI Polish, Performance & App Store Optimization

**Give this prompt to Gemini:**

```
Enhance app quality for premium user experience and app store visibility:
1. Loading screen & splash implementation:
   - Lightweight splash screen (no more than 2 seconds)
   - Show Ramadan Bot logo with minimal text
   - Smooth fade transition to WebView
   - Use animated splash theme in styles.xml
   
2. WebView performance optimization:
   - Implement aggressive caching for offline support
   - Cache service worker resources
   - Optimize image loading
   - Set proper WebView memory limits
   
3. App branding & theming:
   - Light theme with white background (#ffffff)
   - Dark status bar with white icons (API 23+)
   - Dark navigation bar
   - app:name="Ramadan Bot: Create Beautiful Ramadan Flyers with your name"
   
4. Error handling:
   - Show friendly error screen if https://ramadanbot.app/app is unreachable
   - Implement retry mechanism with exponential backoff
   - Cache last successful load for offline fallback
   
5. App Store metadata preparation:
   - App icon in all required sizes (192x192, 512x512)
   - App description optimized for keywords: "Ramadan", "AI Flyer Generator", "Islamic Reflections", "Personalised"
   - Screenshot templates (5 screenshots showing key features)
   
Provide styling resources (colors.xml, styles.xml), error handling activity, and app store description template with SEO-optimized keywords.
```

---

## Prompt 5: Build Configuration, Signing & Deployment (Optional but Recommended)

**Give this prompt to Gemini:**

```
Finalize the app for production and Google Play Store submission:
1. Build configuration setup:
   - buildTypes with debug and release variants
   - Proper ProGuard/R8 rules for code obfuscation (minify enabled for release)
   - Exclude Firebase/Google services from obfuscation
   - Optimize APK size (target: <50MB)
   
2. Signing configuration:
   - Generate keystore file for Play Store
   - Configure signingConfigs in build.gradle
   - Set up version code (1) and versionName (1.0.0)
   - Include build metadata
   
3. Dependencies cleanup:
   - Remove unused libraries
   - Use latest stable versions of:
     - androidx.appcompat
     - com.google.firebase:firebase-messaging
     - com.google.firebase:firebase-analytics
     - okhttp3 for network optimization
   
4. Play Store listing preparation:
   - Package name: com.ramadanbot.app
   - Category: Lifestyle / Productivity
   - Content rating: Low maturity (PEGI 3)
   - Pricing: Free with optional in-app monetization setup
   
5. App permissions documentation:
   - Internet: Load webview content
   - Camera/Microphone: AI voice features in webapp
   - Notifications: Push notifications and engagement
   - Files: Share flyers to social media
   
Provide complete build.gradle configuration, signing setup instructions, and Play Store description template.
```

---

## Implementation Steps

1. **Create new Android project** in Android Studio
   - Name: Ramadan Bot
   - Package: com.ramadanbot.app
   - Min API: 24
   - Language: Kotlin

2. **Copy Gemini responses** into the respective files after receiving code from each prompt

3. **Download google-services.json** from Firebase Console and place in `app/` directory

4. **Set up resources:**
   - Place app logos in `res/drawable-*dpi/`
   - Create `colors.xml`, `styles.xml`, `strings.xml`
   - Set up `AndroidManifest.xml` with all permissions

5. **Build APK:**
   ```bash
   ./gradlew assembleRelease
   ```

6. **Sign APK using keystore**

7. **Test on multiple devices** (minimum 3 different Android versions)

8. **Upload to Google Play Console** for review and publication

---

## Prompt 6: Persistent Login Configuration

**Give this prompt to Gemini:**

```
Implement persistent login for the Ramadan Bot Android app using SharedPreferences:

1. Create a SessionManager class that handles:
   - Saving user login data to SharedPreferences after first login
   - Loading saved user data on app startup
   - Auto-login if user session exists
   - Clearing session only on explicit logout or app uninstall
   - Managing session expiry (optional: implement 30-day session refresh)

2. Configure WebView to:
   - Inject JavaScript that checks for saved user session
   - Auto-fill login form when saved credentials exist
   - Persist localStorage between app restarts
   - Store authentication tokens locally

3. Session storage structure:
   - Store user data as JSON: { id, name, loginTime, lastActive }
   - Store auth tokens or session keys if provided by login API
   - Use encrypted SharedPreferences for sensitive data

4. App startup flow:
   - Load app
   - Check if saved user exists in SharedPreferences
   - If yes → show splash screen → auto-navigate to app
   - If no → show login screen

5. Logout handling:
   - Clear SharedPreferences on logout
   - Clear WebView cookies and localStorage
   - Reset to login screen
   - Clear app cache

6. Implement auto-logout safeguard:
   - Optional: Auto-logout if app is not used for 30 days
   - Optional: Refresh user session periodically

Provide complete Kotlin code for SessionManager, updated MainActivity with session restoration, and WebView configuration for persistent sessions.
```

---

## Key Configurations Summary

| Component | Configuration |
|-----------|---------------|
| **WebView URL** | https://ramadanbot.app/app |
| **Min API Level** | 24 (Android 7.0) |
| **Target API** | 34 |
| **Firebase** | Cloud Messaging + Analytics |
| **Permissions** | Internet, Camera, Microphone, Notifications |
| **App Title** | Ramadan Bot: Create Beautiful Ramadan Flyers with your name |
| **Package** | com.ramadanbot.app |
| **App Icon** | 512x512px PNG with transparency |
| **Session Management** | SharedPreferences-based persistent login |
| **Stay Logged In** | Forever unless user presses logout or uninstalls app |

---

## Expected Delivery

- ✅ Native Android APK without "running in Chrome" badge
- ✅ Persistent login (stays logged in forever unless logout/uninstall)
- ✅ Firebase push notifications for general users
- ✅ Offline fallback capability
- ✅ Deep linking support
- ✅ Share integration with social media
- ✅ Premium UI/UX quality
- ✅ Google Play Store ready
- ✅ ~40-50MB final APK size

---

## Support Resources

- [Android WebView Documentation](https://developer.android.com/reference/android/webkit/WebView)
- [Firebase Cloud Messaging Guide](https://firebase.google.com/docs/cloud-messaging)
- [Android App Architecture Best Practices](https://developer.android.com/topic/architecture)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

---

**Note:** Follow the prompts in order. Each response from Gemini builds upon the previous setup. Ensure you have Android Studio 2024+ for best compatibility.
