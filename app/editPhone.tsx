import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import RadioGroup from '../components/RadioGroup';
import { useToast } from '../components/Toast';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { editPhone, Section } from '../utils/crud-api';
import { isValidName, isValidTel } from '../utils/validation';

const SECTION_OPTIONS: { label: string; value: Section }[] = [
  { label: 'CED', value: 'CED' },
  { label: 'TCT', value: 'TCT' },
];

export default function EditPhone() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    tel: string;
    sect: Section;
  }>();

  // Original values, kept only for reference/comparison — the fields below are what get edited and submitted.
  const { id, name, tel, sect } = params;

  const [newName, setNewName] = useState(name ?? '');
  const [newTel, setNewTel] = useState(tel ?? '');
  const [newSect, setNewSect] = useState<Section>((sect as Section) ?? 'CED');
  const [nameError, setNameError] = useState('');
  const [telError, setTelError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nameValid = isValidName(newName);
    const telValid = isValidTel(newTel);

    setNameError(nameValid ? '' : 'Please enter a name');
    setTelError(telValid ? '' : 'Phone number must be 9-10 digits');

    if (!nameValid || !telValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setSubmitting(true);
    try {
      await editPhone(id, { name: newName.trim(), tel: newTel.trim(), sect: newSect });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.show('Contact updated', 'success');
      router.back();
    } catch (err) {
      console.error(err);
      toast.show('Failed to update contact', 'error');
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
          value={newName}
          onChangeText={setNewName}
          error={nameError}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. 0812345678"
          value={newTel}
          onChangeText={setNewTel}
          keyboardType="number-pad"
          maxLength={10}
          error={telError}
        />
        <RadioGroup
          label="Section"
          options={SECTION_OPTIONS}
          value={newSect}
          onChange={setNewSect}
        />
      </View>

      <Button
        title="Save Changes"
        icon="checkmark-circle-outline"
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
