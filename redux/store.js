import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';
import { resetAccountAction } from './reducers/account';
import { resetCategoriesAction } from './reducers/categories';
import { resetColorsAction } from './reducers/colors';
import { resetExpensesAction } from './reducers/expenses';
import { resetIncomesAndIncomesTotalsAction } from './reducers/incomes';
import { resetSavingsAndInvestmentsAction } from './reducers/savings';
import { resetUIAction } from './reducers/ui';

export const store = configureStore({ reducer });

export function resetStore (dispatch) {
  dispatch(resetAccountAction());
  dispatch(resetCategoriesAction());
  dispatch(resetColorsAction());
  dispatch(resetExpensesAction());
  dispatch(resetIncomesAndIncomesTotalsAction());
  dispatch(resetSavingsAndInvestmentsAction());
  dispatch(resetUIAction());
}
