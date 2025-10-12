import AnalyticsShimmer from "@/components/AnalyticsShimmer";
import colors from "@/constants/Colors";
import useSwrApi from "@/hooks/useSwrApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const onRefresh = () => {
    mutate();
  };

  const {
    data: analysisData,
    error,
    isLoading,
    mutate,
  } = useSwrApi("/suggestions/analysis");


  const renderAnalysisItem = ({
    item,
    index,
    color,
  }: {
    item: string;
    index: number;
    color: string;
  }) => (
    <View key={`analysis-${index}`} style={styles.analysisItem}>
      <View style={[styles.analysisItemDot, { backgroundColor: color }]} />
      <Text style={styles.analysisItemText}>{item}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Analytics</Text>
          <Text style={styles.headerDate}>Track your progress & insights</Text>
        </View>
        <View style={styles.loadingContainer}>
          <AnalyticsShimmer />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="warning-outline"
          size={48}
          color={colors["text-danger"]}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            // setIsLoading(true);
            mutate();
          }}
        >
          <Ionicons
            name="refresh"
            size={18}
            color="#fff"
            style={styles.retryIcon}
          />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!analysisData?.data) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="help-circle-outline"
          size={48}
          color={colors["text-secondary"]}
        />
        <Text style={styles.errorText}>No analysis data available</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { analysis, metrics, userProfile } = analysisData?.data;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Analytics</Text>
            <Text style={styles.headerDate}>
              Track your progress & insights
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatValue}>
                {metrics.consistencyScore}%
              </Text>
              <Text style={styles.headerStatLabel}>Consistency</Text>
            </View>
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatValue}>
                {metrics.balanceScore}%
              </Text>
              <Text style={styles.headerStatLabel}>Balance</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <View style={styles.content}>
            <View style={styles.progressOverviewCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: `${colors.primary}10` },
                    ]}
                  >
                    <Ionicons
                      name="stats-chart"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View>
                    <Text
                      style={[styles.sectionTitle, { color: colors.primary }]}
                    >
                      Progress Overview
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                      Your weekly performance snapshot
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <View
                    style={[
                      styles.progressCircle,
                      { borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.progressPercentage,
                        { color: colors.primary },
                      ]}
                    >
                      {metrics.consistencyScore}%
                    </Text>
                  </View>
                  <Text style={styles.progressLabel}>Consistency</Text>
                </View>
                <View style={styles.progressStat}>
                  <View
                    style={[
                      styles.progressCircle,
                      { borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.progressPercentage,
                        { color: colors.primary },
                      ]}
                    >
                      {metrics.balanceScore}%
                    </Text>
                  </View>
                  <Text style={styles.progressLabel}>Balance</Text>
                </View>
                <View style={styles.progressStat}>
                  <View
                    style={[
                      styles.progressCircle,
                      { borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.progressPercentage,
                        { color: colors.primary },
                      ]}
                    >
                      {metrics.activeHabits}
                    </Text>
                  </View>
                  <Text style={styles.progressLabel}>Active Habits</Text>
                </View>
              </View>
            </View>

            <View style={styles.insightsGrid}>
              <View style={styles.insightCard}>
                <View
                  style={[
                    styles.insightIcon,
                    { backgroundColor: `${colors.primary}10` },
                  ]}
                >
                  <Ionicons
                    name="trending-up"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.insightValue}>{metrics.totalHabits}</Text>
                <Text style={styles.insightLabel}>Total Habits</Text>
              </View>
              <View style={styles.insightCard}>
                <View
                  style={[
                    styles.insightIcon,
                    { backgroundColor: `${colors.primary}10` },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.insightValue}>{metrics.activeHabits}</Text>
                <Text style={styles.insightLabel}>Active</Text>
              </View>
              <View style={styles.insightCard}>
                <View
                  style={[
                    styles.insightIcon,
                    { backgroundColor: `${colors.primary}10` },
                  ]}
                >
                  <Ionicons name="calendar" size={24} color={colors.primary} />
                </View>
                <Text style={styles.insightValue}>
                  {metrics.averageFrequency.toFixed(1)}x
                </Text>
                <Text style={styles.insightLabel}>Per Week</Text>
              </View>
              <View style={styles.insightCard}>
                <View
                  style={[
                    styles.insightIcon,
                    { backgroundColor: `${colors.primary}10` },
                  ]}
                >
                  <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                <Text style={styles.insightValue}>{userProfile.age}</Text>
                <Text style={styles.insightLabel}>Age</Text>
              </View>
            </View>

            <View style={styles.profileSummaryCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: `${colors.primary}10` },
                    ]}
                  >
                    <Ionicons
                      name="person-circle"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View>
                    <Text
                      style={[styles.sectionTitle, { color: colors.primary }]}
                    >
                      Profile Summary
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                      Your fitness profile
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Fitness Level</Text>
                  <Text style={styles.profileValue}>
                    {userProfile.fitnessLevel}
                  </Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Primary Goal</Text>
                  <Text style={styles.profileValue}>
                    {userProfile.primaryGoal}
                  </Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Motivation</Text>
                  <View
                    style={[
                      styles.motivationBadge,
                      { backgroundColor: `${colors.primary}10` },
                    ]}
                  >
                    <Text
                      style={[styles.motivationText, { color: colors.primary }]}
                    >
                      {userProfile.motivationLevel}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {analysis.strengths.length > 0 && (
              <View style={styles.analysisCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <View
                      style={[
                        styles.sectionIcon,
                        { backgroundColor: `${colors.primary}10` },
                      ]}
                    >
                      <Ionicons
                        name="thumbs-up"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={[styles.sectionTitle, { color: colors.primary }]}
                      >
                        Your Strengths
                      </Text>
                      <Text style={styles.sectionSubtitle}>
                        Keep up the great work!
                      </Text>
                    </View>
                  </View>
                </View>
                <FlatList
                  data={analysis.strengths}
                  renderItem={({ item, index }) =>
                    renderAnalysisItem({ item, index, color: colors.primary })
                  }
                  keyExtractor={(item, index) => `strength-${index}`}
                  scrollEnabled={false}
                />
              </View>
            )}

            {analysis.gaps.length > 0 && (
              <View style={styles.analysisCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <View
                      style={[
                        styles.sectionIcon,
                        { backgroundColor: `${colors.primary}10` },
                      ]}
                    >
                      <Ionicons
                        name="warning"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={[styles.sectionTitle, { color: colors.primary }]}
                      >
                        Areas for Improvement
                      </Text>
                      <Text style={styles.sectionSubtitle}>
                        Focus on these opportunities
                      </Text>
                    </View>
                  </View>
                </View>
                <FlatList
                  data={analysis.gaps}
                  renderItem={({ item, index }) =>
                    renderAnalysisItem({ item, index, color: colors.primary })
                  }
                  keyExtractor={(item, index) => `gap-${index}`}
                  scrollEnabled={false}
                />
              </View>
            )}

            {analysis.recommendations.length > 0 && (
              <View style={[styles.analysisCard, { marginBottom: 40 }]}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <View
                      style={[
                        styles.sectionIcon,
                        { backgroundColor: `${colors.primary}10` },
                      ]}
                    >
                      <Ionicons name="bulb" size={24} color={colors.primary} />
                    </View>
                    <View>
                      <Text
                        style={[styles.sectionTitle, { color: colors.primary }]}
                      >
                        Smart Recommendations
                      </Text>
                      <Text style={styles.sectionSubtitle}>
                        AI-powered suggestions for you
                      </Text>
                    </View>
                  </View>
                </View>
                <FlatList
                  data={analysis.recommendations}
                  renderItem={({ item, index }) =>
                    renderAnalysisItem({ item, index, color: colors.primary })
                  }
                  keyExtractor={(item, index) => `rec-${index}`}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>
        )}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["bg-light"],
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors["text-light"],
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: colors["text-light"],
    fontWeight: "500",
    opacity: 0.9,
  },
  headerStats: {
    flexDirection: "row",
    gap: 16,
  },
  headerStatItem: {
    alignItems: "center",
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors["text-light"],
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 12,
    color: colors["text-light"],
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
    backgroundColor: colors["bg-light"],
  },
  errorText: {
    color: colors["text-danger"],
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: "row",
    backgroundColor: colors["bg-dark"],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    gap: 8,
  },
  retryIcon: {},
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  progressOverviewCard: {
    backgroundColor: colors["bg-accent"],
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: colors["border-light"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors["text-primary"],
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors["text-secondary"],
    opacity: 0.8,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
  },
  progressStat: {
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors["bg-accent"],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "800",
  },
  progressLabel: {
    fontSize: 14,
    color: colors["text-secondary"],
    fontWeight: "600",
    textAlign: "center",
  },
  insightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    gap: 16,
  },
  insightCard: {
    backgroundColor: colors["bg-accent"],
    borderRadius: 16,
    padding: 16,
    width: (width - 64) / 2,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: colors["border-light"],
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors["text-primary"],
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: colors["text-secondary"],
    fontWeight: "500",
    textAlign: "center",
  },
  profileSummaryCard: {
    backgroundColor: colors["bg-accent"],
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: colors["border-light"],
  },
  profileInfo: {
    gap: 12,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileLabel: {
    fontSize: 16,
    color: colors["text-secondary"],
    fontWeight: "500",
  },
  profileValue: {
    fontSize: 16,
    color: colors["text-primary"],
    fontWeight: "600",
    textTransform: "capitalize",
  },
  motivationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  motivationText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  analysisCard: {
    backgroundColor: colors["bg-accent"],
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: colors["border-light"],
  },
  analysisItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  analysisItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
    flexShrink: 0,
  },
  analysisItemText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors["text-secondary"],
    flex: 1,
    fontWeight: "500",
  },
});
