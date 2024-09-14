export function formatPhoneNumber(phoneNumber: string) {
  // Ensure that the phone number starts with a '+'
  let formattedNumber = phoneNumber;

  // Remove any non-numeric characters (optional)
  formattedNumber = phoneNumber.replace(/[^\d]/g, '');

  // check first 3 digits
  if (formattedNumber.length > 10) {
    // Qatar number
    return `+${formattedNumber.slice(0, 3)} ${formattedNumber.slice(
      3,
      6
    )}-${formattedNumber.slice(6, 8)}-${formattedNumber.slice(8)}`;
  } else {
    // French number
    return `+${formattedNumber.slice(0, 2)} ${formattedNumber.slice(
      2,
      5
    )}-${formattedNumber.slice(5, 7)}-${formattedNumber.slice(7)}`;
  }
}
