import { PookieColors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const completionData = {
    week: [65, 80, 90, 85, 70, 75, 95],
    month: [65, 80, 90, 85, 70, 75, 95, 80, 85, 90, 75, 80, 85, 90, 95, 80, 85, 90, 75, 80, 85, 90, 95, 80, 85, 90, 75, 80, 85, 90],
  };

  const longestStreaks = [
    {
      id: '1',
      name: 'Morning Yoga',
      days: 90,
      isPersonalBest: true,
    },
    {
      id: '2',
      name: 'Read 15 Mins',
      days: 65,
      isPersonalBest: true,
    },
    {
      id: '3',
      name: 'Drink Water',
      days: 42,
      isPersonalBest: true,
    },
  ];

  const mostSkippedHabits = [
    {
      id: '1',
      name: 'Evening Run',
      skippedCount: 18,
    },
    {
      id: '2',
      name: 'Meditate',
      skippedCount: 12,
    },
    {
      id: '3',
      name: 'Learn Spanish',
      skippedCount: 9,
    },
  ];

  const renderProgressBar = (percentage: number) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{percentage}%</Text>
      </View>
    );
  };

  const renderGraph = () => {
    const data = completionData[selectedPeriod];
    const maxValue = Math.max(...data);
    const barWidth = (width - 80) / data.length;

    return (
      <View style={styles.graphContainer}>
        <View style={styles.graphBars}>
          {data.map((value, index) => {
            const height = (value / maxValue) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height, width: barWidth - 4 }]} />
                <Text style={styles.barLabel}>
                  {selectedPeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : `${index + 1}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Completion Rate Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Completion Rate</Text>
              <View style={styles.periodSelector}>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === 'week' && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === 'week' && styles.periodButtonTextActive,
                  ]}>
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === 'month' && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === 'month' && styles.periodButtonTextActive,
                  ]}>
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {renderGraph()}
          </View>

          {/* Longest Streaks Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Longest Streaks</Text>
            
            {longestStreaks.map((streak) => (
              <View key={streak.id} style={styles.streakCard}>
                <View style={styles.streakInfo}>
                  <Text style={styles.streakName}>{streak.name}</Text>
                  <View style={styles.streakDays}>
                    <Text style={styles.streakNumber}>{streak.days}</Text>
                    <Text style={styles.streakLabel}>days</Text>
                  </View>
                </View>
                <View style={styles.streakBadges}>
                  <View style={styles.personalBestBadge}>
                    <Text style={styles.personalBestText}>Personal Best!</Text>
                  </View>
                  <MaterialCommunityIcons name="fire" size={20} color="#ff6b6b" />
                </View>
              </View>
            ))}
          </View>

          {/* Most Skipped Habits Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Skipped Habits</Text>
            
            {mostSkippedHabits.map((habit) => (
              <View key={habit.id} style={styles.skippedCard}>
                <View style={styles.skippedInfo}>
                  <View style={styles.skippedIcon}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </View>
                  <View style={styles.skippedDetails}>
                    <Text style={styles.skippedName}>{habit.name}</Text>
                    <Text style={styles.skippedCount}>Skipped {habit.skippedCount} times</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Overall Progress Section */}
          <View style={styles.overallProgressCard}>
            <View style={styles.overallProgressHeader}>
              <MaterialCommunityIcons name="medal" size={24} color="#ffd93d" />
              <View style={styles.overallProgressInfo}>
                <Text style={styles.overallProgressTitle}>Overall Progress</Text>
                <Text style={styles.overallProgressSubtitle}>
                  Review your journey and celebrate milestones.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#3a3a3a',
  },
  periodButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  graphContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    backgroundColor: PookieColors.hotPink,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    color: '#999',
    fontSize: 10,
    fontWeight: '500',
  },
  streakCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  streakDays: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  streakLabel: {
    color: '#999',
    fontSize: 14,
  },
  streakBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalBestBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  personalBestText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  skippedCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skippedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skippedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skippedDetails: {
    flex: 1,
  },
  skippedName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  skippedCount: {
    color: '#999',
    fontSize: 14,
  },
  reviewButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  overallProgressCard: {
    backgroundColor: '#4a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overallProgressInfo: {
    marginLeft: 12,
    flex: 1,
  },
  overallProgressTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overallProgressSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  viewDetailsButton: {
    backgroundColor: '#0066ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PookieColors.hotPink,
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
  },
}); 