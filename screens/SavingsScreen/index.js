import { StyleSheet, Text, View } from 'react-native';

export default function SavingsScreen () {
  return (
    <View style={styles.savingsScreen}>
      <Text style={styles.title}>
        Savings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsScreen: {
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
