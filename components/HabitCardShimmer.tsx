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

const HabitCardShimmer = () => {
  // Create an array of 10 items to map over
  const shimmerItems = Array(10).fill(null);

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
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: [{ translateX: -100 }],
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 117,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  titlePlaceholder: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f0f0f0',
  },
  timePlaceholder: {
    width: 80,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  checkboxPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default HabitCardShimmer;
