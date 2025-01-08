import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "defaultencryptionkey";

// Simple key derivation function that works in both Node.js and browser environments
function deriveKey(key: string): Buffer {
  const hash = Array.from(key).reduce((acc, char) => {
    const last = acc[acc.length - 1] || 0;
    return acc.concat(last ^ char.charCodeAt(0));
  }, [] as number[]);

  return Buffer.from(hash.slice(0, 32)); // Ensure 32-byte key length
}

const derivedKey = deriveKey(ENCRYPTION_KEY);

export function encryptFormId(formId: string): string {
  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-cbc", derivedKey, iv);
    let encrypted = cipher.update(formId, "utf8", "hex");
    encrypted += cipher.final("hex");
    const token = `${iv.toString("hex")}:${encrypted}`;
    console.log("Encrypted:", { formId, token });
    return token;
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

export function decryptFormId(token: string): string | null {
  try {
    console.log("Decrypting token:", token);
    const [ivHex, encrypted] = token.split(":");
    if (!ivHex || !encrypted) return null;

    const iv = Buffer.from(ivHex, "hex");
    const decipher = createDecipheriv("aes-256-cbc", derivedKey, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log("Decrypted:", { token, decrypted });
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
