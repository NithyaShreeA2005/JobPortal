import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import { fetchJobs, filterJobs } from '../services/jobService';
import JobCard from '../components/JobCard';

// ── Hero banner (dashboard) ─────────────────────────────────────────────────
// Unsplash — replace with your Cloudinary URL if preferred:
//   https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80';

const CATEGORIES = ['All', 'Remote', 'Full-time', 'Part-time', 'Contract'];

const DashboardScreen = () => {
  const { user } = useAuth();

  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userName, setUserName] = useState('');

  // ── Load data on mount ────────────────────────────────────────────────────
  useEffect(() => {
    loadUser();
    loadJobs();
  }, []);

  const loadUser = async () => {
    if (!user) return;
    const res = await getUserProfile(user.uid);
    if (res.success) {
      // Show first name only
      setUserName(res.data.name?.split(' ')[0] || 'there');
    }
  };

  const loadJobs = async () => {
    setError(null);
    const res = await fetchJobs();
    if (res.success) {
      setAllJobs(res.data);
      setDisplayedJobs(res.data);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery('');
    setActiveCategory('All');
    await loadJobs();
    setRefreshing(false);
  }, []);

  // ── Filtering logic ───────────────────────────────────────────────────────
  const applyFilter = (query, category) => {
    setDisplayedJobs(filterJobs(allJobs, query, category));
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilter(text, activeCategory);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    applyFilter(searchQuery, cat);
  };

  // ── Greeting ──────────────────────────────────────────────────────────────
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // ── List header (rendered above FlatList items) ───────────────────────────
  const ListHeader = () => (
    <>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image source={{ uri: HERO_IMAGE }} style={styles.heroBg} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.greetingText}>{greeting()},</Text>
          <Text style={styles.nameText}>{userName || 'Explorer'} 👋</Text>
          <Text style={styles.heroTagline}>Find the job that fits your life</Text>

          {/* Stats strip */}
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statNum}>{allJobs.length}+</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statNum}>500+</Text>
              <Text style={styles.statLabel}>Companies</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statNum}>10k+</Text>
              <Text style={styles.statLabel}>Hired</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Job title, company, skill..."
            placeholderTextColor="#B0BEC5"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, activeCategory === cat && styles.chipActive]}
            onPress={() => handleCategory(cat)}
          >
            <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Result count */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          <Text style={styles.resultCount}>{displayedJobs.length}</Text>
          {displayedJobs.length === 1 ? ' job found' : ' jobs found'}
        </Text>
      </View>
    </>
  );

  // ── Empty state ───────────────────────────────────────────────────────────
  const ListEmpty = () => (
    <View style={styles.emptyBox}>
      <Ionicons name="briefcase-outline" size={64} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>No jobs found</Text>
      <Text style={styles.emptyHint}>Try a different keyword or filter</Text>
    </View>
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Finding great jobs…</Text>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline-outline" size={64} color="#CBD5E1" />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadJobs}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={displayedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() =>
              Alert.alert(item.title, item.description, [{ text: 'Close' }])
            }
          />
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
            colors={['#4F46E5']}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  listContent: { paddingBottom: 24 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 24,
  },

  // Hero
  heroBanner: {
    height: 220,
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
    padding: 22,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },

  // Search
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: -22,
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },

  // Categories
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Result count
  resultRow: {
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  resultText: {
    fontSize: 14,
    color: '#64748B',
  },
  resultCount: {
    fontWeight: '800',
    color: '#4F46E5',
  },

  // States
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 16,
  },
  errorMsg: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DashboardScreen;
