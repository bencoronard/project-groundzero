import { CryptoCipher } from './detachables/CryptoCipher';

const crypto = new CryptoCipher();

const perm = {
  database: { create: false, read: true, update: true, delete: false },
};
const message: string = JSON.stringify(perm);

// const publicKey: string =
//   'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6B18+wcVLPfN4nQMEtZP4o16LoG9d5eSC5BI8NguJY/GkM40wmGAm+rpSMGocnJqA9GvY/KynJuUU9DxxG3cXyyPXT9vHWY/PBJ70jAm+ciPVoFxEkf/9XNbUDA5BrEgOkFPekNirMscNuLKe4vm7b93XxyHjsNKi0jHEAMfjEJ8vS11M5vzc4xbsKOW4My7/GqWBTxiv1KAufVgiDeP4vHzpRvVdcsHowraC2DHVmZAiNjWbWZivWzhDaTvvMuLAqMN1jj9HlFGMpAzdC9fzlSmw6tU2R2hAIQm+QUvEl/k8h5nDJ2bIrIfRa9g0vDh170MdW5x4FsDaYqW7dPA0wIDAQAB';
// const privateKey: string =
//   'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDoHXz7BxUs983idAwS1k/ijXougb13l5ILkEjw2C4lj8aQzjTCYYCb6ulIwahycmoD0a9j8rKcm5RT0PHEbdxfLI9dP28dZj88EnvSMCb5yI9WgXESR//1c1tQMDkGsSA6QU96Q2Ksyxw24sp7i+btv3dfHIeOw0qLSMcQAx+MQny9LXUzm/NzjFuwo5bgzLv8apYFPGK/UoC59WCIN4/i8fOlG9V1ywejCtoLYMdWZkCI2NZtZmK9bOENpO+8y4sCow3WOP0eUUYykDN0L1/OVKbDq1TZHaEAhCb5BS8SX+TyHmcMnZsish9Fr2DS8OHXvQx1bnHgWwNpipbt08DTAgMBAAECggEAMtqnE76JAqmmJ3uiW4wtw2aYwtC1CJsiKbtqZ64NajhWWkp7X60KBt8QTlrzg2OS25RYt26oeExT0otANPeW5Rk3rcfkmc3Zg9lO3I2lNGufD+ZbNhSlPQsRkf+GtvMeqvS9K33RBCeZ3mKQ10GfDi65QhLXlk0uK1b+GgF9K3bIwvAOCAcIkiWhi/hxI3F4uCyZSJbPxLLCNagv09Tcg90B/dhF73+1VUHC4XpQG+3+laqS9PQUxAS4adDLyV0rN/B/R1m94cbSPC6S6A15fwf7bzqLuStrsurupF+LO2ykGpotSoEXuUpynbb/EzFEJ3mHNphTboE1Qucg+I/E1QKBgQD9/GhWnwSajUlFE4DtdpdzVN4CnCokdhFdq5HJkWpPDkA8D+55BuBzQ+/DW7zXet8rMozSTF1IgUtYgsc0wsfwKhqetkajQu6LucA9IU7OBUlaCelV7rbjgFpp323VdPoGaL9P7qxSWSJ8YgVe2kijAaZSEEdd8l6EM9gc5uBdzwKBgQDp9K7Q03SmZAQ12UOygDmmKCwDiyivEHfUXBuxotvU0VnQItfNhxcQ+unFTPYguRIrGofgFj+MgA0qLlQ9LhyXSXfJYzvLSSf7KjvWAZHIEzR1fPzJzHj2x5omhLJS3ffvJif0nUM7ZAw11ZhKDR525VIPaUnO/wdL8KWUW4BRvQKBgQCaEKQR9z/JqG6Lkjsg0FEqSo6pMqV1nJEIKuyyQp0j+1cHl/pmO7+m68ziyiEQ7J23DGDTqDLlqlhUBnBkFstFaaTgJV1P52fgJfrwmeW9nwNRtLVvxO/3rIIrurZbRyvq+1shV3v8L8l1fdgYI3zwNC35lZpU6JJgyzoKvhnXjQKBgEWBKcZka81a/V06FMCdE4Nnf9v1pbqMu+zdCGU3qvOI1pPdJhurPJEQ2g6BlMWX9evUT/Wk5nBJQp/7b49Vea0AaJPt5T+5liUqIOitQrAb9IPLBBa3pmA6YHN9DLVNuHDV9xzW87hbOr1rnXiyeRB9hGmLsB/M6FAJSEfQ/0hJAoGAEq6UVpc3Q29WUAJXcUUrvokfq/98HgGFqY+buoiIdMqqhn/RJaDNZH9ixW5p7u71C2gtOjpSsE/3hW1BW6wUZDSKmSjCg2rMPNOorWZhZl8WRlzxcF3OzBiNx3HkHi47L7cXZZZRz0ZSbmKG/tzeB3fRXSF6SAmaNveOJ8gbHHU=';

