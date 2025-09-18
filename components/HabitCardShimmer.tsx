import colors from '@/constants/Colors';
import { useEffect } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

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

const HabitCardShimmer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ShimmerPlaceholder style={styles.iconPlaceholder} />
        <View style={styles.content}>
          <ShimmerPlaceholder style={styles.titlePlaceholder} />
          <View style={styles.streakContainer}>
            <ShimmerPlaceholder style={styles.streakPlaceholder} />
            <ShimmerPlaceholder style={styles.timePlaceholder} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 25,
  },
  placeholder: {
    backgroundColor: colors['border-light'],
    borderRadius: 4,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.light,
    opacity: 0.7,
  },
  card: {
    backgroundColor: colors['bg-light'],
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 117,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  titlePlaceholder: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: colors['bg-accent'],
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakPlaceholder: {
    width: 60,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: colors['bg-accent'],
  },
  timePlaceholder: {
    width: 80,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors['bg-accent'],
  },
});

export default HabitCardShimmer;
