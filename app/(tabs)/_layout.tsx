import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Configuration for the tab bar
const TAB_CONFIG = {
  positions: {
    0: '3%',    // Coach tab
    1: '27%',   // Habits tab  
    2: '51%',   // Stats tab
    3: '74.5%',   // Profile tab
  },
  indicatorWidth: '22%',
  animation: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
} as const;

// Tab configuration with colors and icons
const TAB_ITEMS = [
  {
    name: 'coach',
    title: 'Coach',
    icon: 'bulb' as const,
    color: colors.primary, // Purple
    bg: colors['bg-accent'],
  },
  {
    name: 'index',
    title: 'Habits',
    icon: 'infinite' as const,
    color: colors.primary, // Pink
    bg: colors['bg-accent'],
  },
  {
    name: 'analytics',
    title: 'Stats',
    icon: 'analytics' as const,
    color: colors.primary, // Orange/Yellow
    bg: colors['bg-accent'],
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'person' as const,
    color: colors.primary, // Cyan
    bg: colors['bg-accent'],
  },
];

const CustomTabBar = ({ state, navigation }: { state: any, navigation: any }) => {
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  const indicatorLeft = indicatorPosition.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: Object.values(TAB_CONFIG.positions),
  });
  
  React.useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: state.index,
      duration: TAB_CONFIG.animation.duration,
      useNativeDriver: false,
      easing: TAB_CONFIG.animation.easing,
    }).start();
  }, [state.index]);

  const activeTab = TAB_ITEMS[state.index];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <View style={styles.tabBarBackground}>
          {/* Animated pill indicator */}
          <Animated.View 
            style={[
              styles.activeIndicator,
              { 
                left: indicatorLeft,
                backgroundColor: activeTab.bg,
              }
            ]} 
          />
        </View>
        
        <View style={styles.tabBar}>
          {TAB_ITEMS.map((item, index) => {
            const isFocused = state.index === index;
            const route = state.routes[index];
            
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented && !isTransitioning) {
                setIsTransitioning(true);
                // Add a small delay for smooth transition
                setTimeout(() => {
                  navigation.navigate(route.name);
                  setIsTransitioning(false);
                }, 100);
              }
            };

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.tabItem}
                onPress={onPress}
                activeOpacity={0.8}
              >
                <View style={styles.tabContent}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={isFocused ? item.color : colors['bg-primary']} 
                  />
                  {isFocused && (
                    <Text 
                      style={[
                        styles.tabLabel, 
                        { color: item.color }
                      ]}
                    >
                      {item.title}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TAB_ITEMS.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={item.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}





const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  tabContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors['bg-secondary'],
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    width: TAB_CONFIG.indicatorWidth,
    height: '77%',
    borderRadius: 28,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 8,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textAlign: 'center',
  },
});


const screenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors['text-secondary'],
  },
});

// Merge the screen styles with main styles
Object.assign(styles, screenStyles);