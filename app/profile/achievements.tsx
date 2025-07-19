import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const achievements = [
  { icon: <MaterialCommunityIcons name="chat-processing" size={36} color="#FF7A7A" />, title: 'Streak Starter', subtitle: 'Achieved 7-day streak' },
  { icon: <MaterialCommunityIcons name="snowflake" size={36} color="#7A7AFF" />, title: 'Habit Master', subtitle: 'Completed 10 habits' },
  { icon: <MaterialCommunityIcons name="meditation" size={36} color="#FF7A7A" />, title: 'Zen Warrior', subtitle: 'Meditated for 30 days' },
  { icon: <MaterialCommunityIcons name="water" size={36} color="#7A7AFF" />, title: 'Hydration Hero', subtitle: 'Drank water for 60 days' },
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
    backgroundColor: '#18181b',
    alignItems: 'center',
    paddingTop: 48,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  achievementBadge: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: 150,
    margin: 10,
  },
  achievementTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  achievementSubtitle: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
}); 