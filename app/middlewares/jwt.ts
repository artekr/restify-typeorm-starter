import * as jwt from 'jsonwebtoken';

// tslint:disable-next-line: export-name
export const generateJWT = (id: number, username: string, email: string) => {
  return jwt.sign({
    id: id,
    username: username,
    email: email
  }, 'bopusecret', {
    expiresIn: '7d'
  });
};
