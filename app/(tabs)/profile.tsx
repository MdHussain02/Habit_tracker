import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PROFILE_KEY = 'userProfile';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      if (data) {
        setProfile(JSON.parse(data));
      } else {
        // Try to load registration data for first time
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        const height = await AsyncStorage.getItem('userHeight');
        const weight = await AsyncStorage.getItem('userWeight');
        const age = await AsyncStorage.getItem('userAge');
        const gender = await AsyncStorage.getItem('userGender');
        setProfile({
          name: name || '',
          email: email || '',
          height: height || '',
          weight: weight || '',
          age: age || '',
          gender: gender || '',
          avatar: '',
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const newProfile = { ...profile, avatar: uri };
      setProfile(newProfile);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={() => router.push('/profile/settings')}
          style={styles.settingsBtn}
        >
          <Ionicons name="settings" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <Image
          source={profile.avatar ? { uri: profile.avatar } : require('../../assets/images/heart.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarBtn} onPress={pickAvatar}>
          <Text style={styles.editAvatarText}>Edit Avatar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile.name || '-'}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email || '-'}</Text>
        <Text style={styles.label}>Height</Text>
        <Text style={styles.value}>{profile.height ? profile.height + ' cm' : '-'}</Text>
        <Text style={styles.label}>Weight</Text>
        <Text style={styles.value}>{profile.weight ? profile.weight + ' kg' : '-'}</Text>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.value}>{profile.age || '-'}</Text>
        <Text style={styles.label}>Gender</Text>
        <Text style={styles.value}>{profile.gender || '-'}</Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('onboardingDone');
          await AsyncStorage.removeItem('userRegistered');
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    alignItems: 'center',
    paddingTop: 48,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  settingsBtn: {
    padding: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#23232b',
    marginBottom: 12,
  },
  editAvatarBtn: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  editAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoBox: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    marginTop: 8,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 2,
    fontWeight: '600',
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF1972',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
    width: '85%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 