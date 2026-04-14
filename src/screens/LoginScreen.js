import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { signUpUser, signInUser } from '../services/authService';

// ── Hero image for login screen ──────────────────────────────────────────────
// Using Unsplash (free, no key needed).
// To use Cloudinary: replace with your own URL, e.g.:
//   https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80';

const LoginScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (isSignUp && !name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!password) {
      e.password = 'Password is required.';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const result = isSignUp
      ? await signUpUser(name.trim(), email.trim(), password)
      : await signInUser(email.trim(), password);

    setLoading(false);

    if (!result.success) {
      Alert.alert(isSignUp ? 'Sign Up Failed' : 'Sign In Failed', result.error);
    }
    // On success → AuthContext detects user change → AppNavigator shows MainTabs
  };

  // ── Toggle login ↔ signup ──────────────────────────────────────────────────
  const toggleMode = () => {
    setIsSignUp((v) => !v);
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero ─────────────────────────────────────────── */}
          <View style={styles.hero}>
            <Image source={{ uri: HERO_IMAGE }} style={styles.heroBg} resizeMode="cover" />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              {/* Logo */}
              <View style={styles.logoBubble}>
                <Text style={styles.logoLetters}>JP</Text>
              </View>
              <Text style={styles.appName}>JobPortal</Text>
              <Text style={styles.tagline}>Find your dream career today ✨</Text>
            </View>
          </View>

          {/* ── Form card ────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isSignUp
                ? 'Join thousands of job seekers worldwide'
                : 'Sign in to continue your job search'}
            </Text>

            {isSignUp && (
              <InputField
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Jane Smith"
                autoCapitalize="words"
                icon="person-outline"
                error={errors.name}
              />
            )}

            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <Button
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitBtn}
            />

            {/* Toggle link */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleQuestion}>
                {isSignUp ? 'Already have an account?  ' : "Don't have an account?  "}
              </Text>
              <TouchableOpacity onPress={toggleMode} hitSlop={{ top: 8, bottom: 8 }}>
                <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },

  // Hero section
  hero: {
    height: 280,
    position: 'relative',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(67, 56, 202, 0.78)',
  },
  heroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  logoBubble: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoLetters: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.2,
  },

  // Form card
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
    lineHeight: 20,
  },
  submitBtn: {
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  toggleQuestion: {
    fontSize: 14,
    color: '#64748B',
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
});

export default LoginScreen;
