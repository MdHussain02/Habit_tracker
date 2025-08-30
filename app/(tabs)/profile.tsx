import { useToast } from '@/hooks/useToast';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
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
      
      if (!forceRefresh) {
        const cachedProfile = await AsyncStorage.getItem(PROFILE_KEY);
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
          setLoading(false);
          return;
        }
      }
      
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
  
  const handleRefresh = () => {
    getProfileDetails(true);
  };

  useEffect(() => {
    getProfileDetails();
    
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

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Profile</Text>
              <Text style={styles.headerDate}>Manage your account & settings</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/profile/settings')}
            >
              <AntDesign name="setting" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor='#4CAF50'
          />
        }
      >
        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
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
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name || 'Jane Doe'}</Text>
                <Text style={styles.profileLevel}>
                  Level: {profile.level || 'Beginner'}
                </Text>
                <Text style={styles.profileQuote}>
                  <Text style={styles.quoteText}>
                    "{profile.quote || 'Consistency is key to lasting change.'}"
                  </Text>
                </Text>
                <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                  <AntDesign name="edit" size={16} color="#6366f1" />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Health Metrics Card */}
          <View style={styles.metricsCard}>
            <Text style={styles.cardTitle}>Health Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <MaterialCommunityIcons name="human-male-height" size={20} color="#6366f1" />
                </View>
                <Text style={styles.metricValue}>{profile.height || '--'}</Text>
                <Text style={styles.metricLabel}>Height (cm)</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <MaterialCommunityIcons name="weight-kilogram" size={20} color="#10b981" />
                </View>
                <Text style={styles.metricValue}>{profile.weight || '--'}</Text>
                <Text style={styles.metricLabel}>Weight (kg)</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.metricValue}>{profile.age || '--'}</Text>
                <Text style={styles.metricLabel}>Age</Text>
              </View>
            </View>
          </View>

          {/* Account Options */}
          <View style={styles.optionsCard}>
            <Text style={styles.cardTitle}>Account</Text>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/profile/details')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: '#6366f120' }]}>
                  <MaterialCommunityIcons name="account-details" size={20} color="#6366f1" />
                </View>
                <View>
                  <Text style={styles.optionTitle}>Personal Details</Text>
                  <Text style={styles.optionSubtitle}>{profile.email}</Text>
                </View>
              </View>
              <AntDesign name="right" size={16} color="#7f8c8d" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/profile/achievements')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: '#f59e0b20' }]}>
                  <MaterialCommunityIcons name="trophy-award" size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.optionTitle}>Achievements</Text>
                  <Text style={styles.optionSubtitle}>View your badges & progress</Text>
                </View>
              </View>
              <AntDesign name="right" size={16} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#ffffff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
                placeholderTextColor="#7f8c8d"
                value={editProfile.name}
                onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Level"
                placeholderTextColor="#7f8c8d"
                value={editProfile.level}
                onChangeText={(text) => setEditProfile({ ...editProfile, level: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Motivational Quote"
                placeholderTextColor="#7f8c8d"
                value={editProfile.quote}
                onChangeText={(text) => setEditProfile({ ...editProfile, quote: text })}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={saveEditProfile}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
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
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: 'rgb(0, 182, 212)',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 95,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e7eb',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 8,
  },
  profileQuote: {
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f120',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  metricsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6366f120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
  },
  optionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalCancelText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});