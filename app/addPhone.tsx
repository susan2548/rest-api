import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import RadioGroup from '../components/RadioGroup';
import { useToast } from '../components/Toast';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { addPhone, Section } from '../utils/crud-api';
import { isValidName, isValidTel } from '../utils/validation';

const SECTION_OPTIONS: { label: string; value: Section }[] = [
  { label: 'CED', value: 'CED' },
  { label: 'TCT', value: 'TCT' },
];

export default function AddPhone() {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [sect, setSect] = useState<Section>('CED');
  const [nameError, setNameError] = useState('');
  const [telError, setTelError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nameValid = isValidName(name);
    const telValid = isValidTel(tel);

    setNameError(nameValid ? '' : 'Please enter a name');
    setTelError(telValid ? '' : 'Phone number must be 9-10 digits');

    if (!nameValid || !telValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setSubmitting(true);
    try {
      await addPhone({ name: name.trim(), tel: tel.trim(), sect });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.show('Contact added', 'success');
      router.back();
    } catch (err) {
      console.error(err);
      toast.show('Failed to add contact', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.formCard, shadow.card]}>
        <Input
          label="Full Name"
          placeholder="e.g. Alex Johnson"
          value={name}
          onChangeText={setName}
          error={nameError}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. 0812345678"
          value={tel}
          onChangeText={setTel}
          keyboardType="number-pad"
          maxLength={10}
          error={telError}
        />
        <RadioGroup label="Section" options={SECTION_OPTIONS} value={sect} onChange={setSect} />
      </View>

      <Button
        title="Save Contact"
        icon="person-add-outline"
        onPress={handleSubmit}
        loading={submitting}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
});
