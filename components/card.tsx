import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { useToast } from './Toast';
import { colors, radius, sectionColors, shadow, spacing, typography } from '../constants/theme';
import { Phone } from '../utils/crud-api';

interface CardProps {
  phone: Phone;
  onDelete: (id: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0] ?? '');
  return initials.join('').toUpperCase() || '?';
}

export default function Card({ phone, onDelete }: CardProps) {
  const router = useRouter();
  const toast = useToast();
  const section = sectionColors[phone.sect];

  const handleEdit = () => {
    router.push({
      pathname: '/editPhone',
      params: {
        id: phone._id,
        name: phone.name,
        tel: phone.tel,
        sect: phone.sect,
      },
    });
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(phone.tel);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show('Phone number copied', 'success');
  };

  const handleCall = () => {
    if (Platform.OS === 'web') {
      // Desktop browsers have no dialer to hand tel: links to — copy the number instead.
      Clipboard.setStringAsync(phone.tel);
      toast.show('Calling is unavailable in a browser — number copied instead', 'success');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone.tel}`);
  };

  const confirmDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(phone._id);
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      // Alert.alert has no dialog implementation on web, so its buttons never fire there.
      if (window.confirm(`Remove "${phone.name}" from the directory?`)) {
        confirmDelete();
      }
      return;
    }
    Alert.alert('Delete contact', `Remove "${phone.name}" from the directory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: confirmDelete },
    ]);
  };

  return (
    <AnimatedPressable
      onPress={handleEdit}
      onLongPress={handleCopy}
      scaleTo={0.985}
      style={[styles.card, shadow.card]}
    >
      <LinearGradient
        colors={section.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.avatar, { boxShadow: `0px 4px 14px ${section.glow}` }]}
      >
        <Text style={styles.avatarText}>{getInitials(phone.name)}</Text>
      </LinearGradient>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {phone.name}
        </Text>
        <View style={styles.telRow}>
          <Ionicons name="call-outline" size={12} color={colors.textDim} style={styles.telIcon} />
          <Text style={styles.tel}>{phone.tel}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: section.wash, borderColor: section.accent }]}>
          <View style={[styles.badgeDot, { backgroundColor: section.accent }]} />
          <Text style={[styles.badgeText, { color: section.accentBright }]}>{phone.sect}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <AnimatedPressable onPress={handleCall} scaleTo={0.85} style={[styles.actionShadow, shadow.gold]}>
          <LinearGradient
            colors={section.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.callButton}
          >
            <Ionicons name="call" size={16} color={colors.black} />
          </LinearGradient>
        </AnimatedPressable>
        <AnimatedPressable onPress={handleDelete} scaleTo={0.85} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
        </AnimatedPressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.black,
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '800',
    color: colors.goldBright,
    marginBottom: spacing.xxs,
  },
  telRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  telIcon: {
    marginRight: spacing.xxs + 2,
  },
  tel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  actions: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionShadow: {
    borderRadius: radius.full,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.dangerMuted,
    backgroundColor: colors.dangerWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
