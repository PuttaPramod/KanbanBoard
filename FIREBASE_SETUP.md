# Firebase Authentication Setup Guide

This project is now configured with Firebase authentication for login and signup functionality.

## Overview

The Firebase authentication system has been integrated into:
- **Login Page** (`src/app/pages/login/`) - Sign in with email and password
- **Register Page** (`src/app/pages/register/`) - Create new account with email and password
- **Auth Service** (`src/app/services/auth.service.ts`) - Handles all Firebase authentication operations

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" and follow the setup wizard
3. Enter your project name (e.g., "TaskFlow")
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Toggle **Enable** to turn it on
4. Click **Save**

### 3. Get Your Firebase Config

1. Go to **Project Settings** (gear icon in top-left)
2. In the **General** tab, scroll down to **Your apps**
3. Look for your web app or click **Add App** if you don't have one
4. Select **Web** app
5. Copy the configuration code (you'll see something like):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 4. Update the Firebase Config File

1. Open `src/app/config/firebase.config.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_ACTUAL_MESSAGING_SENDER_ID',
  appId: 'YOUR_ACTUAL_APP_ID',
  measurementId: 'YOUR_ACTUAL_MEASUREMENT_ID'
};
```

3. Save the file

### 5. Run the Application

```bash
npm start
```

Your application is now configured with Firebase authentication!

## Features

### Login Page
- Email and password validation
- "Remember me" functionality
- Error handling with user-friendly messages
- Password visibility toggle
- Loading state during authentication
- Automatic redirect to dashboard on successful login

### Register/Signup Page
- First name and last name fields
- Email validation
- Strong password requirements (minimum 8 characters)
- Password strength indicator
- Password confirmation
- Terms and conditions agreement
- Error handling with user-friendly messages
- Password visibility toggle
- Automatic redirect to dashboard on successful registration

### Authentication Service Features
- `register(email, password, firstName?, lastName?)` - Create new user account
- `login(email, password)` - Sign in with credentials
- `logout()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user
- `getUserEmail()` - Get current user's email
- `getCurrentLoginStatus()` - Check if user is logged in
- Error handling with descriptive messages

## Error Handling

The system provides user-friendly error messages for common authentication issues:

- **User not found** - Suggests signing up
- **Wrong password** - Prompts to try again
- **Email already in use** - When registering with existing email
- **Weak password** - Suggests stronger password requirements
- **Network errors** - Helps with connection issues

## Security Notes

⚠️ **Important**: 
- Never commit your Firebase config with real credentials to version control
- Consider using environment variables for sensitive configuration in production
- Firebase security rules should be configured in the Firebase Console for production use

## Troubleshooting

### Blank screen or errors on startup
- Verify Firebase config is correctly filled in
- Check browser console for error messages
- Ensure Firebase project exists and is active

### Authentication not working
- Verify Email/Password authentication is enabled in Firebase Console
- Check that the config values are exactly as shown in Firebase Console
- Clear browser cache and restart the development server

### Users can't register
- Check Firebase Console quota limits
- Verify email/password authentication method is enabled
- Ensure password meets requirements (minimum 8 characters)

## Next Steps

1. Set up Firestore database for storing user profiles (optional)
2. Configure Firebase security rules for production
3. Add password reset functionality
4. Implement email verification
5. Add OAuth providers (Google, GitHub, etc.)

For more details, check the [Firebase Documentation](https://firebase.google.com/docs/auth)
