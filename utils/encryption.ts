import CryptoJS from 'crypto-js';

export function encrypt(text: any) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

export function decrypt(data?: string) {
  if (!data) {
    return '';
  }
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
}
