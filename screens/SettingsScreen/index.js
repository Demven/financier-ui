import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen () {
  return (
    <View style={styles.settingsScreen}>
      <Text style={styles.title}>
        Settings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsScreen: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  title: {
    color: '#fff',
    fontSize: 34,
  },
});
