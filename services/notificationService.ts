import { useApi } from '../hooks/useApi';

export interface NotificationPreferences {
  notifications?: boolean;
  habitReminders?: boolean;
  streakAlerts?: boolean;
  reports?: boolean;
  motivationalMessages?: boolean;
  testNotifications?: boolean;
}

export interface NotificationToken {
  fcmToken: string;
}

export interface TestNotificationRequest {
  title?: string;
  body?: string;
}

export interface JobsStatus {
  status: string;
  jobs: any[];
}

export class NotificationService {
  private static instance: NotificationService;
  private api: ReturnType<typeof useApi>;
  private baseUrl: string;

  constructor() {
    // This will be initialized when the service is used
    this.api = {} as ReturnType<typeof useApi>;
    this.baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || '';
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setApi(api: ReturnType<typeof useApi>) {
    this.api = api;
  }

  /**
   * Update FCM Token
   * POST /notifications/token
   */
  async updatePushToken(token: string): Promise<void> {
    console.log('🔧 NotificationService: Updating push token:', token);
    try {
      const result = await this.api.fetchPost(`${this.baseUrl}/notifications/token`, { fcmToken: token });
      console.log('✅ NotificationService: Push token updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to update push token:', error);
      throw error;
    }
  }

  /**
   * Remove FCM Token
   * DELETE /notifications/token
   */
  async removePushToken(): Promise<void> {
    console.log('🔧 NotificationService: Removing push token');
    try {
      const result = await this.api.fetchDelete(`${this.baseUrl}/notifications/token`);
      console.log('✅ NotificationService: Push token removed successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to remove push token:', error);
      throw error;
    }
  }

  /**
   * Get Notification Preferences
   * GET /notifications/preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    console.log('🔧 NotificationService: Getting preferences');
    try {
      const result = await this.api.fetchGet(`${this.baseUrl}/notifications/preferences`);
      console.log('✅ NotificationService: Preferences retrieved successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to get preferences:', error);
      throw error;
    }
  }

  /**
   * Update Notification Preferences
   * PUT /notifications/preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    console.log('🔧 NotificationService: Updating preferences:', preferences);
    try {
      const result = await this.api.fetchPut(`${this.baseUrl}/notifications/preferences`, preferences);
      console.log('✅ NotificationService: Preferences updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to update preferences:', error);
      throw error;
    }
  }

  /**
   * Send Test Notification
   * POST /notifications/test
   */
  async sendTestNotification(title?: string, body?: string): Promise<void> {
    console.log('🔧 NotificationService: Sending test notification:', { title, body });
    const payload: TestNotificationRequest = {};
    if (title) payload.title = title;
    if (body) payload.body = body;
    
    try {
      const result = await this.api.fetchPost(`${this.baseUrl}/notifications/test`, payload);
      console.log('✅ NotificationService: Test notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to send test notification:', error);
      throw error;
    }
  }

  /**
   * Trigger Test Notifications
   * POST /notifications/trigger-test
   */
  async triggerTestNotifications(): Promise<void> {
    console.log('🔧 NotificationService: Triggering test notifications');
    try {
      const result = await this.api.fetchPost(`${this.baseUrl}/notifications/trigger-test`, {});
      console.log('✅ NotificationService: Test notifications triggered successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to trigger test notifications:', error);
      throw error;
    }
  }

  /**
   * Start Test Notifications
   * POST /notifications/start-test
   */
  async startTestNotifications(): Promise<void> {
    console.log('🔧 NotificationService: Starting test notifications');
    try {
      const result = await this.api.fetchPost(`${this.baseUrl}/notifications/start-test`, {});
      console.log('✅ NotificationService: Test notifications started successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to start test notifications:', error);
      throw error;
    }
  }

  /**
   * Stop Test Notifications
   * POST /notifications/stop-test
   */
  async stopTestNotifications(): Promise<void> {
    console.log('🔧 NotificationService: Stopping test notifications');
    try {
      const result = await this.api.fetchPost(`${this.baseUrl}/notifications/stop-test`, {});
      console.log('✅ NotificationService: Test notifications stopped successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to stop test notifications:', error);
      throw error;
    }
  }

  /**
   * Get Jobs Status
   * GET /notifications/jobs-status
   */
  async getJobsStatus(): Promise<JobsStatus> {
    console.log('🔧 NotificationService: Getting jobs status');
    try {
      const result = await this.api.fetchGet(`${this.baseUrl}/notifications/jobs-status`);
      console.log('✅ NotificationService: Jobs status retrieved successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ NotificationService: Failed to get jobs status:', error);
      throw error;
    }
  }
}

// Hook to use the notification service
export function useNotificationService() {
  const api = useApi();
  const service = NotificationService.getInstance();
  service.setApi(api);

  return {
    updatePushToken: (token: string) => service.updatePushToken(token),
    removePushToken: () => service.removePushToken(),
    getPreferences: () => service.getPreferences(),
    updatePreferences: (preferences: Partial<NotificationPreferences>) => service.updatePreferences(preferences),
    sendTestNotification: (title?: string, body?: string) => service.sendTestNotification(title, body),
    triggerTestNotifications: () => service.triggerTestNotifications(),
    startTestNotifications: () => service.startTestNotifications(),
    stopTestNotifications: () => service.stopTestNotifications(),
    getJobsStatus: () => service.getJobsStatus(),
  };
}
