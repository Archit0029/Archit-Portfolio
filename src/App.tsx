import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { colors } from './theme/colors';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.background} barStyle="light-content" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
