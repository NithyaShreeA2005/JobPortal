import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { getUserProfile, signOutUser } from '../services/authService';
import Button from '../components/Button';

// ── Profile hero image ───────────────────────────────────────────────────────
// Using Unsplash. Replace with Cloudinary URL:
//   https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
const PROFILE_HERO =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80';

const ProfileScreen = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const res = await getUserProfile(user.uid);
    if (res.success) setProfile(res.data);
    setLoading(false);
  };

  // ── Logout flow ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          await signOutUser();
          // AuthContext will detect null user → AppNavigator shows Login
        },
      },
    ]);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const initials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ── Reusable info row ─────────────────────────────────────────────────────
  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color="#4F46E5" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <Image source={{ uri: PROFILE_HERO }} style={styles.heroBg} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>My Profile</Text>
          </View>
        </View>

        {/* ── Avatar ───────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(profile?.name)}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{profile?.name || 'User'}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4F46E5" />
            <Text style={styles.verifiedText}>Verified Member</Text>
          </View>
        </View>

        {/* ── Stats card ───────────────────────────────────────── */}
        <View style={styles.statsCard}>
          {[
            { num: '0', label: 'Applied' },
            { num: '0', label: 'Saved' },
            { num: '0', label: 'Interviews' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.statBlock}>
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Account info ─────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <InfoRow
            icon="person-outline"
            label="Full Name"
            value={profile?.name}
          />
          <InfoRow
            icon="mail-outline"
            label="Email Address"
            value={profile?.email}
          />
          <InfoRow
            icon="calendar-outline"
            label="Member Since"
            value={formatDate(profile?.createdAt)}
          />
          <InfoRow
            icon="shield-checkmark-outline"
            label="Account Status"
            value="Active"
          />
        </View>

        {/* ── Quick actions ─────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          {[
            { icon: 'document-text-outline', label: 'My Resume' },
            { icon: 'heart-outline', label: 'Saved Jobs' },
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionRow}>
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={18} color="#4F46E5" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sign out ──────────────────────────────────────────── */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          loading={signingOut}
          icon="log-out-outline"
          style={styles.signOutBtn}
        />

        <Text style={styles.version}>JobPortal v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },

  // Hero
  hero: {
    height: 130,
    position: 'relative',
  },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(67, 56, 202, 0.82)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginTop: -44,
    marginBottom: 20,
  },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  // Stats
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '900', color: '#4F46E5' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },

  // Action row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },

  // Sign out
  signOutBtn: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },
});

export default ProfileScreen;
