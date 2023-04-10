import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (plaintextPassword = '') => {
  return bcrypt
    .hash(plaintextPassword, saltRounds);
}

export const comparePassword = async (plaintextPassword, hash) => {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}
