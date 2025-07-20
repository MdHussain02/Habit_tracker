import { PookieColors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CoachScreen() {
  const aiTips = [
    {
      id: '1',
      title: 'Consistency is key',
      description: 'Aim for small, daily wins rather than infrequent, large efforts. Even 5 minutes counts!',
      icon: 'bulb',
    },
    {
      id: '2',
      title: 'Environment matters',
      description: 'Set up your space to make good habits easy and bad habits hard. Put your running shoes by the door!',
      icon: 'bulb',
    },
  ];

  const failurePatterns = [
    {
      id: '1',
      title: 'Inconsistent Evening Routine',
      description: "Your 'Read Before Bed' habit frequently misses on weekdays. Try setting an earlier reminder.",
      action: 'Adjust Reminder',
    },
    {
      id: '2',
      title: 'Skipping Weekend Workouts',
      description: 'Your exercise habits drop significantly on weekends. Schedule a fun activity to stay active.',
      action: 'Explore Weekend Habits',
    },
  ];

  const recommendations = [
    {
      id: '1',
      title: 'Mindfulness Boost',
      description: 'Introduce a 5-minute daily meditation to improve focus and reduce stress.',
      category: 'Mental Wellness',
      action: 'Add Habit',
    },
    {
      id: '2',
      title: 'Hydration Habit',
      description: 'Track your water intake throughout the day to ensure optimal hydration.',
      category: 'Health',
      action: 'Add Habit',
    },
    {
      id: '3',
      title: 'Digital Detox Evening',
      description: 'Dedicate the last hour before bed to screen-free activities for better sleep.',
      category: 'Well-being',
      action: 'Add Habit',
    },
  ];

  const handleShareInsight = (tip: any) => {
    Alert.alert('Share Insight', `Sharing: ${tip.title}`);
  };

  const handleAddHabit = (recommendation: any) => {
    Alert.alert('Add Habit', `Adding: ${recommendation.title}`);
  };

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Smart Coach</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* AI Tips Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={24} color={PookieColors.hotPink} />
              <Text style={styles.sectionTitle}>Today's AI Tips</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Insights to boost your habit success.</Text>
            
            {aiTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <View style={styles.aiIcon}>
                    <Text style={styles.aiText}>AI</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShareInsight(tip)}
                  >
                    <Ionicons name="share-outline" size={20} color="#fff" />
                    <Text style={styles.shareText}>Share Insight</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.tipText}>{tip.description}</Text>
              </View>
            ))}
          </View>

          {/* Failure Patterns Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={24} color="#ff6b6b" />
              <Text style={styles.sectionTitle}>Failure Patterns</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Identified areas where you might be struggling.</Text>
            
            {failurePatterns.map((pattern) => (
              <View key={pattern.id} style={styles.warningCard}>
                <View style={styles.warningHeader}>
                  <Ionicons name="warning" size={24} color="#ff6b6b" />
                  <Text style={styles.warningTitle}>{pattern.title}</Text>
                </View>
                <Text style={styles.warningText}>{pattern.description}</Text>
                <TouchableOpacity style={styles.warningButton}>
                  <Text style={styles.warningButtonText}>{pattern.action}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Recommendations Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="star" size={24} color="#ffd93d" />
              <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Based on your progress and goals.</Text>
            
            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationCard}>
                <View style={styles.recHeader}>
                  <MaterialCommunityIcons name="star" size={20} color="#ffd93d" />
                  <Text style={styles.recTitle}>{rec.title}</Text>
                </View>
                <Text style={styles.recText}>{rec.description}</Text>
                <View style={styles.recFooter}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{rec.category}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addHabitButton}
                    onPress={() => handleAddHabit(rec)}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={styles.addHabitText}>{rec.action}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14141c',
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PookieColors.hotPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  tipText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  warningText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  warningButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  warningButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  recommendationCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  recText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
  addHabitButton: {
    backgroundColor: PookieColors.hotPink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addHabitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
}); 