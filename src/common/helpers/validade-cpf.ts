export function ValidadeCpf(cpf: string): boolean {
  // Remove possible mask
  cpf = cpf.replace(/[^\d]+/g, '');

  // Checks if the CPF has 11 digits and if all are the same
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  // Check first digit
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder == 10 || remainder == 11) remainder = 0;
  if (remainder != parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  // Check second digit
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder == 10 || remainder == 11) remainder = 0;
  if (remainder != parseInt(cpf.substring(10, 11))) return false;

  return true;
}
