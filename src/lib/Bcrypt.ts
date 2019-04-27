import * as crypto from 'crypto'

export class Bcrypt {

  /**
   * sha256
   */
  static SHA256 (originData: string): string {
    return crypto.createHash('sha256').update(originData).digest('hex')
  }
}
