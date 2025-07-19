import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/heart.png')} style={styles.image} />
      <Text style={styles.title}>{'Unlock Your\nPotential with\nHabits'}</Text>
      <Text style={styles.subtitle}>
        Build lasting habits, track your progress, and get personalized insights with your AI-powered coach.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onComplete} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Start Your Journey  {'>'}</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Made By <Text style={styles.visily}>DevZain</Text></Text>
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
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 32,
    minWidth: 260,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
  },
  visily: {
    color: '#7066F6',
    fontWeight: 'bold',
  },
}); 