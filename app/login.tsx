import Button from '@/components/ui/Button';
import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

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
      const data = await fetchPost(`${API_BASE_URL}/auth/login`, {  email, password }, false);

      if (data && (data.success )) {
        const userData = data.user || { email, ...data };
        
        // Use the auth context to handle login
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>
          </View>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
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
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
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
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleLogin} 
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  headerContent: {
    marginTop: 100,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
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
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#2d3748',
    fontSize: 16,
    paddingVertical: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
    alignItems: 'center',
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
});
