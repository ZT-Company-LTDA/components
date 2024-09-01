export const cpf = (cpf: string): { isValid: boolean; error?: string } => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) {
    return { isValid: false, error: 'O CPF deve ter 11 dígitos.' };
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return { isValid: false, error: 'O CPF não pode ter todos os dígitos iguais.' };
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return { isValid: false, error: 'O primeiro dígito verificador está incorreto.' };
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return { isValid: false, error: 'O segundo dígito verificador está incorreto.' };
  }

  return { isValid: true };
};