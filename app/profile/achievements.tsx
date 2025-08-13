import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
      <Text style={styles.title}>Achievements</Text>
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
  title: {
    color: '#1a1a1a',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
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