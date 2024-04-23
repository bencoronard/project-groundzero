import { BcryptHasher } from './detachables/BcryptHasher';

const credentials = { identifier: 'L36J', passCode: '643039' };
console.log(credentials);
const user = { ...credentials, accessLevel: 'user' };
console.log(user);

const bcryptor = new BcryptHasher(10);

(async () => {
  try {
    const hashedPassword = await bcryptor.hash(credentials.passCode);
    console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
})();
