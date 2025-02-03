import { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  useGlobalSearchParams,
  usePathname,
  useRouter,
} from 'expo-router';
import { useDispatch } from 'react-redux';
import Modal from '../../components/Modal';
import Input, { INPUT_TYPE } from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import DatePicker from '../../components/DatePicker';
import Loader from '../../components/Loader';
import {
  addSavingAction,
  updateSavingAction,
  deleteSavingAction,
  addInvestmentAction,
  updateInvestmentAction,
  deleteInvestmentAction,
  setSavingsTotalsAction,
  setInvestmentsTotalsAction,
} from '../../redux/reducers/savings';
import {
  setTitleAction,
  showToastAction,
  TOAST_TYPE,
} from '../../redux/reducers/ui';
import { dateToDateString, getWeekNumberByDayNumber } from '../../services/date';
import {
  fetchSavingById,
  addSaving,
  updateSaving,
  deleteSaving,
} from '../../services/api/saving';
import {
  fetchInvestmentById,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from '../../services/api/investment';
import { useDeleteItemAction } from '../../context/DeleteItemContext';
import ConfirmationDialog from "../../components/ConfirmationDialog";

const TYPE = {
  SAVING: 'saving',
  INVESTMENT: 'investment',
};
const TYPES = [
  { value: TYPE.SAVING, label: 'Saving', description: 'Saving accounts, cash, etc.' },
  { value: TYPE.INVESTMENT, label: 'Investment', description: 'Stocks, ETFs, bonds, etc.' },
];

const DATE_OPTION = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  CHOOSE_DATE: 'choose',
};
const DATE_OPTIONS = [
  { value: DATE_OPTION.TODAY, label: 'Today' },
  { value: DATE_OPTION.YESTERDAY, label: 'Yesterday' },
  { value: DATE_OPTION.CHOOSE_DATE, label: 'Choose' },
];

