import { Slot } from 'expo-router';
import { useModal } from '../../components/Modal';
import { DeleteItemProvider, useDeleteItemAction } from "../../context/DeleteItemContext";

function SavingSlot () {
  const { onDeleteItem } = useDeleteItemAction();

  useModal(onDeleteItem);

  return (
    <Slot/>
  );
}

export default function SavingLayout () {
  return (
    <DeleteItemProvider>
      <SavingSlot />
    </DeleteItemProvider>
  );
}
