export const password = (password: string): { isValid: boolean; error?: string } => {
  
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

  if (!regex.test(password)) {
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, error: 'A senha deve conter pelo menos uma letra maiúscula.' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, error: 'A senha deve conter pelo menos uma letra minúscula.' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'A senha deve conter pelo menos um número.' };
    }
    if (!/(?=.*[@$!%*?&#])/.test(password)) {
      return { isValid: false, error: 'A senha deve conter pelo menos um caractere especial.' };
    }
    if (password.length < 8) {
      return { isValid: false, error: 'A senha deve ter pelo menos 8 caracteres.' };
    }
  }

  return { isValid: true };
};