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
  View
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

  // const renderProgressBar = (percentage: number) => {
  //   return (
  //     <View style={styles.progressBarContainer}>
  //       <View style={styles.progressBarBackground}>
  //         <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
  //       </View>
  //       <Text style={styles.progressText}>{percentage}%</Text>
  //     </View>
  //   );
  // };

  // const renderSection = (title: string, items: string[], icon: string, color: string) => (
  //   <View style={styles.section}>
  //     <View style={styles.sectionHeader}>
  //       <Ionicons name={icon as any} size={20} color={color} />
  //       <Text style={[styles.sectionTitle, { color, marginLeft: 8 }]}>{title}</Text>
  //     </View>
  //     <View style={styles.listContainer}>
  //       {items.map((item, index) => (
  //         <View key={index} style={styles.listItem}>
  //           <View style={{ backgroundColor: color }} />
  //           <Text style={styles.listText}>{item}</Text>
  //         </View>
  //       ))}
  //     </View>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Habit Analysis</Text>
      </View>
    

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
          <ScrollView
        refreshControl={
        <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={PookieColors.hotPink}
            colors={[PookieColors.hotPink]}
          />
       }
 
    >

      <View style={styles.content}>
        {/* Metrics Section */}
       


        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={20} color={PookieColors.hotPink} />
            <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Your Profile</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Goal:</Text> {userProfile.primaryGoal}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Fitness Level:</Text> {userProfile.fitnessLevel}</Text>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Motivation:</Text> {userProfile.motivationLevel}</Text>
          </View>
        </View> */}
        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <View style={styles.section}>
            <ScrollView>
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
            </ScrollView>
          </View>
        )}

        {/* Gaps */}
        {analysis.gaps.length > 0 && (
          <View style={styles.section}>
            <ScrollView>
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
            </ScrollView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  content: {
    padding: 16,
    marginHorizontal: -4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: -4,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  metricValue: {
    color: '#1a1a1a',
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 6,
  },
  metricLabel: {
    color: '#4a4a4a',
    fontSize: 13,
    textAlign: 'center',
  },
  profileInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
    marginBottom: 20,
  },
  infoText: {
    color: '#1a1a1a',
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  infoLabel: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
  },
  listText: {
    color: '#333333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
    fontSize: 14,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  graphContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
    marginBottom: 16,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginTop: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    backgroundColor: '#ff6b35',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
    alignSelf: 'center',
  },
  barLabel: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
  streakCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  streakInfo: {
    flex: 1,
  },
  streakName: {
    color: '#1a1a1a',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  streakDays: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakNumber: {
    color: '#1a1a1a',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 6,
  },
  streakLabel: {
    color: '#666666',
    fontSize: 13,
  },
  streakBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  personalBestBadge: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  personalBestText: {
    color: '#ff6b35',
    fontSize: 11,
    fontWeight: '600',
  },
  skippedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  skippedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skippedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  skippedDetails: {
    flex: 1,
  },
  skippedName: {
    color: '#1a1a1a',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  skippedCount: {
    color: '#888888',
    fontSize: 13,
  },
  reviewButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  overallProgressCard: {
    backgroundColor: '#fff8f5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffebe0',
  },
  overallProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overallProgressInfo: {
    marginLeft: 14,
    flex: 1,
  },
  overallProgressTitle: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  overallProgressSubtitle: {
    color: '#666666',
    fontSize: 13,
  },
  viewDetailsButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 0,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ff6b35',
    borderRadius: 3,
  },
  progressText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
}); 