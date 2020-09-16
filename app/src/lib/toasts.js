const DEFAULT_TOAST_DURATION = 10000

export function defaultToast(
  message,
  duration = DEFAULT_TOAST_DURATION,
  type = undefined,
  position = 'bottom',
  buttonText = 'Okay'
) {
  return {
    text: message,
    duration: duration,
    type: type,
    position: position,
    buttonText: buttonText,
  }
}

export function defaultSuccessToast(
  message,
  duration = DEFAULT_TOAST_DURATION,
  position = 'bottom'
) {
  return defaultToast(message, duration, 'success', position)
}

export function defaultDangerToast(
  message,
  duration = DEFAULT_TOAST_DURATION,
  position = 'bottom'
) {
  return defaultToast(message, duration, 'danger', position)
}
