const EMAIL_SHIFT = 3
const PHONE_SHIFT = 2

const ENCODED_EMAIL = [109, 104, 122, 100, 111, 111, 108, 102, 110, 67, 115, 112, 49, 112, 104]
const ENCODED_PHONE_E164 = [45, 51, 54, 50, 57, 54, 55, 52, 58, 59, 52, 59]
const ENCODED_PHONE_DISPLAY = [42, 54, 50, 57, 43, 34, 54, 55, 52, 47, 58, 59, 52, 59]

function decode(encoded: number[], shift: number) {
  return String.fromCharCode(...encoded.map((charCode) => charCode - shift))
}

export function getProtectedEmail() {
  return decode(ENCODED_EMAIL, EMAIL_SHIFT)
}

export function getProtectedPhoneE164() {
  return decode(ENCODED_PHONE_E164, PHONE_SHIFT)
}

export function getProtectedPhoneDisplay() {
  return decode(ENCODED_PHONE_DISPLAY, PHONE_SHIFT)
}
