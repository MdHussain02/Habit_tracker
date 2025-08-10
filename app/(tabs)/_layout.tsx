import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ProtectedRoute } from '../../components/ProtectedRoute';

// Custom tab bar component with cutout background
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const animatedValues = React.useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;
  
  const cutoutAnimated = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    animatedValues.forEach((animValue: Animated.Value, index: number) => {
      Animated.spring(animValue, {
        toValue: state.index === index ? 1 : 0,
        useNativeDriver: false,
        tension: 120,
        friction: 6,
      }).start();
    });

    // Animate cutout position
    Animated.spring(cutoutAnimated, {
      toValue: state.index,
      useNativeDriver: false,
      tension: 120,
      friction: 6,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabContainer}>
      {/* Background with cutout */}
      <View style={styles.tabBarBackground}>
        <Animated.View
          // style={[
          //   styles.cutoutCircle,
          //   {
          //     left: cutoutAnimated.interpolate({
          //       inputRange: [0, 1, 2, 3],
          //       outputRange: ['12.5%', '37.5%', '62.5%', '87.5%'],
          //     }),
          //   },
          // ]}
        />
      </View>
      
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const animatedValue = animatedValues[index];
          
          const scale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          });

          const translateY = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20 ],
          });

          const backgroundOpacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <View key={route.key} style={styles.tabItem}>
              {/* Active tab elevated background */}
              <Animated.View
                style={[
                  styles.activeBackground,
                  {
                    opacity: backgroundOpacity,
                    transform: [{ scale }, { translateY }],
                  },
                ]}
              />
              
              <Animated.View
                style={[
                  styles.tabButton,
                  {
                    transform: [{ scale }, { translateY }],
                  },
                ]}
                onTouchStart={onPress}
              >
                <View style={styles.iconContainer}>
                  {options.tabBarIcon({
                    color: isFocused ? '#ffffff' : '#7a7a7a',
                    size: 22,
                  })}
                  {isFocused && <View style={styles.activeIndicator} />}
                </View>
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <ProtectedRoute requireAuth={true}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="coach"
          options={{
            title: 'Coach',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bulb" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  // @ts-ignore - TypeScript has issues with complex style objects
  tabContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    position: 'absolute',
    width: '100%',
    maxWidth: 300,
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 50,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  activeIndicator: {
    position: 'absolute', 
    bottom: -20,
    width: 6,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
    zIndex: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
    zIndex: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 60,
  },
  activeBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#18181b',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 3,
  },
  iconContainer: {
    alignItems: 'center',
    elevation: 8,
  },
});
