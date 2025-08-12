import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProtectedRoute } from '../../components/ProtectedRoute';

// Custom tab bar component with simplified animation
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  // Single animated value for the active tab indicator
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;
  
  // Calculate the position based on the active tab
  const indicatorLeft = indicatorPosition.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['2%', '26%', '50%', '74%'],
  });
  
  // Animate the indicator when tab changes
  React.useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: state.index,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBarBackground}>
        {/* Animated indicator */}
        <Animated.View 
          style={[
            styles.activeIndicator,
            { 
              left: indicatorLeft,
              transform: [{
                translateX: Animated.multiply(
                  indicatorPosition.interpolate({
                    inputRange: [0, 1, 2, 3],
                    outputRange: [0, 0, 0, 0],
                  }),
                  -1
                )
              }]
            }
          ]} 
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

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {options.tabBarIcon({
                  color: isFocused ? '#4CAF50' : '#7a7a7a',
                  size: 24,
                })}
              </View>
            </TouchableOpacity>
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
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    position: 'absolute',
    width: '100%',
    maxWidth: '80%',
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '23%',
    height: '100%',
    backgroundColor: 'rgba(105, 199, 108, 0.1)',
    borderRadius: 30,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: 300,
    height: 55,
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
