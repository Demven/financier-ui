import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

export const ICON_COLLECTION = {
  IONICONS: Ionicons,
  FONT_AWESOME_5: FontAwesome5,
  MATERIAL: MaterialIcons,
  MATERIAL_COMMUNITY: MaterialCommunityIcons,
};

Icon.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  name: PropTypes.string.isRequired,
  collection: PropTypes.oneOf([
    ICON_COLLECTION.IONICONS,
    ICON_COLLECTION.FONT_AWESOME_5,
    ICON_COLLECTION.MATERIAL,
    ICON_COLLECTION.MATERIAL_COMMUNITY,
  ]).isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default function Icon (props) {
  const {
    style,
    name,
    collection: VectorIcon,
    size,
    color,
  } = props;

  return (
    <View style={[styles.icon, style]}>
      <VectorIcon
        name={name}
        size={size}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {},
});
