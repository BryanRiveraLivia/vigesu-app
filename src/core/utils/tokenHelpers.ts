export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // convierte a milisegundos
    return Date.now() > exp;
  } catch {
    return true; // si no se puede leer, lo tratamos como expirado
  }
};
