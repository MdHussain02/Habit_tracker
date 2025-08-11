# Push Notifications Implementation

This document describes the push notification implementation for the Habit Hero app.

## Overview

The app uses Expo Notifications with Firebase Cloud Messaging (FCM) for Android and Apple Push Notification Service (APNs) for iOS to deliver push notifications to users.

## Features

- **Habit Reminders**: Notify users when it's time to complete their habits
- **Streak Alerts**: Celebrate user streaks and motivate them to continue
- **Weekly Reports**: Send weekly progress summaries
- **Motivational Messages**: Inspire users with encouraging messages
- **Test Notifications**: Allow testing of notification functionality

## Architecture

### Components

1. **PushNotificationProvider** (`hooks/usePushNotifications.tsx`)
   - Manages notification state and permissions
   - Handles device token registration
   - Provides context for notification functionality

2. **NotificationService** (`services/notificationService.ts`)
   - Handles API calls to backend notification endpoints
   - Manages notification preferences
   - Sends test notifications

3. **NotificationPreferences** (`components/NotificationPreferences.tsx`)
   - UI component for managing notification settings
   - Allows users to toggle different notification types

### Key Files

- `hooks/usePushNotifications.tsx` - Main notification hook and provider
- `services/notificationService.ts` - API service for notifications
- `components/NotificationPreferences.tsx` - Settings UI component
- `app/profile/settings.tsx` - Integrated settings page
- `app/_layout.tsx` - Root layout with notification provider

## Setup

### Prerequisites

1. Firebase project with FCM configured
2. `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files
3. Backend API with notification endpoints

### Configuration

1. **App Configuration** (`app.json`)
   ```json
   {
     "expo": {
       "ios": {
         "googleServicesFile": "./GoogleService-Info.plist",
         "bundleIdentifier": "com.devzaine.habithero"
       },
       "android": {
         "googleServicesFile": "./google-services.json",
         "useNextNotificationsApi": true
       }
     }
   }
   ```

2. **Environment Variables**
   - `EXPO_PUBLIC_API_BASE_URL` - Backend API base URL

### Backend Endpoints

The backend should provide the following endpoints:

- `POST /api/v1/notifications/token` - Register device token
- `GET /api/v1/notifications/preferences` - Get user preferences
- `PUT /api/v1/notifications/preferences` - Update user preferences
- `POST /api/v1/notifications/test` - Send test notification
- `GET /api/v1/notifications/history` - Get notification history

## Usage

### Basic Usage

```typescript
import { usePushNotifications } from '../hooks/usePushNotifications';

function MyComponent() {
  const { 
    token, 
    isRegistered, 
    preferences, 
    registerForPushNotifications,
    updatePreferences 
  } = usePushNotifications();

  // Component logic
}
```

### Managing Preferences

```typescript
const { updatePreferences } = usePushNotifications();

// Update a single preference
await updatePreferences({ habitReminders: true });

// Update multiple preferences
await updatePreferences({
  habitReminders: true,
  streakAlerts: false,
  reports: true
});
```

### Testing Notifications

```typescript
import { useNotificationService } from '../services/notificationService';

function TestComponent() {
  const { sendTestNotification } = useNotificationService();

  const handleTest = async () => {
    try {
      await sendTestNotification();
      console.log('Test notification sent!');
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };
}
```

## Notification Types

### 1. Habit Reminders
- **Purpose**: Remind users to complete their habits
- **Trigger**: Scheduled based on user's habit time preferences
- **Data**: `{ type: 'habit_reminder', habitId: string }`

### 2. Streak Alerts
- **Purpose**: Celebrate user achievements and motivate continued progress
- **Trigger**: When user reaches milestone streaks
- **Data**: `{ type: 'streak_alert', streak: number, habitId: string }`

### 3. Weekly Reports
- **Purpose**: Provide weekly progress summaries
- **Trigger**: Weekly (configurable)
- **Data**: `{ type: 'weekly_report', week: string, stats: object }`

### 4. Motivational Messages
- **Purpose**: Inspire and encourage users
- **Trigger**: Based on user behavior and preferences
- **Data**: `{ type: 'motivational', message: string }`

## Error Handling

The implementation includes comprehensive error handling:

- Permission denied scenarios
- Device token generation failures
- Network connectivity issues
- Backend API errors

## Testing

### Local Testing

1. Use the "Send Test Notification" button in settings
2. Check console logs for token generation and API responses
3. Verify notification display on device

### Production Testing

1. Ensure Firebase configuration is correct
2. Test on both Android and iOS devices
3. Verify backend endpoints are working
4. Check notification delivery and user interaction

## Troubleshooting

### Common Issues

1. **Token not generated**
   - Check device permissions
   - Verify Firebase configuration
   - Ensure physical device (not simulator)

2. **Notifications not received**
   - Check backend endpoint configuration
   - Verify token is being sent to backend
   - Check notification preferences

3. **Permission denied**
   - Guide user to app settings
   - Request permissions again
   - Handle gracefully in UI

### Debug Information

Enable debug logging by checking console output for:
- Device push token
- Permission status
- API responses
- Notification events

## Future Enhancements

- Rich notifications with images and actions
- Notification categories and channels
- Silent notifications for background updates
- Notification analytics and tracking
- Custom notification sounds
- Notification scheduling and frequency controls
