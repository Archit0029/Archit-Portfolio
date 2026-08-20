import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View, Pressable, ScrollView } from 'react-native';
import type { AppTheme } from '../theme/colors';
import { showToast } from './ToastContainer';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  theme: AppTheme;
  onSave: (data: { name: string; title: string; bio: string }) => Promise<void>;
  initialData?: { name: string; title: string; bio: string };
};

export function EditProfileModal({
  visible,
  onClose,
  theme,
  onSave,
  initialData = { name: '', title: '', bio: '' },
}: EditProfileModalProps) {
  const [name, setName] = useState(initialData.name);
  const [title, setTitle] = useState(initialData.title);
  const [bio, setBio] = useState(initialData.bio);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !title.trim() || !bio.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ name, title, bio });
      showToast('Profile updated successfully', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Edit Profile</Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.textSecondary }]}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={theme.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Your professional title"
              placeholderTextColor={theme.muted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Bio</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={theme.muted}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, { backgroundColor: theme.accent }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

type EditContactModalProps = {
  visible: boolean;
  onClose: () => void;
  theme: AppTheme;
  onSave: (data: { email: string; phone: string; address: string }) => Promise<void>;
  initialData?: { email: string; phone: string; address: string };
};

export function EditContactModal({
  visible,
  onClose,
  theme,
  onSave,
  initialData = { email: '', phone: '', address: '' },
}: EditContactModalProps) {
  const [email, setEmail] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone);
  const [address, setAddress] = useState(initialData.address);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    if (!phone.trim() || !address.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ email, phone, address });
      showToast('Contact info updated successfully', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to update contact info', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Edit Contact Info</Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.textSecondary }]}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={theme.muted}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Phone</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={theme.muted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.textPrimary }]}
              value={address}
              onChangeText={setAddress}
              placeholder="City, Country"
              placeholderTextColor={theme.muted}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, { backgroundColor: theme.accent }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
