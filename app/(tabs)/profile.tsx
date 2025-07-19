import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    level: '', // Added for editable level
    quote: '', // Added for editable quote
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: '',
    level: '',
    quote: '',
  });

  // Mock data for demo
  const habits = [
    { name: 'Morning Meditation', percent: 75 },
    { name: 'Drink 8 Glasses of Water', percent: 90 },
    { name: 'Daily Workout', percent: 50 },
    { name: 'Read for 30 Minutes', percent: 100 },
  ];
  const achievements = [
    { icon: <MaterialCommunityIcons name="chat-processing" size={36} color="#FF7A7A" />, title: 'Streak Starter', subtitle: 'Achieved 7-day streak' },
    { icon: <MaterialCommunityIcons name="snowflake" size={36} color="#7A7AFF" />, title: 'Habit Master', subtitle: 'Completed 10 habits' },
    { icon: <MaterialCommunityIcons name="meditation" size={36} color="#FF7A7A" />, title: 'Zen Warrior', subtitle: 'Meditated for 30 days' },
    { icon: <MaterialCommunityIcons name="water" size={36} color="#7A7AFF" />, title: 'Hydration Hero', subtitle: 'Drank water for 60 days' },
  ];
  const stats = [
    { icon: <AntDesign name="checkcircleo" size={28} color="#7A7AFF" />, label: 'Overall Completion', value: '78%' },
    { icon: <MaterialCommunityIcons name="water" size={28} color="#7A7AFF" />, label: 'Current Streak Days', value: '35' },
    { icon: <MaterialCommunityIcons name="target" size={28} color="#7A7AFF" />, label: 'Active Habits', value: '12' },
  ];

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
          level: '12', // Default level
          quote: 'Consistency is key to lasting change.', // Default quote
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

  // Add edit modal handlers
  const openEditModal = () => {
    setEditProfile({
      name: profile.name || '',
      level: profile.level || '12',
      quote: profile.quote || 'Consistency is key to lasting change.',
    });
    setEditModalVisible(true);
  };
  const saveEditProfile = async () => {
    const newProfile = { ...profile, ...editProfile };
    setProfile(newProfile);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    setEditModalVisible(false);
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
      {/* Header Row with Settings Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/profile/settings')}
        >
          <AntDesign name="setting" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Profile Header */}
      <View style={styles.profileHeaderBox}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8} style={{ marginBottom: 0 }}>
            <Image
              source={profile.avatar ? { uri: profile.avatar } : require('../../assets/images/heart.png')}
              style={styles.avatarLarge}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editAvatarBtn} onPress={pickAvatar}>
            <Text style={styles.editAvatarText}>Edit Avatar</Text>
          </TouchableOpacity>
          <Text style={styles.profileName}>{profile.name || 'Jane Doe'}</Text>
          <Text style={styles.profileLevel}>Level {profile.level || '12'}: Habit Enthusiast</Text>
          <Text style={styles.profileQuote}>
            <Text style={{ fontStyle: 'italic', color: '#aaa' }}>
              "{profile.quote || 'Consistency is key to lasting change.'}"
            </Text>
          </Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={openEditModal}>
            <AntDesign name="edit" size={16} color="#7066F6" />
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {/* Achievements */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {achievements.map((ach, idx) => (
              <View key={idx} style={styles.achievementBadge}>
                {ach.icon}
                <Text style={styles.achievementTitle}>{ach.title}</Text>
                <Text style={styles.achievementSubtitle}>{ach.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Statistics Overview */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Statistics Overview</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {stats.map((stat, idx) => (
              <View key={idx} style={styles.statBox}>
                {stat.icon}
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Edit Profile Modal */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={editProfile.name}
                onChangeText={text => setEditProfile({ ...editProfile, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Level"
                placeholderTextColor="#aaa"
                value={editProfile.level}
                onChangeText={text => setEditProfile({ ...editProfile, level: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Motivational Quote"
                placeholderTextColor="#aaa"
                value={editProfile.quote}
                onChangeText={text => setEditProfile({ ...editProfile, quote: text })}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#7066F6' }]} onPress={saveEditProfile}>
                  <Text style={[styles.modalBtnText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    justifyContent: 'flex-end',
    width: '90%',
    marginBottom: 16,
  },
  settingsBtn: {
    padding: 8,
  },
  logoutButtonTop: {
    backgroundColor: '#FF1972',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    width: '90%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  profileHeaderBox: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    marginTop: 0,
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#23232b',
    marginBottom: 12,
  },
  profileName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileLevel: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 2,
  },
  profileQuote: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7066F6',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  editProfileBtnText: {
    color: '#7066F6',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  sectionBox: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 18,
    width: '90%',
    marginTop: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  habitCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  habitName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#7066F6',
    borderRadius: 4,
  },
  habitProgressText: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  achievementBadge: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    width: '47%',
    marginBottom: 10,
  },
  achievementTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  achievementSubtitle: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  statBox: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    marginBottom: 10,
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
  },
  chartPlaceholder: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#18181b',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalBtn: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 