import { Slot } from 'expo-router';
import { useModal } from '../../components/Modal';

export default function IncomeLayout () {
  useModal();

  return (
    <Slot/>
  );
}
