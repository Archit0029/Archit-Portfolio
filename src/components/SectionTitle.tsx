import { StyleSheet, Text, View } from 'react-native';
import { darkTheme, type AppTheme } from '../theme/colors';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  theme?: AppTheme;
};

export default function SectionTitle({ title, subtitle, theme = darkTheme }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={[styles.rule, { backgroundColor: theme.accent }]} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      </View>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    width: 24,
    height: 3,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});
