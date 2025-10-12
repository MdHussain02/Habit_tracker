import colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient"; // If you don't have expo-linear-gradient, see alternative below
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const { width } = Dimensions.get("window");

interface ShimmerPlaceholderProps {
  style: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

const ShimmerPlaceholder = ({
  style,
  width: customWidth,
  height: customHeight,
}: ShimmerPlaceholderProps) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500, // Slower, more elegant
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // Wider sweep for better effect
  });

  return (
    <View
      style={[
        styles.placeholder,
        style,
        customWidth != null ? { width: customWidth } : undefined,
        customHeight != null ? { height: customHeight } : undefined,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Using LinearGradient for smooth shimmer effect */}
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.4)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

// Alternative ShimmerPlaceholder without LinearGradient (if you don't have expo-linear-gradient)
const ShimmerPlaceholderAlternative = ({
  style,
  width: customWidth,
  height: customHeight,
}: ShimmerPlaceholderProps) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View
      style={[
        styles.placeholder,
        style,
        customWidth != null ? { width: customWidth } : undefined,
        customHeight != null ? { height: customHeight } : undefined,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmerOverlayAlternative,
          {
            transform: [{ translateX }],
            opacity,
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
          {[1, 2].map((item) => (
            <View key={item} style={styles.insightCard}>
              <ShimmerPlaceholder style={styles.insightIconPlaceholder} />
              <ShimmerPlaceholder style={styles.insightValuePlaceholder} />
              <ShimmerPlaceholder style={styles.insightLabelPlaceholder} />
            </View>
          ))}
        </View>
        {/* Quick Insights Grid Shimmer */}
        <View style={styles.insightsGrid}>
          {[1, 2].map((item) => (
            <View key={item} style={styles.insightCard}>
              <ShimmerPlaceholder style={styles.insightIconPlaceholder} />
              <ShimmerPlaceholder style={styles.insightValuePlaceholder} />
              <ShimmerPlaceholder style={styles.insightLabelPlaceholder} />
            </View>
          ))}
        </View>

        {/* {/* Profile Summary Card Shimmer */}
        <View style={styles.profileSummaryCard}>
          <View style={styles.profileSummaryHeader}>
            <ShimmerPlaceholder style={styles.profileAvatarPlaceholder} />
            <View style={styles.profileInfo}>
              <ShimmerPlaceholder style={styles.profileLevelPlaceholder} />
              <ShimmerPlaceholder style={styles.profileGoalPlaceholder} />
            </View>
            <ShimmerPlaceholder style={styles.motivationBadgePlaceholder} />
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.profileDetailRow}>
              <ShimmerPlaceholder
                style={styles.profileDetailLabelPlaceholder}
              />
              <ShimmerPlaceholder
                style={styles.profileDetailValuePlaceholder}
              />
            </View>
            <View style={styles.profileDetailRow}>
              <ShimmerPlaceholder
                style={styles.profileDetailLabelPlaceholder}
              />
              <ShimmerPlaceholder
                style={styles.profileDetailValuePlaceholder}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["bg-light"] || "#f8f9fa",
  },
  placeholder: {
    backgroundColor: "#e2e8f0", // Light gray background
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
  },
  shimmerOverlayAlternative: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: 100,
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 0,
  },
  progressOverviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressTitlePlaceholder: {
    width: 160,
    height: 20,
    marginBottom: 6,
  },
  progressSubtitlePlaceholder: {
    width: 200,
    height: 16,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  progressStat: {
    alignItems: "center",
  },
  progressCirclePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  progressLabelPlaceholder: {
    width: 70,
    height: 14,
  },
  insightsGrid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    marginBottom: 20,
    // justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 4,
  },
  insightCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    // width: (width - 56) / 2,
    width: (width - 60) / 2,

    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  insightIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
  },
  insightValuePlaceholder: {
    width: 30,
    height: 30,
    marginBottom: 6,
  },
  insightLabelPlaceholder: {
    width: 60,
    height: 14,
  },
  profileSummaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  profileSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileLevelPlaceholder: {
    width: 97,
    height: 18,
    marginBottom: 6,
  },
  profileGoalPlaceholder: {
    width: 78,
    height: 24,
  },
  motivationBadgePlaceholder: {
    width: 80,
    height: 32,
    borderRadius: 16,
  },
  profileDetails: {
    gap: 12,
  },
  profileDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileDetailLabelPlaceholder: {
    width: 60,
    height: 16,
  },
  profileDetailValuePlaceholder: {
    width: 80,
    height: 16,
  },
  analysisCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  analysisCardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    marginBottom: 6,
  },
  analysisSubtitlePlaceholder: {
    width: 160,
    height: 14,
  },
  analysisContent: {
    gap: 14,
  },
  analysisItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  analysisItemDotPlaceholder: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  analysisItemTextPlaceholder: {
    height: 16,
    flex: 1,
  },
});

export default AnalyticsShimmer;
