import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/splash-icon.png')} style={styles.image} />
      <Text style={styles.title}>Unlock Your Potential with Habits</Text>
      <Text style={styles.subtitle}>
        Build lasting habits, track your progress, and get personalized insights with your AI-powered coach.
      </Text>
      <Button title="Start Your Journey" onPress={onComplete} color="#FF1972" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
  },
}); 