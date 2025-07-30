import { fetchOverviewForYear } from './api/overview';
import { setDataRefreshedAction, setLoadingAction } from '../redux/reducers/ui';
import { setExpensesAction, setExpensesTotalsAction } from '../redux/reducers/expenses';
import {
  setInvestmentsAction,
  setInvestmentsTotalsAction,
  setSavingsAction,
  setSavingsTotalsAction
} from '../redux/reducers/savings';
import { setIncomesAction, setIncomesTotalsAction } from '../redux/reducers/incomes';

export async function fetchOverviewData (year, dispatch, dataRefreshed = +(new Date())) {
  dispatch(setLoadingAction(true));

  const {
    expenses,
    expensesTotals,
    incomes,
    incomesTotals,
    savings,
    savingsTotals,
    investments,
    investmentsTotals,
  } = await fetchOverviewForYear(year);

  if (expenses) {
    dispatch(setExpensesAction(expenses));
  }
  if (expensesTotals) {
    dispatch(setExpensesTotalsAction(expensesTotals));
  }

  if (savings) {
    dispatch(setSavingsAction(savings));
  }
  if (savingsTotals) {
    dispatch(setSavingsTotalsAction(savingsTotals));
  }

  if (investments) {
    dispatch(setInvestmentsAction(investments));
  }
  if (investmentsTotals) {
    dispatch(setInvestmentsTotalsAction(investmentsTotals));
  }

  if (incomes) {
    dispatch(setIncomesAction(incomes));
  }
  if (incomesTotals) {
    dispatch(setIncomesTotalsAction(incomesTotals));
  }

  // if we refreshed data for the latest year - update "ui.dataRefreshed" value
  if (new Date().getFullYear() === new Date(dataRefreshed).getFullYear()) {
    dispatch(setDataRefreshedAction(+new Date()));
  }

  dispatch(setLoadingAction(false));
}
