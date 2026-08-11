export function isValidTel(tel: string): boolean {
  return /^[0-9]{9,10}$/.test(tel.trim());
}

export function isValidName(name: string): boolean {
  return name.trim().length > 0;
}
