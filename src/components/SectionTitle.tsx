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
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});
