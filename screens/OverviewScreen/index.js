import { StyleSheet, Text, View } from 'react-native';

export default function OverviewScreen () {
  return (
    <View style={styles.overviewScreen}>
      <Text style={styles.title}>
        Overview
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewScreen: {
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
