import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function CategoriesScreen () {
  const route = useRoute();
  const overviewType = route.params?.type;

  return (
    <View style={styles.categoriesScreen}>
      <Text style={styles.title}>
        Categories: {overviewType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 14,
  },
});
