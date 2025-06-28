import bcrypt from 'bcrypt';
const saltRounds = 10; // Número de rondas de sal

// Encriptar contraseña
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
}

// Verificar contraseña
export async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match; // true si coinciden, false si no
  } catch (error) {
    throw error;
  }
}
