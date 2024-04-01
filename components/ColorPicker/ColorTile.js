import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import { COLOR } from '../../styles/colors';
import { FONT } from '../../styles/fonts';

ColorTile.propTypes = {
  style: PropTypes.object,
  color: PropTypes.shape({
    name: PropTypes.string.isRequired,
    hex: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function ColorTile (props) {
  const {
    style,
    color: {
      name,
      hex,
    },
    selected,
    onPress,
    onDelete,
  } = props;

  const [highlighted, setHighlighted] = useState(false);

  const isCustomColor = name.startsWith('#');

  return (
    <View style={styles.colorTile}>
      <Pressable
        style={({ pressed }) => [style, pressed && styles.colorButtonPressed, selected && styles.colorButtonSelected]}
        onPress={selected ? undefined : onPress}
      >
        <View
          style={[
            styles.colorTileWrapper,
            selected && styles.colorTileSelected,
          ]}
          onMouseEnter={onPress ? () => setHighlighted(true) : undefined}
          onMouseLeave={onPress ? () => setHighlighted(false) : undefined}
        >
          <View
            style={[
              styles.color,
              { backgroundColor: hex },
              highlighted && styles.colorHighlighted,
              selected && styles.colorSelected,
            ]}
            onPress={onPress}
          />

          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.nameText,
                highlighted && styles.nameTextHighlighted,
                selected && styles.nameTextSelected,
              ]}
            >
              {name}
            </Text>
          </View>
        </View>
      </Pressable>

      {isCustomColor && (
        <CloseButton
          style={styles.deleteButton}
          iconStyle={styles.deleteButtonIcon}
          iconStyleHover={styles.deleteButtonIconHover}
          size={10}
          onPress={onDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  colorTile: {
    position: 'relative',
    overflow: 'visible',
  },

  colorTileWrapper: {
    cursor: 'pointer',
  },
  colorTileSelected: {
    cursor: 'auto',
  },

  colorButtonPressed: {
    opacity: 0.7,
  },
  colorButtonSelected: {
    cursor: 'auto',
  },

  color: {
    width: 52,
    height: 52,
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: COLOR.LIGHT_GRAY,
  },
  colorHighlighted: {
    borderWidth: 2,
  },
  colorSelected: {
    borderWidth: 5,
  },

  nameContainer: {
    marginTop: 12,
  },

  deleteButton: {
    position: 'absolute',
    padding: 4,
    top: 16,
    right: 2,
    zIndex: 1,
    borderRadius: '50%',
    backgroundColor: COLOR.WHITE,
  },
  deleteButtonIcon: {
    backgroundColor: COLOR.RED,
  },
  deleteButtonIconHover: {
    backgroundColor: COLOR.ORANGE,
  },

  nameText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    color: COLOR.DARK_GRAY,
  },
  nameTextHighlighted: {
    textDecorationLine: 'underline',
  },
  nameTextSelected: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    textDecorationLine: 'none',
  },
});
