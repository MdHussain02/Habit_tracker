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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.headerDate}>Your Progress Overview</Text>
          </View>
        </View>
      </View>


      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={PookieColors.hotPink}
            colors={[PookieColors.hotPink]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Main Stats Cards */}
          <View style={styles.mainStatsContainer}>
            <View style={styles.primaryStatCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trophy" size={28} color={PookieColors.hotPink} />
              </View>
              <Text style={styles.primaryStatValue}>{metrics.consistencyScore}%</Text>
              <Text style={styles.primaryStatLabel}>Consistency Score</Text>
            </View>
            
            <View style={styles.secondaryStatCard}>
              <View style={styles.statIcon}>
                <Ionicons name="flame" size={24} color="#FF6B35" />
              </View>
              <Text style={styles.secondaryStatValue}>{metrics.balanceScore}%</Text>
              <Text style={styles.secondaryStatLabel}>Balance Score</Text>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <View style={styles.quickStatTop}>
                <Ionicons name="list" size={20} color="#4CAF50" />
                <Text style={styles.quickStatValue}>{metrics.totalHabits}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Total Habits</Text>
            </View>

            <View style={styles.quickStatCard}>
              <View style={styles.quickStatTop}>
                <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
                <Text style={styles.quickStatValue}>{metrics.activeHabits}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Active</Text>
            </View>

            <View style={styles.quickStatCard}>
              <View style={styles.quickStatTop}>
                <Ionicons name="trending-up" size={20} color="#9C27B0" />
                <Text style={styles.quickStatValue}>{metrics.averageFrequency.toFixed(1)}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Avg Frequency</Text>
            </View>

            <View style={styles.quickStatCard}>
              <View style={styles.quickStatTop}>
                <Ionicons name="person" size={20} color="#FF9800" />
                <Text style={styles.quickStatValue}>{userProfile.age}</Text>
              </View>
              <Text style={styles.quickStatLabel}>Age</Text>
            </View>
          </View>

          {/* Profile Info Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Ionicons name="person-circle" size={24} color={PookieColors.hotPink} />
              <Text style={styles.profileTitle}>Your Profile</Text>
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Fitness Level</Text>
                <Text style={styles.profileValue}>{userProfile.fitnessLevel}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Primary Goal</Text>
                <Text style={styles.profileValue}>{userProfile.primaryGoal}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Motivation Level</Text>
                <Text style={styles.profileValue}>{userProfile.motivationLevel}</Text>
              </View>
            </View>
          </View>

          {/* Strengths Section */}
          {analysis.strengths.length > 0 && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <View style={styles.analysisIconContainer}>
                  <Ionicons name="thumbs-up" size={20} color="#4CAF50" />
                </View>
                <Text style={[styles.analysisTitle, { color: '#4CAF50' }]}>Your Strengths</Text>
              </View>
              <View style={styles.analysisContent}>
                {analysis.strengths.map((strength, index) => (
                  <View key={index} style={styles.analysisItem}>
                    <View style={styles.analysisItemDot} />
                    <Text style={styles.analysisItemText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Areas for Improvement */}
          {analysis.gaps.length > 0 && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <View style={styles.analysisIconContainer}>
                  <Ionicons name="warning" size={20} color="#FF9800" />
                </View>
                <Text style={[styles.analysisTitle, { color: '#FF9800' }]}>Areas for Improvement</Text>
              </View>
              <View style={styles.analysisContent}>
                {analysis.gaps.map((gap, index) => (
                  <View key={`gap-${index}`} style={styles.analysisItem}>
                    <View style={[styles.analysisItemDot, { backgroundColor: '#FF9800' }]} />
                    <Text style={styles.analysisItemText}>{gap}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <View style={[styles.analysisCard, { marginBottom: 40 }]}>
              <View style={styles.analysisHeader}>
                <View style={styles.analysisIconContainer}>
                  <Ionicons name="bulb" size={20} color={PookieColors.hotPink} />
                </View>
                <Text style={[styles.analysisTitle, { color: PookieColors.hotPink }]}>Recommendations</Text>
              </View>
              <View style={styles.analysisContent}>
                {analysis.recommendations.map((recommendation, index) => (
                  <View key={`rec-${index}`} style={styles.analysisItem}>
                    <View style={[styles.analysisItemDot, { backgroundColor: PookieColors.hotPink }]} />
                    <Text style={styles.analysisItemText}>{recommendation}</Text>
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
    backgroundColor: '#f5f7fa',
  },

  sectionHeader: {
    marginBottom: 16,
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
    borderRadius: 12,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
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
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PookieColors.hotPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  mainStatsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  primaryStatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flex: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryStatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryStatValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  primaryStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  secondaryStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  quickStatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  quickStatLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 12,
  },
  profileDetails: {
    gap: 12,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  analysisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  analysisIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  analysisContent: {
    gap: 12,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  analysisItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 8,
    marginRight: 12,
    flexShrink: 0,
  },
  analysisItemText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2c3e50',
    flex: 1,
  },
});