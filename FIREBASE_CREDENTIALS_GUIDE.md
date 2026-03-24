# Firebase Setup - Getting Real Credentials

## Complete Step-by-Step Guide

### STEP 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** button
3. Enter project name: **TaskFlow**
4. Uncheck Google Analytics (optional)
5. Click **Create project**
6. Wait 1-2 minutes for project creation

### STEP 2: Register Web App

1. After project creates, you'll see welcome screen
2. Under "Get started by adding Firebase to your app", click **Web icon** `</>`
3. Enter app nickname: **TaskFlow-App**
4. Check "Also set up Firebase Hosting" (optional)
5. Click **Register app**

### STEP 3: Copy Firebase Config

You'll see your config code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "taskflow-xxx.firebaseapp.com",
  projectId: "taskflow-xxx",
  storageBucket: "taskflow-xxx.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abcd1234",
  measurementId: "G-ABCDEF"
};
```

**Copy each value from here to your config file.**

### STEP 4: Enable Email/Password Authentication

1. In Firebase Console left menu, click **Authentication**
2. Click **Get started** (if first time) or **"Sign-in method"** tab
3. Under "Sign-in providers", find **Email/Password**
4. Click on it and toggle **Enable** (turn it ON)
5. Click **Save**

### STEP 5: Update Your App Config File

Open: `src/app/config/firebase.config.ts`

Replace the placeholder values with your actual Firebase credentials:

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY_FROM_FIREBASE',
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-actual-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_ACTUAL_SENDER_ID',
  appId: 'YOUR_ACTUAL_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};
```

### STEP 6: Get Firebase Settings URL Quick Links

**Firebase Console URL:**
- https://console.firebase.google.com

**Direct links to important pages:**
- **Your Project Settings:** https://console.firebase.google.com/project/_/settings/general
- **Authentication:** https://console.firebase.google.com/project/_/authentication/providers
- **Firestore Database:** https://console.firebase.google.com/project/_/firestore

(Replace `_` with your actual project name)

---

## Where to Find Each Value in Firebase Console

### 📌 apiKey
- Go to **Settings** → **Project Settings**
- Click **"Web"** app in "Your apps" section
- Look for `"apiKey": "AIzaSy..."`

### 📌 authDomain
- In same location as apiKey
- Look for `"authDomain": "taskflow-xxx.firebaseapp.com"`

### 📌 projectId
- In same location
- Look for `"projectId": "taskflow-xxx"`

### 📌 storageBucket
- In same location
- Look for `"storageBucket": "taskflow-xxx.appspot.com"`

### 📌 messagingSenderId
- In same location
- Look for `"messagingSenderId": "123456789"`

### 📌 appId
- In same location
- Look for `"appId": "1:123456789:web:abcd1234efgh5678"`

### 📌 measurementId (Optional)
- In same location
- Look for `"measurementId": "G-ABCDEF1234"`

---

## Example of Completed Config File

```typescript
// src/app/config/firebase.config.ts

export const firebaseConfig = {
  apiKey: "AIzaSyDxEk4QZ7YxW8N3V0L2K1M2P3Q4R5S6T7U",
  authDomain: "taskflow-demo-12345.firebaseapp.com",
  projectId: "taskflow-demo-12345",
  storageBucket: "taskflow-demo-12345.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:xyz123abc456def789",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## Verify Setup is Complete

✅ Firebase project created  
✅ Web app registered  
✅ Email/Password authentication enabled  
✅ Firebase config added to your app  
✅ All placeholder values replaced with real values  

---

## Test Authentication

1. **Start your app:**
   ```bash
   npm start
   ```

2. **Go to login page:** http://localhost:4200/login

3. **Create account:**
   - Click "Sign up" link
   - Enter first name, last name
   - Enter email (any email format)
   - Enter password (min 8 characters)
   - Click "Sign Up"

4. **Check Firebase Console:**
   - Go to **Authentication** → **Users**
   - You should see your new user listed

5. **Login:**
   - Go back to login page
   - Enter email and password
   - You should be logged in
   - See dashboard with your email in navbar

---

## Troubleshooting

### ❌ "auth/operation-not-allowed"
- Go to Firebase Console → **Authentication** → **Sign-in method**
- Make sure **Email/Password** is **Enabled** (toggle should be ON)

### ❌ "auth/network-request-failed"
- Check internet connection
- Check Firebase config is correct
- Check project ID matches Firebase Console

### ❌ Can't find config values
- Go to Firebase Console
- Click on your project
- Click Settings (gear icon)
- Go to **Project Settings** tab
- Scroll down to **"Your apps"** section
- Click on your **Web** app
- Copy the entire config object

### ❌ Page still shows "YOUR_API_KEY"
- Make sure you replaced ALL placeholder text
- Each value should be from your Firebase config
- No "YOUR_" or "REPLACE_WITH_" text should remain
- Save the file after changes

### ❌ "Cannot find module '@angular/fire'"
- Run: `npm install`
- Run: `npm install firebase @angular/fire --legacy-peer-deps`
- Restart dev server

---

## Firebase Console Quick Tips

- **Find your project name:** Top left corner of Firebase Console
- **Switch projects:** Click project name dropdown
- **Logout of Firebase:** Click your avatar (bottom left)
- **Delete project:** Settings → General → Delete this project

---

## Security Warning ⚠️

**IMPORTANT:** Your `apiKey` is public and visible in browser code. This is normal.  
However:
- Never commit real credentials to GitHub
- Use environment variables for production
- Enable Firebase Security Rules
- Use `.env` files for sensitive data

---

## Still Having Issues?

**Double-check:**
1. Firebase project exists (check console.firebase.google.com)
2. Email/Password auth is ENABLED (not just visible)
3. Config file has NO placeholder text remaining
4. All 6 values are filled (apiKey through appId)
5. No typos in config values
6. Dev server was restarted after config changes

**Next step:** If still not working, verify the exact config values match your Firebase Console exactly character-by-character.