(async () => {
  try {
    // Generate a new RSA key pair
    const { publicKey, privateKey } = await crypto.generateKeyPair();
    // console.log(publicKey);
    // console.log(privateKey);
    const key: string = await crypto.generateKey();
    console.log('Symm: ', key);

    console.log(
      '========================= Asymmetric ========================'
    );

    let encryptedMsg: string = await crypto.encryptAsymmetric(
      message,
      publicKey
    );
    let decryptedMsg: string = await crypto.decryptAsymmetric(
      encryptedMsg,
      privateKey
    );
    console.log('Encrypted: ', encryptedMsg);
    console.log('Decrypted: ', decryptedMsg);

    console.log(
      '========================== Symmetric ========================'
    );

    encryptedMsg = await crypto.encryptSymmetric(message, key);
    decryptedMsg = await crypto.decryptSymmetric(encryptedMsg, key);
    console.log('Encrypted: ', encryptedMsg);
    console.log('Decrypted: ', decryptedMsg);

    // const encryptedMsg: string = await crypto.encryptSymmetric(message, key);
    // console.log('Encrypted: ', encryptedMsg);
    // console.log(
    //   'Decrypted: ',
    //   await crypto.decryptSymmetric(encryptedMsg, key)
    // );
  } catch (error) {
    console.error('Error: ', (error as Error).message);
  }
})();

console.log('Message: ', message);
// (async () => {
//   try {
//     const encryptedText: string = await cipher.encryptText(message, publicKey);
//     console.log('Encrypted: ', encryptedText);
//     const decryptedText: string = await cipher.decryptText(
//       encryptedText,
//       privateKey
//     );
//     console.log('Decrypted: ', decryptedText);

//     // const encryptedText: string = await cipher.encryptText(message, privateKey);
//     // console.log('Encrypted: ', encryptedText);
//     // const decryptedText: string = await cipher.decryptText(
//     //   encryptedText,
//     //   publicKey
//     // );
//     // console.log('Decrypted: ', decryptedText);
//   } catch (error) {
//     console.error('Error: ', (error as Error).message);
//   }
// })();

// const user = {
//   credentials: { identifier: 'Jake', passphrase: '1234' },
//   permissions: message,
// };

// console.log({ ...user.credentials, permit: user.permissions });
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// const publicKey: string = process.env.PUBLIC_KEY || 'public_key';
// const privateKey: string = process.env.PRIVATE_KEY || 'private_key';

// Sample payload for the JWT token
// const payload = {
//   id: 123,
//   username: 'exampleuser',
// };

// Sign the JWT token using the private key
// const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
// console.log('JWT Token:', token);

// Verify the JWT token using the public key
// try {
//   const clientToken = jwt.verify(token, publicKey);
//   console.log('JWT Payload:', clientToken);
// } catch {
//   console.log('Token verification failed');
// }
