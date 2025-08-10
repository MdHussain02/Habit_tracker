import { PookieColors } from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface AnalysisData {
  analysis: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    consistency_score: number;
    balance_score: number;
  };
  metrics: {
    totalHabits: number;
    activeHabits: number;
    averageFrequency: number;
    consistencyScore: number;
    balanceScore: number;
  };
  userProfile: {
    age: number;
    fitnessLevel: string;
    primaryGoal: string;
    motivationLevel: string;
  };
}

export default function AnalyticsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchGet } = useApi();
  const router = useRouter();

  const fetchAnalysisData = async () => {
    try {
      const response = await fetchGet('/suggestions/analysis');
      if (response.success && response.data) {
        setAnalysisData(response.data);
        setError(null);
      } else {
        setError('Failed to load analysis data');
      }
    } catch (err) {
      console.error('Error fetching analysis data:', err);
      setError('An error occurred while loading analysis data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAnalysisData();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PookieColors.hotPink} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color="#f87171" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            fetchAnalysisData();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!analysisData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="help-circle-outline" size={48} color="#9ca3af" />
        <Text style={styles.errorText}>No analysis data available</Text>
      </View>
    );
  }

  const { analysis, metrics, userProfile } = analysisData;

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

  const renderSection = (title: string, items: string[], icon: string, color: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.sectionTitle, { color, marginLeft: 8 }]}>{title}</Text>
      </View>
      <View style={styles.listContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <View style={[styles.bullet, { backgroundColor: color }]} />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={PookieColors.hotPink}
          colors={[PookieColors.hotPink]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Habit Analysis</Text>
        <Text style={styles.headerSubtitle}>Your personalized insights and recommendations</Text>
      </View>

      <View style={styles.content}>
        {/* Metrics Section */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Ionicons name="stats-chart" size={24} color={PookieColors.hotPink} />
            <Text style={styles.metricValue}>{metrics.totalHabits}</Text>
            <Text style={styles.metricLabel}>Total Habits</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.metricValue}>{metrics.activeHabits}</Text>
            <Text style={styles.metricLabel}>Active</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Ionicons name="trending-up" size={24} color="#2196F3" />
            <Text style={styles.metricValue}>{metrics.consistencyScore}%</Text>
            <Text style={styles.metricLabel}>Consistency</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="scale" size={24} color="#9C27B0" />
            <Text style={styles.metricValue}>{metrics.balanceScore}%</Text>
            <Text style={styles.metricLabel}>Balance</Text>
          </View>
        </View>

        {/* User Profile */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={20} color={PookieColors.hotPink} />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Your Profile</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Goal:</Text> {userProfile.primaryGoal}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Fitness Level:</Text> {userProfile.fitnessLevel}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Motivation:</Text> {userProfile.motivationLevel}</Text>
          </View>
        </View>

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="thumbs-up" size={20} color="#4CAF50" />
              <Text style={[styles.sectionTitle, { marginLeft: 8, color: '#4CAF50' }]}>
                Your Strengths
              </Text>
            </View>
            <View style={styles.listContainer}>
              {analysis.strengths.map((strength, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.listText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Gaps */}
        {analysis.gaps.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={20} color="#FF9800" />
              <Text style={[styles.sectionTitle, { marginLeft: 8, color: '#FF9800' }]}>
                Areas for Improvement
              </Text>
            </View>
            <View style={styles.listContainer}>
              {analysis.gaps.map((gap, index) => (
                <View key={`gap-${index}`} style={styles.listItem}>
                  <Ionicons name="alert-circle" size={16} color="#FF9800" />
                  <Text style={styles.listText}>{gap}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <View style={[styles.section, { marginBottom: 40 }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={20} color={PookieColors.hotPink} />
              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>
                Recommendations
              </Text>
            </View>
            <View style={styles.listContainer}>
              {analysis.recommendations.map((recommendation, index) => (
                <View key={`rec-${index}`} style={styles.listItem}>
                  <Ionicons name="arrow-forward" size={16} color={PookieColors.hotPink} />
                  <Text style={styles.listText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14141c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14141c',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#14141c',
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: PookieColors.hotPink,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#1e1e28',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  metricValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  metricLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  profileInfo: {
    backgroundColor: '#1e1e28',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 15,
  },
  infoLabel: {
    color: PookieColors.hotPink,
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: '#1e1e28',
    borderRadius: 12,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listText: {
    color: '#fff',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
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
    backgroundColor: '#22222b',
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
    backgroundColor: '#22222b',
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
    backgroundColor: '#22222b',
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
    backgroundColor: '#636ae8',
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