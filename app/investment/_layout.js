import { Slot } from 'expo-router';
import { useModal } from '../../components/Modal';
import { DeleteItemProvider, useDeleteItemAction } from '../../context/DeleteItemContext';

function InvestmentSlot () {
  const { onDeleteItem } = useDeleteItemAction();

  useModal(onDeleteItem);

  return (
    <Slot/>
  );
}

export default function InvestmentLayout () {
  return (
    <DeleteItemProvider>
      <InvestmentSlot />
    </DeleteItemProvider>
  );
}
