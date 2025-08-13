import { useToast } from '@/hooks/useToast';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal, RefreshControl, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';

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
    level: '',
    quote: '',
  });

  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: '',
    level: '',
    quote: '',
  });

  const router = useRouter();
  const { fetchGet } = useApi();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const getProfileDetails = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Try to get cached profile first if not forcing refresh
      if (!forceRefresh) {
        const cachedProfile = await AsyncStorage.getItem(PROFILE_KEY);
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
          setLoading(false);
          return; // Use cached data if available
        }
      }
      
      // Fetch fresh data from API
      const data = await fetchGet(`${API_BASE_URL}/auth/me`);
      if (data.success && data.data) {
        const profileData = {
          name: data.data.name || '',
          email: data.data.email || '',
          height: data.data.height?.toString() || '',
          weight: data.data.weight?.toString() || '',
          age: data.data.age?.toString() || '',
          gender: data.data.gender || '',
          avatar: data.data.avatar || '',
          level: data.data.fitnessLevel || '',
          quote: data.data.motivationLevel || '',
          lastUpdated: new Date().toISOString(),
        };
        
        setProfile(profileData);
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
      } else {
        showToast('Failed to load profile', 'error');
      }
    } catch (error: any) {
      console.error('Profile error:', error);
      if (forceRefresh) {
        showToast('Failed to refresh profile', 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Add pull-to-refresh handler
  const handleRefresh = () => {
    getProfileDetails(true); // Force refresh
  };

  useEffect(() => {
    getProfileDetails();
    
    // Set up interval to refresh data every 30 minutes
    const interval = setInterval(() => {
      getProfileDetails(true);
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

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

  const openEditModal = () => {
    setEditProfile({
      name: profile.name || '',
      level: profile.level || 'Beginner',
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

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      router.replace('/onboarding');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text style={styles.loadingText}>Loading profile...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/profile/settings')}
        >
          <AntDesign name="setting" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeaderBox}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profile.avatar
                  ? { uri: profile.avatar }
                  : require('../../assets/images/heart.png')
              }
              style={styles.avatarLarge}
            />
            <TouchableOpacity style={styles.editAvatarBtn} onPress={pickAvatar}>
              <AntDesign name="edit" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile.name || 'Jane Doe'}</Text>
          <Text style={styles.profileLevel}>
            Level: {profile.level || 'Beginner'}
          </Text>
          <Text style={styles.profileQuote}>
            <Text style={{ fontStyle: 'italic', color: '#aaa' }}>
              "{profile.quote || 'Consistency is key to lasting change.'}"
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.personalDetailsTile}
          onPress={() => router.push('/profile/details')}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="account-details"
              size={24}
              color="#7066F6"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                Personal Details
              </Text>
              <Text style={{ color: '#aaa', fontSize: 13 }}>{profile.email}</Text>
            </View>
          </View>
          <AntDesign name="right" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* Health Metrics Summary */}
        <View style={styles.healthMetricsContainer}>
          <View style={styles.healthMetric}>
            <Text style={styles.healthMetricValue}>{profile.height || '--'}</Text>
            <Text style={styles.healthMetricLabel}>Height (cm)</Text>
          </View>
          <View style={styles.healthMetricDivider} />
          <View style={styles.healthMetric}>
            <Text style={styles.healthMetricValue}>{profile.weight || '--'}</Text>
            <Text style={styles.healthMetricLabel}>Weight (kg)</Text>
          </View>
          <View style={styles.healthMetricDivider} />
          <View style={styles.healthMetric}>
            <Text style={styles.healthMetricValue}>{profile.age || '--'}</Text>
            <Text style={styles.healthMetricLabel}>Age</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.achievementsTile}
          onPress={() => router.push('/profile/achievements')}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="trophy-award"
              size={24}
              color="#FFD93D"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                Achievements
              </Text>
              <Text style={{ color: '#aaa', fontSize: 13 }}>View your badges</Text>
            </View>
          </View>
          <AntDesign name="right" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor='#4CAF50'
          />
        }
      >
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
                onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Level"
                placeholderTextColor="#aaa"
                value={editProfile.level}
                onChangeText={(text) => setEditProfile({ ...editProfile, level: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Motivational Quote"
                placeholderTextColor="#aaa"
                value={editProfile.quote}
                onChangeText={(text) => setEditProfile({ ...editProfile, quote: text })}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#7066F6' }]}
                  onPress={saveEditProfile}
                >
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
    backgroundColor: '#fff', // Light background
    alignItems: 'center',
    paddingTop: 48,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff', // Light background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#11181C', // Dark text
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
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7066F6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#23232b',
  },
  editAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  profileHeaderBox: {
    backgroundColor: '#f0f0f0', // Light background
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
    color: '#11181C', // Dark text
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileLevel: {
    color: '#687076', // Medium gray text
    fontSize: 15,
    marginBottom: 2,
  },
  profileQuote: {
    color: '#687076', // Medium gray text
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
    backgroundColor: '#f0f0f0', // Light background
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#11181C', // Dark text
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff', // White background
    color: '#11181C', // Dark text
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalBtn: {
    backgroundColor: '#e0e0e0', // Light gray background
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: '#11181C', // Dark text
    fontWeight: 'bold',
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginTop: 32,
  },
  personalDetailsTile: {
    backgroundColor: '#f0f0f0', // Light background
    borderRadius: 12,
    padding: 16,
    marginTop: 18,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  healthMetricsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  healthMetric: {
    alignItems: 'center',
    flex: 1,
  },
  healthMetricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  healthMetricLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  healthMetricDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  achievementsTile: {
    backgroundColor: '#f0f0f0', // Light background
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});