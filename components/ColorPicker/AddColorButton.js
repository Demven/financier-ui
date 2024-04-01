import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon, { ICON_COLLECTION } from '../Icon';
import { COLOR } from '../../styles/colors';
import { FONT } from '../../styles/fonts';

AddColorButton.propTypes = {
  style: PropTypes.object,
  pickerVisible: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

export default function AddColorButton (props) {
  const {
    style,
    pickerVisible,
    onPress,
  } = props;

  const [highlighted, setHighlighted] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [style, pressed && styles.colorButtonPressed]}
      onPress={onPress}
    >
      <View
        style={styles.addColorButton}
        onMouseEnter={() => setHighlighted(true)}
        onMouseLeave={() => setHighlighted(false)}
      >
        <View
          style={[
            styles.color,
            highlighted && styles.colorHighlighted,
          ]}
        >
          <LinearGradient
            style={styles.gradient}
            colors={['#FF625E', '#FF9C70']}
          />

          <Icon
            style={[
              styles.plusIcon,
              pickerVisible && styles.closeIcon,
              highlighted && styles.plusIconHighlighted,
              highlighted && pickerVisible && styles.closeIconHighlighted,
            ]}
            collection={ICON_COLLECTION.FONT_AWESOME_5}
            name='plus'
            size={16}
            color={COLOR.WHITE}
          />
        </View>

        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.nameText,
              highlighted && styles.nameTextHighlighted,
            ]}
          >
            {pickerVisible
              ? 'Close'
              : 'Add\ncolor'
            }
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addColorButton: {
    cursor: 'pointer',
  },

  colorButtonPressed: {
    opacity: 0.7,
  },

  color: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    backgroundColor: COLOR.RED,
    overflow: 'hidden',
  },
  colorHighlighted: {
    borderWidth: 2,
  },

  plusIcon: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transition: Platform.select({ web: 'transform 0.25s' }),
  },
  plusIconHighlighted: {
    transform: [{ scale: 1.3 }],
  },

  closeIcon: {
    transform: [{ rotate: '45deg' }],
  },
  closeIconHighlighted: {
    transform: [{ scale: 1.3 }, { rotate: '45deg' }],
  },

  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    transform: [{ rotate: '125deg' }],
  },

  nameContainer: {
    marginTop: 12,
  },

  nameText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: COLOR.DARK_GRAY,
  },
  nameTextHighlighted: {
    textDecorationLine: 'underline',
  },
});
