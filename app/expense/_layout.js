import { Slot } from 'expo-router';
import { useModal } from '../../components/Modal';
import { DeleteItemProvider, useDeleteItemAction } from '../../context/DeleteItemContext';

function ExpenseSlot () {
  const { onDeleteItem } = useDeleteItemAction();

  useModal(onDeleteItem);

  return (
    <Slot/>
  );
}

export default function ExpenseLayout () {
  return (
    <DeleteItemProvider>
      <ExpenseSlot />
    </DeleteItemProvider>
  );
}
