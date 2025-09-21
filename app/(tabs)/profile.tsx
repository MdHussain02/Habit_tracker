import colors from '@/constants/Colors';
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
              <AntDesign name="setting" size={24} color={colors["text-light"]} />
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
            colors={[colors.primary]}
            tintColor={colors.primary}
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
                  <AntDesign name="edit" size={14} color={colors["text-light"]} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileLevel}>
                  Level: {profile.level || 'Beginner'}
                </Text>
                <Text style={styles.profileQuote}>
                  <Text style={styles.quoteText}>
                    "{profile.quote || 'Consistency is key to lasting change.'}"
                  </Text>
                </Text>
                <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                  <AntDesign name="edit" size={16} color={colors.primary} />
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
                  <MaterialCommunityIcons name="human-male-height" size={20} color={colors.primary} />
                </View>
                <Text style={styles.metricValue}>{profile.height || '--'}</Text>
                <Text style={styles.metricLabel}>Height (cm)</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <MaterialCommunityIcons name="weight-kilogram" size={20} color={colors.secondary} />
                </View>
                <Text style={styles.metricValue}>{profile.weight || '--'}</Text>
                <Text style={styles.metricLabel}>Weight (kg)</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <MaterialCommunityIcons name="calendar" size={20} color={colors.accent} />
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
                <View style={[styles.optionIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <MaterialCommunityIcons name="account-details" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionTitle}>Personal Details</Text>
                  <Text style={styles.optionSubtitle}>{profile.email}</Text>
                </View>
              </View>
              <AntDesign name="right" size={16} color={colors["text-secondary"]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/profile/achievements')}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: `${colors.accent}20` }]}>
                  <MaterialCommunityIcons name="trophy-award" size={20} color={colors.accent} />
                </View>
                <View>
                  <Text style={styles.optionTitle}>Achievements</Text>
                  <Text style={styles.optionSubtitle}>View your badges & progress</Text>
                </View>
              </View>
              <AntDesign name="right" size={16} color={colors["text-secondary"]} />
            </TouchableOpacity>
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
                placeholderTextColor={colors["text-secondary"]}
                value={editProfile.name}
                onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Level"
                placeholderTextColor={colors["text-secondary"]}
                value={editProfile.level}
                onChangeText={(text) => setEditProfile({ ...editProfile, level: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Motivational Quote"
                placeholderTextColor={colors["text-secondary"]}
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
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.primary,
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
    color: colors["text-light"],
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: colors["text-light"],
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors["text-light"]}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 95,
    backgroundColor: colors.light,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: colors["text-light"],
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.shadow,
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
    backgroundColor: colors["bg-light"],
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors["text-light"],
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors["text-dark"],
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 16,
    color: colors["text-secondary"],
    fontWeight: '500',
    marginBottom: 8,
  },
  profileQuote: {
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 14,
    color: colors["text-secondary"],
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  metricsCard: {
    backgroundColor: colors["text-light"],
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors["text-dark"],
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
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors["text-dark"],
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors["text-secondary"],
    textAlign: 'center',
    fontWeight: '500',
  },
  optionsCard: {
    backgroundColor: colors["text-light"],
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
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
    borderBottomColor: colors["border-light"],
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
    color: colors["text-dark"],
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors["text-secondary"],
  },
  logoutButton: {
    backgroundColor: colors["text-danger"],
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    color: colors["text-light"],
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
    backgroundColor: colors["text-light"],
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors["text-dark"],
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors["bg-light"],
    color: colors["text-dark"],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors["border-light"],
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors["bg-light"],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors["border-light"],
  },
  modalCancelText: {
    color: colors["text-secondary"],
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    color: colors["text-light"],
    fontSize: 16,
    fontWeight: '600',
  },
});
