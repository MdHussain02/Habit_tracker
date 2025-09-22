import colors from '@/constants/Colors';
import { useEffect } from 'react';
import { Animated, Dimensions, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const { width } = Dimensions.get('window');

interface ShimmerPlaceholderProps {
  style: StyleProp<ViewStyle>;
}

const ShimmerPlaceholder = ({ style }: ShimmerPlaceholderProps) => {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.placeholder, style]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const AnalyticsShimmer = () => {
  return (
    <View style={styles.container}>
      {/* Header Shimmer */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ShimmerPlaceholder style={styles.greetingPlaceholder} />
            <ShimmerPlaceholder style={styles.headerDatePlaceholder} />
          </View>
          <View style={styles.headerStats}>
            <View style={styles.headerStatItem}>
              <ShimmerPlaceholder style={styles.headerStatValuePlaceholder} />
              <ShimmerPlaceholder style={styles.headerStatLabelPlaceholder} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Progress Overview Card Shimmer */}
        <View style={styles.progressOverviewCard}>
          <View style={styles.progressHeader}>
            <ShimmerPlaceholder style={styles.progressTitlePlaceholder} />
            <ShimmerPlaceholder style={styles.progressSubtitlePlaceholder} />
          </View>
          <View style={styles.progressStats}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.progressStat}>
                <ShimmerPlaceholder style={styles.progressCirclePlaceholder} />
                <ShimmerPlaceholder style={styles.progressLabelPlaceholder} />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Insights Grid Shimmer */}
        <View style={styles.insightsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.insightCard}>
              <ShimmerPlaceholder style={styles.insightIconPlaceholder} />
              <ShimmerPlaceholder style={styles.insightValuePlaceholder} />
              <ShimmerPlaceholder style={styles.insightLabelPlaceholder} />
            </View>
          ))}
        </View>

        {/* Profile Summary Card Shimmer */}
        <View style={styles.profileSummaryCard}>
          <View style={styles.profileSummaryHeader}>
            <ShimmerPlaceholder style={styles.profileAvatarPlaceholder} />
            <View style={styles.profileInfo}>
              <ShimmerPlaceholder style={styles.profileLevelPlaceholder} />
              <ShimmerPlaceholder style={styles.profileGoalPlaceholder} />
            </View>
            <ShimmerPlaceholder style={styles.motivationBadgePlaceholder} />
          </View>
        </View>

        {/* Analysis Cards Shimmer */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.analysisCard}>
            <View style={styles.analysisCardHeader}>
              <ShimmerPlaceholder style={styles.analysisIconContainerPlaceholder} />
              <View style={styles.analysisTitleContainer}>
                <ShimmerPlaceholder style={styles.analysisTitlePlaceholder} />
                <ShimmerPlaceholder style={styles.analysisSubtitlePlaceholder} />
              </View>
            </View>
            <View style={styles.analysisContent}>
              {[1, 2, 3].map((analysisItem) => (
                <View key={analysisItem} style={styles.analysisItem}>
                  <ShimmerPlaceholder style={styles.analysisItemDotPlaceholder} />
                  <ShimmerPlaceholder style={styles.analysisItemTextPlaceholder} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['bg-light'],
  },
  placeholder: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 4,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors['bg-secondary'],
    transform: [{ translateX: -100 }],
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
  greetingPlaceholder: {
    width: 120,
    height: 24,
    borderRadius: 4,
    marginBottom: 4,
  },
  headerDatePlaceholder: {
    width: 180,
    height: 14,
    borderRadius: 4,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 15,
  },
  headerStatItem: {
    alignItems: 'center',
  },
  headerStatValuePlaceholder: {
    width: 40,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  headerStatLabelPlaceholder: {
    width: 60,
    height: 12,
    borderRadius: 4,
  },
  content: {
    padding: 20,
  },
  progressOverviewCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    marginBottom: 16,
  },
  progressTitlePlaceholder: {
    width: 150,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressSubtitlePlaceholder: {
    width: 200,
    height: 14,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressCirclePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  progressLabelPlaceholder: {
    width: 60,
    height: 13,
    borderRadius: 4,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#ffffff',
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
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  insightIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
  },
  insightValuePlaceholder: {
    width: 40,
    height: 24,
    borderRadius: 4,
    marginBottom: 4,
  },
  insightLabelPlaceholder: {
    width: 50,
    height: 13,
    borderRadius: 4,
  },
  profileSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  profileSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileLevelPlaceholder: {
    width: 100,
    height: 18,
    borderRadius: 4,
    marginBottom: 4,
  },
  profileGoalPlaceholder: {
    width: 120,
    height: 14,
    borderRadius: 4,
  },
  motivationBadgePlaceholder: {
    width: 80,
    height: 32,
    borderRadius: 16,
  },
  analysisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  analysisCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  analysisIconContainerPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  analysisTitleContainer: {
    flex: 1,
  },
  analysisTitlePlaceholder: {
    width: 140,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  analysisSubtitlePlaceholder: {
    width: 120,
    height: 14,
    borderRadius: 4,
  },
  analysisContent: {
    gap: 16,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  analysisItemDotPlaceholder: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 16,
    flexShrink: 0,
  },
  analysisItemTextPlaceholder: {
    height: 15,
    flex: 1,
    borderRadius: 4,
  },
});

export default AnalyticsShimmer;
