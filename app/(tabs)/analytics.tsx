import AnalyticsShimmer from '@/components/AnalyticsShimmer';
import colors from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
    return <AnalyticsShimmer />;
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
            <Text style={styles.greeting}>Analytics</Text>
            <Text style={styles.headerDate}>Track your progress & insights</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatValue}>{metrics.consistencyScore}%</Text>
              <Text style={styles.headerStatLabel}>Consistency</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Progress Overview Card */}
          <View style={styles.progressOverviewCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress Overview</Text>
              <Text style={styles.progressSubtitle}>This week's performance</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <View style={[styles.progressCircle, { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' }]}>
                  <Text style={[styles.progressPercentage, { color: '#4CAF50' }]}>{metrics.consistencyScore}%</Text>
                </View>
                <Text style={styles.progressLabel}>Consistency</Text>
              </View>
              <View style={styles.progressStat}>
                <View style={[styles.progressCircle, { backgroundColor: 'rgba(255, 107, 53, 0.1)', borderColor: 'rgba(255, 107, 53, 0.3)' }]}>
                  <Text style={[styles.progressPercentage, { color: '#FF6B35' }]}>{metrics.balanceScore}%</Text>
                </View>
                <Text style={styles.progressLabel}>Balance</Text>
              </View>
              <View style={styles.progressStat}>
                <View style={[styles.progressCircle, { backgroundColor: 'rgba(156, 39, 176, 0.1)', borderColor: 'rgba(156, 39, 176, 0.3)' }]}>
                  <Text style={[styles.progressPercentage, { color: '#9C27B0' }]}>{metrics.activeHabits}</Text>
                </View>
                <Text style={styles.progressLabel}>Active Habits</Text>
              </View>
            </View>
          </View>

          {/* Quick Insights Grid */}
          <View style={styles.insightsGrid}>
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="trending-up" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.insightValue}>{metrics.totalHabits}</Text>
              <Text style={styles.insightLabel}>Total Habits</Text>
            </View>
            
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
              </View>
              <Text style={styles.insightValue}>{metrics.activeHabits}</Text>
              <Text style={styles.insightLabel}>Active</Text>
            </View>
            
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <Ionicons name="calendar" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.insightValue}>{metrics.averageFrequency.toFixed(1)}x</Text>
              <Text style={styles.insightLabel}>Per Week</Text>
            </View>
            
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="person" size={24} color="#FF9800" />
              </View>
              <Text style={styles.insightValue}>{userProfile.age}</Text>
              <Text style={styles.insightLabel}>Age</Text>
            </View>
          </View>

          {/* Profile Summary Card */}
          <View style={styles.profileSummaryCard}>
            <View style={styles.profileSummaryHeader}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person-circle" size={32} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileLevel}>{userProfile.fitnessLevel}</Text>
                <Text style={styles.profileGoal}>{userProfile.primaryGoal}</Text>
              </View>
              <View style={styles.motivationBadge}>
                <Text style={styles.motivationText}>{userProfile.motivationLevel}</Text>
              </View>
            </View>
          </View>

          {/* Analysis Cards */}
          {analysis.strengths.length > 0 && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisCardHeader}>
                <View style={[styles.analysisIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' }]}>
                  <Ionicons name="thumbs-up" size={24} color="#4CAF50" />
                </View>
                <View style={styles.analysisTitleContainer}>
                  <Text style={[styles.analysisTitle, { color: '#4CAF50' }]}>Your Strengths</Text>
                  <Text style={styles.analysisSubtitle}>Keep up the great work!</Text>
                </View>
              </View>
              <View style={styles.analysisContent}>
                {analysis.strengths.map((strength, index) => (
                  <View key={index} style={styles.analysisItem}>
                    <View style={[styles.analysisItemDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.analysisItemText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {analysis.gaps.length > 0 && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisCardHeader}>
                <View style={[styles.analysisIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)', borderColor: 'rgba(255, 152, 0, 0.3)' }]}>
                  <Ionicons name="warning" size={24} color="#FF9800" />
                </View>
                <View style={styles.analysisTitleContainer}>
                  <Text style={[styles.analysisTitle, { color: '#FF9800' }]}>Areas for Improvement</Text>
                  <Text style={styles.analysisSubtitle}>Focus on these areas</Text>
                </View>
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

          {analysis.recommendations.length > 0 && (
            <View style={[styles.analysisCard, { marginBottom: 40 }]}>
              <View style={styles.analysisCardHeader}>
                <View style={[styles.analysisIconContainer, { backgroundColor: 'rgba(255, 107, 53, 0.1)', borderColor: 'rgba(255, 107, 53, 0.3)' }]}>
                  <Ionicons name="bulb" size={24} color={colors.primary} />
                </View>
                <View style={styles.analysisTitleContainer}>
                  <Text style={[styles.analysisTitle, { color: colors.primary }]}>Smart Recommendations</Text>
                  <Text style={styles.analysisSubtitle}>AI-powered suggestions</Text>
                </View>
              </View>
              <View style={styles.analysisContent}>
                {analysis.recommendations.map((recommendation, index) => (
                  <View key={`rec-${index}`} style={styles.analysisItem}>
                    <View style={[styles.analysisItemDot, { backgroundColor: colors.primary }]} />
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
    backgroundColor: colors['bg-light'],
  },

  sectionHeader: {
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors['bg-light'],
  },
  errorText: {
    color: colors['text-danger'],
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
    backgroundColor: colors['bg-primary'],
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
    color: colors['text-light'],
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: colors['text-light'],
    fontWeight: '500',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 15,
  },
  headerStatItem: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors['text-light'],
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 12,
    color: colors['text-light'],
    fontWeight: '500',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors['bg-primary'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  progressOverviewCard: {
    backgroundColor:colors['bg-accent'],
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors['shadow'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors['text-secondary'],
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: colors['text-secondary'],
    fontWeight: '500',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors['bg-accent'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: colors['border-light'],
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: '800',
    color: colors['text-primary'],
  },
  progressLabel: {
    fontSize: 13,
    color: colors['text-secondary'],
    fontWeight: '600',
    textAlign: 'center',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  insightCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 16,
    padding: 20,
    width: (width - 56) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors['bg-dark'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 13,
    color: colors['text-secondary'],
    fontWeight: '500',
    textAlign: 'center',
  },
  profileSummaryCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors['border-light'], 
  },
  profileSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors['bg-accent'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors['border-light'],
  },
  profileInfo: {
    flex: 1,
  },
  profileLevel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors['text-primary'],
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  profileGoal: {
    fontSize: 14,
    color: colors['text-primary'],
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  motivationBadge: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  motivationText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors['text-dark'],
    textTransform: 'capitalize',
  },
  analysisCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors['shadow'],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  analysisCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  analysisIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors['bg-primary'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors['border-light'],
  },
  analysisTitleContainer: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors['text-secondary'],
    marginBottom: 4,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: colors['text-secondary'],
    fontWeight: '500',
  },
  analysisContent: {
    gap: 16,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  analysisItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors['bg-primary'],
    marginTop: 8,
    marginRight: 16,
    flexShrink: 0,
  },
  analysisItemText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors['text-secondary'],
    flex: 1,
    fontWeight: '500',
  },
});