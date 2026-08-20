import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../theme/colors';

type OwnerAction = {
  label: string;
  onPress?: () => void;
};

type OwnerActionRowProps = {
  theme: AppTheme;
  actions: OwnerAction[];
  style?: object;
};

export default function OwnerActionRow({ theme, actions, style }: OwnerActionRowProps) {
  return (
    <View style={[styles.row, style]}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          style={[styles.button, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
        >
          <Text style={[styles.buttonText, { color: theme.accent }]}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  button: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
