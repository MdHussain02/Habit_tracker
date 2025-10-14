import Button from '@/components/ui/Button';
import colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ProtectedRoute } from '../components/ProtectedRoute';

const { width, height } = Dimensions.get('window');

// Avatar data with positions
const avatarData = [
  { id: 1, size: 60, top: '12%', left: '8%', image: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, size: 70, top: '10%', right: '12%', image: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, size: 50, top: '22%', left: '22%', image: 'https://i.pravatar.cc/150?img=9' },
  { id: 4, size: 80, top: '18%', left: '38%', image: 'https://i.pravatar.cc/150?img=12' },
  { id: 5, size: 55, top: '20%', right: '20%', image: 'https://i.pravatar.cc/150?img=16' },
  { id: 6, size: 65, top: '32%', left: '10%', image: 'https://i.pravatar.cc/150?img=20' },
  { id: 7, size: 52, top: '35%', right: '8%', image: 'https://i.pravatar.cc/150?img=25' },
  { id: 8, size: 58, top: '42%', left: '25%', image: 'https://i.pravatar.cc/150?img=30' },
  { id: 9, size: 62, top: '45%', right: '22%', image: 'https://i.pravatar.cc/150?img=33' },
];

const FloatingAvatar = ({ avatar : avatar, index }: { avatar: any, index: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -15,
          duration: 2000 + index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000 + index * 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const position = {
    top: avatar.top,
    ...(avatar.left ? { left: avatar.left } : { right: avatar.right }),
  };

  return (
    <Animated.View
      style={[
        styles.avatar,
        position,
        {
          width: avatar.size,
          height: avatar.size,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Image
        source={{ uri: avatar.image }}
        style={styles.avatarImage}
      />
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ProtectedRoute requireAuth={false}>
      <LinearGradient
        colors={['#f5f3ff', '#fdf4ff', '#eff6ff']}
        style={styles.container}
      >
        {/* Decorative blur circles */}
        <View style={[styles.blurCircle, styles.blurCircle1]} />
        <View style={[styles.blurCircle, styles.blurCircle2]} />

        {/* Floating avatars */}
        <View style={styles.avatarContainer}>
          {avatarData.map((avatar, index) => (
            <FloatingAvatar key={avatar.id} avatar={avatar} index={index} />
          ))}
        </View>

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>
            {'Unlock Your\nPotential with\nHabits'}
          </Text>
          <Text style={styles.subtitle}>
            Build lasting habits, track your progress, and get personalized insights with your AI-powered coach.
          </Text>

          <Button onPress={() => router.push('/register')}>
            Start Your Journey
          </Button>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkText}>
              Already a member?{' '}
              <Text style={styles.loginLinkTextBold}>Log in</Text>
            </Text>
          </TouchableOpacity>

          {/* Page indicators */}
          <View style={styles.indicators}>
            <View style={styles.indicatorDot} />
            <View style={[styles.indicatorDot, styles.indicatorActive]} />
            <View style={styles.indicatorDot} />
          </View>
        </Animated.View>

        <Text style={styles.footer}>
          Made By <Text style={styles.visily}>DevZain</Text>
        </Text>
      </LinearGradient>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  blurCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  blurCircle1: {
    top: -100,
    left: -100,
    backgroundColor: '#c084fc',
  },
  blurCircle2: {
    bottom: -100,
    right: -100,
    backgroundColor: '#f9a8d4',
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  avatar: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: height * 0.3,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  loginLink: {
    marginTop: 20,
    marginBottom: 40,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },
  loginLinkTextBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  indicatorActive: {
    width: 32,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
  },
  visily: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});