export default function generatePassword(length: number): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';

  const getRandomChar = (chars: string): string => {
    return chars[Math.floor(Math.random() * chars.length)];
  };

  let password = '';

  // Generate at least one uppercase, lowercase, and number character
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numberChars);

  const remainingLength = length - password.length;

  // Generate random characters for the remaining length
  for (let i = 0; i < remainingLength; i++) {
    const allChars = uppercaseChars + lowercaseChars + numberChars;
    password += getRandomChar(allChars);
  }

  // Shuffle the characters in the password string
  const shuffledPassword = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return shuffledPassword;
}
