import { Slot } from 'expo-router';
import { useModal } from '../../components/Modal';

export default function CategoryLayout () {
  useModal();

  return (
    <Slot/>
  );
}
