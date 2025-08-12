import { PookieColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { useToast } from "../../hooks/useToast";
import { useNotificationService } from "../../services/notificationService";

interface LocalPreferences {
  notifications: boolean;
  habitReminders: boolean;
  streakAlerts: boolean;
  reports: boolean;
  motivationalMessages: boolean;
  testNotifications: boolean;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { preferences, isLoading, error, updatePreferences } = usePushNotifications();
  const { 
    sendTestNotification, 
    triggerTestNotifications, 
    startTestNotifications, 
    stopTestNotifications,
    getJobsStatus 
  } = useNotificationService();

  const [localPreferences, setLocalPreferences] = useState<LocalPreferences>({
    notifications: true,
    habitReminders: true,
    streakAlerts: true,
    reports: true,
    motivationalMessages: true,
    testNotifications: false,
  });

  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        notifications: preferences.notifications ?? true,
        habitReminders: preferences.habitReminders ?? true,
        streakAlerts: preferences.streakAlerts ?? true,
        reports: preferences.reports ?? true,
        motivationalMessages: preferences.motivationalMessages ?? true,
        testNotifications: preferences.testNotifications ?? false,
      });
    }
  }, [preferences]);

  const handleToggle = async (key: keyof LocalPreferences) => {
    const newPreferences = {
      ...localPreferences,
      [key]: !localPreferences[key],
    };
    
    setLocalPreferences(newPreferences);
    
    try {
      await updatePreferences({ [key]: newPreferences[key] });
      showToast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newPreferences[key] ? 'enabled' : 'disabled'}`, 'success');
    } catch (err) {
      // Revert on error
      setLocalPreferences(prev => ({ ...prev, [key]: !newPreferences[key] }));
      showToast('Failed to update notification preferences', 'error');
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification('Test Notification', 'This is a test notification from Habit Hero!');
      showToast('Test notification sent!', 'success');
    } catch (err) {
      showToast('Failed to send test notification', 'error');
    }
  };

  const handleTriggerTestNotifications = async () => {
    try {
      await triggerTestNotifications();
      showToast('Test notifications triggered!', 'success');
    } catch (err) {
      showToast('Failed to trigger test notifications', 'error');
    }
  };

  const handleStartTestNotifications = async () => {
    try {
      await startTestNotifications();
      showToast('Test notifications started!', 'success');
    } catch (err) {
      showToast('Failed to start test notifications', 'error');
    }
  };

  const handleStopTestNotifications = async () => {
    try {
      await stopTestNotifications();
      showToast('Test notifications stopped!', 'success');
    } catch (err) {
      showToast('Failed to stop test notifications', 'error');
    }
  };

  const handleGetJobsStatus = async () => {
    try {
      const status = await getJobsStatus();
      showToast(`Jobs status: ${status.status}`, 'info');
    } catch (err) {
      showToast('Failed to get jobs status', 'error');
    }
  };

  const settingsSections = [
    {
      title: "General Preferences",
      description: "Customize your app experience",
      items: [
        {
          id: "theme",
          title: "App Theme",
          description:
            "Choose between a light or dark visual theme for the application.",
          type: "toggle",
          value: darkMode,
          onValueChange: setDarkMode,
          icon: "color-palette",
        },
      ],
    },
    {
      title: "Notification Settings",
      description: "Manage how Habit Hero keeps you informed and motivated",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          description:
            "Enable or disable all notifications.",
          type: "toggle",
          value: localPreferences.notifications,
          onValueChange: () => handleToggle('notifications'),
          icon: "notifications",
        },
        {
          id: "habit-reminders",
          title: "Habit Reminders",
          description:
            "Receive reminders when it's time to complete your habits.",
          type: "toggle",
          value: localPreferences.habitReminders,
          onValueChange: () => handleToggle('habitReminders'),
          icon: "notifications",
        },
        {
          id: "streak-alerts",
          title: "Streak Alerts",
          description:
            "Celebrate your streaks and get motivated to keep going.",
          type: "toggle",
          value: localPreferences.streakAlerts,
          onValueChange: () => handleToggle('streakAlerts'),
          icon: "trophy",
        },
        {
          id: "reports",
          title: "Weekly Reports",
          description:
            "Receive weekly summaries of your habit progress.",
          type: "toggle",
          value: localPreferences.reports,
          onValueChange: () => handleToggle('reports'),
          icon: "bar-chart",
        },
        {
          id: "motivational-messages",
          title: "Motivational Messages",
          description:
            "Get inspiring messages to help you stay on track.",
          type: "toggle",
          value: localPreferences.motivationalMessages,
          onValueChange: () => handleToggle('motivationalMessages'),
          icon: "bulb",
        },
        {
          id: "test-notifications",
          title: "Test Notifications",
          description:
            "Allow test notifications for debugging purposes.",
          type: "toggle",
          value: localPreferences.testNotifications,
          onValueChange: () => handleToggle('testNotifications'),
          icon: "bug",
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    return (
      <View key={item.id} style={styles.settingCard}>
        <View style={styles.settingHeader}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
          <View style={styles.settingIcon}>
            <Ionicons name={item.icon} size={24} color={PookieColors.hotPink} />
          </View>
        </View>
        <View style={styles.settingDivider} />
        <View style={styles.settingControl}>
          <Text style={styles.settingLabel}>
            {item.type === "toggle"
              ? item.value
                ? "Enabled"
                : "Disabled"
              : item.value}
          </Text>
          {item.type === "toggle" && (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#767577", true: PookieColors.hotPink }}
              thumbColor={item.value ? "#f5dd4b" : "#f4f3f4"}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerDescription}>
          Customize your Habit Hero experience
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionDescription}>{section.description}</Text>
          {section.items.map(renderSettingItem)}
        </View>
      ))}

      <View style={styles.testSection}>
        <Text style={styles.testSectionTitle}>Test Notifications</Text>
        <Button
          onPress={handleTestNotification}
          style={styles.testButton}
        >
          Send Test Notification
        </Button>
        <Button
          onPress={handleTriggerTestNotifications}
          style={styles.testButton}
        >
          Trigger Test Notifications
        </Button>
        <Button
          onPress={handleStartTestNotifications}
          style={styles.testButton}
        >
          Send Test Notification
        </Button>
        <Button
          onPress={handleTriggerTestNotifications}
          style={styles.testButton}
        >
          Trigger Test Notifications
        </Button>
      </View>

      <View style={styles.logoutSection}>
        <Button
          onPress={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: logout, style: "destructive" },
              ]
            );
          }}
          style={styles.logoutButton}
        >Logout</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  logoutButton: {
    marginBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
  },
  settingControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    color: "#4a4a4a",
    fontWeight: "500",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
  },
  testSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: PookieColors.hotPink,
  },
  testSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  logoutSection: {
    paddingHorizontal: 20,
  },
});
