import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function OverviewScreen () {
  const route = useRoute();
  const overviewType = route.params?.type;

  console.info('Overview route', route);

  return (
    <View style={styles.overviewScreen}>
      <Text style={styles.title}>
        Overview: {overviewType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 14,
  },
});