export default function SavingScreen () {
  const pathname = usePathname();
  const isInvestment = pathname.includes(TYPE.INVESTMENT);

  const params = useGlobalSearchParams();
  const id = params?.id ? parseInt(params.id, 10) : undefined;

  const router = useRouter();
  const dispatch = useDispatch();

  const canGoBack = router.canGoBack();

  const { registerDeleteItemAction } = useDeleteItemAction();

  const [loading, setLoading] = useState(false);
  const [savingToEdit, setSavingToEdit] = useState();
  const [investmentToEdit, setInvestmentToEdit] = useState();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [typeSelectOpen, setTypeSelectOpen] = useState(false);
  const [typeId, setTypeId] = useState(isInvestment ? TYPE.INVESTMENT : TYPE.SAVING);
  const [types, setTypes] = useState(TYPES);

  const [dateOptionsSelectOpen, setDateOptionsSelectOpen] = useState(false);
  const [dateOptionId, setDateOptionId] = useState((savingToEdit?.dateString || investmentToEdit?.dateString)
    ? DATE_OPTION.CHOOSE_DATE
    : DATE_OPTION.TODAY
  );
  const [dateOptions, setDateOptions] = useState(DATE_OPTIONS);

  const [dateString, setDateString] = useState(dateToDateString(new Date()));
  const [dateDisabled, setDateDisabled] = useState(false);

  const [ticker, setTicker] = useState('');

  const [shares, setShares] = useState('');
  const [sharesError, setSharesError] = useState('');

  const [pricePerShare, setPricePerShare] = useState('');
  const [pricePerShareError, setPricePerShareError] = useState('');

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const [deleteSavingDialogVisible, setDeleteSavingDialogVisible] = useState(false);
  const [deleteInvestmentDialogVisible, setDeleteInvestmentDialogVisible] = useState(false);

  const todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);

  const title = typeId === TYPE.INVESTMENT
    ? (investmentToEdit ? 'Edit an investment' : 'Add an investment')
    : (savingToEdit ? 'Edit a saving' : 'Add a saving');

  useEffect(() => {
    dispatch(setTitleAction(title));
  }, [title]);

  useEffect(() => {
    if (id && typeId === TYPE.INVESTMENT) {
      fetchInvestment(id);
    } else if (id) {
      fetchSaving(id);
    }
  }, [id, isInvestment]);

  useEffect(() => {
    if (savingToEdit || investmentToEdit) {
      registerDeleteItemAction(() => {
        if (savingToEdit) {
          onDeleteSavingRequest();
        } else if (investmentToEdit) {
          onDeleteInvestmentRequest();
        }
      });
    }

    // Cleanup when the component unmounts
    return () => registerDeleteItemAction(() => {});
  }, [registerDeleteItemAction, savingToEdit, investmentToEdit]);

  useEffect(() => {
    if (savingToEdit && id === savingToEdit?.id) {
      setName(savingToEdit?.name || '');
      setTypeId(TYPE.SAVING);
      setDateOptionId(savingToEdit?.dateString ? DATE_OPTION.CHOOSE_DATE : DATE_OPTION.TODAY);
      setDateString(savingToEdit?.dateString || dateToDateString(new Date()));
      setAmount(savingToEdit?.amount ? String(savingToEdit.amount) : '');
    }
  }, [savingToEdit]);

  useEffect(() => {
    if (investmentToEdit && id === investmentToEdit?.id) {
      setName(investmentToEdit?.name || '');
      setTypeId(TYPE.INVESTMENT);
      setDateOptionId(investmentToEdit?.dateString ? DATE_OPTION.CHOOSE_DATE : DATE_OPTION.TODAY);
      setDateString(investmentToEdit?.dateString || dateToDateString(new Date()));
      setTicker(investmentToEdit?.ticker || '');
      setShares(investmentToEdit?.shares ? String(investmentToEdit.shares) : '');
      setPricePerShare(investmentToEdit?.pricePerShare ? String(investmentToEdit.pricePerShare) : '');
    }
  }, [investmentToEdit]);

  useEffect(() => {
    if (dateOptionId === DATE_OPTION.TODAY) {
      setDateString(dateToDateString(todayDate));
      setDateDisabled(true);
    } else if (dateOptionId === DATE_OPTION.YESTERDAY) {
      const yesterdayDate = new Date(todayDate.setDate(todayDate.getDate() - 1));
      setDateString(dateToDateString(yesterdayDate));
      setDateDisabled(true);
    } else {
      setDateString(savingToEdit?.dateString || investmentToEdit?.dateString || dateToDateString(todayDate));
      setDateDisabled(false);
    }
  }, [dateOptionId]);

  async function fetchSaving (id) {
    setLoading(true);
    const savingToEdit = await fetchSavingById(id);

    setSavingToEdit(savingToEdit);

    setLoading(false);
  }

  async function fetchInvestment (id) {
    setLoading(true);
    const investmentToEdit = await fetchInvestmentById(id);

    setInvestmentToEdit(investmentToEdit);

    setLoading(false);
  }

  function onDeleteSavingRequest () {
    setDeleteSavingDialogVisible(true);
  }

  function onDeleteInvestmentRequest () {
    setDeleteInvestmentDialogVisible(true);
  }

  function validateName () {
    let valid = true;

    if (!name.trim().length) {
      setNameError('Name can\'t be empty');
      valid = false;
    } else {
      setNameError('');
    }

    return valid;
  }

  function validateAmount () {
    let valid = true;

    if (!amount.trim().length) {
      setAmountError('Can\'t be empty');
      valid = false;
    } else if (isNaN(Number(amount))) {
      setAmountError('Can contain only numeric characters');
      valid = false;
    } else {
      setAmountError('');
    }

    return valid;
  }

  function validateShares () {
    let valid = true;

    if (!shares.trim().length) {
      setSharesError('Can\'t be empty');
      valid = false;
    } else if (isNaN(Number(shares))) {
      setSharesError('Can contain only numeric characters');
      valid = false;
    } else {
      setSharesError('');
    }

    return valid;
  }

  function validatePricePerShare () {
    let valid = true;

    if (!pricePerShare.trim().length) {
      setPricePerShareError('Can\'t be empty');
      valid = false;
    } else if (isNaN(Number(pricePerShare))) {
      setPricePerShareError('Can contain only numeric characters');
      valid = false;
    } else {
      setPricePerShareError('');
    }

    return valid;
  }

  function isValid () {
    const nameValid = validateName();
    const amountValid = validateAmount();
    const sharesValid = validateShares();
    const pricePerShareValid = validatePricePerShare();

    return nameValid
      && (
        (typeId === TYPE.SAVING && amountValid)
        || (typeId === TYPE.INVESTMENT && sharesValid && pricePerShareValid)
      );
  }

  function onSave () {
    if (isValid()) {
      const [year, month, day] = dateString.split('-').map(string => Number(string));
      const week = getWeekNumberByDayNumber(day);

      if (typeId === TYPE.SAVING) {
        if (savingToEdit) {
          const [oldYear, oldMonth, oldDay] = savingToEdit.dateString.split('-').map(string => Number(string));
          const oldWeek = getWeekNumberByDayNumber(oldDay);

          const savingToUpdate = {
            id: savingToEdit.id,
            name,
            dateString, // new date
            year,
            month,
            week,
            amount: parseFloat(amount),
          };

          onUpdateSaving(oldYear, oldMonth, oldWeek, savingToUpdate);
        } else {
          const savingToSave = {
            name,
            dateString,
            year,
            month,
            week,
            amount: parseFloat(amount),
          };

          onCreateSaving(savingToSave);
        }
      } else if (typeId === TYPE.INVESTMENT) {
        if (investmentToEdit) {
          // update
          const [oldYear, oldMonth, oldDay] = investmentToEdit.dateString.split('-').map(string => Number(string));
          const oldWeek = getWeekNumberByDayNumber(oldDay);

          const investmentToUpdate = {
            id: investmentToEdit.id,
            name,
            dateString, // new date
            year,
            month,
            week,
            ticker,
            shares: parseFloat(shares),
            pricePerShare: parseFloat(pricePerShare),
          };

          onUpdateInvestment(oldYear, oldMonth, oldWeek, investmentToUpdate);
        } else {
          const investmentToSave = {
            name,
            dateString,
            year,
            month,
            week,
            ticker,
            shares: parseFloat(shares),
            pricePerShare: parseFloat(pricePerShare),
          };

          onCreateInvestment(investmentToSave);
        }
      }
    }
  }

  async function onUpdateSaving (oldYear, oldMonth, oldWeek, saving) {
    const {
      success,
      totals,
    } = await updateSaving(saving);

    if (success && totals) {
      dispatch(updateSavingAction({
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        saving,
      }));

      const needToDeleteOldSaving = (
        oldYear !== saving.year
        || oldMonth !== saving.month
        || oldWeek !== saving.week
      );

      if (needToDeleteOldSaving) {
        // the saving has been moved to a new date, so we should delete the old object
        dispatch(deleteSavingAction({
          year: oldYear,
          month: oldMonth,
          week: oldWeek,
          saving,
        }));
      }

      dispatch(setSavingsTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Updated',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to update the saving. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onCreateSaving (saving) {
    const {
      success,
      saving: savedSaving,
      totals,
    } = await addSaving(saving);

    if (success && savedSaving && totals) {
      dispatch(addSavingAction({
        year: savedSaving.year,
        month: savedSaving.month,
        week: savedSaving.week,
        saving: savedSaving,
      }));

      dispatch(setSavingsTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Saved',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to add a saving. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onUpdateInvestment (oldYear, oldMonth, oldWeek, investment) {
    const {
      success,
      totals,
    } = await updateInvestment(investment);

    if (success && totals) {
      dispatch(updateInvestmentAction({
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        investment,
      }));

      const needToDeleteOldInvestment = (
        oldYear !== investment.year
        || oldMonth !== investment.month
        || oldWeek !== investment.week
      );

      if (needToDeleteOldInvestment) {
        // the investment has been moved to a new date, so we should delete the old object
        dispatch(deleteInvestmentAction({
          year: oldYear,
          month: oldMonth,
          week: oldWeek,
          investment,
        }));
      }

      dispatch(setInvestmentsTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Updated',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to update the investment. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onCreateInvestment (investment) {
    const {
      success,
      investment: savedInvestment,
      totals,
    } = await addInvestment(investment);

    if (success && savedInvestment && totals) {
      dispatch(addInvestmentAction({
        year: savedInvestment.year,
        month: savedInvestment.month,
        week: savedInvestment.week,
        investment: savedInvestment,
      }));

      dispatch(setInvestmentsTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Saved',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to add an investment. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onDeleteSaving () {
    const {
      success,
      totals,
    } = await deleteSaving(savingToEdit);

    if (success && totals) {
      dispatch(deleteSavingAction({
        year: savingToEdit.year,
        month: savingToEdit.month,
        week: savingToEdit.week,
        saving: savingToEdit,
      }));

      dispatch(setSavingsTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Deleted',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to delete the saving. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  async function onDeleteInvestment () {
    const {
      success,
      totals,
    } = await deleteInvestment(investmentToEdit);

    if (success && totals) {
      dispatch(deleteInvestmentAction({
        year: investmentToEdit.year,
        month: investmentToEdit.month,
        week: investmentToEdit.week,
        investment: investmentToEdit,
      }));

      dispatch(setInvestmentsTotalsAction(totals));

      dispatch(showToastAction({
        message: 'Deleted',
        type: TOAST_TYPE.INFO,
      }));
    } else {
      dispatch(showToastAction({
        message: 'Failed to delete the investment. Please try again.',
        type: TOAST_TYPE.ERROR,
      }));
    }
  }

  function onClose () {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
  }

  const formIsInvalid = !!nameError
    || (typeId === TYPE.SAVING && !!amountError)
    || (typeId === TYPE.INVESTMENT && (!!sharesError || !!pricePerShareError));

  const modalTitle = typeId === TYPE.SAVING
    ? savingToEdit ? 'Edit a saving' : 'Add a saving'
    : investmentToEdit ? 'Edit an investment' : 'Add an investment';

  return (
    <>
      <Modal
        style={[
          { maxWidth: Platform.select({ ios: 580 }) },
          Platform.isPad && { maxHeight: 600 },
        ]}
        title={modalTitle}
        disableSave={formIsInvalid}
        onSave={onSave}
        onDelete={typeId === TYPE.SAVING
          ? savingToEdit ? onDeleteSavingRequest : undefined
          : investmentToEdit ? onDeleteInvestmentRequest : undefined
        }
        onCloseRequest={onClose}
      >
        <View style={styles.savingScreen}>
          <Loader loading={loading} />

          {!savingToEdit && !investmentToEdit && (
            <View style={{ zIndex: 20 }}>
              <Dropdown
                style={styles.formElement}
                label='Type'
                open={typeSelectOpen}
                setOpen={setTypeSelectOpen}
                value={typeId}
                setValue={setTypeId}
                items={types}
                setItems={setTypes}
              />
            </View>
          )}

          <View style={styles.formRow}>
            <Input
              inputContainerStyle={styles.formElement}
              label='Name'
              placeholder={typeId === TYPE.SAVING
                ? 'American Express Savings'
                : 'S&P500'
              }
              inputType={INPUT_TYPE.DEFAULT}
              value={name}
              errorText={nameError}
              onChange={setName}
              onBlur={validateName}
              autoFocus
            />
          </View>

          <View style={[styles.formRow, { zIndex: 10 }]}>
            <View style={[styles.halfFormElement, { paddingRight: Platform.select({ web: 16, ios: 12 }) }]}>
              <Dropdown
                label='Date'
                open={dateOptionsSelectOpen}
                setOpen={setDateOptionsSelectOpen}
                value={dateOptionId}
                setValue={setDateOptionId}
                items={dateOptions}
                setItems={setDateOptions}
              />
            </View>

            <View style={[styles.halfFormElement, { paddingLeft: Platform.select({ web: 16, ios: 12 }) }]}>
              <DatePicker
                label='Set Date'
                dateString={dateString}
                max={dateToDateString(todayDate)}
                onChange={setDateString}
                disabled={dateDisabled}
              />
            </View>
          </View>

          {typeId === TYPE.INVESTMENT && (
            <>
              <View style={styles.formRow}>
                <View style={[styles.halfFormElement, { paddingRight: Platform.select({ web: 16, ios: 12 }) }]}>
                  <Input
                    inputContainerStyle={styles.formElement}
                    label='Ticker'
                    placeholder='SPY'
                    inputType={INPUT_TYPE.DEFAULT}
                    value={ticker}
                    onChange={(ticker) => setTicker(ticker.toUpperCase())}
                  />
                </View>

                <View style={[styles.halfFormElement, { paddingLeft: Platform.select({ web: 16, ios: 12 }) }]}>
                  <Input
                    inputContainerStyle={styles.formElement}
                    label='Total Shares'
                    placeholder='0'
                    inputType={INPUT_TYPE.QUANTITY}
                    value={shares}
                    errorText={sharesError}
                    onChange={setShares}
                    onBlur={validateShares}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.amountContainer}>
                  <Input
                    inputContainerStyle={styles.formElement}
                    label='Price per share'
                    placeholder='0.01'
                    inputType={INPUT_TYPE.CURRENCY}
                    value={pricePerShare}
                    errorText={pricePerShareError}
                    onChange={setPricePerShare}
                    onBlur={validatePricePerShare}
                  />
                </View>
              </View>
            </>
          )}

          {typeId === TYPE.SAVING && (
            <View style={styles.formRow}>
              <View style={styles.amountContainer}>
                <Input
                  label='Amount'
                  placeholder='0.01'
                  inputType={INPUT_TYPE.CURRENCY}
                  value={amount}
                  errorText={amountError}
                  onChange={setAmount}
                  onBlur={validateAmount}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>

      {deleteSavingDialogVisible && (
        <ConfirmationDialog
          title='Delete saving'
          message='Are you sure you want to delete this saving?'
          onCancel={() => setDeleteSavingDialogVisible(false)}
          onDelete={() => {
            onDeleteSaving();
            onClose();
          }}
        />
      )}

      {deleteInvestmentDialogVisible && (
        <ConfirmationDialog
          title='Delete investment'
          message='Are you sure you want to delete this investment?'
          onCancel={() => setDeleteInvestmentDialogVisible(false)}
          onDelete={() => {
            onDeleteInvestment();
            onClose();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  savingScreen: {
    paddingTop: 16,
    paddingBottom: 48,
  },

  formRow: {
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: 32,
    justifyContent: 'flex-end',
  },

  formElement: {
    flexShrink: 1,
  },
  halfFormElement: {
    width: '50%',
  },

  amountContainer: {
    width: '50%',
    paddingLeft: 16,
    paddingBottom: Platform.select({ ios: 48 }),
  },
});
