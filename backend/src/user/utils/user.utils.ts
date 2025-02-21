export function generatePassword(
  firstName: string,
  lastName: string,
  phoneNumber: string,
): string {
  const part1 = firstName.slice(0, 2);
  const part2 = lastName.slice(-2);
  const part3 = phoneNumber.slice(-4);

  const randomChars = Math.random().toString(36).slice(-4);

  const specialChars = '!@#$%^&*';
  const randomSpecial =
    specialChars[Math.floor(Math.random() * specialChars.length)];

  const password = `${part1}${randomSpecial}${part2}${randomChars}${part3}`;

  return password;
}
