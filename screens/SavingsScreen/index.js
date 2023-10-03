import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function SavingsScreen () {
  const route = useRoute();
  const overviewType = route.params?.type;

  return (
    <View style={styles.savingsScreen}>
      <Text style={styles.title}>
        Savings: {overviewType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 14,
  },
});
