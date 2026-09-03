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
    marginBottom: 20,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    width: 18,
    height: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
});
