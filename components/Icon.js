import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

Icon.propTypes = {
  style: PropTypes.object,
  iconName: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default function Icon (props) {
  const {
    style,
    iconName,
    size,
    color,
  } = props;

  return (
    <View style={[styles.icon, style]}>
      <Ionicons
        name={iconName}
        size={size}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {},
});
