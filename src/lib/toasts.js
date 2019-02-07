export const NETWORK_TIMEOUT_TOAST = {
  text: 'Network connection timeout. Please check your internet connection.',
  duration: 10000,
  type: 'warning',
  position: 'bottom',
  buttonText: 'Okay',
}

export const DEFAULT_REQUEST_ERROR_TOAST = {
  text: "Couldn't get data from server.",
  duration: 10000,
  type: 'danger',
  position: 'bottom',
  buttonText: 'Okay',
}

export const UNEXPECTED_BEHAVIOUR_TOAST = {
  text: 'Something unexpected happened.',
  duration: 5000,
  type: 'danger',
  position: 'bottom',
  buttonText: 'Okay',
}

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
