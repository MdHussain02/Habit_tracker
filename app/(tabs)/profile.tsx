import colors from '@/constants/Colors';
import { useToast } from '@/hooks/useToast';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';

const PROFILE_KEY = 'userProfile';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconFamily: 'AntDesign' | 'MaterialCommunityIcons' | 'Feather';
  iconColor: string;
  iconBgColor: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  icon,
  iconFamily,
  iconColor,
  iconBgColor,
  children,
  isExpanded,
  onToggle
}) => {
  const IconComponent = iconFamily === 'AntDesign' ? AntDesign :
    iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={toggleAccordion}
        activeOpacity={0.7}
      >
        <View style={styles.accordionLeft}>
          <View style={[styles.accordionIcon, { backgroundColor: iconBgColor }]}>
            <IconComponent name={icon as any} size={20} color={iconColor} />
          </View>
          <View style={styles.accordionTextContainer}>
            <Text style={styles.accordionTitle}>{title}</Text>
            {subtitle && <Text style={styles.accordionSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <AntDesign
          name={isExpanded ? "up" : "down"}
          size={16}
          color={colors["text-secondary"]}
          style={[styles.chevron, isExpanded && styles.chevronRotated]}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

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
  const [expandedAccordions, setExpandedAccordions] = useState<{ [key: string]: boolean }>({
    personal: false,
    health: false,
    fitness: false,
    account: false,
  });

  const router = useRouter();
  const { fetchGet } = useApi();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const toggleAccordion = (key: string) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
          {/* <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/profile/settings')}
          >
            <AntDesign name="setting" size={24} color={colors["text-light"]} />
          </TouchableOpacity> */}
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
          {/* Profile Summary Card */}
          <View style={styles.profileSummaryCard}>
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
                  <AntDesign name="camera" size={14} color={colors["text-light"]} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileSummaryInfo}>
                <Text style={styles.profileName}>{profile.name || 'Your Name'}</Text>
                <Text style={styles.profileLevel}>
                  {profile.level || 'Beginner'} • {profile.email}
                </Text>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.age || '--'}</Text>
                <Text style={styles.statLabel}>Age</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.height || '--'}</Text>
                <Text style={styles.statLabel}>Height</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.weight || '--'}</Text>
                <Text style={styles.statLabel}>Weight</Text>
              </View>
            </View>
          </View>

          {/* Personal Information Accordion */}
          <AccordionItem
            title="Personal Information"
            subtitle="View and manage your personal details"
            icon="user"
            iconFamily="AntDesign"
            iconColor={colors.primary}
            iconBgColor={`${colors.primary}20`}
            isExpanded={expandedAccordions.personal}
            onToggle={() => toggleAccordion('personal')}
          >
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{profile.name || 'Not set'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{profile.email || 'Not set'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>{profile.gender || 'Not specified'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/profile/details')}
            >
              <AntDesign name="edit" size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit Details</Text>
            </TouchableOpacity>
          </AccordionItem>

          {/* Health Metrics Accordion */}
          <AccordionItem
            title="Health Metrics"
            subtitle="Your physical measurements and stats"
            icon="heart-pulse"
            iconFamily="MaterialCommunityIcons"
            iconColor={colors.secondary}
            iconBgColor={`${colors.secondary}20`}
            isExpanded={expandedAccordions.health}
            onToggle={() => toggleAccordion('health')}
          >
            <View style={styles.metricsDetailGrid}>
              <View style={styles.metricDetailItem}>
                <View style={styles.metricDetailIcon}>
                  <MaterialCommunityIcons name="human-male-height" size={24} color={colors.primary} />
                </View>
                <View style={styles.metricDetailInfo}>
                  <Text style={styles.metricDetailValue}>{profile.height || '--'} cm</Text>
                  <Text style={styles.metricDetailLabel}>Height</Text>
                </View>
              </View>
              <View style={styles.metricDetailItem}>
                <View style={styles.metricDetailIcon}>
                  <MaterialCommunityIcons name="weight-kilogram" size={24} color={colors.secondary} />
                </View>
                <View style={styles.metricDetailInfo}>
                  <Text style={styles.metricDetailValue}>{profile.weight || '--'} kg</Text>
                  <Text style={styles.metricDetailLabel}>Weight</Text>
                </View>
              </View>
              <View style={styles.metricDetailItem}>
                <View style={styles.metricDetailIcon}>
                  <MaterialCommunityIcons name="calendar" size={24} color={colors.accent} />
                </View>
                <View style={styles.metricDetailInfo}>
                  <Text style={styles.metricDetailValue}>{profile.age || '--'} years</Text>
                  <Text style={styles.metricDetailLabel}>Age</Text>
                </View>
              </View>
            </View>
          </AccordionItem>

          {/* Fitness Profile Accordion */}
          {/* <AccordionItem
            title="Fitness Profile"
            subtitle="Your fitness level and goals"
            icon="trophy"
            iconFamily="MaterialCommunityIcons"
            iconColor={colors.primary}
            iconBgColor={`${colors.primary}20`}
            isExpanded={expandedAccordions.fitness}
            onToggle={() => toggleAccordion('fitness')}
          >
            <View style={styles.fitnessDetails}>
              <View style={styles.fitnessItem}>
                <View>
                  <Text style={styles.fitnessLabel}>Fitness Level</Text>
                  <Text style={styles.fitnessValue}>{profile.level}</Text>
                </View>
              </View>
              <View style={styles.motivationSection}>
                <Text style={styles.motivationLabel}>Motivational Quote</Text>
                <Text style={styles.fitnessValue}>
                  {profile.quote}
                </Text>
              </View>
            </View>
          </AccordionItem> */}

          {/* Account Options Accordion */}
          <AccordionItem
            title="Account & Settings"
            subtitle="Manage your account preferences"
            icon="settings"
            iconFamily="Feather"
            iconColor={colors.primary}
            iconBgColor={`${colors.primary}20`}
            isExpanded={expandedAccordions.account}
            onToggle={() => toggleAccordion('account')}
          >
            <View style={styles.accountOptions}>
              <TouchableOpacity
                style={styles.accountOptionItem}
                onPress={() => router.push('/profile/achievements')}
                activeOpacity={0.7}
              >
                <View style={styles.accountOptionIcon}>
                  <MaterialCommunityIcons name="trophy-award" size={20} color={colors.primary} />
                </View>
                <View style={styles.accountOptionText}>
                  <Text style={styles.accountOptionTitle}>Achievements</Text>
                  <Text style={styles.accountOptionSubtitle}>View badges & progress</Text>
                </View>
                <AntDesign name="right" size={16} color={colors["text-primary"]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accountOptionItem}
                onPress={() => router.push('/profile/settings')}
                activeOpacity={0.7}
              >
                <View style={styles.accountOptionIcon}>
                  <MaterialCommunityIcons name="cog" size={20} color={colors.primary} />
                </View>
                <View style={styles.accountOptionText}>
                  <Text style={styles.accountOptionTitle}>Preferences</Text>
                  <Text style={styles.accountOptionSubtitle}>App settings & notifications</Text>
                </View>
                <AntDesign name="right" size={16} color={colors["text-primary"]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accountOptionItem}
                onPress={() => router.push('/profile')}
                activeOpacity={0.7}
              >
                <View style={styles.accountOptionIcon}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={colors.primary} />
                </View>
                <View style={styles.accountOptionText}>
                  <Text style={styles.accountOptionTitle}>Privacy & Security</Text>
                  <Text style={styles.accountOptionSubtitle}>Data & privacy settings</Text>
                </View>
                <AntDesign name="right" size={16} color={colors["text-primary"]} />
              </TouchableOpacity>
            </View>
          </AccordionItem>

          {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={colors["text-light"]} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footer}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  footer: {
    paddingHorizontal: 20,
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
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
  profileSummaryCard: {
    backgroundColor: colors["bg-accent"],
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors["bg-light"],
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors["text-light"],
  },
  profileSummaryInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors["text-dark"],
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    color: colors["text-secondary"],
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors["bg-secondary"],
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors["text-light"],
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors["text-light"],
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors["border-light"],
  },
  // Accordion Styles
  accordionContainer: {
    backgroundColor: colors["bg-accent"],
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accordionTextContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors["text-dark"],
    marginBottom: 2,
  },
  accordionSubtitle: {
    fontSize: 13,
    color: colors["text-secondary"],
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors["border-light"],
  },
  // Content Styles
  detailsGrid: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors["border-light"],
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors["text-secondary"],
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors["text-dark"],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  metricsDetailGrid: {
    gap: 16,
  },
  metricDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors["bg-light"],
    padding: 16,
    borderRadius: 12,
  },
  metricDetailIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors["text-light"],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricDetailInfo: {
    flex: 1,
  },
  metricDetailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors["text-dark"],
    marginBottom: 2,
  },
  metricDetailLabel: {
    fontSize: 13,
    color: colors["text-secondary"],
    fontWeight: '500',
  },
  fitnessDetails: {
    gap: 16,
  },
  fitnessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors["bg-light"],
    padding: 16,
    borderRadius: 12,
  },
  fitnessIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.accent}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fitnessLabel: {
    fontSize: 13,
    color: colors["text-secondary"],
    fontWeight: '500',
    marginBottom: 2,
  },
  fitnessValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors["text-dark"],
  },
  motivationSection: {
    backgroundColor: colors["bg-light"],
    padding: 16,
    borderRadius: 12,
  },
  motivationLabel: {
    fontSize: 13,
    color: colors["text-secondary"],
    fontWeight: '500',
    marginBottom: 8,
  },
  quoteContainer: {
    backgroundColor: colors["text-light"],
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  quoteText: {
    fontSize: 14,
    color: colors["text-dark"],
    fontStyle: 'italic',
    lineHeight: 20,
  },
  accountOptions: {
    gap: 0,
  },
  accountOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors["border-light"],
  },
  accountOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors["bg-light"],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountOptionText: {
    flex: 1,
  },
  accountOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors["text-dark"],
    marginBottom: 2,
  },
  accountOptionSubtitle: {
    fontSize: 12,
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
    marginTop: 20,
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
});