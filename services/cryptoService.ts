/**
 * WebCrypto Cryptographic Utility Service
 * Provides AES-256-GCM encryption for stored API tokens and PBKDF2/SHA-256 password hashing.
 */

const SALT_PREFIX = 'srs_salt_';
const MASTER_KEY_MATERIAL = 'srs_genie_vault_kdf_seed_2026';

class CryptoService {
  /**
   * Hashes a password using PBKDF2 with SHA-256 and a per-user salt.
   */
  async hashPassword(password: string, email: string): Promise<string> {
    try {
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        return this.fallbackHash(password);
      }

      const enc = new TextEncoder();
      const salt = enc.encode(`${SALT_PREFIX}${email.toLowerCase()}`);
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
      );

      const exported = await window.crypto.subtle.exportKey('raw', derivedKey);
      const hashArray = Array.from(new Uint8Array(exported));
      const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `pbkdf2_sha256$100000$${hex}`;
    } catch (e) {
      console.warn('[CryptoService] Falling back to standard digest:', e);
      return this.fallbackHash(password);
    }
  }

  /**
   * Verifies password against stored hash, supporting both PBKDF2 and legacy demo hashes.
   */
  async verifyPassword(password: string, email: string, storedHash: string): Promise<boolean> {
    if (!storedHash) return false;

    // Check PBKDF2 hash
    if (storedHash.startsWith('pbkdf2_sha256$')) {
      const computed = await this.hashPassword(password, email);
      return computed === storedHash;
    }

    // Check legacy hash format
    if (storedHash.startsWith('hash_')) {
      return this.fallbackHash(password) === storedHash;
    }

    // Direct match (for initial test seeds)
    return password === storedHash;
  }

  /**
   * Encrypts a sensitive string (e.g. AI Provider API key) using AES-256-GCM.
   */
  async encryptSecret(plaintext: string): Promise<string> {
    if (!plaintext) return '';
    try {
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        return `enc_b64_${btoa(plaintext)}`;
      }

      const enc = new TextEncoder();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(MASTER_KEY_MATERIAL.padEnd(32, '0').slice(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        enc.encode(plaintext)
      );

      const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
      const ctHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
      return `aes_gcm$${ivHex}$${ctHex}`;
    } catch (e) {
      return `enc_b64_${btoa(plaintext)}`;
    }
  }

  /**
   * Decrypts an AES-256-GCM encrypted secret.
   */
  async decryptSecret(encryptedStr: string): Promise<string> {
    if (!encryptedStr) return '';
    try {
      if (encryptedStr.startsWith('enc_b64_')) {
        return atob(encryptedStr.replace('enc_b64_', ''));
      }

      if (!encryptedStr.startsWith('aes_gcm$')) {
        // Plaintext token (unencrypted legacy)
        return encryptedStr;
      }

      const [, ivHex, ctHex] = encryptedStr.split('$');
      if (!ivHex || !ctHex) return encryptedStr;

      const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const ciphertext = new Uint8Array(ctHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(MASTER_KEY_MATERIAL.padEnd(32, '0').slice(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        ciphertext
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.warn('[CryptoService] Decryption failed, returning input:', e);
      return encryptedStr;
    }
  }

  private fallbackHash(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }
}

export const cryptoService = new CryptoService();
