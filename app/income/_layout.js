import { Slot } from 'expo-router';
import { useModal } from '../../components/Modal';
import { DeleteItemProvider, useDeleteItemAction } from '../../context/DeleteItemContext';

function IncomeSlot () {
  const { onDeleteItem } = useDeleteItemAction();

  useModal(onDeleteItem);

  return (
    <Slot/>
  );
}

export default function IncomeLayout () {
  return (
    <DeleteItemProvider>
      <IncomeSlot />
    </DeleteItemProvider>
  );
}
