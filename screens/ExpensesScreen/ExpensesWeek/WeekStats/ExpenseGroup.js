import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import TitleLink from '../../../../components/TitleLink';
import FoldedContainer from '../../../../components/FoldedContainer';
import { getAmount } from '../../../../services/amount';
import { MONTH_NAME } from '../../../../services/date';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';

ExpenseGroup.propTypes = {
  style: PropTypes.any,
  titleStyle: PropTypes.any,
  title: PropTypes.string.isRequired,
  arrowIconSize: PropTypes.number,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    categoryId: PropTypes.string,
    dateString: PropTypes.string,
    amount: PropTypes.number,
  })).isRequired,
  monthNumber: PropTypes.number.isRequired,
};

export default function ExpenseGroup (props) {
  const {
    style,
    titleStyle,
    title,
    arrowIconSize = 16,
    expenses,
    monthNumber,
  } = props;

  const navigation = useNavigation();

  const [folded, setFolded] = useState(true);
  const [width, setWidth] = useState();

  const currencySymbol = useSelector(state => state.account.currencySymbol);

  function onLayout (event) {
    setWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      style={[styles.expenseGroup, style]}
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
        <View style={styles.groupExpensesList}>
          {expenses.map(expense => (
            <TitleLink
              key={expense.id}
              textStyle={[styles.groupExpenses, styles.groupExpensesUnfolded]}
              onPress={() => navigation.navigate('Expense', { expense })}
            >
              {MONTH_NAME[monthNumber].slice(0, 3)} {Number(expense.dateString.split('-')[2])}:  {currencySymbol}{getAmount(expense)}
            </TitleLink>
          ))}
        </View>
      </FoldedContainer>

      {folded && (
        <Text style={[
          styles.groupExpenses,
          styles.groupExpensesFolded,
          { width: width * 0.7 }
        ]}>
          {expenses
            .map(expense => getAmount(expense))
            .join(' + ')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  expenseGroup: {
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

  groupExpensesList: {
    width: '100%',
    paddingLeft: 12,
    alignItems: 'flex-start',
  },

  groupExpenses: {
    marginTop: 4,
    marginLeft: 12,
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 12,
    lineHeight: 18,
    color: COLOR.DARK_GRAY,
  },
  groupExpensesFolded: {
    width: 300,
  },
  groupExpensesUnfolded: {
    marginLeft: 0,
  },
});
