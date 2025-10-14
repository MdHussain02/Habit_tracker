import Button from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const { height } = Dimensions.get('window');

const avatarData = [
  { id: 1, size: 60, top: '12%', left: '8%', image: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, size: 70, top: '10%', right: '12%', image: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, size: 50, top: '22%', left: '22%', image: 'https://i.pravatar.cc/150?img=9' },
  { id: 4, size: 80, top: '18%', left: '38%', image: 'https://i.pravatar.cc/150?img=12' },
  { id: 5, size: 55, top: '20%', right: '20%', image: 'https://i.pravatar.cc/150?img=16' },
  { id: 6, size: 65, top: '32%', left: '10%', image: 'https://i.pravatar.cc/150?img=20' },
  { id: 7, size: 52, top: '35%', right: '8%', image: 'https://i.pravatar.cc/150?img=25' },
];

const FloatingAvatar = ({ avatar, index }: { avatar: any; index: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -15,
          duration: 2000 + index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000 + index * 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const position = {
    top: avatar.top,
    ...(avatar.left ? { left: avatar.left } : { right: avatar.right }),
  };

  return (
    <Animated.View
      style={[
        styles.avatar,
        position,
        {
          width: avatar.size,
          height: avatar.size,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Image source={{ uri: avatar.image }} style={styles.avatarImage} />
    </Animated.View>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { showToast } = useToast();
  const { fetchPost, loading } = useApi();
  const { login } = useAuth();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleLogin = async () => {
    try {
      const data = await fetchPost(`${API_BASE_URL}/auth/login`, { email, password }, false);

      if (data && data.success) {
        const userData = data.user || { email, ...data };
        if (data.token) {
          await login(userData, data.token);
          showToast('Logged in successfully!', 'success', 'top');
          router.replace('/(tabs)');
        } else {
          showToast('Invalid response from server', 'error', 'top');
        }
      } else {
        showToast(data.data?.error || 'Invalid email or password', 'error', 'top');
      }
    } catch (e: any) {
      showToast(e.message || 'Login failed', 'error', 'top');
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <LinearGradient colors={['#f5f3ff', '#fdf4ff', '#eff6ff']} style={styles.container}>
        {/* Blur circles */}
        <View style={[styles.blurCircle, styles.blurCircle1]} />
        <View style={[styles.blurCircle, styles.blurCircle2]} />

        {/* Floating avatars */}
        <View style={styles.avatarContainer}>
          {avatarData.map((avatar, index) => (
            <FloatingAvatar key={avatar.id} avatar={avatar} index={index} />
          ))}
        </View>

        {/* Login form card */}
        <View style={styles.formCard}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button onPress={handleLogin} loading={loading} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerButton}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Made By <Text style={styles.visily}>DevZain</Text></Text>
      </LinearGradient>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  blurCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  blurCircle1: {
    top: -100,
    left: -100,
    backgroundColor: '#c084fc',
  },
  blurCircle2: {
    bottom: -100,
    right: -100,
    backgroundColor: '#f9a8d4',
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  avatar: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 24,
    marginTop: height * 0.35,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#2d3748',
    fontSize: 16,
    paddingVertical: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#a0aec0',
    fontSize: 14,
    marginHorizontal: 16,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  registerLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
  },
  visily: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
