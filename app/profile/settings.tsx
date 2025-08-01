import { PookieColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [coachTips, setCoachTips] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(false);
  const [promotionalUpdates, setPromotionalUpdates] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();

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
          id: "daily-reminders",
          title: "Daily Habit Reminders",
          description:
            "Receive a friendly nudge at your preferred time to complete your daily habits.",
          type: "toggle",
          value: dailyReminders,
          onValueChange: setDailyReminders,
          icon: "notifications",
        },
        {
          id: "coach-tips",
          title: "Smart Coach Insights",
          description:
            "Get personalized tips, motivational messages, and progress insights from your AI coach.",
          type: "toggle",
          value: coachTips,
          onValueChange: setCoachTips,
          icon: "bulb",
        },
        {
          id: "achievement-alerts",
          title: "Achievement Alerts",
          description:
            "Celebrate your milestones! Get notified when you hit a new streak or achieve a habit goal.",
          type: "toggle",
          value: achievementAlerts,
          onValueChange: setAchievementAlerts,
          icon: "trophy",
        },
        {
          id: "promotional-updates",
          title: "Promotional Updates",
          description:
            "Stay informed about new app features, exclusive offers, and important announcements.",
          type: "toggle",
          value: promotionalUpdates,
          onValueChange: setPromotionalUpdates,
          icon: "gift",
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
              ? item.id === "theme"
                ? "Use Dark Mode"
                : item.id === "daily-reminders"
                ? "Enable Reminders"
                : item.id === "coach-tips"
                ? "Enable Coach Tips"
                : item.id === "achievement-alerts"
                ? "Enable Alerts"
                : "Enable Promotions"
              : ""}
          </Text>
          {item.type === "toggle" && (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#3a3a3a", true: PookieColors.hotPink }}
              thumbColor={item.value ? "#fff" : "#ccc"}
              ios_backgroundColor="#3a3a3a"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {settingsSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>
                {section.description}
              </Text>

              {section.items.map(renderSettingItem)}
            </View>
          ))}

          <View style={styles.logoutButton}>
            <Button
              type="primary"
              onPress={async () => {
                try {
                  await logout();
                  showToast('Logged out successfully', 'success');
                  router.replace("/onboarding");
                } catch (error) {
                  showToast('Logout failed', 'error');
                }
              }}
            >
              Log Out
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14141c",
  },
  gradientBackground: {
    flex: 1,
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
    color: "#fff",
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
    color: "#fff",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: "#23232b",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
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
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#3a3a3a",
    marginBottom: 16,
  },
  settingControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
