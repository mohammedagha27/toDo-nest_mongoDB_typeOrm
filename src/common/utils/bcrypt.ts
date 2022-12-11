import * as bcrypt from 'bcrypt';

const hashPassword = (password: string): string => {
  return bcrypt.hash(password, 10);
};
const checkPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export { hashPassword, checkPassword };
