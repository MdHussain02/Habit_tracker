import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const achievements = [
  { icon: <MaterialCommunityIcons name="chat-processing" size={36} color="#4CAF50" />, title: 'Streak Starter', subtitle: 'Achieved 7-day streak' },
  { icon: <MaterialCommunityIcons name="snowflake" size={36} color="#4CAF50" />, title: 'Habit Master', subtitle: 'Completed 10 habits' },
  { icon: <MaterialCommunityIcons name="meditation" size={36} color="#4CAF50" />, title: 'Zen Warrior', subtitle: 'Meditated for 30 days' },
  { icon: <MaterialCommunityIcons name="water" size={36} color="#4CAF50" />, title: 'Hydration Hero', subtitle: 'Drank water for 60 days' },
];

export default function AchievementsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Achievements</Text>
            <Text style={styles.headerDate}>Celebrate your milestones</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.achievementsContainer}>
        {achievements.map((ach, idx) => (
          <View key={idx} style={styles.achievementBadge}>
            {ach.icon}
            <Text style={styles.achievementTitle}>{ach.title}</Text>
            <Text style={styles.achievementSubtitle}>{ach.subtitle}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: '#bdc3c7',
    fontWeight: '500',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 40,
    width: '100%',
  },
  achievementBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  achievementTitle: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  achievementSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});