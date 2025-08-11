import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <ProtectedRoute requireAuth={false}>
      <View style={styles.container}>
        <Image source={require('../assets/images/heart.png')} style={styles.image} />
        <Text style={styles.title}>{'Unlock Your\nPotential with\nHabits'}</Text>
        <Text style={styles.subtitle}>
          Build lasting habits, track your progress, and get personalized insights with your AI-powered coach.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/register')} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Start Your Journey   <Ionicons name="arrow-forward" size={15} color="#fff" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')} activeOpacity={0.7}>
          <Text style={styles.loginLinkText}>Already a member? <Text style={styles.loginLinkTextBold}>Log in</Text></Text>
        </TouchableOpacity>
        <Text style={styles.footer}>Made By <Text style={styles.visily}>DevZain</Text></Text>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#6d28d9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 18,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginBottom: 18,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },
  loginLinkTextBold: {
    color: '#6d28d9',
    fontWeight: 'bold',
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
    color: '#6d28d9',
    fontWeight: 'bold',
  },
}); 