# Deploy Firebase Security Rules

## Quick Deploy (if Firebase CLI is installed):
```bash
firebase deploy --only firestore:rules
```

## Manual Deploy via Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **pallasartis-c873f**
3. Navigate to **Firestore Database** → **Rules**
4. Replace the current rules with the content from `firestore.rules`
5. Click **Publish**

## What These Rules Do:

### User Collection Rules:
- **Read**: Anyone can read user profiles (needed for public gallery)
- **Create**: Users can only create their own profile document
- **Update**: Users can update their own profile OR admins can update ANY profile
- **Delete**: Only admins can delete profiles

### Key Security Features:
- Uses `isAdmin()` helper function to check admin status
- Verifies the admin document exists before checking role
- Prevents non-admins from elevating their own privileges
- Allows admins to verify/unverify users and change roles

## Testing After Deploy:
1. Try verifying an unverified user from admin dashboard
2. Try toggling admin status on a user
3. Ensure regular users can still edit their own profiles