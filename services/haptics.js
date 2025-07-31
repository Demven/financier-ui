import {
  notificationAsync,
  impactAsync,
  NotificationFeedbackType,
  ImpactFeedbackStyle,
} from 'expo-haptics';

export function hapticSuccess () {
  notificationAsync(NotificationFeedbackType.Success);
}

export function hapticWarning () {
  notificationAsync(NotificationFeedbackType.Warning);
}

export function hapticError () {
  notificationAsync(NotificationFeedbackType.Error);
}

// vibration levels

export function vibrateSoft () {
  impactAsync(ImpactFeedbackStyle.Soft);
}

export function vibrateLight () {
  impactAsync(ImpactFeedbackStyle.Light);
}

export function vibrateMedium () {
  impactAsync(ImpactFeedbackStyle.Medium);
}

export function vibrateHeavy () {
  impactAsync(ImpactFeedbackStyle.Heavy);
}

export function vibrateRigid () {
  impactAsync(ImpactFeedbackStyle.Rigid);
}
