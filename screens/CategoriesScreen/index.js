import { StyleSheet, Text, View } from 'react-native';

export default function CategoriesScreen () {
  return (
    <View style={styles.categoriesScreen}>
      <Text style={styles.title}>
        Categories
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesScreen: {
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
