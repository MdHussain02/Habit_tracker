# Habit Hero

A React Native/Expo app for tracking and building healthy habits with AI-powered coaching and push notifications.

## Features

- **Habit Tracking**: Create, manage, and track daily habits
- **AI Coaching**: Personalized insights and motivation
- **Push Notifications**: Smart reminders and motivational messages
- **Analytics**: Progress tracking and streak monitoring
- **User Profiles**: Personalized experience with user preferences

## Push Notifications

The app includes a comprehensive push notification system with the following features:

- **Habit Reminders**: Get notified when it's time to complete your habits
- **Streak Alerts**: Celebrate your achievements and stay motivated
- **Weekly Reports**: Receive progress summaries
- **Motivational Messages**: Inspiring content to keep you on track
- **Test Notifications**: Debug and test notification functionality

### Setup

1. **Firebase Configuration**
   - Add `google-services.json` (Android) to project root
   - Add `GoogleService-Info.plist` (iOS) to project root
   - Configure Firebase project with FCM

2. **Environment Variables**
   - Set `EXPO_PUBLIC_API_BASE_URL` to your backend API URL

3. **Backend Endpoints**
   - `POST /api/v1/notifications/token` - Register device token
   - `GET /api/v1/notifications/preferences` - Get user preferences
   - `PUT /api/v1/notifications/preferences` - Update user preferences
   - `POST /api/v1/notifications/test` - Send test notification

### Usage

The push notification system is automatically integrated into the app. Users can:

- Manage notification preferences in Settings
- Test notifications using the "Send Test Notification" button
- Receive automatic notifications based on their preferences

For detailed implementation information, see [Push Notifications Documentation](docs/push-notifications.md).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator or Android Emulator
- Firebase project (for push notifications)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Create .env file
   EXPO_PUBLIC_API_BASE_URL=your_backend_url_here
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Building for Production

1. **Android**:
   ```bash
   eas build --platform android
   ```

2. **iOS**:
   ```bash
   eas build --platform ios
   ```

## Project Structure

```
Habit_tracker/
├── app/                    # Expo Router pages
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── services/             # API services
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── docs/                 # Documentation
└── assets/               # Images, fonts, etc.
```

## Key Components

- **PushNotificationProvider**: Manages notification state and permissions
- **NotificationService**: Handles API calls for notifications
- **NotificationPreferences**: UI for managing notification settings
- **usePushNotifications**: Hook for notification functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
