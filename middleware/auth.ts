import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  return encryptedPassword;
};

export const comparePassword = async (
  encryptedPassword: string,
  enteredPassword: string
): Promise<boolean> => {
  const result = await bcrypt.compare(enteredPassword, encryptedPassword);
  return result;
};

export const generateToken = async (userEmail: string): Promise<string> => {
  const newToken = jwt.sign(
    {
      email: userEmail,
    },
    process.env.SECRET_KEY
  );
  return newToken;
};

export const verifyToken = async (token: string) => {
  const result = jwt.verify(token, process.env.SECRET_KEY);
  return result;
};
