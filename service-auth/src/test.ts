import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

// Generate a new RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Sample payload for the JWT token
const payload = {
  id: 123,
  username: 'exampleuser',
};

// Sign the JWT token using the private key
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);
console.log('JWT Token:', token);
