import uiReducer from './ui';
import accountReducer from './account';
import incomesReducer from './incomes';
import expensesReducer from './expenses';
import savingsReducer from './savings';

export default {
  ui: uiReducer,
  account: accountReducer,
  incomes: incomesReducer,
  expenses: expensesReducer,
  savings: savingsReducer,
};
