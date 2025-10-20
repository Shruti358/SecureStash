import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as CryptoJS from 'crypto-js';
// Ensure PBKDF2 and encoders are registered (side-effect imports)
import 'crypto-js/pbkdf2';
import 'crypto-js/sha256';
import 'crypto-js/enc-hex';
import 'crypto-js/pbkdf2';
import 'crypto-js/sha256';
import 'crypto-js/enc-hex';

const filesCol = () => firestore().collection('files');

const ITERATIONS = 10000; // PBKDF2 iterations
const KEY_SIZE_WORDS = 256 / 32; // 256-bit

export type FileProtectionInfo = {
  password_protected?: boolean;
  password_hash?: string;
  password_salt?: string;
};

export async function getFileProtection(fileId: string): Promise<FileProtectionInfo> {
  const snap = await filesCol().doc(fileId).get();
  const d: any = snap.data() || {};
  return {
    password_protected: d.password_protected === true,
    password_hash: d.password_hash,
    password_salt: d.password_salt,
  };
}

export function hashPassword(password: string, salt: string): string {
  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: KEY_SIZE_WORDS,
    iterations: ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });
  return key.toString(CryptoJS.enc.Hex);
}

export function generateSaltHex(bytes: number = 16): string {
  const wa = CryptoJS.lib.WordArray.random(bytes);
  return wa.toString(CryptoJS.enc.Hex);
}

export async function setFilePassword(fileId: string, password: string): Promise<void> {
  const salt = generateSaltHex(16);
  const hash = hashPassword(password, salt);
  await filesCol().doc(fileId).update({
    password_protected: true,
    password_salt: salt,
    password_hash: hash,
    updated_at: firestore.FieldValue.serverTimestamp(),
  });
}

export async function verifyFilePassword(fileId: string, password: string): Promise<boolean> {
  const { password_salt, password_hash } = await getFileProtection(fileId);
  if (!password_salt || !password_hash) return false;
  const h = hashPassword(password, password_salt);
  return h === password_hash;
}

export async function clearFilePasswordWithAccountAuth(fileId: string, accountEmail: string, accountPassword: string): Promise<void> {
  // Reauth current user with provided credentials
  const user = auth().currentUser;
  if (!user || user.email !== accountEmail) {
    throw new Error('Signed-in user does not match provided email');
  }
  const cred = auth.EmailAuthProvider.credential(accountEmail, accountPassword);
  await user.reauthenticateWithCredential(cred);
  await filesCol().doc(fileId).update({
    password_protected: false,
    password_salt: firestore.FieldValue.delete(),
    password_hash: firestore.FieldValue.delete(),
    updated_at: firestore.FieldValue.serverTimestamp(),
  });
}

export async function setFilePasswordWithAccountAuth(fileId: string, newPassword: string, accountEmail: string, accountPassword: string): Promise<void> {
  // Reauth then set new password
  const user = auth().currentUser;
  if (!user || user.email !== accountEmail) {
    throw new Error('Signed-in user does not match provided email');
  }
  const cred = auth.EmailAuthProvider.credential(accountEmail, accountPassword);
  await user.reauthenticateWithCredential(cred);
  await setFilePassword(fileId, newPassword);
}
