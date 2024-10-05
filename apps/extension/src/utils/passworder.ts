import { Buffer } from 'buffer';
import { sessionStorage } from './storage/session';

const DEFAULT_ALGORITHM = 'PBKDF2';
const DERIVED_KEY_FORMAT = 'AES-GCM';
const STRING_ENCODING = 'utf-8';
const BUFFER_ENCODING = 'base64';
const ITERATIONS = 10_000;

function generateSalt(size = 32) {
  const randomBytes = new Uint8Array(size);
  return crypto.getRandomValues(new Uint8Array(randomBytes));
}

function getBase64Salt(salt: Uint8Array<ArrayBuffer>) {
  return Buffer.from(salt).toString(BUFFER_ENCODING);
}

async function getCryptoKey(
  password: string,
  base64salt: string,
  extractable = true
) {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    Buffer.from(password, STRING_ENCODING),
    { name: DEFAULT_ALGORITHM },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: Buffer.from(base64salt, 'base64'),
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    { name: DERIVED_KEY_FORMAT, length: 256 },
    extractable,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

async function encryptWithKey<T>(key: CryptoKey, data: T) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString, STRING_ENCODING);
  const iv = generateSalt(16);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: DERIVED_KEY_FORMAT,
      iv,
    },
    key,
    dataBuffer
  );

  return {
    data: Buffer.from(new Uint8Array(encrypted)).toString(BUFFER_ENCODING),
    iv: Buffer.from(iv).toString(BUFFER_ENCODING),
  };
}

export async function encrypt<T>(data: T, password?: string) {
  let key, salt;

  if (!password) {
    const { cryptoKey: storedKey, salt: storedSalt } = await sessionStorage.get(
      ['cryptoKey', 'salt']
    );

    if (!storedKey || !storedSalt) {
      throw new Error('Password is required and not found in sessionStorage');
    }
    key = await crypto.subtle.importKey(
      'jwk',
      JSON.parse(storedKey as string),
      { name: DERIVED_KEY_FORMAT, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    salt = storedSalt;
  } else {
    salt = getBase64Salt(generateSalt());
    key = await getCryptoKey(password, salt);

    const exportedKey = await crypto.subtle.exportKey('jwk', key);
    sessionStorage.save({ cryptoKey: JSON.stringify(exportedKey), salt });
  }

  const encryptedData = await encryptWithKey(key, data);
  return JSON.stringify({ ...encryptedData, salt });
}

async function decryptWithKey(
  key: CryptoKey,
  data: {
    data: string;
    iv: string;
  }
) {
  const dataBuffer = Buffer.from(data.data, BUFFER_ENCODING);
  const saltBuffer = Buffer.from(data.iv, BUFFER_ENCODING);

  try {
    const decryptedRes = await crypto.subtle.decrypt(
      {
        name: DERIVED_KEY_FORMAT,
        iv: saltBuffer,
      },
      key,
      dataBuffer
    );

    const decryptedData = new Uint8Array(decryptedRes);
    const decryptedStr = Buffer.from(decryptedData).toString(STRING_ENCODING);
    return JSON.parse(decryptedStr);
  } catch (error) {
    throw new Error(`Elytro: Wrong password! ${error}`);
  }
}

export async function decrypt(
  encryptedText: string,
  password?: string
): Promise<unknown> {
  const payload = JSON.parse(encryptedText);
  const { salt } = payload;
  let key;

  if (!password) {
    const { cryptoKey: storedKey } = await sessionStorage.get(['cryptoKey']);
    if (!storedKey) {
      throw new Error('Password is required and not found in sessionStorage');
    }
    key = await crypto.subtle.importKey(
      'jwk',
      JSON.parse(storedKey as string),
      { name: DERIVED_KEY_FORMAT, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  } else {
    // 使用提供的密码生成 key
    key = await getCryptoKey(password, salt);
  }

  const result = await decryptWithKey(key, payload);
  return result;
}
