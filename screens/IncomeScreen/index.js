import { StyleSheet, Text } from 'react-native';
import Modal from '../../components/Modal';

export default function IncomeScreen () {
  return (
    <Modal
      style={styles.incomeScreen}
      title='Add an Income'
    >
      <Text>
        Mise en place is a French term that literally means “put in place.” It
        also refers to a way cooks in professional kitchens and restaurants
        set up their work stations—first by gathering all ingredients for a
        recipes, partially preparing them (like measuring out and chopping),
        and setting them all near each other. Setting up mise en place before
        cooking is another top tip for home cooks, as it seriously helps with
        organization. It’ll pretty much guarantee you never forget to add an
        ingredient and save you time from running back and forth from the
        pantry ten times.
      </Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  incomeScreen: {},
});
