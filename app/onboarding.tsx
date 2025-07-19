import { PookieColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const handleStartJourney = () => {
    // Navigate to the main app
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.gradientBackground}
      >
        {/* Top Section - Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.mainCircle}>
            <View style={styles.personContainer}>
              {/* Person illustration */}
              <View style={styles.person}>
                <View style={styles.personBody} />
                <View style={styles.personHead} />
                <View style={styles.personArm} />
                <View style={styles.targetIcon}>
                  <Ionicons name="locate" size={16} color="#fff" />
                </View>
              </View>
              
              {/* Surrounding icons */}
              <View style={styles.surroundingIcons}>
                <View style={[styles.smallIcon, { top: 20, left: 20 }]}>
                  <Ionicons name="leaf" size={12} color="#FF6B6B" />
                </View>
                <View style={[styles.smallIcon, { top: 40, right: 30 }]}>
                  <Ionicons name="bulb" size={12} color="#4ECDC4" />
                </View>
                <View style={[styles.smallIcon, { bottom: 30, left: 25 }]}>
                  <Ionicons name="flash" size={12} color="#FFE66D" />
                </View>
                <View style={[styles.smallIcon, { bottom: 50, right: 20 }]}>
                  <Ionicons name="shield" size={12} color="#FF6B6B" />
                </View>
                <View style={[styles.smallIcon, { top: 60, left: 50 }]}>
                  <Ionicons name="checkmark" size={12} color="#4ECDC4" />
                </View>
                <View style={[styles.smallIcon, { bottom: 20, right: 50 }]}>
                  <Ionicons name="trending-up" size={12} color="#FFE66D" />
                </View>
              </View>
            </View>
          </View>
          
          {/* Decorative dots */}
          <View style={[styles.dot, { top: 100, left: 50 }]} />
          <View style={[styles.dot, { top: 150, right: 80 }]} />
          <View style={[styles.dot, { bottom: 200, left: 30 }]} />
          <View style={[styles.dot, { bottom: 250, right: 40 }]} />
        </View>

        {/* Middle Section - Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>Unlock Your Potential with Habits</Text>
          <Text style={styles.description}>
            Build lasting habits, track your progress, and get personalized insights with your AI-powered coach.
          </Text>
        </View>

        {/* Bottom Section - Call to Action */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartJourney}
          >
            <Text style={styles.startButtonText}>Start Your Journey</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with</Text>
          <Text style={styles.visilyText}>Visily</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradientBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  personContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  person: {
    position: 'relative',
    width: 60,
    height: 80,
  },
  personHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFB6C1',
    position: 'absolute',
    top: 0,
    left: 20,
  },
  personBody: {
    width: 30,
    height: 40,
    backgroundColor: '#FFB6C1',
    position: 'absolute',
    top: 20,
    left: 15,
    borderRadius: 15,
  },
  personArm: {
    width: 8,
    height: 25,
    backgroundColor: '#FFB6C1',
    position: 'absolute',
    top: 25,
    right: 5,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  targetIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    left: 20,
  },
  surroundingIcons: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  smallIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: PookieColors.hotPink,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
  visilyText: {
    color: PookieColors.hotPink,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
}); 