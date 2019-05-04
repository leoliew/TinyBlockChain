// Import the elliptic library and initialize a curve.
// You can use other curves if you want.

import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')


export class KeyGenerator {
  /**
   * 生成非对称密钥对
   */
  static genCryptographicKey (): { publicKey: any, privateKey: any } {
    // Generate a new key pair and convert them to hex-strings
    const key = ec.genKeyPair()
    const publicKey = key.getPublic('hex')
    const privateKey = key.getPrivate('hex')
    // Print the keys to the console
    console.log('Your public key:', publicKey)
    console.log('Your private key', privateKey)
    return {
      publicKey,
      privateKey
    }
  }
}
