import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'right',
  duration = 300,
  delay = 0,
  style,
  onAnimationComplete,
}) => {
  const animValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimation = () => {
      let animation: Animated.CompositeAnimation;

      switch (type) {
        case 'fade':
          // Start from 0 and animate to 1
          animValue.setValue(0);
          animation = Animated.timing(animValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          break;

        case 'slide':
          const startValue = direction === 'left' || direction === 'right' ? 100 : 0;
          const endValue = 0;
          
          animValue.setValue(startValue);
          animation = Animated.timing(animValue, {
            toValue: endValue,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          break;

        case 'scale':
          // Start from 0.95 and animate to 1
          scaleValue.setValue(0.95);
          animation = Animated.timing(scaleValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          break;

        case 'bounce':
          // Start from 0.95 and animate through bounce sequence
          scaleValue.setValue(0.95);
          animation = Animated.sequence([
            Animated.timing(scaleValue, {
              toValue: 1.1,
              duration: duration * 0.4,
              delay,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(scaleValue, {
              toValue: 0.9,
              duration: duration * 0.2,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: duration * 0.4,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
          ]);
          break;

        default:
          // Default fade animation
          animValue.setValue(0);
          animation = Animated.timing(animValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
      }

      // Use InteractionManager for better performance
      const runAnimation = () => {
        animation.start((result) => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
          // Ensure content is visible after animation
          if (result.finished) {
            if (type === 'fade') {
              animValue.setValue(1);
            } else if (type === 'scale' || type === 'bounce') {
              scaleValue.setValue(1);
            } else if (type === 'slide') {
              animValue.setValue(0);
            }
          }
        });
      };

      if (delay > 0) {
        setTimeout(runAnimation, delay);
      } else {
        runAnimation();
      }

      // Safety timeout to ensure content becomes visible
      const safetyTimeout = setTimeout(() => {
        if (type === 'fade') {
          animValue.setValue(1);
        } else if (type === 'scale' || type === 'bounce') {
          scaleValue.setValue(1);
        } else if (type === 'slide') {
          animValue.setValue(0);
        }
      }, duration + delay + 100);

      return () => clearTimeout(safetyTimeout);
    };

    startAnimation();
  }, [type, direction, duration, delay]);

  const getAnimatedStyle = (): any => {
    switch (type) {
      case 'fade':
        return {
          opacity: animValue,
        };

      case 'slide':
        if (direction === 'left' || direction === 'right') {
          return {
            transform: [{ translateX: animValue }],
          };
        } else {
          return {
            transform: [{ translateY: animValue }],
          };
        }

      case 'scale':
        return {
          transform: [{ scale: scaleValue }],
        };

      case 'bounce':
        return {
          transform: [{ scale: scaleValue }],
        };

      default:
        return {
          opacity: animValue,
        };
    }
  };

  // Ensure content is always visible as fallback
  const fallbackStyle = {
    opacity: 1,
    transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
};

