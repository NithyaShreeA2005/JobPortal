import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * JobCard — displays a single job listing.
 * Pass the full job object and an onPress handler.
 */
const JobCard = ({ job, onPress }) => {
  const {
    title,
    company,
    location,
    salary,
    type,
    remote,
    tags = [],
    image,
    postedDate,
    applicants,
  } = job;

  const typeColor = {
    'Full-time': '#10B981',
    Contract: '#F59E0B',
    'Part-time': '#3B82F6',
  }[type] || '#64748B';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* ── Header row ──────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: image }}
          style={styles.companyImage}
          resizeMode="cover"
        />

        <View style={styles.headerInfo}>
          <Text style={styles.companyName}>{company}</Text>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {remote && (
          <View style={styles.remotePill}>
            <Text style={styles.remotePillText}>Remote</Text>
          </View>
        )}
      </View>

      {/* ── Meta row ────────────────────────────────────────── */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={13} color="#64748B" />
          <Text style={styles.metaText}>{location}</Text>
        </View>

        <View style={[styles.typePill, { backgroundColor: typeColor + '20' }]}>
          <View style={[styles.typeDot, { backgroundColor: typeColor }]} />
          <Text style={[styles.typeText, { color: typeColor }]}>{type}</Text>
        </View>
      </View>

      {/* ── Tags ────────────────────────────────────────────── */}
      <View style={styles.tagsRow}>
        {tags.slice(0, 3).map((tag, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* ── Footer ──────────────────────────────────────────── */}
      <View style={styles.footer}>
        <Text style={styles.salary}>{salary}</Text>

        <View style={styles.footerMeta}>
          <Ionicons name="people-outline" size={13} color="#94A3B8" />
          <Text style={styles.footerText}>{applicants} applied</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.footerText}>{postedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 7,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyImage: {
    width: 54,
    height: 54,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  companyName: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 22,
  },
  remotePill: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  remotePillText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    gap: 5,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  salary: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  footerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  dot: {
    color: '#CBD5E1',
    fontSize: 12,
  },
});

export default JobCard;
