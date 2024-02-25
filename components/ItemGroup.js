import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import TitleLink from './TitleLink';
import FoldedContainer from './FoldedContainer';
import { getAmount } from '../services/amount';
import { MONTH_NAME } from '../services/date';
import { COLOR } from '../styles/colors';
import { FONT } from '../styles/fonts';

ItemGroup.propTypes = {
  style: PropTypes.any,
  titleStyle: PropTypes.any,
  title: PropTypes.string.isRequired,
  arrowIconSize: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    categoryId: PropTypes.string,
    dateString: PropTypes.string,
    amount: PropTypes.number,
  })).isRequired,
  monthNumber: PropTypes.number.isRequired,
  onPressItem: PropTypes.func,
};

export default function ItemGroup (props) {
  const {
    style,
    titleStyle,
    title,
    arrowIconSize = 16,
    items,
    monthNumber,
    onPressItem,
  } = props;

  const [folded, setFolded] = useState(true);
  const [width, setWidth] = useState();

  const currencySymbol = useSelector(state => state.account.currencySymbol);

  function onLayout (event) {
    setWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      style={[styles.itemGroup, style]}
      onLayout={onLayout}
    >
      <FoldedContainer
        style={styles.foldedContainer}
        titleStyle={[styles.titleStyle, titleStyle]}
        title={title}
        arrowIconSize={arrowIconSize}
        initiallyFolded
        onFold={() => setFolded(true)}
        onUnfold={() => setFolded(false)}
      >
        <View style={styles.groupItemsList}>
          {items.map(item => (
            <TitleLink
              key={item.id}
              textStyle={[styles.groupItems, styles.groupItemsUnfolded]}
              onPress={() => onPressItem(item)}
            >
              {MONTH_NAME[monthNumber].slice(0, 3)} {Number(item.dateString.split('-')[2])}:  {currencySymbol}{getAmount(item)}
            </TitleLink>
          ))}
        </View>
      </FoldedContainer>

      {folded && (
        <Text
          style={[
            styles.groupItems,
            styles.groupItemsFolded,
            !!width && { width: width * 0.7 },
          ]}
        >
          {items
            .map(item => getAmount(item))
            .join(' + ')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemGroup: {
    width: '100%',
  },

  foldedContainer: {
    width: '100%',
  },

  titleStyle: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 20,
    lineHeight: 24,
    color: COLOR.DARK_GRAY,
  },

  groupItemsList: {
    width: '100%',
    paddingLeft: 12,
    alignItems: 'flex-start',
  },

  groupItems: {
    marginTop: 4,
    marginLeft: 12,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 12,
    lineHeight: 18,
    color: COLOR.DARK_GRAY,
  },
  groupItemsFolded: {
    width: 300,
  },
  groupItemsUnfolded: {
    marginLeft: 0,
  },
});
