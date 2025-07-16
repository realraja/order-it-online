import jwt from 'jsonwebtoken';
// import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // store in .env
const JWT_EXP = `${process.env.DAY_COOKIE}d` || '100d'; // store in .env

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
}

export function verifyToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);

  return decoded;
}

export function generateRandomString(length = 16) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}


// export function signToken(payload) {
//   const { encryptedData, iv } = encryptData(JSON.stringify(payload));
//   const token = jwt.sign({ data: encryptedData, iv }, JWT_SECRET, { expiresIn: JWT_EXP });
//   // return jwt.sign(payload, JWT_SECRET, { expiresIn : JWT_EXP});
//   return token;
// }

// export function verifyToken(token) {
//   const decoded = jwt.verify(token, JWT_SECRET);
//   const decrypted = decryptData(decoded.data, decoded.iv);

//   return JSON.parse(decrypted);
// }




// const algorithm = 'aes-256-cbc';
// const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// export function encryptData(data) {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(data, 'utf8', 'base64');
//   encrypted += cipher.final('base64');
//   return {
//     encryptedData: encrypted,
//     iv: iv.toString('base64'),
//   };
// }

// export function decryptData(encryptedData, ivBase64) {
//   const iv = Buffer.from(ivBase64, 'base64');
//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

