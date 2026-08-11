import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import AnimatedPressable from '../components/AnimatedPressable';
import Card from '../components/card';
import GradientText from '../components/GradientText';
import { useToast } from '../components/Toast';
import { colors, gradients, radius, sectionColors, shadow, spacing, typography } from '../constants/theme';
import { delPhone, getPhone, Phone, Section } from '../utils/crud-api';
import FadeInView from '../components/FadeInView';

if (
  Platform.OS === 'android' &&
  typeof UIManager.setLayoutAnimationEnabledExperimental === 'function'
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SectionFilter = 'ALL' | Section;
type SortMode = 'recent' | 'name';

const FILTERS: { label: string; value: SectionFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'CED', value: 'CED' },
  { label: 'TCT', value: 'TCT' },
];

export default function Index() {
  const router = useRouter();
  const toast = useToast();

  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  const loadPhones = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getPhone();
      setPhones(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPhones();
    }, [loadPhones])
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await delPhone(id);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPhones((prev) => prev.filter((p) => p._id !== id));
        toast.show('Contact deleted', 'success');
      } catch (err) {
        console.error(err);
        toast.show('Failed to delete contact', 'error');
      }
    },
    [toast]
  );

  const stats = useMemo(
    () => ({
      total: phones.length,
      ced: phones.filter((p) => p.sect === 'CED').length,
      tct: phones.filter((p) => p.sect === 'TCT').length,
    }),
    [phones]
  );

  const visiblePhones = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = phones.filter((phone) => {
      const matchesSection = sectionFilter === 'ALL' || phone.sect === sectionFilter;
      const matchesSearch =
        keyword.length === 0 ||
        phone.name.toLowerCase().includes(keyword) ||
        phone.tel.includes(keyword) ||
        phone.sect.toLowerCase().includes(keyword);
      return matchesSection && matchesSearch;
    });

    if (sortMode === 'name') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [phones, search, sectionFilter, sortMode]);

  const toggleSort = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSortMode((prev) => (prev === 'recent' ? 'name' : 'recent'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatCard
          icon="people"
          value={stats.total}
          label="Total"
          gradientColors={gradients.gold}
        />
        <StatCard
          icon="school-outline"
          value={stats.ced}
          label="CED"
          gradientColors={sectionColors.CED.gradient}
        />
        <StatCard
          icon="hardware-chip-outline"
          value={stats.tct}
          label="TCT"
          gradientColors={sectionColors.TCT.gradient}
        />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textDim} style={styles.searchIcon} />
        <TextInput
          style={styles.search}
          placeholder="Search by name, phone, or section"
          placeholderTextColor={colors.textDim}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <AnimatedPressable onPress={() => setSearch('')} scaleTo={0.85} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.textDim} />
          </AnimatedPressable>
        )}
      </View>

      <View style={styles.toolbarRow}>
        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const active = filter.value === sectionFilter;
            return (
              <AnimatedPressable
                key={filter.value}
                onPress={() => setSectionFilter(filter.value)}
                style={styles.filterChipWrap}
              >
                {active ? (
                  <LinearGradient
                    colors={gradients.gold}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.filterChip}
                  >
                    <Text style={styles.filterTextActive}>{filter.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.filterChip, styles.filterChipOutlined]}>
                    <Text style={styles.filterText}>{filter.label}</Text>
                  </View>
                )}
              </AnimatedPressable>
            );
          })}
        </View>

        <AnimatedPressable onPress={toggleSort} style={styles.sortChip}>
          <Ionicons name="swap-vertical-outline" size={13} color={colors.textMuted} />
          <Text style={styles.sortText}>{sortMode === 'recent' ? 'Recent' : 'Name A-Z'}</Text>
        </AnimatedPressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : visiblePhones.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="people-outline" size={48} color={colors.textDim} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>
            {phones.length === 0 ? 'No contacts yet' : 'No matches found'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {phones.length === 0
              ? 'Tap the + button to add your first contact.'
              : 'Try a different search term or filter.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={visiblePhones}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <FadeInView delay={Math.min(index * 40, 300)}>
              <Card phone={item} onDelete={handleDelete} />
            </FadeInView>
          )}
          contentContainerStyle={styles.listContent}
          onRefresh={() => loadPhones(true)}
          refreshing={refreshing}
        />
      )}

      <AnimatedPressable
        onPress={() => router.push('/addPhone')}
        scaleTo={0.9}
        style={[styles.fabShadow, shadow.goldStrong]}
      >
        <LinearGradient colors={gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
          <Ionicons name="add" size={28} color={colors.black} />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  gradientColors: readonly [string, string, ...string[]];
}

function StatCard({ icon, value, label, gradientColors }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statIconBadge}
      >
        <Ionicons name={icon} size={15} color={colors.black} />
      </LinearGradient>
      <GradientText style={styles.statValue} colors={gradientColors}>
        {String(value)}
      </GradientText>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption,
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs + 2,
  },
  search: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    color: colors.text,
    fontSize: 15,
  },
  clearButton: {
    padding: spacing.xxs,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChipWrap: {
    borderRadius: radius.full,
  },
  filterChip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 3,
  },
  filterChipOutlined: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  filterText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
  },
  filterTextActive: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.black,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  sortText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    ...typography.subtitle,
    marginTop: spacing.sm,
  },
  emptyIcon: {
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.subtitle,
    fontSize: 17,
    fontWeight: '800',
    color: colors.goldBright,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.caption,
    textAlign: 'center',
  },
  fabShadow: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    borderRadius: radius.full,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
