import bs58 from 'bs58';
import * as nacl from 'tweetnacl';

export function verifySignature(walletAddress: string, signature: string, nonce: string): boolean {
  try {
    const message = new TextEncoder().encode(nonce);
    const publicKey = bs58.decode(walletAddress);
    const sig = bs58.decode(signature);
    return nacl.sign.detached.verify(message, sig, publicKey);
  } catch (err) {
    console.error(err);
    return false;
  }
}