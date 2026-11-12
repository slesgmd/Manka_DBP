export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

export const passwordRules = (password: string) => [
  { text: "Entre 8 y 72 caracteres", ok: password.length >= 8 && password.length <= 72 },
  { text: "Una mayúscula", ok: /[A-ZÁÉÍÓÚÑ]/.test(password) },
  { text: "Una minúscula", ok: /[a-záéíóúñ]/.test(password) },
  { text: "Un número", ok: /[0-9]/.test(password) },
];
